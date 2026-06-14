import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('malli.registry');
/**
 * @define {string}
 * @type {string}
 */
malli.registry.mode = goog.define("malli.registry.mode","default");
/**
 * @define {string}
 * @type {string}
 */
malli.registry.type = goog.define("malli.registry.type","default");

/**
 * @interface
 */
malli.registry.Registry = function(){};

var malli$registry$Registry$_schema$dyn_17656 = (function (this$,type){
var x__5519__auto__ = (((this$ == null))?null:this$);
var m__5520__auto__ = (malli.registry._schema[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(this$,type) : m__5520__auto__.call(null,this$,type));
} else {
var m__5518__auto__ = (malli.registry._schema["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(this$,type) : m__5518__auto__.call(null,this$,type));
} else {
throw cljs.core.missing_protocol("Registry.-schema",this$);
}
}
});
/**
 * returns the schema from a registry
 */
malli.registry._schema = (function malli$registry$_schema(this$,type){
if((((!((this$ == null)))) && ((!((this$.malli$registry$Registry$_schema$arity$2 == null)))))){
return this$.malli$registry$Registry$_schema$arity$2(this$,type);
} else {
return malli$registry$Registry$_schema$dyn_17656(this$,type);
}
});

var malli$registry$Registry$_schemas$dyn_17666 = (function (this$){
var x__5519__auto__ = (((this$ == null))?null:this$);
var m__5520__auto__ = (malli.registry._schemas[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5520__auto__.call(null,this$));
} else {
var m__5518__auto__ = (malli.registry._schemas["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(this$) : m__5518__auto__.call(null,this$));
} else {
throw cljs.core.missing_protocol("Registry.-schemas",this$);
}
}
});
/**
 * returns all schemas from a registry
 */
malli.registry._schemas = (function malli$registry$_schemas(this$){
if((((!((this$ == null)))) && ((!((this$.malli$registry$Registry$_schemas$arity$1 == null)))))){
return this$.malli$registry$Registry$_schemas$arity$1(this$);
} else {
return malli$registry$Registry$_schemas$dyn_17666(this$);
}
});

malli.registry.registry_QMARK_ = (function malli$registry$registry_QMARK_(x){
if((!((x == null)))){
if(((false) || ((cljs.core.PROTOCOL_SENTINEL === x.malli$registry$Registry$)))){
return true;
} else {
return false;
}
} else {
return false;
}
});

/**
* @constructor
 * @implements {malli.registry.Registry}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
malli.registry.t_malli$registry17437 = (function (m,fm,meta17438){
this.m = m;
this.fm = fm;
this.meta17438 = meta17438;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(malli.registry.t_malli$registry17437.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_17439,meta17438__$1){
var self__ = this;
var _17439__$1 = this;
return (new malli.registry.t_malli$registry17437(self__.m,self__.fm,meta17438__$1));
}));

(malli.registry.t_malli$registry17437.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_17439){
var self__ = this;
var _17439__$1 = this;
return self__.meta17438;
}));

(malli.registry.t_malli$registry17437.prototype.malli$registry$Registry$ = cljs.core.PROTOCOL_SENTINEL);

(malli.registry.t_malli$registry17437.prototype.malli$registry$Registry$_schema$arity$2 = (function (_,type){
var self__ = this;
var ___$1 = this;
return self__.fm.get(type);
}));

(malli.registry.t_malli$registry17437.prototype.malli$registry$Registry$_schemas$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.m;
}));

(malli.registry.t_malli$registry17437.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"m","m",-1021758608,null),new cljs.core.Symbol(null,"fm","fm",-1190690268,null),new cljs.core.Symbol(null,"meta17438","meta17438",-2080262844,null)], null);
}));

(malli.registry.t_malli$registry17437.cljs$lang$type = true);

(malli.registry.t_malli$registry17437.cljs$lang$ctorStr = "malli.registry/t_malli$registry17437");

(malli.registry.t_malli$registry17437.cljs$lang$ctorPrWriter = (function (this__5455__auto__,writer__5456__auto__,opt__5457__auto__){
return cljs.core._write(writer__5456__auto__,"malli.registry/t_malli$registry17437");
}));

/**
 * Positional factory function for malli.registry/t_malli$registry17437.
 */
malli.registry.__GT_t_malli$registry17437 = (function malli$registry$__GT_t_malli$registry17437(m,fm,meta17438){
return (new malli.registry.t_malli$registry17437(m,fm,meta17438));
});


malli.registry.fast_registry = (function malli$registry$fast_registry(m){
var fm = m;
return (new malli.registry.t_malli$registry17437(m,fm,cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {malli.registry.Registry}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
malli.registry.t_malli$registry17449 = (function (m,meta17450){
this.m = m;
this.meta17450 = meta17450;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(malli.registry.t_malli$registry17449.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_17451,meta17450__$1){
var self__ = this;
var _17451__$1 = this;
return (new malli.registry.t_malli$registry17449(self__.m,meta17450__$1));
}));

(malli.registry.t_malli$registry17449.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_17451){
var self__ = this;
var _17451__$1 = this;
return self__.meta17450;
}));

(malli.registry.t_malli$registry17449.prototype.malli$registry$Registry$ = cljs.core.PROTOCOL_SENTINEL);

(malli.registry.t_malli$registry17449.prototype.malli$registry$Registry$_schema$arity$2 = (function (_,type){
var self__ = this;
var ___$1 = this;
return (self__.m.cljs$core$IFn$_invoke$arity$1 ? self__.m.cljs$core$IFn$_invoke$arity$1(type) : self__.m.call(null,type));
}));

(malli.registry.t_malli$registry17449.prototype.malli$registry$Registry$_schemas$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.m;
}));

(malli.registry.t_malli$registry17449.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"m","m",-1021758608,null),new cljs.core.Symbol(null,"meta17450","meta17450",1118014411,null)], null);
}));

