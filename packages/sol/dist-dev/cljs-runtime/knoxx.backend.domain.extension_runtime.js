import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.domain.extension_runtime');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.extension_runtime !== 'undefined') && (typeof knoxx.backend.domain.extension_runtime.extensions_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.extension_runtime.extensions_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.EMPTY);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.extension_runtime !== 'undefined') && (typeof knoxx.backend.domain.extension_runtime.command_handlers_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.extension_runtime.command_handlers_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
/**
 * Return a vector of built-in extension maps.
 * Each map has :name, :events, :commands, :tools keys.
 */
knoxx.backend.domain.extension_runtime.load_built_in_extensions = (function knoxx$backend$domain$extension_runtime$load_built_in_extensions(){
return cljs.core.PersistentVector.EMPTY;
});
/**
 * Initialise the extension runtime.  Idempotent.
 */
knoxx.backend.domain.extension_runtime.init_BANG_ = (function knoxx$backend$domain$extension_runtime$init_BANG_(){
if(cljs.core.empty_QMARK_(cljs.core.deref(knoxx.backend.domain.extension_runtime.extensions_STAR_))){
cljs.core.reset_BANG_(knoxx.backend.domain.extension_runtime.extensions_STAR_,knoxx.backend.domain.extension_runtime.load_built_in_extensions());

return console.log("[extension-runtime] initialised with",cljs.core.count(cljs.core.deref(knoxx.backend.domain.extension_runtime.extensions_STAR_)),"built-in extension(s)");
} else {
return null;
}
});
knoxx.backend.domain.extension_runtime.event_handlers = (function knoxx$backend$domain$extension_runtime$event_handlers(event_name){
return cljs.core.keep.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"handler","handler",-195596612),cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (ext){
return cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__14188_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_name,new cljs.core.Keyword(null,"event","event",301435442).cljs$core$IFn$_invoke$arity$1(p1__14188_SHARP_));
}),new cljs.core.Keyword(null,"events","events",1792552201).cljs$core$IFn$_invoke$arity$1(ext));
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.deref(knoxx.backend.domain.extension_runtime.extensions_STAR_)], 0)));
});
/**
 * Dispatch an event to all registered handlers.
 * 
 * event-name – keyword or string
 * event      – map/JS object passed to handlers
 * ctx        – extension context map
 * 
 * Returns a Promise that resolves to a merged result map.
 * Handlers may return promises; results are deep-merged left-to-right.
 * 
 * Keys that extensions commonly produce:
 *   :systemPrompt  – string to inject into the system prompt
 *   :message       – map with :customType, :content, :display to inject
 *   :messages      – vector of messages to replace the outgoing context
 */
knoxx.backend.domain.extension_runtime.dispatch_event = (async function knoxx$backend$domain$extension_runtime$dispatch_event(event_name,event,ctx){
var handlers = knoxx.backend.domain.extension_runtime.event_handlers(event_name);
if(cljs.core.empty_QMARK_(handlers)){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
try{var acc = cljs.core.PersistentArrayMap.EMPTY;
var remaining = cljs.core.seq(handlers);
while(true){
if(cljs.core.not(remaining)){
return acc;
} else {
var handler = cljs.core.first(remaining);
var result = (handler.cljs$core$IFn$_invoke$arity$2 ? handler.cljs$core$IFn$_invoke$arity$2(event,ctx) : handler.call(null,event,ctx));
var acc_SINGLEQUOTE_ = (((result instanceof Promise))?cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([acc,(await (async function (){var or__5162__auto__ = (await result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})())], 0)):cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([acc,(await (async function (){var or__5162__auto__ = result;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})())], 0)));
var G__14238 = acc_SINGLEQUOTE_;
var G__14239 = cljs.core.next(remaining);
acc = G__14238;
remaining = G__14239;
continue;
}
break;
}
}catch (e14191){var err = e14191;
console.warn("[extension-runtime] event",event_name,"handler failed:",err);

return cljs.core.PersistentArrayMap.EMPTY;
}}
});
/**
 * Register a slash-command handler.
 * 
 * cmd-name   – string without leading slash, e.g. 'mycology'
 * handler    – fn [args ctx] -> {:ok true :reply ...} or nil
 */
knoxx.backend.domain.extension_runtime.register_command_BANG_ = (function knoxx$backend$domain$extension_runtime$register_command_BANG_(cmd_name,handler){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.extension_runtime.command_handlers_STAR_,cljs.core.assoc,clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cmd_name))),handler);

return console.log("[extension-runtime] registered command /",cmd_name);
});
knoxx.backend.domain.extension_runtime.unregister_command_BANG_ = (function knoxx$backend$domain$extension_runtime$unregister_command_BANG_(cmd_name){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.extension_runtime.command_handlers_STAR_,cljs.core.dissoc,clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cmd_name))));
});
knoxx.backend.domain.extension_runtime.command_names = (function knoxx$backend$domain$extension_runtime$command_names(){
return cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.keys(cljs.core.deref(knoxx.backend.domain.extension_runtime.command_handlers_STAR_)));
});
/**
 * Try to handle a slash command.  Returns a Promise of
 * {:handled true :result ...} or {:handled false}.
 * 
 * text – full user text, e.g. '/mycology on'
 * ctx  – extension context map
 */
