import "./cljs_env.js";
import "./cljs.core.js";
import "./promesa.protocols.js";
import "./promesa.util.js";
import "./goog.object.object.js";
import "./promesa.impl.promise.js";
goog.provide('promesa.exec');
goog.scope(function(){
  promesa.exec.goog$module$goog$object = goog.module.get('goog.object');
});
promesa.exec._STAR_default_scheduler_STAR_ = null;
promesa.exec._STAR_default_executor_STAR_ = null;
/**
 * Var that indicates the availability of virtual threads.
 */
promesa.exec.virtual_threads_available_QMARK_ = false;
/**
 * backward compatibility alias for `virtual-threads-available?`
 */
promesa.exec.vthread_supported_QMARK_ = promesa.exec.virtual_threads_available_QMARK_;
promesa.exec.noop = cljs.core.constantly(null);
if((typeof promesa !== 'undefined') && (typeof promesa.exec !== 'undefined') && (typeof promesa.exec.default_scheduler !== 'undefined')){
} else {
/**
 * Default scheduled executor instance.
 */
promesa.exec.default_scheduler = (new cljs.core.Delay((function (){
return (promesa.exec.scheduled_executor.cljs$core$IFn$_invoke$arity$0 ? promesa.exec.scheduled_executor.cljs$core$IFn$_invoke$arity$0() : promesa.exec.scheduled_executor.call(null));
}),null));
}
if((typeof promesa !== 'undefined') && (typeof promesa.exec !== 'undefined') && (typeof promesa.exec.default_executor !== 'undefined')){
} else {
/**
 * Default executor instance, ForkJoinPool/commonPool in JVM, MicrotaskExecutor on JS.
 */
promesa.exec.default_executor = (new cljs.core.Delay((function (){
return (promesa.exec.microtask_executor.cljs$core$IFn$_invoke$arity$0 ? promesa.exec.microtask_executor.cljs$core$IFn$_invoke$arity$0() : promesa.exec.microtask_executor.call(null));
}),null));
}
/**
 * Default Executor instance that runs the task in the same thread.
 */
promesa.exec.default_current_thread_executor = (new cljs.core.Delay((function (){
return (promesa.exec.current_thread_executor.cljs$core$IFn$_invoke$arity$0 ? promesa.exec.current_thread_executor.cljs$core$IFn$_invoke$arity$0() : promesa.exec.current_thread_executor.call(null));
}),null));
if((typeof promesa !== 'undefined') && (typeof promesa.exec !== 'undefined') && (typeof promesa.exec.default_cached_executor !== 'undefined')){
} else {
/**
 * A global, cached thread executor service.
 */
promesa.exec.default_cached_executor = promesa.exec.default_executor;
}
if((typeof promesa !== 'undefined') && (typeof promesa.exec !== 'undefined') && (typeof promesa.exec.default_thread_executor !== 'undefined')){
} else {
/**
 * A global, thread per task executor service.
 */
promesa.exec.default_thread_executor = promesa.exec.default_executor;
}
if((typeof promesa !== 'undefined') && (typeof promesa.exec !== 'undefined') && (typeof promesa.exec.default_vthread_executor !== 'undefined')){
} else {
/**
 * A global, virtual thread per task executor service.
 */
promesa.exec.default_vthread_executor = promesa.exec.default_executor;
}
/**
 * Returns true if `o` is an instane of Executor or satisfies IExecutor protocol.
 */
