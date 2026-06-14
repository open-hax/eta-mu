import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./shadow.esm.esm_import$$open_hax$eta_mu_cli.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_path.js";
import "./knoxx.backend.extern.promise.js";
import "./knoxx.backend.shape.agent.js";
goog.provide('knoxx.backend.extern.eta_mu');
knoxx.backend.extern.eta_mu.settings_manager_class = (function knoxx$backend$extern$eta_mu$settings_manager_class(){
return (shadow.esm.esm_import$$open_hax$eta_mu_cli["SettingsManager"]);
});
knoxx.backend.extern.eta_mu.auth_storage_class = (function knoxx$backend$extern$eta_mu$auth_storage_class(){
return (shadow.esm.esm_import$$open_hax$eta_mu_cli["AuthStorage"]);
});
knoxx.backend.extern.eta_mu.model_registry_class = (function knoxx$backend$extern$eta_mu$model_registry_class(){
return (shadow.esm.esm_import$$open_hax$eta_mu_cli["ModelRegistry"]);
});
knoxx.backend.extern.eta_mu.resource_loader_class = (function knoxx$backend$extern$eta_mu$resource_loader_class(){
return (shadow.esm.esm_import$$open_hax$eta_mu_cli["DefaultResourceLoader"]);
});
knoxx.backend.extern.eta_mu.session_manager_class = (function knoxx$backend$extern$eta_mu$session_manager_class(){
return (shadow.esm.esm_import$$open_hax$eta_mu_cli["SessionManager"]);
});
knoxx.backend.extern.eta_mu.create_agent_session_fn = (function knoxx$backend$extern$eta_mu$create_agent_session_fn(){
return (shadow.esm.esm_import$$open_hax$eta_mu_cli["createAgentSession"]);
});
knoxx.backend.extern.eta_mu.model_registry = (function knoxx$backend$extern$eta_mu$model_registry(){
return (shadow.esm.esm_import$$open_hax$eta_mu_cli["modelRegistry"]);
});
knoxx.backend.extern.eta_mu.auth_storage = (function knoxx$backend$extern$eta_mu$auth_storage(){
return (shadow.esm.esm_import$$open_hax$eta_mu_cli["authStorage"]);
});
knoxx.backend.extern.eta_mu.loader = (function knoxx$backend$extern$eta_mu$loader(){
return (shadow.esm.esm_import$$open_hax$eta_mu_cli["loader"]);
});
knoxx.backend.extern.eta_mu.settings_manager = (function knoxx$backend$extern$eta_mu$settings_manager(){
return (shadow.esm.esm_import$$open_hax$eta_mu_cli["settingsManager"]);
});
knoxx.backend.extern.eta_mu.runtime_dir = (function knoxx$backend$extern$eta_mu$runtime_dir(){
return (shadow.esm.esm_import$$open_hax$eta_mu_cli["runtimeDir"]);
});
knoxx.backend.extern.eta_mu.js_array_seq = (function knoxx$backend$extern$eta_mu$js_array_seq(value){
if(cljs.core.truth_(cljs.core.array_QMARK_(value))){
return cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(value);
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
knoxx.backend.extern.eta_mu.write_file_BANG_ = (function knoxx$backend$extern$eta_mu$write_file_BANG_(path,text){
return shadow.esm.esm_import$node_fs$promises.writeFile((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)),"utf8");
});
knoxx.backend.extern.eta_mu.mkdirp_BANG_ = (function knoxx$backend$extern$eta_mu$mkdirp_BANG_(path){
return shadow.esm.esm_import$node_fs$promises.mkdir((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)),({"recursive": true}));
});
knoxx.backend.extern.eta_mu.path_join = (function knoxx$backend$extern$eta_mu$path_join(var_args){
var args__5903__auto__ = [];
var len__5897__auto___26393 = arguments.length;
var i__5898__auto___26395 = (0);
while(true){
if((i__5898__auto___26395 < len__5897__auto___26393)){
args__5903__auto__.push((arguments[i__5898__auto___26395]));

var G__26396 = (i__5898__auto___26395 + (1));
i__5898__auto___26395 = G__26396;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return knoxx.backend.extern.eta_mu.path_join.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(knoxx.backend.extern.eta_mu.path_join.cljs$core$IFn$_invoke$arity$variadic = (function (parts){
return shadow.esm.esm_import$node_path.join.apply(shadow.esm.esm_import$node_path,cljs.core.clj__GT_js(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__25801_SHARP_){
if(cljs.core.truth_(p1__25801_SHARP_)){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(p1__25801_SHARP_));
} else {
return null;
}
}),parts)));
}));

(knoxx.backend.extern.eta_mu.path_join.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(knoxx.backend.extern.eta_mu.path_join.cljs$lang$applyTo = (function (seq25803){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq25803));
}));