(malli.registry.t_malli$registry17449.cljs$lang$type = true);

(malli.registry.t_malli$registry17449.cljs$lang$ctorStr = "malli.registry/t_malli$registry17449");

(malli.registry.t_malli$registry17449.cljs$lang$ctorPrWriter = (function (this__5455__auto__,writer__5456__auto__,opt__5457__auto__){
return cljs.core._write(writer__5456__auto__,"malli.registry/t_malli$registry17449");
}));

/**
 * Positional factory function for malli.registry/t_malli$registry17449.
 */
malli.registry.__GT_t_malli$registry17449 = (function malli$registry$__GT_t_malli$registry17449(m,meta17450){
return (new malli.registry.t_malli$registry17449(m,meta17450));
});


malli.registry.simple_registry = (function malli$registry$simple_registry(m){
return (new malli.registry.t_malli$registry17449(m,cljs.core.PersistentArrayMap.EMPTY));
});
malli.registry.registry = (function malli$registry$registry(_QMARK_registry){
if((_QMARK_registry == null)){
return null;
} else {
if(malli.registry.registry_QMARK_(_QMARK_registry)){
return _QMARK_registry;
} else {
if(cljs.core.map_QMARK_(_QMARK_registry)){
return malli.registry.simple_registry(_QMARK_registry);
} else {
if((((!((_QMARK_registry == null))))?((((false) || ((cljs.core.PROTOCOL_SENTINEL === _QMARK_registry.malli$registry$Registry$))))?true:(((!_QMARK_registry.cljs$lang$protocol_mask$partition$))?cljs.core.native_satisfies_QMARK_(malli.registry.Registry,_QMARK_registry):false)):cljs.core.native_satisfies_QMARK_(malli.registry.Registry,_QMARK_registry))){
return _QMARK_registry;
} else {
return null;
}
}
}
}
});
malli.registry.registry_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(malli.registry.simple_registry(cljs.core.PersistentArrayMap.EMPTY));
malli.registry.set_default_registry_BANG_ = (function malli$registry$set_default_registry_BANG_(_QMARK_registry){
if((!((malli.registry.mode === "strict")))){
return cljs.core.reset_BANG_(malli.registry.registry_STAR_,malli.registry.registry(_QMARK_registry));
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("can't set default registry, invalid mode",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"mode","mode",654403691),malli.registry.mode,new cljs.core.Keyword(null,"type","type",1174270348),malli.registry.type], null));
}
});

