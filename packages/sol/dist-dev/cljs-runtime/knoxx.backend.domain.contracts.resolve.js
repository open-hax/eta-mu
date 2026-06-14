import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.agent.agent_templates.js";
import "./knoxx.backend.domain.actor.scope.js";
import "./knoxx.backend.domain.contracts.loader.js";
import "./knoxx.backend.domain.contracts.roles.js";
import "./knoxx.backend.domain.contracts.sources.js";
import "./knoxx.backend.infra.registry.tools.js";
goog.provide('knoxx.backend.domain.contracts.resolve');
knoxx.backend.domain.contracts.resolve.known_actor_keys = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 15, [new cljs.core.Keyword(null,"model-profile","model-profile",-1997108992),null,new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716),null,new cljs.core.Keyword(null,"sources","sources",-321166424),null,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),null,new cljs.core.Keyword("actor","sources","actor/sources",-832192083),null,new cljs.core.Keyword(null,"capability-ids","capability-ids",-1477528817),null,new cljs.core.Keyword(null,"default-agent","default-agent",279723152),null,new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),null,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),null,new cljs.core.Keyword(null,"id","id",-1388402092),null,new cljs.core.Keyword(null,"kind","kind",-717265803),null,new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429),null,new cljs.core.Keyword("ui","actions","ui/actions",-812652422),null,new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557),null,new cljs.core.Keyword(null,"model","model",331153215),null], null), null);
knoxx.backend.domain.contracts.resolve.known_role_keys = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"sources","sources",-321166424),null,new cljs.core.Keyword("role","permissions","role/permissions",54401385),null,new cljs.core.Keyword("role","sources","role/sources",-317332946),null,new cljs.core.Keyword("role","capabilities","role/capabilities",208971087),null,new cljs.core.Keyword(null,"id","id",-1388402092),null,new cljs.core.Keyword("role","prompts","role/prompts",12162071),null], null), null);
knoxx.backend.domain.contracts.resolve.known_capability_keys = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("capability","description","capability/description",2107615880),null,new cljs.core.Keyword("capability","tools","capability/tools",122081170),null,new cljs.core.Keyword(null,"id","id",-1388402092),null], null), null);
knoxx.backend.domain.contracts.resolve.known_agent_keys = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 14, [new cljs.core.Keyword("contract","uses","contract/uses",715473218),null,new cljs.core.Keyword("contract","actors","contract/actors",-1138019932),null,new cljs.core.Keyword("agent","thinking","agent/thinking",1954119048),null,new cljs.core.Keyword(null,"sources","sources",-321166424),null,new cljs.core.Keyword("contract","actor","contract/actor",1959324173),null,new cljs.core.Keyword(null,"tool-deny","tool-deny",329869390),null,new cljs.core.Keyword(null,"trigger-kind","trigger-kind",1773988783),null,new cljs.core.Keyword(null,"id","id",-1388402092),null,new cljs.core.Keyword("prompts","system","prompts/system",481662773),null,new cljs.core.Keyword("prompts","task","prompts/task",-1181813354),null,new cljs.core.Keyword("agent","model","agent/model",289028726),null,new cljs.core.Keyword("ui","actions","ui/actions",-812652422),null,new cljs.core.Keyword(null,"enabled","enabled",1195909756),null,new cljs.core.Keyword("agent","sources","agent/sources",-832329571),null], null), null);
knoxx.backend.domain.contracts.resolve.contract_extras = (function knoxx$backend$domain$contracts$resolve$contract_extras(contract_data,known_set){
if(cljs.core.truth_(contract_data)){
var extras = cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.dissoc,contract_data,cljs.core.seq(known_set));
if(cljs.core.seq(extras)){
return extras;
} else {
return null;
}
} else {
return null;
}
});
knoxx.backend.domain.contracts.resolve.actor_extras = (function knoxx$backend$domain$contracts$resolve$actor_extras(actor_spec){
return knoxx.backend.domain.contracts.resolve.contract_extras(actor_spec,knoxx.backend.domain.contracts.resolve.known_actor_keys);
});
knoxx.backend.domain.contracts.resolve.role_extras = (function knoxx$backend$domain$contracts$resolve$role_extras(role_data){
return knoxx.backend.domain.contracts.resolve.contract_extras(role_data,knoxx.backend.domain.contracts.resolve.known_role_keys);
});
knoxx.backend.domain.contracts.resolve.capability_extras = (function knoxx$backend$domain$contracts$resolve$capability_extras(cap_data){
return knoxx.backend.domain.contracts.resolve.contract_extras(cap_data,knoxx.backend.domain.contracts.resolve.known_capability_keys);
});
knoxx.backend.domain.contracts.resolve.agent_extras = (function knoxx$backend$domain$contracts$resolve$agent_extras(agent_contract){
return knoxx.backend.domain.contracts.resolve.contract_extras(agent_contract,knoxx.backend.domain.contracts.resolve.known_agent_keys);
});
knoxx.backend.domain.contracts.resolve.memory_hydration_from_contract = (function knoxx$backend$domain$contracts$resolve$memory_hydration_from_contract(contract){
var or__5162__auto__ = new cljs.core.Keyword(null,"memory-hydration","memory-hydration",1956326082).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"memoryHydration","memoryHydration",-226352759).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"memory","memory",-1449401430),new cljs.core.Keyword(null,"passive-hydration","passive-hydration",-1337823895)], null));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"memory","memory",-1449401430),new cljs.core.Keyword(null,"passiveHydration","passiveHydration",-884994907)], null));
}
}
}
});
knoxx.backend.domain.contracts.resolve.context_policy_from_contract = (function knoxx$backend$domain$contracts$resolve$context_policy_from_contract(contract){
var or__5162__auto__ = new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"contextPolicy","contextPolicy",683316353).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"context","context",-830191113)], null));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557)], null));
}
}
}
}
});
knoxx.backend.domain.contracts.resolve.all_contract_extras = (function knoxx$backend$domain$contracts$resolve$all_contract_extras(config,actor_spec,role_slugs,capability_ids,agent_contract){
var actor_x = knoxx.backend.domain.contracts.resolve.actor_extras(new cljs.core.Keyword(null,"actor","actor",-1830560481).cljs$core$IFn$_invoke$arity$1(actor_spec));
var role_x = cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__26713_SHARP_){
return knoxx.backend.domain.contracts.resolve.role_extras(knoxx.backend.domain.contracts.roles.role_contract(config,p1__26713_SHARP_));
}),role_slugs);
var cap_x = cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__26714_SHARP_){
return knoxx.backend.domain.contracts.resolve.capability_extras(knoxx.backend.domain.contracts.loader.contract_sync(config,"capabilities",p1__26714_SHARP_));
}),capability_ids);
var agent_x = knoxx.backend.domain.contracts.resolve.agent_extras(agent_contract);
var merged = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.into,cljs.core.PersistentArrayMap.EMPTY,cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.seq,role_x),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.seq,cap_x),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(cljs.core.truth_(agent_x)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [agent_x], null):null),(cljs.core.truth_(actor_x)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [actor_x], null):null)], 0)));
if(cljs.core.seq(merged)){
return merged;
} else {
return null;
}
});
/**
 * Convert a value to a role slug string. Preserves namespace-qualified keywords
 * (e.g. :deploy/greeter-role -> "deploy/greeter-role") while stripping
 * standard namespaces like :role/.
 */
