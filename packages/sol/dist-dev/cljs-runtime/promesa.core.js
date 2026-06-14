import "./cljs_env.js";
import "./cljs.core.js";
import "./promesa.protocols.js";
import "./promesa.exec.js";
import "./promesa.impl.js";
import "./promesa.util.js";
goog.provide('promesa.core');
/**
 * Return a resolved promise with provided value.
 */
promesa.core.resolved = (function promesa$core$resolved(v){
return promesa.impl.resolved(v);
});
/**
 * Return a rejected promise with provided reason.
 */
promesa.core.rejected = (function promesa$core$rejected(v){
return promesa.impl.rejected(v);
});
/**
 * Creates an empty promise instance.
 */
promesa.core.deferred = (function promesa$core$deferred(){
return promesa.impl.deferred();
});
/**
 * The coerce based promise constructor. Creates an appropriate promise
 *   instance depending on the provided value.
 * 
 *   If an executor is provided, it will be used to resolve this
 *   promise.
 */
promesa.core.promise = (function promesa$core$promise(var_args){
var G__28647 = arguments.length;
switch (G__28647) {
case 1:
return promesa.core.promise.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return promesa.core.promise.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.promise.cljs$core$IFn$_invoke$arity$1 = (function (v){
return promesa.protocols._promise(v);
}));

(promesa.core.promise.cljs$core$IFn$_invoke$arity$2 = (function (v,executor){
return promesa.protocols._fmap(promesa.protocols._promise(v),cljs.core.identity,executor);
}));

(promesa.core.promise.cljs$lang$maxFixedArity = 2);

/**
 * A convenience alias for `promise` coercion function that only accepts
 *   a single argument.
 */
promesa.core.wrap = (function promesa$core$wrap(v){
return promesa.protocols._promise(v);
});
/**
 * Create a promise instance from a factory function. If an executor is
 *   provided, the factory will be executed in the provided executor.
 * 
 *   A factory function looks like `(fn [resolve reject] (resolve 1))`.
 */
promesa.core.create = (function promesa$core$create(var_args){
var G__28665 = arguments.length;
switch (G__28665) {
case 1:
return promesa.core.create.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return promesa.core.create.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.create.cljs$core$IFn$_invoke$arity$1 = (function (f){
var d = promesa.impl.deferred();
try{var G__28671_29216 = (function (p1__28656_SHARP_){
return promesa.protocols._resolve_BANG_(d,p1__28656_SHARP_);
});
var G__28672_29217 = (function (p1__28657_SHARP_){
return promesa.protocols._reject_BANG_(d,p1__28657_SHARP_);
});
(f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__28671_29216,G__28672_29217) : f.call(null,G__28671_29216,G__28672_29217));
}catch (e28670){var e_29218 = e28670;
promesa.protocols._reject_BANG_(d,e_29218);
}
return d;
}));

(promesa.core.create.cljs$core$IFn$_invoke$arity$2 = (function (f,executor){
var d = promesa.impl.deferred();
promesa.exec.run_BANG_.cljs$core$IFn$_invoke$arity$2(executor,(function (){
try{var G__28681 = (function (p1__28658_SHARP_){
return promesa.protocols._resolve_BANG_(d,p1__28658_SHARP_);
});
var G__28682 = (function (p1__28659_SHARP_){
return promesa.protocols._reject_BANG_(d,p1__28659_SHARP_);
});
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(G__28681,G__28682) : f.call(null,G__28681,G__28682));
}catch (e28679){var e = e28679;
return promesa.protocols._reject_BANG_(d,e);
}}));

return d;
}));

(promesa.core.create.cljs$lang$maxFixedArity = 2);

/**
 * Return true if `v` is a promise instance.
 */
promesa.core.promise_QMARK_ = (function promesa$core$promise_QMARK_(v){
return promesa.impl.promise_QMARK_(v);
});
/**
 * Return true if `v` is a deferred instance.
 */
promesa.core.deferred_QMARK_ = (function promesa$core$deferred_QMARK_(v){
return promesa.impl.deferred_QMARK_(v);
});
/**
 * Returns true if `v` is a promise like object.
 */
promesa.core.thenable_QMARK_ = (function promesa$core$thenable_QMARK_(v){
return ((cljs.core.object_QMARK_(v)) && (cljs.core.fn_QMARK_((v["then"]))));
});
/**
 * Returns true if promise `p` is already fulfilled.
 */
promesa.core.resolved_QMARK_ = (function promesa$core$resolved_QMARK_(p){
return promesa.protocols._resolved_QMARK_(p);
});
/**
 * Returns true if promise `p` is already rejected.
 */
promesa.core.rejected_QMARK_ = (function promesa$core$rejected_QMARK_(p){
return promesa.protocols._rejected_QMARK_(p);
});
/**
 * Returns true if promise `p` is stil pending.
 */
promesa.core.pending_QMARK_ = (function promesa$core$pending_QMARK_(p){
return promesa.protocols._pending_QMARK_(p);
});
/**
 * Returns the current promise value.
 */
promesa.core.extract = (function promesa$core$extract(var_args){
var G__28701 = arguments.length;
switch (G__28701) {
case 1:
return promesa.core.extract.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return promesa.core.extract.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.extract.cljs$core$IFn$_invoke$arity$1 = (function (p){
return promesa.protocols._extract(p);
}));

(promesa.core.extract.cljs$core$IFn$_invoke$arity$2 = (function (p,default$){
return promesa.protocols._extract(p,default$);
}));

(promesa.core.extract.cljs$lang$maxFixedArity = 2);

/**
 * Returns true if promise `p` is already done.
 */
promesa.core.done_QMARK_ = (function promesa$core$done_QMARK_(p){
return cljs.core.not(promesa.protocols._pending_QMARK_(p));
});
/**
 * Chains a function `f` to be executed when the promise `p` is
 *   successfully resolved. Returns a promise that will be resolved with
 *   the return value of calling `f` with value as single argument; `f`
 *   can return a plain value or promise instance, an automatic
 *   unwrapping will be performed.
 * 
 *   The computation will be executed in the completion thread by
 *   default; you also can provide a custom executor.
 */
promesa.core.then = (function promesa$core$then(var_args){
var G__28718 = arguments.length;
switch (G__28718) {
case 2:
return promesa.core.then.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.then.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.then.cljs$core$IFn$_invoke$arity$2 = (function (p,f){
return promesa.protocols._then(promesa.protocols._promise(p),f);
}));

(promesa.core.then.cljs$core$IFn$_invoke$arity$3 = (function (p,f,executor){
return promesa.protocols._then(promesa.protocols._promise(p),f,executor);
}));

(promesa.core.then.cljs$lang$maxFixedArity = 3);

/**
 * Chains a function `f` to be executed when the promise `p` is
 *   successfully resolved. Returns a promise that will be resolved with
 *   the return value of calling `f` with value as single argument; `f`
 *   should return a plain value, no automatic unwrapping will be
 *   performed.
 * 
 *   The computation will be executed in the completion thread by
 *   default; you also can provide a custom executor.
 */
promesa.core.then_SINGLEQUOTE_ = (function promesa$core$then_SINGLEQUOTE_(var_args){
var G__28725 = arguments.length;
switch (G__28725) {
case 2:
return promesa.core.then_SINGLEQUOTE_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.then_SINGLEQUOTE_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.then_SINGLEQUOTE_.cljs$core$IFn$_invoke$arity$2 = (function (p,f){
return promesa.protocols._fmap(promesa.protocols._promise(p),f);
}));

(promesa.core.then_SINGLEQUOTE_.cljs$core$IFn$_invoke$arity$3 = (function (p,f,executor){
return promesa.protocols._fmap(promesa.protocols._promise(p),f,executor);
}));

(promesa.core.then_SINGLEQUOTE_.cljs$lang$maxFixedArity = 3);

/**
 * Chains a function `f` to be executed with when the promise `p` is
 *   successfully resolved. Returns a promise that will mirror the
 *   promise instance returned by calling `f` with the value as single
 *   argument; `f` **must** return a promise instance.
 * 
 *   The computation will be executed in the completion thread by
 *   default; you also can provide a custom executor.
 */
promesa.core.bind = (function promesa$core$bind(var_args){
var G__28735 = arguments.length;
switch (G__28735) {
case 2:
return promesa.core.bind.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.bind.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.bind.cljs$core$IFn$_invoke$arity$2 = (function (p,f){
return promesa.protocols._mcat(promesa.protocols._promise(p),f);
}));

(promesa.core.bind.cljs$core$IFn$_invoke$arity$3 = (function (p,f,executor){
return promesa.protocols._mcat(promesa.protocols._promise(p),f,executor);
}));

(promesa.core.bind.cljs$lang$maxFixedArity = 3);

/**
 * Chains a function `f` to be executed when the promise `p` is
 *   successfully resolved. Returns a promise that will be resolved with
 *   the return value of calling `f` with value as single argument.
 * 
 *   The computation will be executed in the completion thread by
 *   default; you also can provide a custom executor.
 * 
 *   This function is intended to be used with `->>`.
 */
promesa.core.map = (function promesa$core$map(var_args){
var G__28743 = arguments.length;
switch (G__28743) {
case 2:
return promesa.core.map.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.map.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.map.cljs$core$IFn$_invoke$arity$2 = (function (f,p){
return promesa.protocols._fmap(promesa.protocols._promise(p),f);
}));

(promesa.core.map.cljs$core$IFn$_invoke$arity$3 = (function (executor,f,p){
return promesa.protocols._fmap(promesa.protocols._promise(p),f,executor);
}));

(promesa.core.map.cljs$lang$maxFixedArity = 3);

/**
 * A convenience alias for `map`.
 */
promesa.core.fmap = (function promesa$core$fmap(var_args){
var G__28757 = arguments.length;
switch (G__28757) {
case 2:
return promesa.core.fmap.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.fmap.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.fmap.cljs$core$IFn$_invoke$arity$2 = (function (f,p){
return promesa.protocols._fmap(promesa.protocols._promise(p),f);
}));

(promesa.core.fmap.cljs$core$IFn$_invoke$arity$3 = (function (executor,f,p){
return promesa.protocols._fmap(promesa.protocols._promise(p),f,executor);
}));

(promesa.core.fmap.cljs$lang$maxFixedArity = 3);

/**
 * Chains a function `f` to be executed when the promise `p` is
 *   successfully resolved. Returns a promise that will mirror the
 *   promise instance returned by calling `f` with the value as single
 *   argument; `f` **must** return a promise instance.
 * 
 *   The computation will be executed in the completion thread by
 *   default; you also can provide a custom executor.
 * 
 *   This funciton is intended to be used with `->>`.
 */
promesa.core.mapcat = (function promesa$core$mapcat(var_args){
var G__28766 = arguments.length;
switch (G__28766) {
case 2:
return promesa.core.mapcat.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.mapcat.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.mapcat.cljs$core$IFn$_invoke$arity$2 = (function (f,p){
return promesa.protocols._mcat(promesa.protocols._promise(p),f);
}));

(promesa.core.mapcat.cljs$core$IFn$_invoke$arity$3 = (function (executor,f,p){
return promesa.protocols._mcat(promesa.protocols._promise(p),f,executor);
}));

(promesa.core.mapcat.cljs$lang$maxFixedArity = 3);

/**
 * A convenience alias for `mapcat`.
 */
promesa.core.mcat = (function promesa$core$mcat(var_args){
var G__28771 = arguments.length;
switch (G__28771) {
case 2:
return promesa.core.mcat.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.mcat.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.mcat.cljs$core$IFn$_invoke$arity$2 = (function (f,p){
return promesa.protocols._mcat(promesa.protocols._promise(p),f);
}));

(promesa.core.mcat.cljs$core$IFn$_invoke$arity$3 = (function (executor,f,p){
return promesa.protocols._mcat(promesa.protocols._promise(p),f,executor);
}));

(promesa.core.mcat.cljs$lang$maxFixedArity = 3);

/**
 * Chain variable number of functions to be executed serially using
 *   `then`.
 */
promesa.core.chain = (function promesa$core$chain(var_args){
var G__28783 = arguments.length;
switch (G__28783) {
case 2:
return promesa.core.chain.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
var args_arr__5922__auto__ = [];
var len__5897__auto___29277 = arguments.length;
var i__5898__auto___29278 = (0);
while(true){
if((i__5898__auto___29278 < len__5897__auto___29277)){
args_arr__5922__auto__.push((arguments[i__5898__auto___29278]));

var G__29279 = (i__5898__auto___29278 + (1));
i__5898__auto___29278 = G__29279;
continue;
} else {
}
break;
}

var argseq__5923__auto__ = ((((2) < args_arr__5922__auto__.length))?(new cljs.core.IndexedSeq(args_arr__5922__auto__.slice((2)),(0),null)):null);
return promesa.core.chain.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5923__auto__);

}
});

(promesa.core.chain.cljs$core$IFn$_invoke$arity$2 = (function (p,f){
return promesa.core.then.cljs$core$IFn$_invoke$arity$2(p,f);
}));

(promesa.core.chain.cljs$core$IFn$_invoke$arity$variadic = (function (p,f,fs){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(promesa.core.then,p,cljs.core.cons(f,fs));
}));

/** @this {Function} */
(promesa.core.chain.cljs$lang$applyTo = (function (seq28780){
var G__28781 = cljs.core.first(seq28780);
var seq28780__$1 = cljs.core.next(seq28780);
var G__28782 = cljs.core.first(seq28780__$1);
var seq28780__$2 = cljs.core.next(seq28780__$1);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__28781,G__28782,seq28780__$2);
}));

(promesa.core.chain.cljs$lang$maxFixedArity = (2));

/**
 * Chain variable number of functions to be executed serially using
 *   `map`.
 */
promesa.core.chain_SINGLEQUOTE_ = (function promesa$core$chain_SINGLEQUOTE_(var_args){
var G__28795 = arguments.length;
switch (G__28795) {
case 2:
return promesa.core.chain_SINGLEQUOTE_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
var args_arr__5922__auto__ = [];
var len__5897__auto___29297 = arguments.length;
var i__5898__auto___29301 = (0);
while(true){
if((i__5898__auto___29301 < len__5897__auto___29297)){
args_arr__5922__auto__.push((arguments[i__5898__auto___29301]));

var G__29302 = (i__5898__auto___29301 + (1));
i__5898__auto___29301 = G__29302;
continue;
} else {
}
break;
}

var argseq__5923__auto__ = ((((2) < args_arr__5922__auto__.length))?(new cljs.core.IndexedSeq(args_arr__5922__auto__.slice((2)),(0),null)):null);
return promesa.core.chain_SINGLEQUOTE_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5923__auto__);

}
});

(promesa.core.chain_SINGLEQUOTE_.cljs$core$IFn$_invoke$arity$2 = (function (p,f){
return promesa.core.then_SINGLEQUOTE_.cljs$core$IFn$_invoke$arity$2(p,f);
}));

(promesa.core.chain_SINGLEQUOTE_.cljs$core$IFn$_invoke$arity$variadic = (function (p,f,fs){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (p1__28790_SHARP_,p2__28789_SHARP_){
return promesa.core.map.cljs$core$IFn$_invoke$arity$2(p2__28789_SHARP_,p1__28790_SHARP_);
}),promesa.protocols._promise(p),cljs.core.cons(f,fs));
}));

/** @this {Function} */
(promesa.core.chain_SINGLEQUOTE_.cljs$lang$applyTo = (function (seq28792){
var G__28793 = cljs.core.first(seq28792);
var seq28792__$1 = cljs.core.next(seq28792);
var G__28794 = cljs.core.first(seq28792__$1);
var seq28792__$2 = cljs.core.next(seq28792__$1);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__28793,G__28794,seq28792__$2);
}));

(promesa.core.chain_SINGLEQUOTE_.cljs$lang$maxFixedArity = (2));

/**
 * Chains a function `f` to be executed when the promise `p` is completed
 *   (resolved or rejected) and returns a promise completed (resolving or
 *   rejecting) with the return value of calling `f` with both: value and
 *   the exception; `f` can return a new plain value or promise instance,
 *   and automatic unwrapping will be performed.
 * 
 *   The computation will be executed in the completion thread by
 *   default; you also can provide a custom executor.
 * 
 *   For performance sensitive code, look at `hmap` and `hcat`.
 */
promesa.core.handle = (function promesa$core$handle(var_args){
var G__28805 = arguments.length;
switch (G__28805) {
case 2:
return promesa.core.handle.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.handle.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.handle.cljs$core$IFn$_invoke$arity$2 = (function (p,f){
return promesa.protocols._mcat(promesa.protocols._hmap(promesa.protocols._promise(p),cljs.core.comp.cljs$core$IFn$_invoke$arity$2(promesa.protocols._promise,f)),cljs.core.identity);
}));

(promesa.core.handle.cljs$core$IFn$_invoke$arity$3 = (function (p,f,executor){
return promesa.protocols._mcat(promesa.protocols._hmap(promesa.protocols._promise(p),cljs.core.comp.cljs$core$IFn$_invoke$arity$2(promesa.protocols._promise,f),executor),cljs.core.identity,executor);
}));

(promesa.core.handle.cljs$lang$maxFixedArity = 3);

/**
 * Like `handle` but ignores the return value. Returns a promise that
 *   will mirror the original one.
 */
promesa.core.finally$ = (function promesa$core$finally(var_args){
var G__28808 = arguments.length;
switch (G__28808) {
case 2:
return promesa.core.finally$.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.finally$.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.finally$.cljs$core$IFn$_invoke$arity$2 = (function (p,f){
return promesa.protocols._fnly(promesa.protocols._promise(p),f);
}));

(promesa.core.finally$.cljs$core$IFn$_invoke$arity$3 = (function (p,f,executor){
return promesa.protocols._fnly(promesa.protocols._promise(p),f,executor);
}));

(promesa.core.finally$.cljs$lang$maxFixedArity = 3);

/**
 * Chains a function `f` to be executed when the promise `p` is completed
 *   (resolved or rejected) and returns a promise completed (resolving or
 *   rejecting) with the return value of calling `f` with both: value and
 *   the exception.
 * 
 *   The computation will be executed in the completion thread by
 *   default; you also can provide a custom executor.
 * 
 *   Intended to be used with `->>`.
 */
promesa.core.hmap = (function promesa$core$hmap(var_args){
var G__28817 = arguments.length;
switch (G__28817) {
case 2:
return promesa.core.hmap.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.hmap.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.hmap.cljs$core$IFn$_invoke$arity$2 = (function (f,p){
return promesa.protocols._hmap(promesa.protocols._promise(p),f);
}));

(promesa.core.hmap.cljs$core$IFn$_invoke$arity$3 = (function (executor,f,p){
return promesa.protocols._hmap(promesa.protocols._promise(p),f,executor);
}));

(promesa.core.hmap.cljs$lang$maxFixedArity = 3);

/**
 * Chains a function `f` to be executed when the promise `p` is completed
 *   (resolved or rejected) and returns a promise that will mirror the
 *   promise instance returned by calling `f` with both: value and the
 *   exception. The `f` function must return a promise instance.
 * 
 *   The computation will be executed in the completion thread by
 *   default; you also can provide a custom executor.
 * 
 *   Intended to be used with `->>`.
 */
promesa.core.hcat = (function promesa$core$hcat(var_args){
var G__28828 = arguments.length;
switch (G__28828) {
case 2:
return promesa.core.hcat.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.hcat.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.hcat.cljs$core$IFn$_invoke$arity$2 = (function (f,p){
return promesa.protocols._mcat(promesa.protocols._hmap(promesa.protocols._promise(p),f),cljs.core.identity);
}));

(promesa.core.hcat.cljs$core$IFn$_invoke$arity$3 = (function (executor,f,p){
return promesa.protocols._mcat(promesa.protocols._hmap(promesa.protocols._promise(p),f,executor),cljs.core.identity,executor);
}));

(promesa.core.hcat.cljs$lang$maxFixedArity = 3);

/**
 * Inverted arguments version of `finally`; intended to be used with
 *   `->>`.
 */
promesa.core.fnly = (function promesa$core$fnly(var_args){
var G__28835 = arguments.length;
switch (G__28835) {
case 2:
return promesa.core.fnly.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.fnly.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.fnly.cljs$core$IFn$_invoke$arity$2 = (function (f,p){
return promesa.protocols._fnly(promesa.protocols._promise(p),f);
}));

(promesa.core.fnly.cljs$core$IFn$_invoke$arity$3 = (function (executor,f,p){
return promesa.protocols._fnly(promesa.protocols._promise(p),f,executor);
}));

(promesa.core.fnly.cljs$lang$maxFixedArity = 3);

/**
 * Chains a function `f` to be executed when the promise `p` is
 *   rejected. Returns a promise that will be resolved with the return
 *   value of calling `f` with exception as single argument; `f` can
 *   return a plain value or promise instance, an automatic unwrapping
 *   will be performed.
 * 
 *   The computation will be executed in the completion thread, look at
 *   `merr` if you want the ability to schedule the computation to other
 *   thread.
 */
promesa.core.catch$ = (function promesa$core$catch(var_args){
var G__28849 = arguments.length;
switch (G__28849) {
case 2:
return promesa.core.catch$.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.catch$.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.catch$.cljs$core$IFn$_invoke$arity$2 = (function (p,f){
return promesa.protocols._merr(promesa.protocols._promise(p),(function (p1__28842_SHARP_){
return promesa.protocols._promise((f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(p1__28842_SHARP_) : f.call(null,p1__28842_SHARP_)));
}));
}));

(promesa.core.catch$.cljs$core$IFn$_invoke$arity$3 = (function (p,pred_or_type,f){
var accept_QMARK_ = ((cljs.core.ifn_QMARK_(pred_or_type))?pred_or_type:(function (p1__28844_SHARP_){
return (p1__28844_SHARP_ instanceof pred_or_type);
}));
return promesa.protocols._merr(promesa.protocols._promise(p),(function (e){
if(cljs.core.truth_((accept_QMARK_.cljs$core$IFn$_invoke$arity$1 ? accept_QMARK_.cljs$core$IFn$_invoke$arity$1(e) : accept_QMARK_.call(null,e)))){
return promesa.protocols._promise((f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(e) : f.call(null,e)));
} else {
return promesa.impl.rejected(e);
}
}));
}));

(promesa.core.catch$.cljs$lang$maxFixedArity = 3);

/**
 * Chains a function `f` to be executed when the promise `p` is
 *   rejected. Returns a promise that will mirror the promise returned by
 *   calling `f` with exception as single argument; `f` **must** return a
 *   promise instance or throw an exception.
 * 
 *   The computation will be executed in the completion thread by
 *   default; you also can provide a custom executor.
 * 
 *   This is intended to be used with `->>`.
 */
promesa.core.merr = (function promesa$core$merr(var_args){
var G__28856 = arguments.length;
switch (G__28856) {
case 2:
return promesa.core.merr.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.merr.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.merr.cljs$core$IFn$_invoke$arity$2 = (function (f,p){
return promesa.protocols._merr(p,f);
}));

(promesa.core.merr.cljs$core$IFn$_invoke$arity$3 = (function (executor,f,p){
return promesa.protocols._merr(p,f,executor);
}));

(promesa.core.merr.cljs$lang$maxFixedArity = 3);

/**
 * Same as `catch` but with parameters inverted.
 * 
 *   DEPRECATED
 */
promesa.core.error = (function promesa$core$error(var_args){
var G__28868 = arguments.length;
switch (G__28868) {
case 2:
return promesa.core.error.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.error.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.error.cljs$core$IFn$_invoke$arity$2 = (function (f,p){
return promesa.core.catch$.cljs$core$IFn$_invoke$arity$2(p,f);
}));

(promesa.core.error.cljs$core$IFn$_invoke$arity$3 = (function (f,type,p){
return promesa.core.catch$.cljs$core$IFn$_invoke$arity$3(p,type,f);
}));

(promesa.core.error.cljs$lang$maxFixedArity = 3);

/**
 * Given an array of promises, return a promise that is fulfilled when
 *   all the items in the array are fulfilled.
 * 
 *   Example:
 * 
 *   ```
 *   (-> (p/all [(promise :first-promise)
 *            (promise :second-promise)])
 *    (then (fn [[first-result second-result]])
 *            (println (str first-result ", " second-result))))
 *   ```
 * 
 *   Will print to out `:first-promise, :second-promise`.
 * 
 *   If at least one of the promises is rejected, the resulting promise
 *   will be rejected.
 */
promesa.core.all = (function promesa$core$all(promises){
return promesa.impl.all(promises);
});
promesa.core.race = (function promesa$core$race(promises){
return promesa.impl.race(promises);
});
/**
 * Given an array of promises, return a promise that is fulfilled when
 *   first one item in the array is fulfilled.
 */
promesa.core.any = (function promesa$core$any(var_args){
var G__28874 = arguments.length;
switch (G__28874) {
case 1:
return promesa.core.any.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return promesa.core.any.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.any.cljs$core$IFn$_invoke$arity$1 = (function (promises){
return promesa.core.any.cljs$core$IFn$_invoke$arity$2(promises,new cljs.core.Keyword("promesa.core","default","promesa.core/default",1773193826));
}));

(promesa.core.any.cljs$core$IFn$_invoke$arity$2 = (function (promises,default$){
var items = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,promises);
var state = cljs.core.volatile_BANG_(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"pending","pending",-220036727),items,new cljs.core.Keyword(null,"rejections","rejections",-1620899911),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"resolved?","resolved?",862515389),false], null));
var lock = promesa.util.mutex();
return promesa.core.create.cljs$core$IFn$_invoke$arity$1((function (resolve,reject){
var seq__28878 = cljs.core.seq(promises);
var chunk__28879 = null;
var count__28880 = (0);
var i__28881 = (0);
while(true){
if((i__28881 < count__28880)){
var p = chunk__28879.cljs$core$IIndexed$_nth$arity$2(null,i__28881);
promesa.protocols._fnly(promesa.protocols._promise(p),((function (seq__28878,chunk__28879,count__28880,i__28881,p,items,state,lock){
return (function (v,exception){
lock.promesa$protocols$ILock$_lock_BANG_$arity$1(null);

try{if(cljs.core.truth_(exception)){
if(cljs.core.truth_(new cljs.core.Keyword(null,"resolved?","resolved?",862515389).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state)))){
return null;
} else {
var state__$1 = state.cljs$core$IVolatile$_vreset_BANG_$arity$2(null,((function (seq__28878,chunk__28879,count__28880,i__28881,p,items,state,lock){
return (function (state__$1){
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(cljs.core.update.cljs$core$IFn$_invoke$arity$4(state__$1,new cljs.core.Keyword(null,"pending","pending",-220036727),cljs.core.disj,p),new cljs.core.Keyword(null,"rejections","rejections",-1620899911),cljs.core.conj,exception);
});})(seq__28878,chunk__28879,count__28880,i__28881,p,items,state,lock))
(state.cljs$core$IDeref$_deref$arity$1(null)));
if(cljs.core.seq(new cljs.core.Keyword(null,"pending","pending",-220036727).cljs$core$IFn$_invoke$arity$1(state__$1))){
return null;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(default$,new cljs.core.Keyword("promesa.core","default","promesa.core/default",1773193826))){
var G__28933 = cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("No promises resolved",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"rejections","rejections",-1620899911),new cljs.core.Keyword(null,"rejections","rejections",-1620899911).cljs$core$IFn$_invoke$arity$1(state__$1)], null));
return (reject.cljs$core$IFn$_invoke$arity$1 ? reject.cljs$core$IFn$_invoke$arity$1(G__28933) : reject.call(null,G__28933));
} else {
return (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(default$) : resolve.call(null,default$));
}
}
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"resolved?","resolved?",862515389).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state)))){
return null;
} else {
var map__28934 = state.cljs$core$IVolatile$_vreset_BANG_$arity$2(null,((function (seq__28878,chunk__28879,count__28880,i__28881,p,items,state,lock){
return (function (state__$1){
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(state__$1,new cljs.core.Keyword(null,"resolved?","resolved?",862515389),true),new cljs.core.Keyword(null,"pending","pending",-220036727),cljs.core.disj,p);
});})(seq__28878,chunk__28879,count__28880,i__28881,p,items,state,lock))
(state.cljs$core$IDeref$_deref$arity$1(null)));
var map__28934__$1 = cljs.core.__destructure_map(map__28934);
var pending = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28934__$1,new cljs.core.Keyword(null,"pending","pending",-220036727));
return (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(v) : resolve.call(null,v));
}
}
}finally {lock.promesa$protocols$ILock$_unlock_BANG_$arity$1(null);
}});})(seq__28878,chunk__28879,count__28880,i__28881,p,items,state,lock))
);


var G__29416 = seq__28878;
var G__29417 = chunk__28879;
var G__29418 = count__28880;
var G__29419 = (i__28881 + (1));
seq__28878 = G__29416;
chunk__28879 = G__29417;
count__28880 = G__29418;
i__28881 = G__29419;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__28878);
if(temp__5825__auto__){
var seq__28878__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28878__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__28878__$1);
var G__29420 = cljs.core.chunk_rest(seq__28878__$1);
var G__29421 = c__5694__auto__;
var G__29422 = cljs.core.count(c__5694__auto__);
var G__29423 = (0);
seq__28878 = G__29420;
chunk__28879 = G__29421;
count__28880 = G__29422;
i__28881 = G__29423;
continue;
} else {
var p = cljs.core.first(seq__28878__$1);
promesa.protocols._fnly(promesa.protocols._promise(p),((function (seq__28878,chunk__28879,count__28880,i__28881,p,seq__28878__$1,temp__5825__auto__,items,state,lock){
return (function (v,exception){
lock.promesa$protocols$ILock$_lock_BANG_$arity$1(null);

try{if(cljs.core.truth_(exception)){
if(cljs.core.truth_(new cljs.core.Keyword(null,"resolved?","resolved?",862515389).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state)))){
return null;
} else {
var state__$1 = state.cljs$core$IVolatile$_vreset_BANG_$arity$2(null,((function (seq__28878,chunk__28879,count__28880,i__28881,p,seq__28878__$1,temp__5825__auto__,items,state,lock){
return (function (state__$1){
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(cljs.core.update.cljs$core$IFn$_invoke$arity$4(state__$1,new cljs.core.Keyword(null,"pending","pending",-220036727),cljs.core.disj,p),new cljs.core.Keyword(null,"rejections","rejections",-1620899911),cljs.core.conj,exception);
});})(seq__28878,chunk__28879,count__28880,i__28881,p,seq__28878__$1,temp__5825__auto__,items,state,lock))
(state.cljs$core$IDeref$_deref$arity$1(null)));
if(cljs.core.seq(new cljs.core.Keyword(null,"pending","pending",-220036727).cljs$core$IFn$_invoke$arity$1(state__$1))){
return null;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(default$,new cljs.core.Keyword("promesa.core","default","promesa.core/default",1773193826))){
var G__28944 = cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("No promises resolved",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"rejections","rejections",-1620899911),new cljs.core.Keyword(null,"rejections","rejections",-1620899911).cljs$core$IFn$_invoke$arity$1(state__$1)], null));
return (reject.cljs$core$IFn$_invoke$arity$1 ? reject.cljs$core$IFn$_invoke$arity$1(G__28944) : reject.call(null,G__28944));
} else {
return (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(default$) : resolve.call(null,default$));
}
}
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"resolved?","resolved?",862515389).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(state)))){
return null;
} else {
var map__28955 = state.cljs$core$IVolatile$_vreset_BANG_$arity$2(null,((function (seq__28878,chunk__28879,count__28880,i__28881,p,seq__28878__$1,temp__5825__auto__,items,state,lock){
return (function (state__$1){
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(state__$1,new cljs.core.Keyword(null,"resolved?","resolved?",862515389),true),new cljs.core.Keyword(null,"pending","pending",-220036727),cljs.core.disj,p);
});})(seq__28878,chunk__28879,count__28880,i__28881,p,seq__28878__$1,temp__5825__auto__,items,state,lock))
(state.cljs$core$IDeref$_deref$arity$1(null)));
var map__28955__$1 = cljs.core.__destructure_map(map__28955);
var pending = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28955__$1,new cljs.core.Keyword(null,"pending","pending",-220036727));
return (resolve.cljs$core$IFn$_invoke$arity$1 ? resolve.cljs$core$IFn$_invoke$arity$1(v) : resolve.call(null,v));
}
}
}finally {lock.promesa$protocols$ILock$_unlock_BANG_$arity$1(null);
}});})(seq__28878,chunk__28879,count__28880,i__28881,p,seq__28878__$1,temp__5825__auto__,items,state,lock))
);


var G__29433 = cljs.core.next(seq__28878__$1);
var G__29434 = null;
var G__29435 = (0);
var G__29436 = (0);
seq__28878 = G__29433;
chunk__28879 = G__29434;
count__28880 = G__29435;
i__28881 = G__29436;
continue;
}
} else {
return null;
}
}
break;
}
}));
}));