knoxx.backend.extern.eta_mu.provider_token = (function knoxx$backend$extern$eta_mu$provider_token(env_var){
var temp__5825__auto__ = (function (){var G__25835 = env_var;
var G__25835__$1 = (((G__25835 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25835)));
var G__25835__$2 = (((G__25835__$1 == null))?null:clojure.string.trim(G__25835__$1));
if((G__25835__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__25835__$2);
}
})();
if(cljs.core.truth_(temp__5825__auto__)){
var env_var__$1 = temp__5825__auto__;
var token = (process.env[env_var__$1]);
if(((typeof token === 'string') && ((!(clojure.string.blank_QMARK_(token)))))){
return token;
} else {
return null;
}
} else {
return null;
}
});
/**
 * Initialise eta-mu runtime and persist models.json.
 * Accepts CLJS config/model maps; returns a CLJS map containing opaque SDK
 * objects under :auth-storage, :model-registry, :settings-manager, :loader,
 * and :runtime-dir.
 */
knoxx.backend.extern.eta_mu.setup_runtime_BANG_ = (async function knoxx$backend$extern$eta_mu$setup_runtime_BANG_(config,model_config,compaction_settings){
var runtime_dir_value = new cljs.core.Keyword(null,"agent-dir","agent-dir",-1644183343).cljs$core$IFn$_invoke$arity$1(config);
var models_file = knoxx.backend.extern.eta_mu.path_join.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([runtime_dir_value,"models.json"], 0));
var auth_file = knoxx.backend.extern.eta_mu.path_join.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([runtime_dir_value,"auth.json"], 0));
var SettingsManager = knoxx.backend.extern.eta_mu.settings_manager_class();
var AuthStorage = knoxx.backend.extern.eta_mu.auth_storage_class();
var ModelRegistry = knoxx.backend.extern.eta_mu.model_registry_class();
var ResourceLoader = knoxx.backend.extern.eta_mu.resource_loader_class();
var settings_manager = SettingsManager.inMemory(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"compaction","compaction",468381181),compaction_settings,new cljs.core.Keyword(null,"retry","retry",-614012896),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"enabled","enabled",1195909756),true,new cljs.core.Keyword(null,"maxRetries","maxRetries",1482254096),(1)], null)], null)));
(await knoxx.backend.extern.eta_mu.mkdirp_BANG_(runtime_dir_value));

(await knoxx.backend.extern.eta_mu.write_file_BANG_(models_file,JSON.stringify(cljs.core.clj__GT_js(model_config),null,(2))));

var auth_storage = AuthStorage.create(auth_file);
if(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"proxx-auth-token","proxx-auth-token",-621179676).cljs$core$IFn$_invoke$arity$1(config))){
} else {
auth_storage.setRuntimeApiKey("proxx",new cljs.core.Keyword(null,"proxx-auth-token","proxx-auth-token",-621179676).cljs$core$IFn$_invoke$arity$1(config));
}

var seq__25873_26402 = cljs.core.seq((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"provider-auth-tokens","provider-auth-tokens",1365293080).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()));
var chunk__25874_26403 = null;
var count__25875_26404 = (0);
var i__25876_26405 = (0);
while(true){
if((i__25876_26405 < count__25875_26404)){
var vec__26002_26407 = chunk__25874_26403.cljs$core$IIndexed$_nth$arity$2(null,i__25876_26405);
var provider_id_26408 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26002_26407,(0),null);
var env_var_26409 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26002_26407,(1),null);
var temp__5825__auto___26411 = knoxx.backend.extern.eta_mu.provider_token(env_var_26409);
if(cljs.core.truth_(temp__5825__auto___26411)){
var token_26413 = temp__5825__auto___26411;
var temp__5825__auto___26414__$1 = (await (async function (){var G__26019 = provider_id_26408;
var G__26019__$1 = (((G__26019 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26019)));
var G__26019__$2 = (((G__26019__$1 == null))?null:clojure.string.trim(G__26019__$1));
if((G__26019__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26019__$2);
}
})());
if(cljs.core.truth_(temp__5825__auto___26414__$1)){
var provider_id_26415__$1 = temp__5825__auto___26414__$1;
auth_storage.setRuntimeApiKey(provider_id_26415__$1,token_26413);
} else {
}
} else {
}