knoxx.backend.domain.extension_runtime.handle_command = (async function knoxx$backend$domain$extension_runtime$handle_command(text,ctx){
var trimmed = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)));
if((!(clojure.string.starts_with_QMARK_(trimmed,"/")))){
return ({"handled": false});
} else {
var without_slash = cljs.core.subs.cljs$core$IFn$_invoke$arity$2(trimmed,(1));
var tokens = clojure.string.split.cljs$core$IFn$_invoke$arity$2(without_slash,/\s+/);
var cmd = clojure.string.lower_case(cljs.core.first(tokens));
var args = clojure.string.join.cljs$core$IFn$_invoke$arity$2(" ",cljs.core.rest(tokens));
var handler = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.extension_runtime.command_handlers_STAR_),cmd);
if(cljs.core.truth_(handler)){
var result = (handler.cljs$core$IFn$_invoke$arity$2 ? handler.cljs$core$IFn$_invoke$arity$2(args,ctx) : handler.call(null,args,ctx));
if((result instanceof Promise)){
return ({"handled": true, "result": (await result)});
} else {
return ({"handled": true, "result": result});
}
} else {
return ({"handled": false});
}
}
});
/**
 * Build the standard extension context map from Knoxx runtime data.
 * 
 * Keys mirror eta-mu ctx where possible:
 *   :cwd            – workspace root
 *   :model          – {:provider ... :id ...}
 *   :sessionManager – SDK session manager (optional)
 *   :hasUI          – false in backend-only mode
 *   :ui             – nil
 *   :conversationId – Knoxx conversation id
 *   :sessionId      – Knoxx session id
 *   :runId          – current run id
 *   :authContext    – authz context
 *   :config         – Knoxx config map
 */
knoxx.backend.domain.extension_runtime.build_extension_ctx = (function knoxx$backend$domain$extension_runtime$build_extension_ctx(var_args){
var args__5903__auto__ = [];
var len__5897__auto___14242 = arguments.length;
var i__5898__auto___14244 = (0);
while(true){
if((i__5898__auto___14244 < len__5897__auto___14242)){
args__5903__auto__.push((arguments[i__5898__auto___14244]));

var G__14245 = (i__5898__auto___14244 + (1));
i__5898__auto___14244 = G__14245;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((2) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((2)),(0),null)):null);
return knoxx.backend.domain.extension_runtime.build_extension_ctx.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5904__auto__);
});

(knoxx.backend.domain.extension_runtime.build_extension_ctx.cljs$core$IFn$_invoke$arity$variadic = (function (_runtime,config,p__14219){
var map__14220 = p__14219;
var map__14220__$1 = cljs.core.__destructure_map(map__14220);
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14220__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14220__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14220__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var model_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14220__$1,new cljs.core.Keyword(null,"model-id","model-id",-467101728));
var auth_context = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__14220__$1,new cljs.core.Keyword(null,"auth-context","auth-context",320032325));
return ({"sessionManager": null, "sessionId": session_id, "config": config, "authContext": auth_context, "cwd": (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return process.cwd();
}
})(), "runId": run_id, "ui": null, "conversationId": conversation_id, "hasUI": false, "model": (cljs.core.truth_(model_id)?({"provider": "proxx", "id": model_id}):null)});
}));

(knoxx.backend.domain.extension_runtime.build_extension_ctx.cljs$lang$maxFixedArity = (2));

/** @this {Function} */
(knoxx.backend.domain.extension_runtime.build_extension_ctx.cljs$lang$applyTo = (function (seq14215){
var G__14216 = cljs.core.first(seq14215);
var seq14215__$1 = cljs.core.next(seq14215);
var G__14217 = cljs.core.first(seq14215__$1);
var seq14215__$2 = cljs.core.next(seq14215__$1);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__14216,G__14217,seq14215__$2);
}));

/**
 * Apply the merged result of before_agent_start events.
 * 
 * session-manager – pi SDK SessionManager instance (optional)
 * messages        – current message vector (will be modified if :message present)
 * system-prompt   – current system prompt string
 * result          – merged event result map
 * 
 * Returns [new-messages new-system-prompt].
 */
knoxx.backend.domain.extension_runtime.apply_before_agent_start_results = (function knoxx$backend$domain$extension_runtime$apply_before_agent_start_results(_session_manager,messages,system_prompt,result){
var messages_STAR_ = cljs.core.vec(messages);
var prompt_STAR_ = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"systemPrompt","systemPrompt",-590399886).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return system_prompt;
}
})();
var injected_msg = new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(result);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(cljs.core.truth_(injected_msg)?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(messages_STAR_,injected_msg):messages_STAR_),prompt_STAR_], null);
});
/**
 * Apply the merged result of context events.
 * 
 * messages – current message vector
 * result   – merged event result map
 * 
 * Returns new message vector.
 */
knoxx.backend.domain.extension_runtime.apply_context_results = (function knoxx$backend$domain$extension_runtime$apply_context_results(messages,result){
var temp__5823__auto__ = new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(temp__5823__auto__)){
var new_messages = temp__5823__auto__;
return cljs.core.vec(new_messages);
} else {
return cljs.core.vec(messages);
}
});

//# sourceMappingURL=knoxx.backend.domain.extension_runtime.js.map
