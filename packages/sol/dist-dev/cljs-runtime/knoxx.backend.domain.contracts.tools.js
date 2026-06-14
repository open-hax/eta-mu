import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.contracts.client.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.domain.tools.js";
goog.provide('knoxx.backend.domain.contracts.tools');
knoxx.backend.domain.contracts.tools.contract_list_params = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract_class","contract_class",490905262),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Contract class to list: agents, roles, capabilities, actors, policies, source_modes, sources, models, model_families, actions, triggers, sub_agents. Defaults to agents."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.contracts.tools.contract_read_params = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Contract ID to read. For roles/capabilities, use the body identity slug such as fork-tales-composer or contract-write."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract_class","contract_class",490905262),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Contract class: agents, roles, capabilities, actors, policies, source_modes, sources, models, model_families, actions, triggers, sub_agents. Defaults to agents."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.contracts.tools.contract_write_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Contract ID to create or update. Must match the contract identity inside edn_text."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"edn_text","edn_text",258296122),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Complete EDN contract text to save. Must be valid EDN and the record id must match contract_id."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract_class","contract_class",490905262),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Contract class to save. Defaults to agents; use roles/capabilities/etc when editing non-agent contracts."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.contracts.tools.contract_validate_params = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"edn_text","edn_text",258296122),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"EDN contract text to validate. Returns :ok, :errors, :warnings, :contract-class, and parsed :contract on success."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract_class","contract_class",490905262),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Contract class hint: agents, roles, capabilities, actors, policies, source_modes, sources, models, model_families, actions, triggers, sub_agents. Defaults to agents."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.contracts.tools.param_value = (function knoxx$backend$domain$contracts$tools$param_value(params,snake,camel,fallback){
var or__5162__auto__ = (params[snake]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params[camel]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return fallback;
}
}
});
knoxx.backend.domain.contracts.tools.param_string = (function knoxx$backend$domain$contracts$tools$param_string(params,snake,camel,fallback){
var G__27537 = knoxx.backend.domain.contracts.tools.param_value(params,snake,camel,fallback);
var G__27537__$1 = (((G__27537 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27537)));
var G__27537__$2 = (((G__27537__$1 == null))?null:clojure.string.trim(G__27537__$1));
if((G__27537__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27537__$2);
}
});
knoxx.backend.domain.contracts.tools.param_text = (function knoxx$backend$domain$contracts$tools$param_text(params,snake,camel,fallback){
var G__27542 = knoxx.backend.domain.contracts.tools.param_value(params,snake,camel,fallback);
if((G__27542 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27542));
}
});
knoxx.backend.domain.contracts.tools.contract_class_param = (function knoxx$backend$domain$contracts$tools$contract_class_param(params){
return knoxx.backend.domain.contracts.tools.param_string(params,"contract_class","contractClass","agents");
});
knoxx.backend.domain.contracts.tools.contract_list_execute = (async function knoxx$backend$domain$contracts$tools$contract_list_execute(_runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var klass = knoxx.backend.domain.contracts.tools.contract_class_param(params);
var client = knoxx.backend.domain.contracts.client.client.cljs$core$IFn$_invoke$arity$1(config);
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Listing "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(klass)+" contracts\u2026"));

var map__27549 = (await knoxx.backend.domain.contracts.client.list_contracts_BANG_(client,klass));
var map__27549__$1 = cljs.core.__destructure_map(map__27549);
var ok = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27549__$1,new cljs.core.Keyword(null,"ok","ok",967785236));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27549__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27549__$1,new cljs.core.Keyword(null,"text","text",-1790561697));
return knoxx.backend.domain.text.tool_text_result((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(ok)?"Contract list":"Contract list failed"))+" for class "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(klass)+" (HTTP "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(status)+"):\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"contract_class","contract_class",490905262),klass,new cljs.core.Keyword(null,"ok","ok",967785236),ok,new cljs.core.Keyword(null,"status","status",-1997798413),status,new cljs.core.Keyword(null,"result","result",1415092211),text], null));
});
knoxx.backend.domain.contracts.tools.contract_read_execute = (async function knoxx$backend$domain$contracts$tools$contract_read_execute(_runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var contract_id = knoxx.backend.domain.contracts.tools.param_string(params,"contract_id","contractId","");
var klass = knoxx.backend.domain.contracts.tools.contract_class_param(params);
var client = knoxx.backend.domain.contracts.client.client.cljs$core$IFn$_invoke$arity$1(config);
if(clojure.string.blank_QMARK_(contract_id)){
throw (new Error("contract_id is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Reading "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(klass)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(contract_id)+"\u2026"));

var map__27558 = (await knoxx.backend.domain.contracts.client.read_contract_BANG_(client,klass,contract_id));
var map__27558__$1 = cljs.core.__destructure_map(map__27558);
var ok = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27558__$1,new cljs.core.Keyword(null,"ok","ok",967785236));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27558__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27558__$1,new cljs.core.Keyword(null,"text","text",-1790561697));
return knoxx.backend.domain.text.tool_text_result((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(ok)?"Contract read":"Contract read failed"))+" for "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(klass)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(contract_id)+" (HTTP "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(status)+"):\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),contract_id,new cljs.core.Keyword(null,"contract_class","contract_class",490905262),klass,new cljs.core.Keyword(null,"ok","ok",967785236),ok,new cljs.core.Keyword(null,"status","status",-1997798413),status,new cljs.core.Keyword(null,"edn_text","edn_text",258296122),text], null));
});
knoxx.backend.domain.contracts.tools.contract_write_execute = (async function knoxx$backend$domain$contracts$tools$contract_write_execute(_runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var contract_id = knoxx.backend.domain.contracts.tools.param_string(params,"contract_id","contractId","");
var edn_text = knoxx.backend.domain.contracts.tools.param_text(params,"edn_text","ednText","");
var klass = knoxx.backend.domain.contracts.tools.contract_class_param(params);
var client = knoxx.backend.domain.contracts.client.client.cljs$core$IFn$_invoke$arity$1(config);
if(clojure.string.blank_QMARK_(contract_id)){
throw (new Error("contract_id is required"));
} else {
}

if(clojure.string.blank_QMARK_(edn_text)){
throw (new Error("edn_text is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Saving "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(klass)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(contract_id)+"\u2026"));

var map__27568 = (await knoxx.backend.domain.contracts.client.write_contract_BANG_(client,klass,contract_id,edn_text));
var map__27568__$1 = cljs.core.__destructure_map(map__27568);
var ok = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27568__$1,new cljs.core.Keyword(null,"ok","ok",967785236));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27568__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27568__$1,new cljs.core.Keyword(null,"text","text",-1790561697));
return knoxx.backend.domain.text.tool_text_result((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(ok)?"Contract save result":"Contract save failed"))+" for "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(klass)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(contract_id)+" (HTTP "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(status)+"):\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),contract_id,new cljs.core.Keyword(null,"contract_class","contract_class",490905262),klass,new cljs.core.Keyword(null,"ok","ok",967785236),ok,new cljs.core.Keyword(null,"status","status",-1997798413),status,new cljs.core.Keyword(null,"result","result",1415092211),text], null));
});
knoxx.backend.domain.contracts.tools.contract_validate_execute = (async function knoxx$backend$domain$contracts$tools$contract_validate_execute(_runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var edn_text = knoxx.backend.domain.contracts.tools.param_text(params,"edn_text","ednText","");
var klass = knoxx.backend.domain.contracts.tools.contract_class_param(params);
var client = knoxx.backend.domain.contracts.client.client.cljs$core$IFn$_invoke$arity$1(config);
if(clojure.string.blank_QMARK_(edn_text)){
throw (new Error("edn_text is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Validating "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(klass)+" contract EDN\u2026"));

var r = (await knoxx.backend.domain.contracts.client.validate_contract_BANG_(client,klass,edn_text));
var ok_QMARK_ = new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(r);
var errors = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(r);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var warnings = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"warnings","warnings",-735437651).cljs$core$IFn$_invoke$arity$1(r);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
return knoxx.backend.domain.text.tool_text_result((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(ok_QMARK_)?(""+"\u2713 Contract valid"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var temp__5825__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(r,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract","contract",798152745),new cljs.core.Keyword("contract","id","contract/id",-872298206)], null));
if(cljs.core.truth_(temp__5825__auto__)){
var cid = temp__5825__auto__;
return (""+" \u2014 :contract/id "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cid));
} else {
return null;
}
})()))+"\nClass: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(r);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"contract-class","contract-class",-393992188).cljs$core$IFn$_invoke$arity$1(r);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return klass;
}
}
})()))):(""+"\u2717 Validation failed:\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (err){
var path = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"path","path",-188191168).cljs$core$IFn$_invoke$arity$1(err);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "root";
}
})();
var msg = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(err);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Unknown error";
}
})();
return (""+"  \u2022 ["+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2(" > ",path))+"]: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(msg));
}),errors))))))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((cljs.core.seq(warnings))?(""+"\nWarnings:\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (warning){
var path = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"path","path",-188191168).cljs$core$IFn$_invoke$arity$1(warning);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "root";
}
})();
var msg = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(warning);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Warning";
}
})();
return (""+"  \u2022 ["+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2(" > ",path))+"]: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(msg));
}),warnings)))):null))),r);
});
knoxx.backend.domain.contracts.tools.contract_list_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"contract.list","Contract List","List contract IDs by class before reading or writing. Use this to discover canonical contract identities instead of guessing paths.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["List contract IDs by class.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Call contract.list before creating or editing when you do not know the exact contract id.","Use contract_class for non-agent contracts such as roles or capabilities.","Never create data/contracts or :data/* filesystem folders as a substitute for reading canonical contracts."], null),knoxx.backend.domain.contracts.tools.contract_list_params,knoxx.backend.domain.contracts.tools.contract_list_execute], 0));
knoxx.backend.domain.contracts.tools.contract_read_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"contract.read","Contract Read","Read the exact EDN for an existing contract by class and id. Use this before patching or cloning behavior.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Read contract EDN.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Always read the target or nearest existing contract before writing a replacement.","Use the returned EDN as the source of truth; do not infer contract shape from memory.","Use contract_class for non-agent contracts such as roles or capabilities."], null),knoxx.backend.domain.contracts.tools.contract_read_params,knoxx.backend.domain.contracts.tools.contract_read_execute], 0));
knoxx.backend.domain.contracts.tools.contract_write_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"contract.write","Contract Write","Create or update a contract by writing EDN text. Validates before saving. This is your ONLY contract write tool \u2014 use contract.list/read first when possible.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Write or update a contract's EDN text.",new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use contract.write to save contract EDN.","Set contract_class correctly; defaults to agents, but roles/capabilities/actors require their own class.","The EDN identity must match the contract_id parameter.","The server validates before saving \u2014 if validation fails, fix the EDN and retry.","Before saving, call contract.validate to catch parse errors and shape warnings without side effects.","Do not invent mutable :data folders or data/contracts files. Contract :data is static config unless a real state backend says otherwise."], null),knoxx.backend.domain.contracts.tools.contract_write_params,knoxx.backend.domain.contracts.tools.contract_write_execute], 0));
knoxx.backend.domain.contracts.tools.contract_validate_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"contract.validate","Contract Validate","Parse and validate EDN contract text without saving. Use this BEFORE contract.write to catch errors and warnings early.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Validate contract EDN before saving.",new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Always validate before writing a contract.","If :ok is false, fix the errors and validate again before calling contract.write.","Treat :warnings as real drift signals; fix them unless preserving legacy behavior intentionally.","Use contract_class hint when you know the type."], null),knoxx.backend.domain.contracts.tools.contract_validate_params,knoxx.backend.domain.contracts.tools.contract_validate_execute], 0));
/**
 * Create contract tools for the contract librarian agent.
 */