/**
* @constructor
 * @implements {malli.registry.Registry}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
malli.registry.t_malli$registry17480 = (function (meta17481){
this.meta17481 = meta17481;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(malli.registry.t_malli$registry17480.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_17482,meta17481__$1){
var self__ = this;
var _17482__$1 = this;
return (new malli.registry.t_malli$registry17480(meta17481__$1));
}));

(malli.registry.t_malli$registry17480.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_17482){
var self__ = this;
var _17482__$1 = this;
return self__.meta17481;
}));

(malli.registry.t_malli$registry17480.prototype.malli$registry$Registry$ = cljs.core.PROTOCOL_SENTINEL);

(malli.registry.t_malli$registry17480.prototype.malli$registry$Registry$_schema$arity$2 = (function (_,type){
var self__ = this;
var ___$1 = this;
return malli.registry._schema(cljs.core.deref(malli.registry.registry_STAR_),type);
}));

(malli.registry.t_malli$registry17480.prototype.malli$registry$Registry$_schemas$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return malli.registry._schemas(cljs.core.deref(malli.registry.registry_STAR_));
}));

(malli.registry.t_malli$registry17480.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"meta17481","meta17481",1948834947,null)], null);
}));

(malli.registry.t_malli$registry17480.cljs$lang$type = true);

(malli.registry.t_malli$registry17480.cljs$lang$ctorStr = "malli.registry/t_malli$registry17480");

(malli.registry.t_malli$registry17480.cljs$lang$ctorPrWriter = (function (this__5455__auto__,writer__5456__auto__,opt__5457__auto__){
return cljs.core._write(writer__5456__auto__,"malli.registry/t_malli$registry17480");
}));

/**
 * Positional factory function for malli.registry/t_malli$registry17480.
 */
malli.registry.__GT_t_malli$registry17480 = (function malli$registry$__GT_t_malli$registry17480(meta17481){
return (new malli.registry.t_malli$registry17480(meta17481));
});


malli.registry.custom_default_registry = (function malli$registry$custom_default_registry(){
return (new malli.registry.t_malli$registry17480(cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {malli.registry.Registry}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
malli.registry.t_malli$registry17506 = (function (_QMARK_registries,registries,meta17507){
this._QMARK_registries = _QMARK_registries;
this.registries = registries;
this.meta17507 = meta17507;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(malli.registry.t_malli$registry17506.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_17508,meta17507__$1){
var self__ = this;
var _17508__$1 = this;
return (new malli.registry.t_malli$registry17506(self__._QMARK_registries,self__.registries,meta17507__$1));
}));

(malli.registry.t_malli$registry17506.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_17508){
var self__ = this;
var _17508__$1 = this;
return self__.meta17507;
}));

(malli.registry.t_malli$registry17506.prototype.malli$registry$Registry$ = cljs.core.PROTOCOL_SENTINEL);

(malli.registry.t_malli$registry17506.prototype.malli$registry$Registry$_schema$arity$2 = (function (_,type){
var self__ = this;
var ___$1 = this;
return cljs.core.some((function (p1__17497_SHARP_){
return malli.registry._schema(p1__17497_SHARP_,type);
}),self__.registries);
}));

(malli.registry.t_malli$registry17506.prototype.malli$registry$Registry$_schemas$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$2(cljs.core.merge,cljs.core.map.cljs$core$IFn$_invoke$arity$2(malli.registry._schemas,cljs.core.reverse(self__.registries)));
}));

(malli.registry.t_malli$registry17506.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"?registries","?registries",2135368100,null),new cljs.core.Symbol(null,"registries","registries",-1366064418,null),new cljs.core.Symbol(null,"meta17507","meta17507",1694017443,null)], null);
}));

(malli.registry.t_malli$registry17506.cljs$lang$type = true);

(malli.registry.t_malli$registry17506.cljs$lang$ctorStr = "malli.registry/t_malli$registry17506");