(promesa.core.any.cljs$lang$maxFixedArity = 2);

/**
 * Given an array of promises, return a promise that is fulfilled when
 *   all the items in the array are resolved (independently if
 *   successfully or exceptionally).
 * 
 *   Example:
 * 
 *   ```
 *   (->> (p/wait-all* [(promise :first-promise)
 *                   (promise :second-promise)])
 *     (p/fmap (fn [_]
 *               (println "done"))))
 *   ```
 * 
 *   Rejected promises also counts as resolved.
 */
promesa.core.wait_all_STAR_ = (function promesa$core$wait_all_STAR_(promises){
var promises__$1 = cljs.core.set(promises);
var total = cljs.core.count(promises__$1);
var prom = promesa.core.deferred();
if((total > (0))){
var counter_29438 = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(total);
cljs.core.run_BANG_((function (p1__28967_SHARP_){
return promesa.protocols._fnly(p1__28967_SHARP_,(function (_,___$1){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((0),cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(counter_29438,cljs.core.dec))){
return promesa.protocols._resolve_BANG_(prom,null);
} else {
return null;
}
}));
}),promises__$1);
} else {
promesa.protocols._resolve_BANG_(prom,null);
}

return prom;
});
/**
 * Given a variable number of promises, returns a promise which resolves
 *   to `nil` when all provided promises complete (rejected or resolved).
 * 
 *   **EXPERIMENTAL**
 */