knoxx.backend.domain.contracts.tools.create_contract_custom_tools = (function knoxx$backend$domain$contracts$tools$create_contract_custom_tools(var_args){
var G__27612 = arguments.length;
switch (G__27612) {
case 2:
return knoxx.backend.domain.contracts.tools.create_contract_custom_tools.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.contracts.tools.create_contract_custom_tools.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.contracts.tools.create_contract_custom_tools.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.domain.contracts.tools.create_contract_custom_tools.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.domain.contracts.tools.create_contract_custom_tools.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
var allowed_QMARK_ = (function (tool_id){
return (((auth_context == null)) || (knoxx.backend.infra.auth.authz.ctx_tool_allowed_QMARK_(auth_context,tool_id)));
});
return cljs.core.clj__GT_js(cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [((allowed_QMARK_("contract.list"))?knoxx.backend.domain.contracts.tools.contract_list_tool(runtime,config):null),((allowed_QMARK_("contract.read"))?knoxx.backend.domain.contracts.tools.contract_read_tool(runtime,config):null),((allowed_QMARK_("contract.write"))?knoxx.backend.domain.contracts.tools.contract_write_tool(runtime,config):null),((allowed_QMARK_("contract.validate"))?knoxx.backend.domain.contracts.tools.contract_validate_tool(runtime,config):null)], null))));
}));