(malli.registry.t_malli$registry17506.cljs$lang$ctorPrWriter = (function (this__5455__auto__,writer__5456__auto__,opt__5457__auto__){
return cljs.core._write(writer__5456__auto__,"malli.registry/t_malli$registry17506");
}));

/**
 * Positional factory function for malli.registry/t_malli$registry17506.
 */
malli.registry.__GT_t_malli$registry17506 = (function malli$registry$__GT_t_malli$registry17506(_QMARK_registries,registries,meta17507){
return (new malli.registry.t_malli$registry17506(_QMARK_registries,registries,meta17507));
});


malli.registry.composite_registry = (function malli$registry$composite_registry(var_args){
var args__5903__auto__ = [];
var len__5897__auto___17762 = arguments.length;
var i__5898__auto___17765 = (0);
while(true){
if((i__5898__auto___17765 < len__5897__auto___17762)){
args__5903__auto__.push((arguments[i__5898__auto___17765]));

var G__17766 = (i__5898__auto___17765 + (1));
i__5898__auto___17765 = G__17766;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return malli.registry.composite_registry.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(malli.registry.composite_registry.cljs$core$IFn$_invoke$arity$variadic = (function (_QMARK_registries){
var registries = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(malli.registry.registry,_QMARK_registries);
return (new malli.registry.t_malli$registry17506(_QMARK_registries,registries,cljs.core.PersistentArrayMap.EMPTY));
}));

(malli.registry.composite_registry.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(malli.registry.composite_registry.cljs$lang$applyTo = (function (seq17499){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq17499));
}));


/**
* @constructor
 * @implements {malli.registry.Registry}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
malli.registry.t_malli$registry17522 = (function (db,meta17523){
this.db = db;
this.meta17523 = meta17523;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(malli.registry.t_malli$registry17522.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_17524,meta17523__$1){
var self__ = this;
var _17524__$1 = this;
return (new malli.registry.t_malli$registry17522(self__.db,meta17523__$1));
}));

(malli.registry.t_malli$registry17522.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_17524){
var self__ = this;
var _17524__$1 = this;
return self__.meta17523;
}));

(malli.registry.t_malli$registry17522.prototype.malli$registry$Registry$ = cljs.core.PROTOCOL_SENTINEL);

(malli.registry.t_malli$registry17522.prototype.malli$registry$Registry$_schema$arity$2 = (function (_,type){
var self__ = this;
var ___$1 = this;
return malli.registry._schema(malli.registry.registry(cljs.core.deref(self__.db)),type);
}));

(malli.registry.t_malli$registry17522.prototype.malli$registry$Registry$_schemas$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return malli.registry._schemas(malli.registry.registry(cljs.core.deref(self__.db)));
}));

(malli.registry.t_malli$registry17522.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"db","db",-1661185010,null),new cljs.core.Symbol(null,"meta17523","meta17523",1551106328,null)], null);
}));

(malli.registry.t_malli$registry17522.cljs$lang$type = true);

(malli.registry.t_malli$registry17522.cljs$lang$ctorStr = "malli.registry/t_malli$registry17522");

(malli.registry.t_malli$registry17522.cljs$lang$ctorPrWriter = (function (this__5455__auto__,writer__5456__auto__,opt__5457__auto__){
return cljs.core._write(writer__5456__auto__,"malli.registry/t_malli$registry17522");
}));

/**
 * Positional factory function for malli.registry/t_malli$registry17522.
 */
malli.registry.__GT_t_malli$registry17522 = (function malli$registry$__GT_t_malli$registry17522(db,meta17523){
return (new malli.registry.t_malli$registry17522(db,meta17523));
});


malli.registry.mutable_registry = (function malli$registry$mutable_registry(db){
return (new malli.registry.t_malli$registry17522(db,cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {malli.registry.Registry}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
malli.registry.t_malli$registry17541 = (function (meta17542){
this.meta17542 = meta17542;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(malli.registry.t_malli$registry17541.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_17543,meta17542__$1){
var self__ = this;
var _17543__$1 = this;
return (new malli.registry.t_malli$registry17541(meta17542__$1));
}));

(malli.registry.t_malli$registry17541.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_17543){
var self__ = this;
var _17543__$1 = this;
return self__.meta17542;
}));

(malli.registry.t_malli$registry17541.prototype.malli$registry$Registry$ = cljs.core.PROTOCOL_SENTINEL);

(malli.registry.t_malli$registry17541.prototype.malli$registry$Registry$_schema$arity$2 = (function (_,type){
var self__ = this;
var ___$1 = this;
if(cljs.core.var_QMARK_(type)){
return cljs.core.deref(type);
} else {
return null;
}
}));

(malli.registry.t_malli$registry17541.prototype.malli$registry$Registry$_schemas$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return null;
}));

(malli.registry.t_malli$registry17541.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"meta17542","meta17542",-844870564,null)], null);
}));