promesa.core.wait_all = (function promesa$core$wait_all(var_args){
var args__5903__auto__ = [];
var len__5897__auto___29439 = arguments.length;
var i__5898__auto___29440 = (0);
while(true){
if((i__5898__auto___29440 < len__5897__auto___29439)){
args__5903__auto__.push((arguments[i__5898__auto___29440]));

var G__29441 = (i__5898__auto___29440 + (1));
i__5898__auto___29440 = G__29441;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return promesa.core.wait_all.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(promesa.core.wait_all.cljs$core$IFn$_invoke$arity$variadic = (function (promises){
return promesa.core.wait_all_STAR_(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,promises));
}));

(promesa.core.wait_all.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(promesa.core.wait_all.cljs$lang$applyTo = (function (seq28974){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq28974));
}));

/**
 * A promise aware run! function. Executed in terms of `then` rules.
 */
promesa.core.run_BANG_ = (function promesa$core$run_BANG_(var_args){
var G__29000 = arguments.length;
switch (G__29000) {
case 2:
return promesa.core.run_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.run_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.run_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (f,coll){
return promesa.protocols._fmap(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (p1__28990_SHARP_,p2__28991_SHARP_){
return promesa.core.then.cljs$core$IFn$_invoke$arity$2(p1__28990_SHARP_,(function (_){
return (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(p2__28991_SHARP_) : f.call(null,p2__28991_SHARP_));
}));
}),promesa.impl.resolved(null),coll),cljs.core.constantly(null));
}));

(promesa.core.run_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (f,coll,executor){
return promesa.protocols._fmap(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (p1__28992_SHARP_,p2__28993_SHARP_){
return promesa.core.then.cljs$core$IFn$_invoke$arity$3(p1__28992_SHARP_,(function (_){
return (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(p2__28993_SHARP_) : f.call(null,p2__28993_SHARP_));
}),executor);
}),promesa.impl.resolved(null),coll),cljs.core.constantly(null));
}));