(knoxx.backend.domain.contracts.tools.create_contract_custom_tools.cljs$lang$maxFixedArity = 3);

/**
 * Create the contract tool suite for the contract librarian agent.
 */
knoxx.backend.domain.contracts.tools.create_contract_librarian_tools = (function knoxx$backend$domain$contracts$tools$create_contract_librarian_tools(var_args){
var G__27624 = arguments.length;
switch (G__27624) {
case 2:
return knoxx.backend.domain.contracts.tools.create_contract_librarian_tools.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.contracts.tools.create_contract_librarian_tools.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.domain.contracts.tools.create_contract_librarian_tools.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.contracts.tools.create_contract_librarian_tools.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.domain.contracts.tools.create_contract_librarian_tools.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.domain.contracts.tools.create_contract_librarian_tools.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
return knoxx.backend.domain.contracts.tools.create_contract_librarian_tools.cljs$core$IFn$_invoke$arity$4(runtime,config,auth_context,null);
}));

(knoxx.backend.domain.contracts.tools.create_contract_librarian_tools.cljs$core$IFn$_invoke$arity$4 = (function (runtime,config,auth_context,allowed_tool_ids){
var contract_tools = knoxx.backend.domain.contracts.tools.create_contract_custom_tools.cljs$core$IFn$_invoke$arity$3(runtime,config,auth_context);
return knoxx.backend.domain.tools.filter_custom_tools_by_allow_set(knoxx.backend.domain.tools.sanitize_custom_tools(contract_tools),allowed_tool_ids);
}));

(knoxx.backend.domain.contracts.tools.create_contract_librarian_tools.cljs$lang$maxFixedArity = 4);


//# sourceMappingURL=knoxx.backend.domain.contracts.tools.js.map