(malli.registry.t_malli$registry17541.cljs$lang$type = true);

(malli.registry.t_malli$registry17541.cljs$lang$ctorStr = "malli.registry/t_malli$registry17541");

(malli.registry.t_malli$registry17541.cljs$lang$ctorPrWriter = (function (this__5455__auto__,writer__5456__auto__,opt__5457__auto__){
return cljs.core._write(writer__5456__auto__,"malli.registry/t_malli$registry17541");
}));

/**
 * Positional factory function for malli.registry/t_malli$registry17541.
 */
malli.registry.__GT_t_malli$registry17541 = (function malli$registry$__GT_t_malli$registry17541(meta17542){
return (new malli.registry.t_malli$registry17541(meta17542));
});


malli.registry.var_registry = (function malli$registry$var_registry(){
return (new malli.registry.t_malli$registry17541(cljs.core.PersistentArrayMap.EMPTY));
});
malli.registry._STAR_registry_STAR_ = cljs.core.PersistentArrayMap.EMPTY;

/**
* @constructor
 * @implements {malli.registry.Registry}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
malli.registry.t_malli$registry17583 = (function (meta17584){
this.meta17584 = meta17584;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(malli.registry.t_malli$registry17583.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_17585,meta17584__$1){
var self__ = this;
var _17585__$1 = this;
return (new malli.registry.t_malli$registry17583(meta17584__$1));
}));

(malli.registry.t_malli$registry17583.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_17585){
var self__ = this;
var _17585__$1 = this;
return self__.meta17584;
}));

(malli.registry.t_malli$registry17583.prototype.malli$registry$Registry$ = cljs.core.PROTOCOL_SENTINEL);

(malli.registry.t_malli$registry17583.prototype.malli$registry$Registry$_schema$arity$2 = (function (_,type){
var self__ = this;
var ___$1 = this;
return malli.registry._schema(malli.registry.registry(malli.registry._STAR_registry_STAR_),type);
}));

(malli.registry.t_malli$registry17583.prototype.malli$registry$Registry$_schemas$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return malli.registry._schemas(malli.registry.registry(malli.registry._STAR_registry_STAR_));
}));

(malli.registry.t_malli$registry17583.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"meta17584","meta17584",-1825234974,null)], null);
}));

(malli.registry.t_malli$registry17583.cljs$lang$type = true);

(malli.registry.t_malli$registry17583.cljs$lang$ctorStr = "malli.registry/t_malli$registry17583");

(malli.registry.t_malli$registry17583.cljs$lang$ctorPrWriter = (function (this__5455__auto__,writer__5456__auto__,opt__5457__auto__){
return cljs.core._write(writer__5456__auto__,"malli.registry/t_malli$registry17583");
}));

/**
 * Positional factory function for malli.registry/t_malli$registry17583.
 */
malli.registry.__GT_t_malli$registry17583 = (function malli$registry$__GT_t_malli$registry17583(meta17584){
return (new malli.registry.t_malli$registry17583(meta17584));
});


malli.registry.dynamic_registry = (function malli$registry$dynamic_registry(){
return (new malli.registry.t_malli$registry17583(cljs.core.PersistentArrayMap.EMPTY));
});