knoxx.backend.domain.contracts.resolve.keywordish__GT_role_slug = (function knoxx$backend$domain$contracts$resolve$keywordish__GT_role_slug(value){
var raw = (((value instanceof cljs.core.Keyword))?(function (){var ns_part = cljs.core.namespace(value);
var name_part = (function (){var G__26727 = value;
var G__26727__$1 = (((G__26727 == null))?null:cljs.core.name(G__26727));
var G__26727__$2 = (((G__26727__$1 == null))?null:clojure.string.trim(G__26727__$1));
if((G__26727__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26727__$2);
}
})();
if(cljs.core.truth_(name_part)){
if(cljs.core.truth_((function (){var and__5160__auto__ = ns_part;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not((knoxx.backend.domain.contracts.roles.standard_namespaces.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.contracts.roles.standard_namespaces.cljs$core$IFn$_invoke$arity$1(ns_part) : knoxx.backend.domain.contracts.roles.standard_namespaces.call(null,ns_part)));
} else {
return and__5160__auto__;
}
})())){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns_part)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name_part));
} else {
return name_part;
}
} else {
return null;
}
})():((typeof value === 'string')?value:(((value == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value))
)));
var G__26729 = raw;
var G__26729__$1 = (((G__26729 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26729)));
var G__26729__$2 = (((G__26729__$1 == null))?null:clojure.string.trim(G__26729__$1));
if((G__26729__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26729__$2);
}
});
/**
 * Convert a value to a capability id string. Preserves namespace-qualified
 * keywords (e.g. :deploy/greet -> "deploy/greet") while stripping standard
 * namespaces like :cap/ and the cap_ prefix.
 */