var G__26416 = seq__25873_26402;
var G__26417 = chunk__25874_26403;
var G__26418 = count__25875_26404;
var G__26419 = (i__25876_26405 + (1));
seq__25873_26402 = G__26416;
chunk__25874_26403 = G__26417;
count__25875_26404 = G__26418;
i__25876_26405 = G__26419;
continue;
} else {
var temp__5825__auto___26420 = cljs.core.seq(seq__25873_26402);
if(temp__5825__auto___26420){
var seq__25873_26422__$1 = temp__5825__auto___26420;
if(cljs.core.chunked_seq_QMARK_(seq__25873_26422__$1)){
var c__5694__auto___26423 = cljs.core.chunk_first(seq__25873_26422__$1);
var G__26424 = cljs.core.chunk_rest(seq__25873_26422__$1);
var G__26425 = c__5694__auto___26423;
var G__26426 = cljs.core.count(c__5694__auto___26423);
var G__26427 = (0);
seq__25873_26402 = G__26424;
chunk__25874_26403 = G__26425;
count__25875_26404 = G__26426;
i__25876_26405 = G__26427;
continue;
} else {
var vec__26045_26428 = cljs.core.first(seq__25873_26422__$1);
var provider_id_26429 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26045_26428,(0),null);
var env_var_26430 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26045_26428,(1),null);
var temp__5825__auto___26431__$1 = knoxx.backend.extern.eta_mu.provider_token(env_var_26430);
if(cljs.core.truth_(temp__5825__auto___26431__$1)){
var token_26432 = temp__5825__auto___26431__$1;
var temp__5825__auto___26433__$2 = (await (async function (){var G__26058 = provider_id_26429;
var G__26058__$1 = (((G__26058 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26058)));
var G__26058__$2 = (((G__26058__$1 == null))?null:clojure.string.trim(G__26058__$1));
if((G__26058__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26058__$2);
}
})());
if(cljs.core.truth_(temp__5825__auto___26433__$2)){
var provider_id_26435__$1 = temp__5825__auto___26433__$2;
auth_storage.setRuntimeApiKey(provider_id_26435__$1,token_26432);
} else {
}
} else {
}


var G__26436 = cljs.core.next(seq__25873_26422__$1);
var G__26437 = null;
var G__26438 = (0);
var G__26439 = (0);
seq__25873_26402 = G__26436;
chunk__25874_26403 = G__26437;
count__25875_26404 = G__26438;
i__25876_26405 = G__26439;
continue;
}
} else {
}
}
break;
}

var model_registry = (new ModelRegistry(auth_storage,models_file));
var resource_loader = (new ResourceLoader(({"cwd": new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config), "agentDir": runtime_dir_value, "settingsManager": settings_manager})));
(await resource_loader.reload());

return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"auth-storage","auth-storage",-2076734340),auth_storage,new cljs.core.Keyword(null,"model-registry","model-registry",483426168),model_registry,new cljs.core.Keyword(null,"settings-manager","settings-manager",-963975515),settings_manager,new cljs.core.Keyword(null,"loader","loader",-462395423),resource_loader,new cljs.core.Keyword(null,"runtime-dir","runtime-dir",-1164830301),runtime_dir_value], null);
});
/**
 * Create an eta-mu SessionManager and optionally seed a specific session id.
 */
knoxx.backend.extern.eta_mu.make_session_manager_BANG_ = (function knoxx$backend$extern$eta_mu$make_session_manager_BANG_(workspace_root,session_id){
var manager = knoxx.backend.extern.eta_mu.session_manager_class().inMemory(workspace_root);
var session_id__$1 = (function (){var G__26076 = session_id;
var G__26076__$1 = (((G__26076 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26076)));
var G__26076__$2 = (((G__26076__$1 == null))?null:clojure.string.trim(G__26076__$1));
if((G__26076__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26076__$2);
}
})();
if(cljs.core.truth_(session_id__$1)){
manager.newSession(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),session_id__$1], null)));
} else {
}