/**
* @constructor
 * @implements {malli.registry.Registry}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.IWithMeta}
*/
malli.registry.t_malli$registry17611 = (function (default_registry,provider,cache_STAR_,registry_STAR_,meta17612){
this.default_registry = default_registry;
this.provider = provider;
this.cache_STAR_ = cache_STAR_;
this.registry_STAR_ = registry_STAR_;
this.meta17612 = meta17612;
this.cljs$lang$protocol_mask$partition0$ = 393216;
this.cljs$lang$protocol_mask$partition1$ = 0;
});
(malli.registry.t_malli$registry17611.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (_17613,meta17612__$1){
var self__ = this;
var _17613__$1 = this;
return (new malli.registry.t_malli$registry17611(self__.default_registry,self__.provider,self__.cache_STAR_,self__.registry_STAR_,meta17612__$1));
}));

(malli.registry.t_malli$registry17611.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_17613){
var self__ = this;
var _17613__$1 = this;
return self__.meta17612;
}));

(malli.registry.t_malli$registry17611.prototype.malli$registry$Registry$ = cljs.core.PROTOCOL_SENTINEL);

(malli.registry.t_malli$registry17611.prototype.malli$registry$Registry$_schema$arity$2 = (function (_,name){
var self__ = this;
var ___$1 = this;
var or__5162__auto__ = (function (){var fexpr__17616 = cljs.core.deref(self__.cache_STAR_);
return (fexpr__17616.cljs$core$IFn$_invoke$arity$1 ? fexpr__17616.cljs$core$IFn$_invoke$arity$1(name) : fexpr__17616.call(null,name));
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var temp__5825__auto__ = (function (){var G__17617 = name;
var G__17618 = cljs.core.deref(self__.registry_STAR_);
return (self__.provider.cljs$core$IFn$_invoke$arity$2 ? self__.provider.cljs$core$IFn$_invoke$arity$2(G__17617,G__17618) : self__.provider.call(null,G__17617,G__17618));
})();
if(cljs.core.truth_(temp__5825__auto__)){
var schema = temp__5825__auto__;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(self__.cache_STAR_,cljs.core.assoc,name,schema);

return schema;
} else {
return null;
}
}
}));

(malli.registry.t_malli$registry17611.prototype.malli$registry$Registry$_schemas$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.deref(self__.cache_STAR_);
}));

(malli.registry.t_malli$registry17611.getBasis = (function (){
return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"default-registry","default-registry",732204441,null),new cljs.core.Symbol(null,"provider","provider",1338474627,null),new cljs.core.Symbol(null,"cache*","cache*",-548597526,null),new cljs.core.Symbol(null,"registry*","registry*",-268031273,null),new cljs.core.Symbol(null,"meta17612","meta17612",1163882750,null)], null);
}));

(malli.registry.t_malli$registry17611.cljs$lang$type = true);

(malli.registry.t_malli$registry17611.cljs$lang$ctorStr = "malli.registry/t_malli$registry17611");

(malli.registry.t_malli$registry17611.cljs$lang$ctorPrWriter = (function (this__5455__auto__,writer__5456__auto__,opt__5457__auto__){
return cljs.core._write(writer__5456__auto__,"malli.registry/t_malli$registry17611");
}));

/**
 * Positional factory function for malli.registry/t_malli$registry17611.
 */
malli.registry.__GT_t_malli$registry17611 = (function malli$registry$__GT_t_malli$registry17611(default_registry,provider,cache_STAR_,registry_STAR_,meta17612){
return (new malli.registry.t_malli$registry17611(default_registry,provider,cache_STAR_,registry_STAR_,meta17612));
});


malli.registry.lazy_registry = (function malli$registry$lazy_registry(default_registry,provider){
var cache_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var registry_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(default_registry);
return cljs.core.reset_BANG_(registry_STAR_,malli.registry.composite_registry.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([default_registry,(new malli.registry.t_malli$registry17611(default_registry,provider,cache_STAR_,registry_STAR_,cljs.core.PersistentArrayMap.EMPTY))], 0)));
});
/**
 * finds a schema from a registry
 */
malli.registry.schema = (function malli$registry$schema(registry,type){
return malli.registry._schema(registry,type);
});
/**
 * finds all schemas from a registry
 */
malli.registry.schemas = (function malli$registry$schemas(registry){
return malli.registry._schemas(registry);
});

//# sourceMappingURL=malli.registry.js.map