knoxx.backend.domain.contracts.resolve.keywordish__GT_capability_ref = (function knoxx$backend$domain$contracts$resolve$keywordish__GT_capability_ref(value){
var raw = (((value instanceof cljs.core.Keyword))?(function (){var ns_part = cljs.core.namespace(value);
var name_part = (function (){var G__26733 = value;
var G__26733__$1 = (((G__26733 == null))?null:cljs.core.name(G__26733));
var G__26733__$2 = (((G__26733__$1 == null))?null:clojure.string.trim(G__26733__$1));
if((G__26733__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26733__$2);
}
})();
if(cljs.core.truth_(name_part)){
if(cljs.core.truth_((function (){var and__5160__auto__ = ns_part;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not((knoxx.backend.domain.contracts.roles.standard_namespaces.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.contracts.roles.standard_namespaces.cljs$core$IFn$_invoke$arity$1(ns_part) : knoxx.backend.domain.contracts.roles.standard_namespaces.call(null,ns_part)));
} else {
return and__5160__auto__;
}
})())){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns_part)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name_part));
} else {
return name_part;
}
} else {
return null;
}
})():((typeof value === 'string')?value:(((value == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value))
)));
var G__26743 = raw;
var G__26743__$1 = (((G__26743 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26743)));
var G__26743__$2 = (((G__26743__$1 == null))?null:clojure.string.trim(G__26743__$1));
var G__26743__$3 = (((G__26743__$2 == null))?null:clojure.string.replace(G__26743__$2,/^cap\//,""));
var G__26743__$4 = (((G__26743__$3 == null))?null:clojure.string.replace(G__26743__$3,/^cap_/,""));
if((G__26743__$4 == null)){
return null;
} else {
return cljs.core.not_empty(G__26743__$4);
}
});
knoxx.backend.domain.contracts.resolve.keywordish__GT_wire = (function knoxx$backend$domain$contracts$resolve$keywordish__GT_wire(value){
if((value instanceof cljs.core.Keyword)){
var temp__5823__auto__ = cljs.core.namespace(value);
if(cljs.core.truth_(temp__5823__auto__)){
var ns = temp__5823__auto__;
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.name(value)));
} else {
return cljs.core.name(value);
}
} else {
if(typeof value === 'string'){
var G__26747 = value;
var G__26747__$1 = (((G__26747 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26747)));
var G__26747__$2 = (((G__26747__$1 == null))?null:clojure.string.trim(G__26747__$1));
if((G__26747__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26747__$2);
}
} else {
if((value == null)){
return null;
} else {
var G__26749 = value;
var G__26749__$1 = (((G__26749 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26749)));
var G__26749__$2 = (((G__26749__$1 == null))?null:clojure.string.trim(G__26749__$1));
if((G__26749__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26749__$2);
}

}
}
}
});
knoxx.backend.domain.contracts.resolve.ui_action_surfaces = (function knoxx$backend$domain$contracts$resolve$ui_action_surfaces(action){
var single = knoxx.backend.domain.contracts.resolve.keywordish__GT_wire(new cljs.core.Keyword(null,"surface","surface",699915646).cljs$core$IFn$_invoke$arity$1(action));
var many = cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.keywordish__GT_wire,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"surfaces","surfaces",-2030326421).cljs$core$IFn$_invoke$arity$1(action);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.concat.cljs$core$IFn$_invoke$arity$2((cljs.core.truth_(single)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [single], null):null),many)));
});
knoxx.backend.domain.contracts.resolve.normalize_ui_action = (function knoxx$backend$domain$contracts$resolve$normalize_ui_action(source,action){
var id = (function (){var G__26754 = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(action);
var G__26754__$1 = (((G__26754 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26754)));
var G__26754__$2 = (((G__26754__$1 == null))?null:clojure.string.trim(G__26754__$1));
if((G__26754__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26754__$2);
}
})();
var label = (function (){var G__26755 = new cljs.core.Keyword(null,"label","label",1718410804).cljs$core$IFn$_invoke$arity$1(action);
var G__26755__$1 = (((G__26755 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26755)));
var G__26755__$2 = (((G__26755__$1 == null))?null:clojure.string.trim(G__26755__$1));
if((G__26755__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26755__$2);
}
})();
var surfaces = knoxx.backend.domain.contracts.resolve.ui_action_surfaces(action);
if(cljs.core.truth_((function (){var and__5160__auto__ = id;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = label;
if(cljs.core.truth_(and__5160__auto____$1)){
return (!(new cljs.core.Keyword(null,"enabled?","enabled?",-1376075057).cljs$core$IFn$_invoke$arity$1(action) === false));
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})())){
var G__26757 = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"confirm","confirm",-2004000608),new cljs.core.Keyword(null,"surfaces","surfaces",-2030326421),new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword(null,"requires","requires",-1201390927),new cljs.core.Keyword(null,"label","label",1718410804),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"intent","intent",-390846953),new cljs.core.Keyword(null,"enabled","enabled",1195909756)],[cljs.core.boolean$(new cljs.core.Keyword(null,"confirm?","confirm?",-374341155).cljs$core$IFn$_invoke$arity$1(action)),surfaces,source,cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.keywordish__GT_wire,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"requires","requires",-1201390927).cljs$core$IFn$_invoke$arity$1(action);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))),label,id,(function (){var or__5162__auto__ = knoxx.backend.domain.contracts.resolve.keywordish__GT_wire(new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(action));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "button";
}
})(),(function (){var or__5162__auto__ = knoxx.backend.domain.contracts.resolve.keywordish__GT_wire(new cljs.core.Keyword(null,"intent","intent",-390846953).cljs$core$IFn$_invoke$arity$1(action));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "agent.run";
}
})(),true]);
var G__26757__$1 = ((cljs.core.seq(surfaces))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26757,new cljs.core.Keyword(null,"surface","surface",699915646),cljs.core.first(surfaces)):G__26757);
var G__26757__$2 = (cljs.core.truth_(new cljs.core.Keyword(null,"icon","icon",1679606541).cljs$core$IFn$_invoke$arity$1(action))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26757__$1,new cljs.core.Keyword(null,"icon","icon",1679606541),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"icon","icon",1679606541).cljs$core$IFn$_invoke$arity$1(action)))):G__26757__$1);
var G__26757__$3 = (cljs.core.truth_(new cljs.core.Keyword("agent","contract","agent/contract",-1980031674).cljs$core$IFn$_invoke$arity$1(action))?cljs.core.assoc_in(G__26757__$2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"contractId","contractId",710260199)], null),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword("agent","contract","agent/contract",-1980031674).cljs$core$IFn$_invoke$arity$1(action)))):G__26757__$2);
var G__26757__$4 = (cljs.core.truth_(new cljs.core.Keyword("agent","actor","agent/actor",-1923440606).cljs$core$IFn$_invoke$arity$1(action))?cljs.core.assoc_in(G__26757__$3,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"actorId","actorId",989542370)], null),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword("agent","actor","agent/actor",-1923440606).cljs$core$IFn$_invoke$arity$1(action)))):G__26757__$3);
var G__26757__$5 = (cljs.core.truth_(new cljs.core.Keyword("tool","id","tool/id",-1375657828).cljs$core$IFn$_invoke$arity$1(action))?cljs.core.assoc_in(G__26757__$4,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tool","tool",-1298696470),new cljs.core.Keyword(null,"id","id",-1388402092)], null),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword("tool","id","tool/id",-1375657828).cljs$core$IFn$_invoke$arity$1(action)))):G__26757__$4);
var G__26757__$6 = (cljs.core.truth_(new cljs.core.Keyword("media","from","media/from",-1778213736).cljs$core$IFn$_invoke$arity$1(action))?cljs.core.assoc_in(G__26757__$5,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"media","media",-1066138403),new cljs.core.Keyword(null,"from","from",1815293044)], null),knoxx.backend.domain.contracts.resolve.keywordish__GT_wire(new cljs.core.Keyword("media","from","media/from",-1778213736).cljs$core$IFn$_invoke$arity$1(action))):G__26757__$5);
if(cljs.core.truth_(new cljs.core.Keyword(null,"mode","mode",654403691).cljs$core$IFn$_invoke$arity$1(action))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26757__$6,new cljs.core.Keyword(null,"mode","mode",654403691),knoxx.backend.domain.contracts.resolve.keywordish__GT_wire(new cljs.core.Keyword(null,"mode","mode",654403691).cljs$core$IFn$_invoke$arity$1(action)));
} else {
return G__26757__$6;
}
} else {
return null;
}
});
knoxx.backend.domain.contracts.resolve.action_matches_surface_QMARK_ = (function knoxx$backend$domain$contracts$resolve$action_matches_surface_QMARK_(surface,action){
var wanted = (function (){var G__26769 = surface;
var G__26769__$1 = (((G__26769 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26769)));
var G__26769__$2 = (((G__26769__$1 == null))?null:clojure.string.trim(G__26769__$1));
if((G__26769__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26769__$2);
}
})();
var surfaces = new cljs.core.Keyword(null,"surfaces","surfaces",-2030326421).cljs$core$IFn$_invoke$arity$1(action);
var or__5162__auto__ = (wanted == null);
if(or__5162__auto__){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.empty_QMARK_(surfaces);
if(or__5162__auto____$1){
return or__5162__auto____$1;
} else {
return cljs.core.some((function (p1__26766_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(wanted,p1__26766_SHARP_);
}),surfaces);
}
}
});
knoxx.backend.domain.contracts.resolve.enrich_ui_action = (function knoxx$backend$domain$contracts$resolve$enrich_ui_action(config,action){
var temp__5823__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(action,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"contractId","contractId",710260199)], null));
if(cljs.core.truth_(temp__5823__auto__)){
var contract_id = temp__5823__auto__;
var actor_id = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(action,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"actorId","actorId",989542370)], null));
var resolved = (knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$3(config,contract_id,actor_id) : knoxx.backend.domain.contracts.resolve.resolve_agent_contract.call(null,config,contract_id,actor_id));
var G__26771 = action;
if(cljs.core.truth_(new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(resolved))){
return cljs.core.assoc_in(G__26771,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"model","model",331153215)], null),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(resolved));
} else {
return G__26771;
}
} else {
return action;
}
});
knoxx.backend.domain.contracts.resolve.resolve_actor = (function knoxx$backend$domain$contracts$resolve$resolve_actor(config,actor_id){
var temp__5825__auto__ = (function (){var G__26775 = actor_id;
var G__26775__$1 = (((G__26775 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26775)));
var G__26775__$2 = (((G__26775__$1 == null))?null:clojure.string.trim(G__26775__$1));
if((G__26775__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26775__$2);
}
})();
if(cljs.core.truth_(temp__5825__auto__)){
var id = temp__5825__auto__;
var record = knoxx.backend.domain.contracts.loader.find_contract_record_sync(config,"actors",id);
var actor = new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(actor)){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),new cljs.core.Keyword(null,"capability-ids","capability-ids",-1477528817),new cljs.core.Keyword(null,"default-agent","default-agent",279723152),new cljs.core.Keyword(null,"org","org",1495985),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429),new cljs.core.Keyword(null,"actor","actor",-1830560481)],[knoxx.backend.domain.agent.agent_templates.prompt_value(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(actor,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompts","prompts",15471501),new cljs.core.Keyword(null,"task","task",-1476607993)], null))),cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.keywordish__GT_role_slug,(function (){var or__5162__auto__ = new cljs.core.Keyword("actor","roles","actor/roles",186081855).cljs$core$IFn$_invoke$arity$1(actor);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())))),cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.keywordish__GT_capability_ref,(function (){var or__5162__auto__ = new cljs.core.Keyword("actor","capabilities","actor/capabilities",-198939954).cljs$core$IFn$_invoke$arity$1(actor);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())))),(function (){var G__26776 = new cljs.core.Keyword("actor","default-agent","actor/default-agent",321319579).cljs$core$IFn$_invoke$arity$1(actor);
var G__26776__$1 = (((G__26776 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26776)));
var G__26776__$2 = (((G__26776__$1 == null))?null:clojure.string.trim(G__26776__$1));
if((G__26776__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26776__$2);
}
})(),(function (){var G__26779 = new cljs.core.Keyword("actor","org","actor/org",175993262).cljs$core$IFn$_invoke$arity$1(actor);
var G__26779__$1 = (((G__26779 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26779)));
var G__26779__$2 = (((G__26779__$1 == null))?null:clojure.string.trim(G__26779__$1));
if((G__26779__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26779__$2);
}
})(),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(record),(function (){var G__26780 = new cljs.core.Keyword("actor","kind","actor/kind",-1410102686).cljs$core$IFn$_invoke$arity$1(actor);
if((G__26780 == null)){
return null;
} else {
return cljs.core.name(G__26780);
}
})(),knoxx.backend.domain.agent.agent_templates.prompt_value(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(actor,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompts","prompts",15471501),new cljs.core.Keyword(null,"system","system",-29381724)], null))),actor]);
} else {
return null;
}
} else {
return null;
}
});
knoxx.backend.domain.contracts.resolve.actor_catalog = (function knoxx$backend$domain$contracts$resolve$actor_catalog(config){
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (record){
return knoxx.backend.domain.contracts.resolve.resolve_actor(config,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(record));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__26782_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("actors",new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(p1__26782_SHARP_));
}),knoxx.backend.domain.contracts.loader.load_all_contracts_sync(config))))));
});
knoxx.backend.domain.contracts.resolve.default_actor_id = (function knoxx$backend$domain$contracts$resolve$default_actor_id(config){
var configured = (function (){var G__26784 = new cljs.core.Keyword(null,"knoxx-default-actor-id","knoxx-default-actor-id",1539819560).cljs$core$IFn$_invoke$arity$1(config);
var G__26784__$1 = (((G__26784 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26784)));
var G__26784__$2 = (((G__26784__$1 == null))?null:clojure.string.trim(G__26784__$1));
if((G__26784__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26784__$2);
}
})();
var configured_actor = (cljs.core.truth_(configured)?knoxx.backend.domain.contracts.resolve.resolve_actor(config,configured):null);
if(cljs.core.truth_(configured_actor)){
return configured;
} else {
var or__5162__auto__ = (function (){var G__26785 = knoxx.backend.domain.contracts.resolve.actor_catalog(config);
var G__26785__$1 = (((G__26785 == null))?null:cljs.core.first(G__26785));
if((G__26785__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(G__26785__$1);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "chat_primary";
}

}
});
knoxx.backend.domain.contracts.resolve.combine_prompts = (function knoxx$backend$domain$contracts$resolve$combine_prompts(var_args){
var args__5903__auto__ = [];
var len__5897__auto___27065 = arguments.length;
var i__5898__auto___27066 = (0);
while(true){
if((i__5898__auto___27066 < len__5897__auto___27065)){
args__5903__auto__.push((arguments[i__5898__auto___27066]));

var G__27067 = (i__5898__auto___27066 + (1));
i__5898__auto___27066 = G__27067;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return knoxx.backend.domain.contracts.resolve.combine_prompts.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(knoxx.backend.domain.contracts.resolve.combine_prompts.cljs$core$IFn$_invoke$arity$variadic = (function (parts){
var segments = cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.agent.agent_templates.prompt_value,parts));
if(cljs.core.empty_QMARK_(segments)){
return null;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(segments))){
return cljs.core.first(segments);
} else {
return (new cljs.core.List(null,cljs.core.symbol.cljs$core$IFn$_invoke$arity$1("template"),(new cljs.core.List(null,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"separator","separator",-1628749125),"\n\n"], null),(new cljs.core.List(null,segments,null,(1),null)),(2),null)),(3),null));

}
}
}));