promesa.exec.executor_QMARK_ = (function promesa$exec$executor_QMARK_(o){
if((!((o == null)))){
if(((false) || ((cljs.core.PROTOCOL_SENTINEL === o.promesa$protocols$IExecutor$)))){
return true;
} else {
if((!o.cljs$lang$protocol_mask$partition$)){
return cljs.core.native_satisfies_QMARK_(promesa.protocols.IExecutor,o);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_(promesa.protocols.IExecutor,o);
}
});
promesa.exec.resolve_executor = (function promesa$exec$resolve_executor(var_args){
var G__26440 = arguments.length;
switch (G__26440) {
case 0:
return promesa.exec.resolve_executor.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return promesa.exec.resolve_executor.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.exec.resolve_executor.cljs$core$IFn$_invoke$arity$0 = (function (){
return promesa.exec.resolve_executor.cljs$core$IFn$_invoke$arity$1(null);
}));

(promesa.exec.resolve_executor.cljs$core$IFn$_invoke$arity$1 = (function (executor){
if((executor == null)){
return cljs.core.deref(promesa.exec.default_executor);
} else {
if(promesa.exec.executor_QMARK_(executor)){
return executor;
} else {
if(cljs.core.delay_QMARK_(executor)){
return promesa.exec.resolve_executor.cljs$core$IFn$_invoke$arity$1(cljs.core.deref(executor));
} else {
var G__26443 = executor;
var G__26443__$1 = (((G__26443 instanceof cljs.core.Keyword))?G__26443.fqn:null);
switch (G__26443__$1) {
case "default":
return cljs.core.deref(promesa.exec.default_executor);

break;
case "cached":
return cljs.core.deref(promesa.exec.default_cached_executor);

break;
case "thread":
return cljs.core.deref(promesa.exec.default_thread_executor);

break;
case "vthread":
return cljs.core.deref(promesa.exec.default_vthread_executor);

break;
case "same-thread":
return cljs.core.deref(promesa.exec.default_current_thread_executor);

break;
case "current-thread":
return cljs.core.deref(promesa.exec.default_current_thread_executor);

break;
default:
throw (new TypeError("invalid executor"));

}

}
}
}
}));

(promesa.exec.resolve_executor.cljs$lang$maxFixedArity = 1);

promesa.exec.resolve_scheduler = (function promesa$exec$resolve_scheduler(var_args){
var G__26448 = arguments.length;
switch (G__26448) {
case 0:
return promesa.exec.resolve_scheduler.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return promesa.exec.resolve_scheduler.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.exec.resolve_scheduler.cljs$core$IFn$_invoke$arity$0 = (function (){
return promesa.exec.resolve_scheduler.cljs$core$IFn$_invoke$arity$1(null);
}));

(promesa.exec.resolve_scheduler.cljs$core$IFn$_invoke$arity$1 = (function (scheduler){
if((((scheduler == null)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"default","default",-1987822328),scheduler)))){
return cljs.core.deref(promesa.exec.default_scheduler);
} else {
return promesa.util.maybe_deref(scheduler);
}
}));

(promesa.exec.resolve_scheduler.cljs$lang$maxFixedArity = 1);

promesa.exec.wrap_bindings = (function promesa$exec$wrap_bindings(f){
return f;
});
/**
 * Run the task in the provided executor, returns `nil`. Analogous to
 *   the `(.execute executor f)`. Fire and forget.
 */
promesa.exec.exec_BANG_ = (function promesa$exec$exec_BANG_(var_args){
var G__26460 = arguments.length;
switch (G__26460) {
case 1:
return promesa.exec.exec_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return promesa.exec.exec_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.exec.exec_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (f){
return promesa.protocols._exec_BANG_(promesa.exec.resolve_executor.cljs$core$IFn$_invoke$arity$1(promesa.exec._STAR_default_executor_STAR_),f);
}));

(promesa.exec.exec_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (executor,f){
return promesa.protocols._exec_BANG_(promesa.exec.resolve_executor.cljs$core$IFn$_invoke$arity$1(executor),f);
}));

(promesa.exec.exec_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Run the task in the provided executor.
 */
promesa.exec.run_BANG_ = (function promesa$exec$run_BANG_(var_args){
var G__26469 = arguments.length;
switch (G__26469) {
case 1:
return promesa.exec.run_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return promesa.exec.run_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.exec.run_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (f){
return promesa.protocols._run_BANG_(promesa.exec.resolve_executor.cljs$core$IFn$_invoke$arity$1(promesa.exec._STAR_default_executor_STAR_),f);
}));

(promesa.exec.run_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (executor,f){
return promesa.protocols._run_BANG_(promesa.exec.resolve_executor.cljs$core$IFn$_invoke$arity$1(executor),f);
}));

(promesa.exec.run_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Submit a task to be executed in a provided executor
 *   and return a promise that will be completed with
 *   the return value of a task.
 * 
 *   A task is a plain clojure function.
 */
promesa.exec.submit_BANG_ = (function promesa$exec$submit_BANG_(var_args){
var G__26474 = arguments.length;
switch (G__26474) {
case 1:
return promesa.exec.submit_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return promesa.exec.submit_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.exec.submit_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (f){
return promesa.protocols._submit_BANG_(promesa.exec.resolve_executor.cljs$core$IFn$_invoke$arity$1(promesa.exec._STAR_default_executor_STAR_),f);
}));

(promesa.exec.submit_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (executor,f){
return promesa.protocols._submit_BANG_(promesa.exec.resolve_executor.cljs$core$IFn$_invoke$arity$1(executor),f);
}));

(promesa.exec.submit_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Schedule a callable to be executed after the `ms` delay
 *   is reached.
 * 
 *   In JVM it uses a scheduled executor service and in JS
 *   it uses the `setTimeout` function.
 */
promesa.exec.schedule_BANG_ = (function promesa$exec$schedule_BANG_(var_args){
var G__26481 = arguments.length;
switch (G__26481) {
case 2:
return promesa.exec.schedule_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.exec.schedule_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.exec.schedule_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (ms,f){
return promesa.protocols._schedule_BANG_(promesa.exec.resolve_scheduler.cljs$core$IFn$_invoke$arity$0(),ms,f);
}));

(promesa.exec.schedule_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (scheduler,ms,f){
return promesa.protocols._schedule_BANG_(promesa.exec.resolve_scheduler.cljs$core$IFn$_invoke$arity$1(scheduler),ms,f);
}));

(promesa.exec.schedule_BANG_.cljs$lang$maxFixedArity = 3);


/**
* @constructor
 * @implements {promesa.protocols.IExecutor}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
promesa.exec.t_promesa$exec26487 = (function (meta26488){
this.meta26488 = meta26488;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(promesa.exec.t_promesa$exec26487.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_26489,meta26488__$1){
var self__ = this;
var _26489__$1 = this;
return (new promesa.exec.t_promesa$exec26487(meta26488__$1));
}));

(promesa.exec.t_promesa$exec26487.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_26489){
var self__ = this;
var _26489__$1 = this;
return self__.meta26488;
}));

(promesa.exec.t_promesa$exec26487.prototype.promesa$protocols$IExecutor$ = cljs.core.PROTOCOL_SENTINEL);

(promesa.exec.t_promesa$exec26487.prototype.promesa$protocols$IExecutor$_exec_BANG_$arity$2 = (function (this$,f){
var self__ = this;
var this$__$1 = this;
try{(f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null));

return null;
}catch (e26497){var _ = e26497;
return null;
}}));

(promesa.exec.t_promesa$exec26487.prototype.promesa$protocols$IExecutor$_run_BANG_$arity$2 = (function (this$,f){
var self__ = this;
var this$__$1 = this;
try{return promesa.protocols._promise(cljs.core.comp.cljs$core$IFn$_invoke$arity$2(promesa.exec.noop,f));
}catch (e26500){var cause = e26500;
return promesa.protocols._promise(cause);
}}));

(promesa.exec.t_promesa$exec26487.prototype.promesa$protocols$IExecutor$_submit_BANG_$arity$2 = (function (this$,f){
var self__ = this;
var this$__$1 = this;
try{return promesa.protocols._promise((f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null)));
}catch (e26502){var cause = e26502;
return promesa.protocols._promise(cause);
}}));

(promesa.exec.t_promesa$exec26487.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"meta26488","meta26488",-585439968,null)], null);
}));

(promesa.exec.t_promesa$exec26487.cljs$lang$type = true);

(promesa.exec.t_promesa$exec26487.cljs$lang$ctorStr = "promesa.exec/t_promesa$exec26487");

(promesa.exec.t_promesa$exec26487.cljs$lang$ctorPrWriter = (function (this__5455__auto__,writer__5456__auto__,opt__5457__auto__){
return cljs.core._write(writer__5456__auto__,"promesa.exec/t_promesa$exec26487");
}));

/**
 * Positional factory function for promesa.exec/t_promesa$exec26487.
 */
promesa.exec.__GT_t_promesa$exec26487 = (function promesa$exec$__GT_t_promesa$exec26487(meta26488){
return (new promesa.exec.t_promesa$exec26487(meta26488));
});


/**
 * Creates an executor instance that run tasks in the same thread.
 */
promesa.exec.current_thread_executor = (function promesa$exec$current_thread_executor(){
return (new promesa.exec.t_promesa$exec26487(cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {promesa.protocols.IExecutor}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
promesa.exec.t_promesa$exec26507 = (function (meta26508){
this.meta26508 = meta26508;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(promesa.exec.t_promesa$exec26507.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_26509,meta26508__$1){
var self__ = this;
var _26509__$1 = this;
return (new promesa.exec.t_promesa$exec26507(meta26508__$1));
}));

(promesa.exec.t_promesa$exec26507.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_26509){
var self__ = this;
var _26509__$1 = this;
return self__.meta26508;
}));

(promesa.exec.t_promesa$exec26507.prototype.promesa$protocols$IExecutor$ = cljs.core.PROTOCOL_SENTINEL);

(promesa.exec.t_promesa$exec26507.prototype.promesa$protocols$IExecutor$_exec_BANG_$arity$2 = (function (this$,f){
var self__ = this;
var this$__$1 = this;
return promesa.impl.promise.nextTick(f);
}));

(promesa.exec.t_promesa$exec26507.prototype.promesa$protocols$IExecutor$_run_BANG_$arity$2 = (function (this$,f){
var self__ = this;
var this$__$1 = this;
return promesa.protocols._fmap(promesa.protocols._fmap(promesa.protocols._promise(null),(function (_){
try{return (f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null));
}catch (e26516){var ___$1 = e26516;
return null;
}})),promesa.exec.noop);
}));

(promesa.exec.t_promesa$exec26507.prototype.promesa$protocols$IExecutor$_submit_BANG_$arity$2 = (function (this$,f){
var self__ = this;
var this$__$1 = this;
return promesa.protocols._fmap(promesa.protocols._promise(null),(function (_){
return (f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null));
}));
}));

(promesa.exec.t_promesa$exec26507.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"meta26508","meta26508",2123463247,null)], null);
}));

(promesa.exec.t_promesa$exec26507.cljs$lang$type = true);

(promesa.exec.t_promesa$exec26507.cljs$lang$ctorStr = "promesa.exec/t_promesa$exec26507");

(promesa.exec.t_promesa$exec26507.cljs$lang$ctorPrWriter = (function (this__5455__auto__,writer__5456__auto__,opt__5457__auto__){
return cljs.core._write(writer__5456__auto__,"promesa.exec/t_promesa$exec26507");
}));

/**
 * Positional factory function for promesa.exec/t_promesa$exec26507.
 */
promesa.exec.__GT_t_promesa$exec26507 = (function promesa$exec$__GT_t_promesa$exec26507(meta26508){
return (new promesa.exec.t_promesa$exec26507(meta26508));
});


/**
 * An IExecutor that schedules tasks to be executed in the MicrotasksQueue.
 */
promesa.exec.microtask_executor = (function promesa$exec$microtask_executor(){
return (new promesa.exec.t_promesa$exec26507(cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {promesa.protocols.IScheduler}
*/
promesa.exec.Scheduler = (function (){
});
(promesa.exec.Scheduler.prototype.promesa$protocols$IScheduler$ = cljs.core.PROTOCOL_SENTINEL);

(promesa.exec.Scheduler.prototype.promesa$protocols$IScheduler$_schedule_BANG_$arity$3 = (function (_,ms,f){
var self__ = this;
var ___$1 = this;
var df = promesa.impl.promise.deferred();
var tid = setTimeout((function (){
try{return promesa.protocols._resolve_BANG_(df,(f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null)));
}catch (e26526){var cause = e26526;
return promesa.protocols._reject_BANG_(df,cause);
}}),ms);
promesa.protocols._fnly(df,(function (___$2,c){
if(cljs.core.truth_(promesa.impl.promise.isCancellationError(c))){
return clearTimeout(tid);
} else {
return null;
}
}));

return df;
}));

(promesa.exec.Scheduler.getBasis = (function (){
return cljs.core.PersistentVector.EMPTY;
}));

(promesa.exec.Scheduler.cljs$lang$type = true);

(promesa.exec.Scheduler.cljs$lang$ctorStr = "promesa.exec/Scheduler");

(promesa.exec.Scheduler.cljs$lang$ctorPrWriter = (function (this__5455__auto__,writer__5456__auto__,opt__5457__auto__){
return cljs.core._write(writer__5456__auto__,"promesa.exec/Scheduler");
}));

/**
 * Positional factory function for promesa.exec/Scheduler.
 */
promesa.exec.__GT_Scheduler = (function promesa$exec$__GT_Scheduler(){
return (new promesa.exec.Scheduler());
});

/**
 * A scheduled thread pool constructor. A ScheduledExecutor (IScheduler
 *   in CLJS) instance allows execute asynchronous tasks some time later.
 */
promesa.exec.scheduled_executor = (function promesa$exec$scheduled_executor(var_args){
var args__5903__auto__ = [];
var len__5897__auto___26641 = arguments.length;
var i__5898__auto___26642 = (0);
while(true){
if((i__5898__auto___26642 < len__5897__auto___26641)){
args__5903__auto__.push((arguments[i__5898__auto___26642]));

var G__26643 = (i__5898__auto___26642 + (1));
i__5898__auto___26642 = G__26643;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return promesa.exec.scheduled_executor.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(promesa.exec.scheduled_executor.cljs$core$IFn$_invoke$arity$variadic = (function (p__26552){
var map__26554 = p__26552;
var map__26554__$1 = cljs.core.__destructure_map(map__26554);
var parallelism = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__26554__$1,new cljs.core.Keyword(null,"parallelism","parallelism",-930922333),(1));
var factory = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26554__$1,new cljs.core.Keyword(null,"factory","factory",63933746));
return promesa.exec.__GT_Scheduler();
}));

(promesa.exec.scheduled_executor.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(promesa.exec.scheduled_executor.cljs$lang$applyTo = (function (seq26547){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq26547));
}));


//# sourceMappingURL=promesa.exec.js.map