(promesa.core.run_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Cancel the promise.
 */
promesa.core.cancel_BANG_ = (function promesa$core$cancel_BANG_(p){
promesa.protocols._cancel_BANG_(p);

return p;
});
/**
 * Return true if `v` is a cancelled promise.
 */
promesa.core.cancelled_QMARK_ = (function promesa$core$cancelled_QMARK_(v){
return promesa.protocols._cancelled_QMARK_(v);
});
/**
 * Resolve a completable promise with a value.
 */
promesa.core.resolve_BANG_ = (function promesa$core$resolve_BANG_(var_args){
var G__29014 = arguments.length;
switch (G__29014) {
case 1:
return promesa.core.resolve_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return promesa.core.resolve_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.resolve_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (o){
return promesa.protocols._resolve_BANG_(o,null);
}));

(promesa.core.resolve_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (o,v){
return promesa.protocols._resolve_BANG_(o,v);
}));

(promesa.core.resolve_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Reject a completable promise with an error.
 */
promesa.core.reject_BANG_ = (function promesa$core$reject_BANG_(p,e){
return promesa.protocols._reject_BANG_(p,e);
});
/**
 * Given a function that accepts a callback as the last argument, return a
 *   function that returns a promise. Callback is expected to take one
 *   parameter (result of a computation).
 */
promesa.core.promisify = (function promesa$core$promisify(callable){
return (function() { 
var G__29449__delegate = function (args){
return promesa.core.create.cljs$core$IFn$_invoke$arity$1((function (resolve,reject){
var args__$1 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(cljs.core.vec(args),resolve);
try{return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(callable,args__$1);
}catch (e29024){if((e29024 instanceof Error)){
var e = e29024;
return (reject.cljs$core$IFn$_invoke$arity$1 ? reject.cljs$core$IFn$_invoke$arity$1(e) : reject.call(null,e));
} else {
throw e29024;

}
}}));
};
var G__29449 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__29453__i = 0, G__29453__a = new Array(arguments.length -  0);
while (G__29453__i < G__29453__a.length) {G__29453__a[G__29453__i] = arguments[G__29453__i + 0]; ++G__29453__i;}
  args = new cljs.core.IndexedSeq(G__29453__a,0,null);
} 
return G__29449__delegate.call(this,args);};
G__29449.cljs$lang$maxFixedArity = 0;
G__29449.cljs$lang$applyTo = (function (arglist__29454){
var args = cljs.core.seq(arglist__29454);
return G__29449__delegate(args);
});
G__29449.cljs$core$IFn$_invoke$arity$variadic = G__29449__delegate;
return G__29449;
})()
;
});
/**
 * @constructor
 */