(knoxx.backend.domain.contracts.resolve.combine_prompts.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(knoxx.backend.domain.contracts.resolve.combine_prompts.cljs$lang$applyTo = (function (seq26787){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq26787));
}));

knoxx.backend.domain.contracts.resolve.combine_system_prompts = (function knoxx$backend$domain$contracts$resolve$combine_system_prompts(var_args){
var args__5903__auto__ = [];
var len__5897__auto___27074 = arguments.length;
var i__5898__auto___27075 = (0);
while(true){
if((i__5898__auto___27075 < len__5897__auto___27074)){
args__5903__auto__.push((arguments[i__5898__auto___27075]));

var G__27076 = (i__5898__auto___27075 + (1));
i__5898__auto___27075 = G__27076;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return knoxx.backend.domain.contracts.resolve.combine_system_prompts.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(knoxx.backend.domain.contracts.resolve.combine_system_prompts.cljs$core$IFn$_invoke$arity$variadic = (function (parts){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.combine_prompts,parts);
}));

(knoxx.backend.domain.contracts.resolve.combine_system_prompts.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(knoxx.backend.domain.contracts.resolve.combine_system_prompts.cljs$lang$applyTo = (function (seq26791){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq26791));
}));

knoxx.backend.domain.contracts.resolve.combine_task_prompts = (function knoxx$backend$domain$contracts$resolve$combine_task_prompts(var_args){
var args__5903__auto__ = [];
var len__5897__auto___27081 = arguments.length;
var i__5898__auto___27082 = (0);
while(true){
if((i__5898__auto___27082 < len__5897__auto___27081)){
args__5903__auto__.push((arguments[i__5898__auto___27082]));

var G__27085 = (i__5898__auto___27082 + (1));
i__5898__auto___27082 = G__27085;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return knoxx.backend.domain.contracts.resolve.combine_task_prompts.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(knoxx.backend.domain.contracts.resolve.combine_task_prompts.cljs$core$IFn$_invoke$arity$variadic = (function (parts){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.combine_prompts,parts);
}));

(knoxx.backend.domain.contracts.resolve.combine_task_prompts.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(knoxx.backend.domain.contracts.resolve.combine_task_prompts.cljs$lang$applyTo = (function (seq26792){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq26792));
}));

knoxx.backend.domain.contracts.resolve.collect_role_tool_ids = (function knoxx$backend$domain$contracts$resolve$collect_role_tool_ids(config,role_slugs){
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (role_slug){
return knoxx.backend.domain.contracts.roles.role_tool_ids(config,role_slug);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.keywordish__GT_role_slug,role_slugs)))], 0)))));
});
knoxx.backend.domain.contracts.resolve.collect_capability_tool_ids = (function knoxx$backend$domain$contracts$resolve$collect_capability_tool_ids(config,capability_ids){
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (cap_id){
return knoxx.backend.domain.contracts.roles.capability_tool_ids(config,cap_id);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.keywordish__GT_capability_ref,capability_ids)))], 0)))));
});
knoxx.backend.domain.contracts.resolve.legacy_explicit_tool_ids = (function knoxx$backend$domain$contracts$resolve$legacy_explicit_tool_ids(contract){
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.registry.tools.normalize_tool_id,(function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"tools","tools",-1241731990)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())))));
});
knoxx.backend.domain.contracts.resolve.contract_actor_capability_claims = (function knoxx$backend$domain$contracts$resolve$contract_actor_capability_claims(contract){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.concat.cljs$core$IFn$_invoke$arity$2((function (){var or__5162__auto__ = new cljs.core.Keyword("actor","capabilities","actor/capabilities",-198939954).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})(),(function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.Keyword(null,"capabilities","capabilities",212739361)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
});
knoxx.backend.domain.contracts.resolve.role_context = (function knoxx$backend$domain$contracts$resolve$role_context(config,actor_spec,contract){
var contract_role_slugs = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.keywordish__GT_role_slug,knoxx.backend.domain.actor.scope.agent_role_claims(contract)))));
var actor_role_slugs = cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158).cljs$core$IFn$_invoke$arity$1(actor_spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var role_slugs = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(actor_role_slugs,contract_role_slugs)));
var role_system_prompts = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__26806_SHARP_){
return knoxx.backend.domain.contracts.roles.role_system_prompt(config,p1__26806_SHARP_);
}),role_slugs)));
var role_task_prompts = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__26807_SHARP_){
return knoxx.backend.domain.contracts.roles.role_task_prompt(config,p1__26807_SHARP_);
}),role_slugs)));
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"contract-role-slugs","contract-role-slugs",-451280079),contract_role_slugs,new cljs.core.Keyword(null,"actor-role-slugs","actor-role-slugs",1597094544),actor_role_slugs,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),role_slugs,new cljs.core.Keyword(null,"primary-role","primary-role",1120103749),(function (){var or__5162__auto__ = cljs.core.first(contract_role_slugs);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.first(actor_role_slugs);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"knoxx-default-role","knoxx-default-role",1668482524).cljs$core$IFn$_invoke$arity$1(config);
}
}
})(),new cljs.core.Keyword(null,"role-system-prompts","role-system-prompts",984408711),role_system_prompts,new cljs.core.Keyword(null,"role-task-prompts","role-task-prompts",-625812241),role_task_prompts], null);
});
knoxx.backend.domain.contracts.resolve.role_capability_claims = (function knoxx$backend$domain$contracts$resolve$role_capability_claims(config,role_slugs){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.keywordish__GT_capability_ref,cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__26816_SHARP_){
return knoxx.backend.domain.contracts.roles.role_capability_ids(config,p1__26816_SHARP_);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(function (){var or__5162__auto__ = role_slugs;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()], 0))))));
});
knoxx.backend.domain.contracts.resolve.capability_context = (function knoxx$backend$domain$contracts$resolve$capability_context(config,actor_spec,role_slugs,contract){
var actor_capability_ids = cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"capability-ids","capability-ids",-1477528817).cljs$core$IFn$_invoke$arity$1(actor_spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var role_capability_ids = knoxx.backend.domain.contracts.resolve.role_capability_claims(config,role_slugs);
var contract_capability_ids = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.keywordish__GT_capability_ref,knoxx.backend.domain.contracts.resolve.contract_actor_capability_claims(contract)))));
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"capability-ids","capability-ids",-1477528817),cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic(actor_capability_ids,role_capability_ids,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([contract_capability_ids], 0))))], null);
});
/**
 * Tool ids an agent contract explicitly removes from its otherwise-granted set.
 * Declared on the contract as :tool-deny (or :data :tool-deny). Lets a specific
 * agent shed a tool granted by a shared role/capability without forking the role
 * — e.g. Discord-delivery agents dropping workspace_media.attach, which they do
 * not need (they deliver via discord.send) and otherwise loop on.
 */