return manager;
});
knoxx.backend.extern.eta_mu.append_message_BANG_ = (function knoxx$backend$extern$eta_mu$append_message_BANG_(session_manager,agent_message){
return session_manager.appendMessage(agent_message);
});
knoxx.backend.extern.eta_mu.append_model_change_BANG_ = (function knoxx$backend$extern$eta_mu$append_model_change_BANG_(session_manager,provider_id,model_id){
return session_manager.appendModelChange((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider_id)),model_id);
});
knoxx.backend.extern.eta_mu.append_thinking_level_change_BANG_ = (function knoxx$backend$extern$eta_mu$append_thinking_level_change_BANG_(session_manager,thinking_level){
return session_manager.appendThinkingLevelChange(thinking_level);
});
knoxx.backend.extern.eta_mu.find_model = (function knoxx$backend$extern$eta_mu$find_model(model_registry,provider_id,model_id,fallback_model_id){
var or__5162__auto__ = model_registry.find((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider_id)),model_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = model_registry.find("proxx",model_id);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return model_registry.find("proxx",fallback_model_id);
}
}
});
/**
 * Return a CLJS seq for an eta-mu JS tool array or [].
 */
knoxx.backend.extern.eta_mu.tool_seq = (function knoxx$backend$extern$eta_mu$tool_seq(tools){
return knoxx.backend.extern.eta_mu.js_array_seq(tools);
});
knoxx.backend.extern.eta_mu.tool_runtime_name = (function knoxx$backend$extern$eta_mu$tool_runtime_name(tool){
if(typeof tool === 'string'){
var G__26107 = tool;
var G__26107__$1 = (((G__26107 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26107)));
var G__26107__$2 = (((G__26107__$1 == null))?null:clojure.string.trim(G__26107__$1));
if((G__26107__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26107__$2);
}
} else {
var or__5162__auto__ = (function (){var G__26112 = tool;
var G__26112__$1 = (((G__26112 == null))?null:(G__26112["name"]));
var G__26112__$2 = (((G__26112__$1 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26112__$1)));
var G__26112__$3 = (((G__26112__$2 == null))?null:clojure.string.trim(G__26112__$2));
if((G__26112__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__26112__$3);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__26122 = tool;
var G__26122__$1 = (((G__26122 == null))?null:(G__26122["id"]));
var G__26122__$2 = (((G__26122__$1 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26122__$1)));
var G__26122__$3 = (((G__26122__$2 == null))?null:clojure.string.trim(G__26122__$2));
if((G__26122__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__26122__$3);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var G__26129 = tool;
var G__26129__$1 = (((G__26129 == null))?null:(G__26129["label"]));
var G__26129__$2 = (((G__26129__$1 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26129__$1)));
var G__26129__$3 = (((G__26129__$2 == null))?null:clojure.string.trim(G__26129__$2));
if((G__26129__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__26129__$3);
}
}
}

}
});
knoxx.backend.extern.eta_mu.tool_execute = (function knoxx$backend$extern$eta_mu$tool_execute(tool){
var execute = (function (){var and__5160__auto__ = tool;
if(cljs.core.truth_(and__5160__auto__)){
return (tool["execute"]);
} else {
return and__5160__auto__;
}
})();
if(cljs.core.fn_QMARK_(execute)){
return execute;
} else {
return null;
}
});
knoxx.backend.extern.eta_mu.set_tool_execute_BANG_ = (function knoxx$backend$extern$eta_mu$set_tool_execute_BANG_(tool,execute){
(tool["execute"] = execute);

return tool;
});
knoxx.backend.extern.eta_mu.with_promise_finally = (function knoxx$backend$extern$eta_mu$with_promise_finally(result,finalizer){
if(cljs.core.truth_((function (){var and__5160__auto__ = result;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.fn_QMARK_((result["finally"]));
} else {
return and__5160__auto__;
}
})())){
return result.finally(finalizer);
} else {
(finalizer.cljs$core$IFn$_invoke$arity$0 ? finalizer.cljs$core$IFn$_invoke$arity$0() : finalizer.call(null));

return result;
}
});
knoxx.backend.extern.eta_mu.raw_media_part__GT_map = (function knoxx$backend$extern$eta_mu$raw_media_part__GT_map(part){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),(function (){var G__26183 = (part["type"]);
if((G__26183 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26183));
}
})(),new cljs.core.Keyword(null,"url","url",276297046),(function (){var G__26184 = (part["url"]);
var G__26184__$1 = (((G__26184 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26184)));
if((G__26184__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__26184__$1);
}
})(),new cljs.core.Keyword(null,"data","data",-232669377),(function (){var G__26192 = (part["data"]);
var G__26192__$1 = (((G__26192 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26192)));
if((G__26192__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__26192__$1);
}
})(),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),(function (){var G__26195 = (part["mimeType"]);
var G__26195__$1 = (((G__26195 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26195)));
if((G__26195__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__26195__$1);
}
})()], null);
});
knoxx.backend.extern.eta_mu.media_part_QMARK_ = (function knoxx$backend$extern$eta_mu$media_part_QMARK_(part){
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["image",null,"audio",null], null), null),(function (){var G__26207 = new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part);
var G__26207__$1 = (((G__26207 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26207)));
if((G__26207__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__26207__$1);
}
})());
});
knoxx.backend.extern.eta_mu.result_media_parts = (function knoxx$backend$extern$eta_mu$result_media_parts(ctx){
var result = (ctx["result"]);
var details = (cljs.core.truth_(result)?(result["details"]):null);
var raw_parts = (function (){var or__5162__auto__ = (cljs.core.truth_(details)?(details["content_parts"]):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (cljs.core.truth_(details)?(details["contentParts"]):null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return [];
}
}
})();
return cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.extern.eta_mu.media_part_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.extern.eta_mu.raw_media_part__GT_map,knoxx.backend.extern.eta_mu.js_array_seq(raw_parts))));
});
/**
 * Build an eta-mu after-tool-call hook from a CLJS materialize fn.
 * materialize! receives a CLJS media part map and resolves to a CLJS media map.
 */