promesa.core.TimeoutException = (function promesa$core$TimeoutException(message){
var it = this;
Error.call(it,message,cljs.core.PersistentArrayMap.EMPTY,null);

return it;
});
goog.inherits(promesa.core.TimeoutException,Error);
/**
 * Returns a cancellable promise that will be fulfilled with this
 *   promise's fulfillment value or rejection reason.  However, if this
 *   promise is not fulfilled or rejected within `ms` milliseconds, the
 *   returned promise is cancelled with a TimeoutError.
 */
promesa.core.timeout = (function promesa$core$timeout(var_args){
var G__29038 = arguments.length;
switch (G__29038) {
case 2:
return promesa.core.timeout.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.timeout.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return promesa.core.timeout.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.timeout.cljs$core$IFn$_invoke$arity$2 = (function (p,t){
return promesa.core.timeout.cljs$core$IFn$_invoke$arity$4(p,t,new cljs.core.Keyword("promesa.core","default","promesa.core/default",1773193826),new cljs.core.Keyword(null,"default","default",-1987822328));
}));

(promesa.core.timeout.cljs$core$IFn$_invoke$arity$3 = (function (p,t,v){
return promesa.core.timeout.cljs$core$IFn$_invoke$arity$4(p,t,v,new cljs.core.Keyword(null,"default","default",-1987822328));
}));

(promesa.core.timeout.cljs$core$IFn$_invoke$arity$4 = (function (p,t,v,scheduler){
var timeout = promesa.core.deferred();
var tid = promesa.exec.schedule_BANG_.cljs$core$IFn$_invoke$arity$3(scheduler,t,(function (){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(v,new cljs.core.Keyword("promesa.core","default","promesa.core/default",1773193826))){
return promesa.core.reject_BANG_(timeout,(new promesa.core.TimeoutException("Operation timed out.")));
} else {
return promesa.core.resolve_BANG_.cljs$core$IFn$_invoke$arity$2(timeout,v);
}
}));
return promesa.core.race(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [promesa.core.fnly.cljs$core$IFn$_invoke$arity$2((function (_,___$1){
return promesa.protocols._cancel_BANG_(tid);
}),p),timeout], null));
}));