knoxx.backend.domain.contracts.resolve.denied_tool_ids = (function knoxx$backend$domain$contracts$resolve$denied_tool_ids(contract){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.registry.tools.normalize_tool_id,cljs.core.concat.cljs$core$IFn$_invoke$arity$2((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tool-deny","tool-deny",329869390).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})(),(function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"tool-deny","tool-deny",329869390)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))));
});
knoxx.backend.domain.contracts.resolve.tool_context = (function knoxx$backend$domain$contracts$resolve$tool_context(config,role_slugs,capability_ids,contract){
var role_tool_ids = knoxx.backend.domain.contracts.resolve.collect_role_tool_ids(config,role_slugs);
var capability_tool_ids = knoxx.backend.domain.contracts.resolve.collect_capability_tool_ids(config,capability_ids);
var explicit_tool_ids = knoxx.backend.domain.contracts.resolve.legacy_explicit_tool_ids(contract);
var denied = knoxx.backend.domain.contracts.resolve.denied_tool_ids(contract);
var tool_ids = cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(denied,cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic(role_tool_ids,capability_tool_ids,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([explicit_tool_ids], 0))))));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"tool-ids","tool-ids",-1358371034),tool_ids,new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (tool_id){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),tool_id,new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null);
}),tool_ids)], null);
});
knoxx.backend.domain.contracts.resolve.role_source_refs = (function knoxx$backend$domain$contracts$resolve$role_source_refs(config,role_slugs){
return cljs.core.vec(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (role_contract){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2((function (){var or__5162__auto__ = new cljs.core.Keyword("role","sources","role/sources",-317332946).cljs$core$IFn$_invoke$arity$1(role_contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"sources","sources",-321166424).cljs$core$IFn$_invoke$arity$1(role_contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__26836_SHARP_){
return knoxx.backend.domain.contracts.roles.role_contract(config,p1__26836_SHARP_);
}),role_slugs)], 0)));
});
knoxx.backend.domain.contracts.resolve.actor_source_refs = (function knoxx$backend$domain$contracts$resolve$actor_source_refs(actor_spec){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2((function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(actor_spec,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.Keyword("actor","sources","actor/sources",-832192083)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})(),(function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(actor_spec,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.Keyword(null,"sources","sources",-321166424)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
});
knoxx.backend.domain.contracts.resolve.agent_source_refs = (function knoxx$backend$domain$contracts$resolve$agent_source_refs(contract){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2((function (){var or__5162__auto__ = new cljs.core.Keyword("agent","sources","agent/sources",-832329571).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"sources","sources",-321166424).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
});
knoxx.backend.domain.contracts.resolve.runtime_sources_for_agent = (function knoxx$backend$domain$contracts$resolve$runtime_sources_for_agent(config,actor_spec,role_slugs,contract){
return knoxx.backend.domain.contracts.sources.compose_source_refs.cljs$core$IFn$_invoke$arity$variadic(config,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.domain.contracts.resolve.actor_source_refs(actor_spec),knoxx.backend.domain.contracts.resolve.role_source_refs(config,role_slugs),knoxx.backend.domain.contracts.resolve.agent_source_refs(contract)], 0));
});
knoxx.backend.domain.contracts.resolve.prompt_context = (function knoxx$backend$domain$contracts$resolve$prompt_context(actor_spec,contract,role_system_prompts,role_task_prompts){
var role_system_prompt = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.combine_system_prompts,role_system_prompts);
var role_task_prompt = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.combine_task_prompts,role_task_prompts);
var agent_system_prompt = knoxx.backend.domain.agent.agent_templates.prompt_value(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompts","prompts",15471501),new cljs.core.Keyword(null,"system","system",-29381724)], null)));
var agent_task_prompt = knoxx.backend.domain.agent.agent_templates.prompt_value(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompts","prompts",15471501),new cljs.core.Keyword(null,"task","task",-1476607993)], null)));
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"role-system-prompt","role-system-prompt",-1946535526),role_system_prompt,new cljs.core.Keyword(null,"role-task-prompt","role-task-prompt",30946701),role_task_prompt,new cljs.core.Keyword(null,"agent-system-prompt","agent-system-prompt",-1576864491),agent_system_prompt,new cljs.core.Keyword(null,"agent-task-prompt","agent-task-prompt",-853433872),agent_task_prompt,new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429),knoxx.backend.domain.contracts.resolve.combine_system_prompts.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([role_system_prompt,new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429).cljs$core$IFn$_invoke$arity$1(actor_spec),agent_system_prompt], 0)),new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716),knoxx.backend.domain.contracts.resolve.combine_task_prompts.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([role_task_prompt,new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716).cljs$core$IFn$_invoke$arity$1(actor_spec),agent_task_prompt], 0))], null);
});
knoxx.backend.domain.contracts.resolve.resolved_agent_map = (function knoxx$backend$domain$contracts$resolve$resolved_agent_map(record,contract,contract_actors,actor_spec,role_ctx,capability_ctx,tool_ctx,prompt_ctx,runtime_sources,all_extras,enabled_QMARK_){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"contract-actor-ids","contract-actor-ids",1506474817),new cljs.core.Keyword(null,"memory-hydration","memory-hydration",1956326082),new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716),new cljs.core.Keyword(null,"tool-ids","tool-ids",-1358371034),new cljs.core.Keyword(null,"sources","sources",-321166424),new cljs.core.Keyword(null,"contract","contract",798152745),new cljs.core.Keyword(null,"actor-task-prompt","actor-task-prompt",354082345),new cljs.core.Keyword(null,"actor-kind","actor-kind",42051561),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"role-task-prompt","role-task-prompt",30946701),new cljs.core.Keyword(null,"contract-actors","contract-actors",-173888049),new cljs.core.Keyword(null,"capability-ids","capability-ids",-1477528817),new cljs.core.Keyword(null,"trigger-kind","trigger-kind",1773988783),new cljs.core.Keyword(null,"agent-task-prompt","agent-task-prompt",-853433872),new cljs.core.Keyword(null,"actor-role-slugs","actor-role-slugs",1597094544),new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429),new cljs.core.Keyword(null,"agent-system-prompt","agent-system-prompt",-1576864491),new cljs.core.Keyword(null,"role-system-prompt","role-system-prompt",-1946535526),new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557),new cljs.core.Keyword(null,"actor-system-prompt","actor-system-prompt",-1563106020),new cljs.core.Keyword(null,"enabled","enabled",1195909756),new cljs.core.Keyword(null,"extras","extras",-1110348066),new cljs.core.Keyword(null,"model","model",331153215)],[new cljs.core.Keyword(null,"primary-role","primary-role",1120103749).cljs$core$IFn$_invoke$arity$1(role_ctx),knoxx.backend.domain.actor.scope.actor_claims__GT_wire(contract_actors),knoxx.backend.domain.contracts.resolve.memory_hydration_from_contract(contract),new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716).cljs$core$IFn$_invoke$arity$1(prompt_ctx),new cljs.core.Keyword(null,"tool-ids","tool-ids",-1358371034).cljs$core$IFn$_invoke$arity$1(tool_ctx),runtime_sources,contract,new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716).cljs$core$IFn$_invoke$arity$1(actor_spec),new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(actor_spec),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158).cljs$core$IFn$_invoke$arity$1(role_ctx),knoxx.backend.domain.contracts.resolve.context_policy_from_contract(contract),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(actor_spec),new cljs.core.Keyword(null,"role-task-prompt","role-task-prompt",30946701).cljs$core$IFn$_invoke$arity$1(prompt_ctx),contract_actors,new cljs.core.Keyword(null,"capability-ids","capability-ids",-1477528817).cljs$core$IFn$_invoke$arity$1(capability_ctx),(function (){var G__26895 = new cljs.core.Keyword(null,"trigger-kind","trigger-kind",1773988783).cljs$core$IFn$_invoke$arity$1(contract);
if((G__26895 == null)){
return null;
} else {
return knoxx.backend.domain.contracts.resolve.keywordish__GT_role_slug(G__26895);
}
})(),new cljs.core.Keyword(null,"agent-task-prompt","agent-task-prompt",-853433872).cljs$core$IFn$_invoke$arity$1(prompt_ctx),new cljs.core.Keyword(null,"actor-role-slugs","actor-role-slugs",1597094544).cljs$core$IFn$_invoke$arity$1(role_ctx),(function (){var G__26897 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"thinking","thinking",2063777387)], null));
if((G__26897 == null)){
return null;
} else {
return knoxx.backend.domain.contracts.resolve.keywordish__GT_role_slug(G__26897);
}
})(),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429).cljs$core$IFn$_invoke$arity$1(prompt_ctx),new cljs.core.Keyword(null,"agent-system-prompt","agent-system-prompt",-1576864491).cljs$core$IFn$_invoke$arity$1(prompt_ctx),new cljs.core.Keyword(null,"role-system-prompt","role-system-prompt",-1946535526).cljs$core$IFn$_invoke$arity$1(prompt_ctx),new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(tool_ctx),new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429).cljs$core$IFn$_invoke$arity$1(actor_spec),enabled_QMARK_,all_extras,(function (){var G__26899 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"model","model",331153215)], null));
var G__26899__$1 = (((G__26899 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26899)));
var G__26899__$2 = (((G__26899__$1 == null))?null:clojure.string.trim(G__26899__$1));
if((G__26899__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26899__$2);
}
})()]);
});
knoxx.backend.domain.contracts.resolve.resolve_agent_contract = (function knoxx$backend$domain$contracts$resolve$resolve_agent_contract(var_args){
var G__26907 = arguments.length;
switch (G__26907) {
case 2:
return knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$2 = (function (config,contract_id){
return knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$3(config,contract_id,null);
}));

(knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$3 = (function (config,contract_id,actor_id){
var temp__5825__auto__ = (function (){var G__26911 = contract_id;
var G__26911__$1 = (((G__26911 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26911)));
var G__26911__$2 = (((G__26911__$1 == null))?null:clojure.string.trim(G__26911__$1));
if((G__26911__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26911__$2);
}
})();
if(cljs.core.truth_(temp__5825__auto__)){
var id = temp__5825__auto__;
var record = knoxx.backend.domain.contracts.loader.find_contract_record_sync(config,"agents",id);
var contract0 = new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(record);
var contract = (function (){var G__26914 = contract0;
if((G__26914 == null)){
return null;
} else {
return knoxx.backend.domain.actor.scope.normalize_agent_contract(G__26914);
}
})();
if(cljs.core.truth_(contract)){
var enabled_QMARK_ = (!(new cljs.core.Keyword(null,"enabled","enabled",1195909756).cljs$core$IFn$_invoke$arity$1(contract) === false));
var contract_actors = knoxx.backend.domain.actor.scope.normalized_contract_actors.cljs$core$IFn$_invoke$arity$1(contract);
var requested_actor_id = (function (){var G__26917 = actor_id;
var G__26917__$1 = (((G__26917 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26917)));
var G__26917__$2 = (((G__26917__$1 == null))?null:clojure.string.trim(G__26917__$1));
if((G__26917__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26917__$2);
}
})();
var allowed_for_request_QMARK_ = (function (){var or__5162__auto__ = (requested_actor_id == null);
if(or__5162__auto__){
return or__5162__auto__;
} else {
return knoxx.backend.domain.actor.scope.actor_allowed_QMARK_(contract_actors,requested_actor_id);
}
})();
var effective_actor_id = knoxx.backend.domain.actor.scope.effective_actor_id(contract_actors,requested_actor_id,knoxx.backend.domain.contracts.resolve.default_actor_id(config));
if(cljs.core.truth_(allowed_for_request_QMARK_)){
var actor_spec = (function (){var or__5162__auto__ = (cljs.core.truth_(effective_actor_id)?knoxx.backend.domain.contracts.resolve.resolve_actor(config,effective_actor_id):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var temp__5825__auto____$1 = knoxx.backend.domain.contracts.resolve.default_actor_id(config);
if(cljs.core.truth_(temp__5825__auto____$1)){
var default_id = temp__5825__auto____$1;
return knoxx.backend.domain.contracts.resolve.resolve_actor(config,default_id);
} else {
return null;
}
}
})();
var role_ctx = knoxx.backend.domain.contracts.resolve.role_context(config,actor_spec,contract);
var capability_ctx = knoxx.backend.domain.contracts.resolve.capability_context(config,actor_spec,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158).cljs$core$IFn$_invoke$arity$1(role_ctx),contract);
var tool_ctx = knoxx.backend.domain.contracts.resolve.tool_context(config,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158).cljs$core$IFn$_invoke$arity$1(role_ctx),new cljs.core.Keyword(null,"capability-ids","capability-ids",-1477528817).cljs$core$IFn$_invoke$arity$1(capability_ctx),contract);
var prompt_ctx = knoxx.backend.domain.contracts.resolve.prompt_context(actor_spec,contract,new cljs.core.Keyword(null,"role-system-prompts","role-system-prompts",984408711).cljs$core$IFn$_invoke$arity$1(role_ctx),new cljs.core.Keyword(null,"role-task-prompts","role-task-prompts",-625812241).cljs$core$IFn$_invoke$arity$1(role_ctx));
var runtime_sources = knoxx.backend.domain.contracts.resolve.runtime_sources_for_agent(config,actor_spec,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158).cljs$core$IFn$_invoke$arity$1(role_ctx),contract);
var all_extras = knoxx.backend.domain.contracts.resolve.all_contract_extras(config,actor_spec,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158).cljs$core$IFn$_invoke$arity$1(role_ctx),new cljs.core.Keyword(null,"capability-ids","capability-ids",-1477528817).cljs$core$IFn$_invoke$arity$1(capability_ctx),contract);
return knoxx.backend.domain.contracts.resolve.resolved_agent_map(record,contract,contract_actors,actor_spec,role_ctx,capability_ctx,tool_ctx,prompt_ctx,runtime_sources,all_extras,enabled_QMARK_);
} else {
return null;
}
} else {
return null;
}
} else {
return null;
}
}));

(knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$lang$maxFixedArity = 3);

knoxx.backend.domain.contracts.resolve.manual_agent_contract_QMARK_ = (function knoxx$backend$domain$contracts$resolve$manual_agent_contract_QMARK_(entry){
var trigger_kind = (function (){var G__26970 = new cljs.core.Keyword(null,"trigger-kind","trigger-kind",1773988783).cljs$core$IFn$_invoke$arity$1(entry);
var G__26970__$1 = (((G__26970 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26970)));
var G__26970__$2 = (((G__26970__$1 == null))?null:clojure.string.trim(G__26970__$1));
if((G__26970__$2 == null)){
return null;
} else {
return clojure.string.lower_case(G__26970__$2);
}
})();
return ((clojure.string.blank_QMARK_(trigger_kind)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("manual",trigger_kind)));
});
knoxx.backend.domain.contracts.resolve.agent_contract_catalog = (function knoxx$backend$domain$contracts$resolve$agent_contract_catalog(var_args){
var G__27000 = arguments.length;
switch (G__27000) {
case 1:
return knoxx.backend.domain.contracts.resolve.agent_contract_catalog.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.domain.contracts.resolve.agent_contract_catalog.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.contracts.resolve.agent_contract_catalog.cljs$core$IFn$_invoke$arity$1 = (function (config){
return knoxx.backend.domain.contracts.resolve.agent_contract_catalog.cljs$core$IFn$_invoke$arity$2(config,null);
}));

(knoxx.backend.domain.contracts.resolve.agent_contract_catalog.cljs$core$IFn$_invoke$arity$2 = (function (config,actor_id){
var wanted_actor_id = (function (){var G__27002 = actor_id;
var G__27002__$1 = (((G__27002 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27002)));
var G__27002__$2 = (((G__27002__$1 == null))?null:clojure.string.trim(G__27002__$1));
if((G__27002__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27002__$2);
}
})();
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.contracts.resolve.manual_agent_contract_QMARK_,cljs.core.filter.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"enabled","enabled",1195909756),cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (record){
return knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$3(config,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(record),wanted_actor_id);
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__26998_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("agents",new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(p1__26998_SHARP_));
}),knoxx.backend.domain.contracts.loader.load_all_contracts_sync(config))))))));
}));