knoxx.backend.extern.eta_mu.media_materialize_hook = (function knoxx$backend$extern$eta_mu$media_materialize_hook(materialize_BANG_){
return (async function (ctx,_signal){
var result = (ctx["result"]);
var media_parts = knoxx.backend.extern.eta_mu.result_media_parts(ctx);
if(cljs.core.seq(media_parts)){
try{var materialized = (await knoxx.backend.extern.promise.all(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(materialize_BANG_,media_parts)));
var good = cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,knoxx.backend.extern.eta_mu.js_array_seq(materialized)));
if(cljs.core.seq(good)){
var existing = (await (async function (){var or__5162__auto__ = (await (async function (){var G__26239 = result;
if((G__26239 == null)){
return null;
} else {
return (G__26239["content"]);
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return [];
}
})());
var merged = cljs.core.clj__GT_js(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.vec(knoxx.backend.extern.eta_mu.js_array_seq(existing)),good));
return ({"content": merged});
} else {
return null;
}
}catch (e26233){var _ = e26233;
return null;
}} else {
return null;
}
});
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {knoxx.backend.shape.agent.IAgentSession}
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
knoxx.backend.extern.eta_mu.EtaMuSession = (function (raw,__meta,__extmap,__hash){
this.raw = raw;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k26249,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__26279 = k26249;
var G__26279__$1 = (((G__26279 instanceof cljs.core.Keyword))?G__26279.fqn:null);
switch (G__26279__$1) {
case "raw":
return self__.raw;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k26249,else__5472__auto__);

}
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__26299){
var vec__26300 = p__26299;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26300,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26300,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.extern.eta-mu.EtaMuSession{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"raw","raw",1604651272),self__.raw],null))], null),self__.__extmap));
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__26248){
var self__ = this;
var G__26248__$1 = this;
return (new cljs.core.RecordIter((0),G__26248__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.extern.eta_mu.EtaMuSession(self__.raw,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (1621456061 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this26250,other26251){
var self__ = this;
var this26250__$1 = this;
return (((!((other26251 == null)))) && ((((this26250__$1.constructor === other26251.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26250__$1.raw,other26251.raw)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26250__$1.__extmap,other26251.__extmap)))))));
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.knoxx$backend$shape$agent$IAgentSession$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.knoxx$backend$shape$agent$IAgentSession$set_thinking_level_BANG_$arity$2 = (function (_,l){
var self__ = this;
var ___$1 = this;
return self__.raw.setThinkingLevel(l);
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.knoxx$backend$shape$agent$IAgentSession$subscribe_BANG_$arity$2 = (function (_,h){
var self__ = this;
var ___$1 = this;
return self__.raw.subscribe(h);
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.knoxx$backend$shape$agent$IAgentSession$send_user_message_BANG_$arity$2 = (function (_,c){
var self__ = this;
var ___$1 = this;
return self__.raw.sendUserMessage(c);
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.knoxx$backend$shape$agent$IAgentSession$streaming_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return (self__.raw["isStreaming"]) === true;
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.knoxx$backend$shape$agent$IAgentSession$abort_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.raw.abort();
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.knoxx$backend$shape$agent$IAgentSession$follow_up_BANG_$arity$2 = (function (_,m){
var self__ = this;
var ___$1 = this;
return self__.raw.followUp(m);
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.knoxx$backend$shape$agent$IAgentSession$steer_BANG_$arity$2 = (function (_,m){
var self__ = this;
var ___$1 = this;
return self__.raw.steer(m);
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.knoxx$backend$shape$agent$IAgentSession$messages$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
var msgs = (self__.raw["messages"]);
if(cljs.core.truth_(cljs.core.array_QMARK_(msgs))){
return cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(msgs);
} else {
return null;
}
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.knoxx$backend$shape$agent$IAgentSession$current_turn$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return (self__.raw["currentTurn"]);
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"raw","raw",1604651272),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.extern.eta_mu.EtaMuSession(self__.raw,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k26249){
var self__ = this;
var this__5476__auto____$1 = this;
var G__26330 = k26249;
var G__26330__$1 = (((G__26330 instanceof cljs.core.Keyword))?G__26330.fqn:null);
switch (G__26330__$1) {
case "raw":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k26249);

}
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__26248){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__26333 = cljs.core.keyword_identical_QMARK_;
var expr__26334 = k__5478__auto__;
if(cljs.core.truth_((pred__26333.cljs$core$IFn$_invoke$arity$2 ? pred__26333.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"raw","raw",1604651272),expr__26334) : pred__26333.call(null,new cljs.core.Keyword(null,"raw","raw",1604651272),expr__26334)))){
return (new knoxx.backend.extern.eta_mu.EtaMuSession(G__26248,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.extern.eta_mu.EtaMuSession(self__.raw,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__26248),null));
}
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"raw","raw",1604651272),self__.raw,null))], null),self__.__extmap));
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__26248){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.extern.eta_mu.EtaMuSession(self__.raw,G__26248,self__.__extmap,self__.__hash));
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.with_meta(new cljs.core.Symbol(null,"raw","raw",-1049784497,null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tag","tag",-1290361223),new cljs.core.Symbol(null,"js","js",-886355190,null)], null))], null);
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.cljs$lang$type = true);

(knoxx.backend.extern.eta_mu.EtaMuSession.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.extern.eta-mu/EtaMuSession",null,(1),null));
}));