(promesa.core.timeout.cljs$lang$maxFixedArity = 4);

/**
 * Given a timeout in miliseconds and optional value, returns a promise
 *   that will be fulfilled with provided value (or nil) after the time is
 *   reached.
 */
promesa.core.delay = (function promesa$core$delay(var_args){
var G__29051 = arguments.length;
switch (G__29051) {
case 1:
return promesa.core.delay.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return promesa.core.delay.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return promesa.core.delay.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.delay.cljs$core$IFn$_invoke$arity$1 = (function (t){
return promesa.core.delay.cljs$core$IFn$_invoke$arity$3(t,null,new cljs.core.Keyword(null,"default","default",-1987822328));
}));

(promesa.core.delay.cljs$core$IFn$_invoke$arity$2 = (function (t,v){
return promesa.core.delay.cljs$core$IFn$_invoke$arity$3(t,v,new cljs.core.Keyword(null,"default","default",-1987822328));
}));

(promesa.core.delay.cljs$core$IFn$_invoke$arity$3 = (function (t,v,scheduler){
var d = promesa.core.deferred();
promesa.exec.schedule_BANG_.cljs$core$IFn$_invoke$arity$3(scheduler,t,(function (){
return promesa.core.resolve_BANG_.cljs$core$IFn$_invoke$arity$2(d,v);
}));

return d;
}));

(promesa.core.delay.cljs$lang$maxFixedArity = 3);

/**
 * Analogous to `clojure.core.async/thread` that returns a promise
 *   instance instead of the `Future`. Useful for executing synchronous
 *   code in a separate thread (also works in cljs).
 */
promesa.core.thread_call = (function promesa$core$thread_call(var_args){
var G__29077 = arguments.length;
switch (G__29077) {
case 1:
return promesa.core.thread_call.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return promesa.core.thread_call.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(promesa.core.thread_call.cljs$core$IFn$_invoke$arity$1 = (function (f){
return promesa.exec.submit_BANG_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"thread","thread",947001524),promesa.exec.wrap_bindings(f));
}));

(promesa.core.thread_call.cljs$core$IFn$_invoke$arity$2 = (function (executor,f){
return promesa.exec.submit_BANG_.cljs$core$IFn$_invoke$arity$2(executor,promesa.exec.wrap_bindings(f));
}));

(promesa.core.thread_call.cljs$lang$maxFixedArity = 2);

/**
 * A shortcut for `(p/thread-call :vthread f)`.
 */
promesa.core.vthread_call = (function promesa$core$vthread_call(f){
return promesa.core.thread_call.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"vthread","vthread",441141075),f);
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
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
promesa.core.Recur = (function (bindings,__meta,__extmap,__hash){
this.bindings = bindings;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(promesa.core.Recur.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(promesa.core.Recur.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k29088,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__29098 = k29088;
var G__29098__$1 = (((G__29098 instanceof cljs.core.Keyword))?G__29098.fqn:null);
switch (G__29098__$1) {
case "bindings":
return self__.bindings;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k29088,else__5472__auto__);

}
}));

(promesa.core.Recur.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__29102){
var vec__29103 = p__29102;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29103,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29103,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(promesa.core.Recur.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#promesa.core.Recur{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"bindings","bindings",1271397192),self__.bindings],null))], null),self__.__extmap));
}));

(promesa.core.Recur.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__29087){
var self__ = this;
var G__29087__$1 = this;
return (new cljs.core.RecordIter((0),G__29087__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"bindings","bindings",1271397192)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(promesa.core.Recur.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(promesa.core.Recur.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new promesa.core.Recur(self__.bindings,self__.__meta,self__.__extmap,self__.__hash));
}));

(promesa.core.Recur.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(promesa.core.Recur.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-404494900 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(promesa.core.Recur.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this29089,other29090){
var self__ = this;
var this29089__$1 = this;
return (((!((other29090 == null)))) && ((((this29089__$1.constructor === other29090.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29089__$1.bindings,other29090.bindings)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29089__$1.__extmap,other29090.__extmap)))))));
}));