(knoxx.backend.domain.contracts.resolve.agent_contract_catalog.cljs$lang$maxFixedArity = 2);

knoxx.backend.domain.contracts.resolve.default_agent_contract_id = (function knoxx$backend$domain$contracts$resolve$default_agent_contract_id(var_args){
var G__27006 = arguments.length;
switch (G__27006) {
case 1:
return knoxx.backend.domain.contracts.resolve.default_agent_contract_id.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.domain.contracts.resolve.default_agent_contract_id.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.contracts.resolve.default_agent_contract_id.cljs$core$IFn$_invoke$arity$1 = (function (config){
return knoxx.backend.domain.contracts.resolve.default_agent_contract_id.cljs$core$IFn$_invoke$arity$2(config,null);
}));

(knoxx.backend.domain.contracts.resolve.default_agent_contract_id.cljs$core$IFn$_invoke$arity$2 = (function (config,actor_id){
var actor_spec = (function (){var or__5162__auto__ = (cljs.core.truth_(actor_id)?knoxx.backend.domain.contracts.resolve.resolve_actor(config,actor_id):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var temp__5825__auto__ = knoxx.backend.domain.contracts.resolve.default_actor_id(config);
if(cljs.core.truth_(temp__5825__auto__)){
var default_id = temp__5825__auto__;
return knoxx.backend.domain.contracts.resolve.resolve_actor(config,default_id);
} else {
return null;
}
}
})();
var actor_default = (function (){var G__27014 = new cljs.core.Keyword(null,"default-agent","default-agent",279723152).cljs$core$IFn$_invoke$arity$1(actor_spec);
var G__27014__$1 = (((G__27014 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27014)));
var G__27014__$2 = (((G__27014__$1 == null))?null:clojure.string.trim(G__27014__$1));
if((G__27014__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27014__$2);
}
})();
var configured = (function (){var G__27017 = new cljs.core.Keyword(null,"knoxx-default-agent-contract","knoxx-default-agent-contract",-620088071).cljs$core$IFn$_invoke$arity$1(config);
var G__27017__$1 = (((G__27017 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27017)));
var G__27017__$2 = (((G__27017__$1 == null))?null:clojure.string.trim(G__27017__$1));
if((G__27017__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27017__$2);
}
})();
var configured_manual = (cljs.core.truth_(configured)?knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$3(config,configured,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(actor_spec)):null);
var actor_default_manual = (cljs.core.truth_(actor_default)?knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$3(config,actor_default,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(actor_spec)):null);
var actor_catalog = knoxx.backend.domain.contracts.resolve.agent_contract_catalog.cljs$core$IFn$_invoke$arity$2(config,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(actor_spec));
if(cljs.core.truth_((function (){var and__5160__auto__ = actor_default_manual;
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.domain.contracts.resolve.manual_agent_contract_QMARK_(actor_default_manual);
} else {
return and__5160__auto__;
}
})())){
return actor_default;
} else {
if(cljs.core.truth_((function (){var and__5160__auto__ = configured_manual;
if(cljs.core.truth_(and__5160__auto__)){
return ((knoxx.backend.domain.contracts.resolve.manual_agent_contract_QMARK_(configured_manual)) && ((((actor_spec == null)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(actor_spec),new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(configured_manual))))));
} else {
return and__5160__auto__;
}
})())){
return configured;
} else {
var G__27025 = actor_catalog;
var G__27025__$1 = (((G__27025 == null))?null:cljs.core.first(G__27025));
if((G__27025__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(G__27025__$1);
}

}
}
}));

(knoxx.backend.domain.contracts.resolve.default_agent_contract_id.cljs$lang$maxFixedArity = 2);

knoxx.backend.domain.contracts.resolve.effective_agent_contract = (function knoxx$backend$domain$contracts$resolve$effective_agent_contract(var_args){
var G__27029 = arguments.length;
switch (G__27029) {
case 2:
return knoxx.backend.domain.contracts.resolve.effective_agent_contract.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.contracts.resolve.effective_agent_contract.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.contracts.resolve.effective_agent_contract.cljs$core$IFn$_invoke$arity$2 = (function (config,requested_contract_id){
return knoxx.backend.domain.contracts.resolve.effective_agent_contract.cljs$core$IFn$_invoke$arity$3(config,requested_contract_id,null);
}));

(knoxx.backend.domain.contracts.resolve.effective_agent_contract.cljs$core$IFn$_invoke$arity$3 = (function (config,requested_contract_id,actor_id){
var or__5162__auto__ = (cljs.core.truth_(requested_contract_id)?knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$3(config,requested_contract_id,actor_id):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var temp__5825__auto__ = knoxx.backend.domain.contracts.resolve.default_agent_contract_id.cljs$core$IFn$_invoke$arity$2(config,actor_id);
if(cljs.core.truth_(temp__5825__auto__)){
var actor_default_id = temp__5825__auto__;
return knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$3(config,actor_default_id,actor_id);
} else {
return null;
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var temp__5825__auto__ = knoxx.backend.domain.contracts.resolve.default_agent_contract_id.cljs$core$IFn$_invoke$arity$2(config,null);
if(cljs.core.truth_(temp__5825__auto__)){
var global_default_id = temp__5825__auto__;
return knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$3(config,global_default_id,actor_id);
} else {
return null;
}
}
}
}));

(knoxx.backend.domain.contracts.resolve.effective_agent_contract.cljs$lang$maxFixedArity = 3);

/**
 * Resolve contract-declared UI actions for an actor and optional surface.
 * Actor actions are listed before default-agent actions; disabled actions are
 * omitted. This is intentionally a render contract, not an execution contract.
 */
knoxx.backend.domain.contracts.resolve.ui_actions_for_actor = (function knoxx$backend$domain$contracts$resolve$ui_actions_for_actor(config,actor_id,surface){
var effective_actor_id = (function (){var or__5162__auto__ = (function (){var G__27038 = actor_id;
var G__27038__$1 = (((G__27038 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27038)));
var G__27038__$2 = (((G__27038__$1 == null))?null:clojure.string.trim(G__27038__$1));
if((G__27038__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27038__$2);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.contracts.resolve.default_actor_id(config);
}
})();
var actor_spec = knoxx.backend.domain.contracts.resolve.resolve_actor(config,effective_actor_id);
var actor_actions = cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__27033_SHARP_){
return knoxx.backend.domain.contracts.resolve.normalize_ui_action("actor",p1__27033_SHARP_);
}),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(actor_spec,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.Keyword("ui","actions","ui/actions",-812652422)], null)));
var default_agent_id = (function (){var G__27041 = new cljs.core.Keyword(null,"default-agent","default-agent",279723152).cljs$core$IFn$_invoke$arity$1(actor_spec);
var G__27041__$1 = (((G__27041 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27041)));
var G__27041__$2 = (((G__27041__$1 == null))?null:clojure.string.trim(G__27041__$1));
if((G__27041__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27041__$2);
}
})();
var agent_spec = (cljs.core.truth_(default_agent_id)?knoxx.backend.domain.contracts.resolve.resolve_agent_contract.cljs$core$IFn$_invoke$arity$3(config,default_agent_id,effective_actor_id):null);
var agent_actions = cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__27034_SHARP_){
return knoxx.backend.domain.contracts.resolve.normalize_ui_action("agent",p1__27034_SHARP_);
}),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(agent_spec,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract","contract",798152745),new cljs.core.Keyword("ui","actions","ui/actions",-812652422)], null)));
var actions = cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__27036_SHARP_){
return knoxx.backend.domain.contracts.resolve.action_matches_surface_QMARK_(surface,p1__27036_SHARP_);
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__27035_SHARP_){
return knoxx.backend.domain.contracts.resolve.enrich_ui_action(config,p1__27035_SHARP_);
}),cljs.core.concat.cljs$core$IFn$_invoke$arity$2(actor_actions,agent_actions))));
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"actor-id","actor-id",897721067),effective_actor_id,new cljs.core.Keyword(null,"surface","surface",699915646),(function (){var G__27042 = surface;
var G__27042__$1 = (((G__27042 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27042)));
var G__27042__$2 = (((G__27042__$1 == null))?null:clojure.string.trim(G__27042__$1));
if((G__27042__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27042__$2);
}
})(),new cljs.core.Keyword(null,"default-agent-id","default-agent-id",-2135472358),default_agent_id,new cljs.core.Keyword(null,"actions","actions",-812656882),actions], null);
});

//# sourceMappingURL=knoxx.backend.domain.contracts.resolve.js.map