(knoxx.backend.extern.eta_mu.EtaMuSession.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.extern.eta-mu/EtaMuSession");
}));

/**
 * Positional factory function for knoxx.backend.extern.eta-mu/EtaMuSession.
 */
knoxx.backend.extern.eta_mu.__GT_EtaMuSession = (function knoxx$backend$extern$eta_mu$__GT_EtaMuSession(raw){
return (new knoxx.backend.extern.eta_mu.EtaMuSession(raw,null,null,null));
});

/**
 * Factory function for knoxx.backend.extern.eta-mu/EtaMuSession, taking a map of keywords to field values.
 */
knoxx.backend.extern.eta_mu.map__GT_EtaMuSession = (function knoxx$backend$extern$eta_mu$map__GT_EtaMuSession(G__26256){
var extmap__5511__auto__ = (function (){var G__26356 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__26256,new cljs.core.Keyword(null,"raw","raw",1604651272));
if(cljs.core.record_QMARK_(G__26256)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__26356);
} else {
return G__26356;
}
})();
return (new knoxx.backend.extern.eta_mu.EtaMuSession(new cljs.core.Keyword(null,"raw","raw",1604651272).cljs$core$IFn$_invoke$arity$1(G__26256),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

/**
 * Wrap a raw eta-mu JS session object, optionally registering an after-tool-call
 * hook. Returns an EtaMuSession that implements IAgentSession.
 */
knoxx.backend.extern.eta_mu.wrap_eta_mu_session = (function knoxx$backend$extern$eta_mu$wrap_eta_mu_session(var_args){
var G__26365 = arguments.length;
switch (G__26365) {
case 1:
return knoxx.backend.extern.eta_mu.wrap_eta_mu_session.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.extern.eta_mu.wrap_eta_mu_session.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.extern.eta_mu.wrap_eta_mu_session.cljs$core$IFn$_invoke$arity$1 = (function (raw_session){
return knoxx.backend.extern.eta_mu.__GT_EtaMuSession(raw_session);
}));

(knoxx.backend.extern.eta_mu.wrap_eta_mu_session.cljs$core$IFn$_invoke$arity$2 = (function (raw_session,on_tool_call){
if(((cljs.core.fn_QMARK_(on_tool_call)) && (cljs.core.fn_QMARK_((function (){var G__26374 = raw_session;
var G__26374__$1 = (((G__26374 == null))?null:(G__26374["agent"]));
if((G__26374__$1 == null)){
return null;
} else {
return (G__26374__$1["setAfterToolCall"]);
}
})())))){
(raw_session["agent"]).setAfterToolCall(on_tool_call);
} else {
}

return knoxx.backend.extern.eta_mu.__GT_EtaMuSession(raw_session);
}));

(knoxx.backend.extern.eta_mu.wrap_eta_mu_session.cljs$lang$maxFixedArity = 2);

/**
 * Create and wrap an eta-mu agent session from CLJS options. Returns a Promise
 * because the eta-mu SDK creates sessions asynchronously.
 */
knoxx.backend.extern.eta_mu.create_session_BANG_ = (async function knoxx$backend$extern$eta_mu$create_session_BANG_(opts){
var create_agent_session = knoxx.backend.extern.eta_mu.create_agent_session_fn();
var runtime_dir_value = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"runtime-dir","runtime-dir",-1164830301).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.eta_mu.runtime_dir();
}
})());
var hook = (await (async function (){var temp__5825__auto__ = new cljs.core.Keyword(null,"materialize!","materialize!",946822078).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(temp__5825__auto__)){
var materialize_BANG_ = temp__5825__auto__;
return knoxx.backend.extern.eta_mu.media_materialize_hook(materialize_BANG_);
} else {
return null;
}
})());
var created = (await (await (async function (){var G__26379 = ({"resourceLoader": new cljs.core.Keyword(null,"loader","loader",-462395423).cljs$core$IFn$_invoke$arity$1(opts), "sessionManager": new cljs.core.Keyword(null,"session-manager","session-manager",-1140954467).cljs$core$IFn$_invoke$arity$1(opts), "agentDir": runtime_dir_value, "tools": cljs.core.clj__GT_js((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tool-name-allowlist","tool-name-allowlist",2001315015).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())), "authStorage": new cljs.core.Keyword(null,"auth-storage","auth-storage",-2076734340).cljs$core$IFn$_invoke$arity$1(opts), "cwd": new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(opts), "customTools": new cljs.core.Keyword(null,"custom-tools","custom-tools",-1003562280).cljs$core$IFn$_invoke$arity$1(opts), "settingsManager": new cljs.core.Keyword(null,"settings-manager","settings-manager",-963975515).cljs$core$IFn$_invoke$arity$1(opts), "modelRegistry": new cljs.core.Keyword(null,"model-registry","model-registry",483426168).cljs$core$IFn$_invoke$arity$1(opts), "thinkingLevel": new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953).cljs$core$IFn$_invoke$arity$1(opts), "model": new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(opts)});
return (create_agent_session.cljs$core$IFn$_invoke$arity$1 ? create_agent_session.cljs$core$IFn$_invoke$arity$1(G__26379) : create_agent_session.call(null,G__26379));
})()));
return knoxx.backend.extern.eta_mu.wrap_eta_mu_session.cljs$core$IFn$_invoke$arity$2((created["session"]),hook);
});

//# sourceMappingURL=knoxx.backend.extern.eta_mu.js.map