(promesa.core.Recur.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"bindings","bindings",1271397192),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new promesa.core.Recur(self__.bindings,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(promesa.core.Recur.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k29088){
var self__ = this;
var this__5476__auto____$1 = this;
var G__29119 = k29088;
var G__29119__$1 = (((G__29119 instanceof cljs.core.Keyword))?G__29119.fqn:null);
switch (G__29119__$1) {
case "bindings":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k29088);

}
}));

(promesa.core.Recur.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__29087){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__29123 = cljs.core.keyword_identical_QMARK_;
var expr__29124 = k__5478__auto__;
if(cljs.core.truth_((pred__29123.cljs$core$IFn$_invoke$arity$2 ? pred__29123.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"bindings","bindings",1271397192),expr__29124) : pred__29123.call(null,new cljs.core.Keyword(null,"bindings","bindings",1271397192),expr__29124)))){
return (new promesa.core.Recur(G__29087,self__.__meta,self__.__extmap,null));
} else {
return (new promesa.core.Recur(self__.bindings,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__29087),null));
}
}));

(promesa.core.Recur.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"bindings","bindings",1271397192),self__.bindings,null))], null),self__.__extmap));
}));

(promesa.core.Recur.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__29087){
var self__ = this;
var this__5468__auto____$1 = this;
return (new promesa.core.Recur(self__.bindings,G__29087,self__.__extmap,self__.__hash));
}));

(promesa.core.Recur.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(promesa.core.Recur.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"bindings","bindings",-1383038577,null)], null);
}));

(promesa.core.Recur.cljs$lang$type = true);

(promesa.core.Recur.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"promesa.core/Recur",null,(1),null));
}));

(promesa.core.Recur.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"promesa.core/Recur");
}));

/**
 * Positional factory function for promesa.core/Recur.
 */
promesa.core.__GT_Recur = (function promesa$core$__GT_Recur(bindings){
return (new promesa.core.Recur(bindings,null,null,null));
});

/**
 * Factory function for promesa.core/Recur, taking a map of keywords to field values.
 */
promesa.core.map__GT_Recur = (function promesa$core$map__GT_Recur(G__29091){
var extmap__5511__auto__ = (function (){var G__29138 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__29091,new cljs.core.Keyword(null,"bindings","bindings",1271397192));
if(cljs.core.record_QMARK_(G__29091)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__29138);
} else {
return G__29138;
}
})();
return (new promesa.core.Recur(new cljs.core.Keyword(null,"bindings","bindings",1271397192).cljs$core$IFn$_invoke$arity$1(G__29091),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

promesa.core.recur_QMARK_ = (function promesa$core$recur_QMARK_(o){
return (o instanceof promesa.core.Recur);
});

//# sourceMappingURL=promesa.core.js.map
