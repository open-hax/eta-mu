import "./cljs_env.js";
import "./cljs.core.js";
import "./honey.sql.js";
goog.provide('honey.sql.helpers');
honey.sql.helpers.default_merge = (function honey$sql$helpers$default_merge(current,args){
var mdata = cljs.core.meta(current);
var current__$1 = (((current == null))?cljs.core.PersistentVector.EMPTY:((cljs.core.sequential_QMARK_(current))?cljs.core.vec(current):new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [current], null)
));
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.with_meta(current__$1,mdata),args);
});
honey.sql.helpers.conjunction_QMARK_ = (function honey$sql$helpers$conjunction_QMARK_(e){
return ((cljs.core.ident_QMARK_(e)) && (cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"or","or",235744169),null,new cljs.core.Keyword(null,"and","and",-971899817),null], null), null),honey.sql.sym__GT_kw(e))));
});
/**
 * For Boolean expressions, simplify the logic to make
 *   the output expression less nested. Finding :and or
 *   :or with a single condition can be lifted. Finding
 *   a conjunction inside the same conjunction can be
 *   merged.
 *   Always called on an expression that begins with a conjunction!
 */
honey.sql.helpers.simplify_logic = (function honey$sql$helpers$simplify_logic(e){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(cljs.core.rest(e)))){
return cljs.core.fnext(e);
} else {
var conjunction = honey.sql.sym__GT_kw(cljs.core.first(e));
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,e__$1){
if(((cljs.core.sequential_QMARK_(e__$1)) && (((honey.sql.helpers.conjunction_QMARK_(cljs.core.first(e__$1))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(conjunction,honey.sql.sym__GT_kw(cljs.core.first(e__$1)))))))){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(acc,cljs.core.rest(e__$1));
} else {
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,e__$1);
}
}),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [conjunction], null),cljs.core.rest(e));
}
});
honey.sql.helpers.ident_or_seq_QMARK_ = (function honey$sql$helpers$ident_or_seq_QMARK_(x){
return ((cljs.core.ident_QMARK_(x)) || (cljs.core.seq(x)));
});
/**
 * Merge for where/having. We ignore nil expressions.
 *   By default, we combine with AND unless the new expression
 *   begins with a conjunction, in which case use that to
 *   combine the new expression. Then we perform some
 *   simplifications to reduce nesting.
 */
honey.sql.helpers.conjunction_merge = (function honey$sql$helpers$conjunction_merge(current,args){
var args__$1 = cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,args);
var vec__30535 = ((honey.sql.helpers.conjunction_QMARK_(cljs.core.first(args__$1)))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.first(args__$1),cljs.core.rest(args__$1)], null):((((cljs.core.ident_QMARK_(cljs.core.first(args__$1))) && (((1) < cljs.core.count(args__$1)))))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"and","and",-971899817),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [args__$1], null)], null):new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"and","and",-971899817),args__$1], null)
));
var conjunction = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30535,(0),null);
var args__$2 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30535,(1),null);
if(cljs.core.seq(args__$2)){
return honey.sql.helpers.simplify_logic(cljs.core.into.cljs$core$IFn$_invoke$arity$2((function (){var G__30539 = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [conjunction], null);
if(honey.sql.helpers.ident_or_seq_QMARK_(current)){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__30539,current);
} else {
return G__30539;
}
})(),args__$2));
} else {
return current;
}
});
/**
 * Since the first argument in a group is special, we
 *   need to merge that, and then merge the other args.
 */
honey.sql.helpers.select_distinct_on_merge = (function honey$sql$helpers$select_distinct_on_merge(p__30544,p__30545){
var vec__30546 = p__30544;
var seq__30547 = cljs.core.seq(vec__30546);
var first__30548 = cljs.core.first(seq__30547);
var seq__30547__$1 = cljs.core.next(seq__30547);
var c_on = first__30548;
var current = seq__30547__$1;
var vec__30549 = p__30545;
var seq__30550 = cljs.core.seq(vec__30549);
var first__30551 = cljs.core.first(seq__30550);
var seq__30550__$1 = cljs.core.next(seq__30550);
var a_on = first__30551;
var args = seq__30550__$1;
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.into.cljs$core$IFn$_invoke$arity$2((new cljs.core.PersistentVector(null,1,(5),cljs.core.PersistentVector.EMPTY_NODE,[cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.vec(c_on),a_on)],null)),current),args);
});
/**
 * Identify the conjunction merge clauses.
 */
honey.sql.helpers.special_merges = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"select-distinct-on","select-distinct-on",1224000227),honey.sql.helpers.select_distinct_on_merge,new cljs.core.Keyword(null,"where","where",-2044795965),honey.sql.helpers.conjunction_merge,new cljs.core.Keyword(null,"having","having",-399543166),honey.sql.helpers.conjunction_merge], null);
honey.sql.helpers.helper_merge = (function honey$sql$helpers$helper_merge(data,k,args){
var k_SINGLEQUOTE_ = honey.sql.sym__GT_kw(k);
var k__$1 = honey.sql.kw__GT_sym(k);
var d = cljs.core.get.cljs$core$IFn$_invoke$arity$2(data,k__$1);
var d_SINGLEQUOTE_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(data,k_SINGLEQUOTE_);
var mf = (honey.sql.helpers.special_merges.cljs$core$IFn$_invoke$arity$1 ? honey.sql.helpers.special_merges.cljs$core$IFn$_invoke$arity$1(k_SINGLEQUOTE_) : honey.sql.helpers.special_merges.call(null,k_SINGLEQUOTE_));
var mf_SINGLEQUOTE_ = (function (){var or__5162__auto__ = mf;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return honey.sql.helpers.default_merge;
}
})();
if((!((d == null)))){
var temp__5827__auto__ = (mf_SINGLEQUOTE_.cljs$core$IFn$_invoke$arity$2 ? mf_SINGLEQUOTE_.cljs$core$IFn$_invoke$arity$2(d,args) : mf_SINGLEQUOTE_.call(null,d,args));
if((temp__5827__auto__ == null)){
return data;
} else {
var clause = temp__5827__auto__;
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(data,k__$1,clause);
}
} else {
if((!((d_SINGLEQUOTE_ == null)))){
var temp__5827__auto__ = (mf_SINGLEQUOTE_.cljs$core$IFn$_invoke$arity$2 ? mf_SINGLEQUOTE_.cljs$core$IFn$_invoke$arity$2(d_SINGLEQUOTE_,args) : mf_SINGLEQUOTE_.call(null,d_SINGLEQUOTE_,args));
if((temp__5827__auto__ == null)){
return data;
} else {
var clause = temp__5827__auto__;
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(data,k_SINGLEQUOTE_,clause);
}
} else {
if(cljs.core.truth_(mf)){
var temp__5827__auto__ = (mf.cljs$core$IFn$_invoke$arity$2 ? mf.cljs$core$IFn$_invoke$arity$2(null,args) : mf.call(null,null,args));
if((temp__5827__auto__ == null)){
return data;
} else {
var clause = temp__5827__auto__;
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(data,k_SINGLEQUOTE_,clause);
}
} else {
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(data,k_SINGLEQUOTE_,honey.sql.helpers.default_merge,args);

}
}
}
});
honey.sql.helpers.generic = (function honey$sql$helpers$generic(k,args){
if(cljs.core.map_QMARK_(cljs.core.first(args))){
var vec__30561 = args;
var seq__30562 = cljs.core.seq(vec__30561);
var first__30563 = cljs.core.first(seq__30562);
var seq__30562__$1 = cljs.core.next(seq__30562);
var data = first__30563;
var args__$1 = seq__30562__$1;
return honey.sql.helpers.helper_merge(data,k,args__$1);
} else {
return honey.sql.helpers.helper_merge(cljs.core.PersistentArrayMap.EMPTY,k,args);
}
});
honey.sql.helpers.generic_grouped = (function honey$sql$helpers$generic_grouped(k,args){
if(cljs.core.map_QMARK_(cljs.core.first(args))){
var vec__30565 = args;
var seq__30566 = cljs.core.seq(vec__30565);
var first__30567 = cljs.core.first(seq__30566);
var seq__30566__$1 = cljs.core.next(seq__30566);
var data = first__30567;
var args__$1 = seq__30566__$1;
return honey.sql.helpers.helper_merge(data,k,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [args__$1], null));
} else {
return honey.sql.helpers.helper_merge(cljs.core.PersistentArrayMap.EMPTY,k,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [args], null));
}
});
honey.sql.helpers.generic_1 = (function honey$sql$helpers$generic_1(k,p__30572){
var vec__30573 = p__30572;
var data = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30573,(0),null);
var arg = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30573,(1),null);
if(cljs.core.map_QMARK_(data)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(data,k,arg);
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,k,data);
}
});
/**
 * Alter table takes a SQL entity (the name of the
 *   table to modify) and any number of optional SQL
 *   clauses to be applied in a single statement.
 * 
 *   (alter-table :foo (add-column :id :int nil))
 * 
 *   If only the SQL entity is provided, the result
 *   needs to be combined with another SQL clause to
 *   modify the table.
 * 
 *   (-> (alter-table :foo) (add-column :id :int nil))
 */
honey.sql.helpers.alter_table = (function honey$sql$helpers$alter_table(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31196 = arguments.length;
var i__5898__auto___31197 = (0);
while(true){
if((i__5898__auto___31197 < len__5897__auto___31196)){
args__5903__auto__.push((arguments[i__5898__auto___31197]));

var G__31198 = (i__5898__auto___31197 + (1));
i__5898__auto___31197 = G__31198;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.alter_table.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.alter_table.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"alter-table","alter-table",1000463814),args);
}));

(honey.sql.helpers.alter_table.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.alter_table.cljs$lang$applyTo = (function (seq30577){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30577));
}));

/**
 * Add a single column to a table (see `alter-table`).
 * 
 *   Accepts any number of SQL elements that describe
 *   a column:
 * 
 *   (add-column :name [:varchar 32] [:not nil])
 */
honey.sql.helpers.add_column = (function honey$sql$helpers$add_column(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31199 = arguments.length;
var i__5898__auto___31200 = (0);
while(true){
if((i__5898__auto___31200 < len__5897__auto___31199)){
args__5903__auto__.push((arguments[i__5898__auto___31200]));

var G__31201 = (i__5898__auto___31200 + (1));
i__5898__auto___31200 = G__31201;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.add_column.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.add_column.cljs$core$IFn$_invoke$arity$variadic = (function (col_elems){
return honey.sql.helpers.generic_grouped(new cljs.core.Keyword(null,"add-column","add-column",141289410),col_elems);
}));

(honey.sql.helpers.add_column.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.add_column.cljs$lang$applyTo = (function (seq30580){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30580));
}));

/**
 * Takes one or more column names (use with `alter-table`).
 * 
 *   Accepts an `IF EXISTS` flag (keyword or symbol) before
 *   any column names.
 * 
 *   (alter-table :foo (drop-column :bar :if-exists :quux))
 */
honey.sql.helpers.drop_column = (function honey$sql$helpers$drop_column(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31202 = arguments.length;
var i__5898__auto___31203 = (0);
while(true){
if((i__5898__auto___31203 < len__5897__auto___31202)){
args__5903__auto__.push((arguments[i__5898__auto___31203]));

var G__31204 = (i__5898__auto___31203 + (1));
i__5898__auto___31203 = G__31204;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.drop_column.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.drop_column.cljs$core$IFn$_invoke$arity$variadic = (function (col_elems){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"drop-column","drop-column",-1898063225),col_elems);
}));

(honey.sql.helpers.drop_column.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.drop_column.cljs$lang$applyTo = (function (seq30587){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30587));
}));

/**
 * Like add-column, accepts any number of SQL elements
 *   that describe the new column definition:
 * 
 *   (alter-column :name [:varchar 64] [:not nil])
 */
honey.sql.helpers.alter_column = (function honey$sql$helpers$alter_column(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31205 = arguments.length;
var i__5898__auto___31206 = (0);
while(true){
if((i__5898__auto___31206 < len__5897__auto___31205)){
args__5903__auto__.push((arguments[i__5898__auto___31206]));

var G__31208 = (i__5898__auto___31206 + (1));
i__5898__auto___31206 = G__31208;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.alter_column.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.alter_column.cljs$core$IFn$_invoke$arity$variadic = (function (col_elems){
return honey.sql.helpers.generic_grouped(new cljs.core.Keyword(null,"alter-column","alter-column",-254828732),col_elems);
}));

(honey.sql.helpers.alter_column.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.alter_column.cljs$lang$applyTo = (function (seq30594){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30594));
}));

/**
 * Like add-column, accepts any number of SQL elements
 *   that describe the new column definition:
 * 
 *   (modify-column :name [:varchar 64] [:not nil])
 * 
 *   MySQL-specific, deprecated. Use `alter-column` and
 *   specify the MySQL dialect to get `MODIFY COLUMN`.
 */
honey.sql.helpers.modify_column = (function honey$sql$helpers$modify_column(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31209 = arguments.length;
var i__5898__auto___31210 = (0);
while(true){
if((i__5898__auto___31210 < len__5897__auto___31209)){
args__5903__auto__.push((arguments[i__5898__auto___31210]));

var G__31213 = (i__5898__auto___31210 + (1));
i__5898__auto___31210 = G__31213;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.modify_column.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.modify_column.cljs$core$IFn$_invoke$arity$variadic = (function (col_elems){
return honey.sql.helpers.generic_grouped(new cljs.core.Keyword(null,"modify-column","modify-column",-614135147),col_elems);
}));

(honey.sql.helpers.modify_column.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.modify_column.cljs$lang$applyTo = (function (seq30602){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30602));
}));

/**
 * Accepts two column names: the original name and the
 *   new name to which it should be renamed:
 * 
 *   (rename-column :name :full-name)
 */
honey.sql.helpers.rename_column = (function honey$sql$helpers$rename_column(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31218 = arguments.length;
var i__5898__auto___31220 = (0);
while(true){
if((i__5898__auto___31220 < len__5897__auto___31218)){
args__5903__auto__.push((arguments[i__5898__auto___31220]));

var G__31221 = (i__5898__auto___31220 + (1));
i__5898__auto___31220 = G__31221;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.rename_column.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.rename_column.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"rename-column","rename-column",737487070),args);
}));

(honey.sql.helpers.rename_column.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.rename_column.cljs$lang$applyTo = (function (seq30613){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30613));
}));

/**
 * Like add-column, this accepts any number of SQL
 *   elements that describe a new index to be added:
 * 
 *   (add-index :unique :name-key :first-name :last-name)
 * 
 *   Produces: UNIQUE name_key(first_name, last_name)
 */
honey.sql.helpers.add_index = (function honey$sql$helpers$add_index(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31222 = arguments.length;
var i__5898__auto___31223 = (0);
while(true){
if((i__5898__auto___31223 < len__5897__auto___31222)){
args__5903__auto__.push((arguments[i__5898__auto___31223]));

var G__31225 = (i__5898__auto___31223 + (1));
i__5898__auto___31223 = G__31225;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.add_index.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.add_index.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"add-index","add-index",376820708),args);
}));

(honey.sql.helpers.add_index.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.add_index.cljs$lang$applyTo = (function (seq30622){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30622));
}));

/**
 * Like drop-table, accepts a single index name:
 * 
 *   (drop-index :name-key)
 */
honey.sql.helpers.drop_index = (function honey$sql$helpers$drop_index(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31227 = arguments.length;
var i__5898__auto___31228 = (0);
while(true){
if((i__5898__auto___31228 < len__5897__auto___31227)){
args__5903__auto__.push((arguments[i__5898__auto___31228]));

var G__31229 = (i__5898__auto___31228 + (1));
i__5898__auto___31228 = G__31229;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.drop_index.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.drop_index.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"drop-index","drop-index",-843154439),args);
}));

(honey.sql.helpers.drop_index.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.drop_index.cljs$lang$applyTo = (function (seq30628){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30628));
}));

/**
 * Accepts a single table name and, despite its name,
 *   actually means RENAME TO:
 * 
 *   (alter-table :foo (rename-table :bar))
 * 
 *   Produces: ALTER TABLE foo RENAME TO bar
 */
honey.sql.helpers.rename_table = (function honey$sql$helpers$rename_table(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31230 = arguments.length;
var i__5898__auto___31231 = (0);
while(true){
if((i__5898__auto___31231 < len__5897__auto___31230)){
args__5903__auto__.push((arguments[i__5898__auto___31231]));

var G__31232 = (i__5898__auto___31231 + (1));
i__5898__auto___31231 = G__31232;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.rename_table.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.rename_table.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"rename-table","rename-table",-651328682),args);
}));

(honey.sql.helpers.rename_table.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.rename_table.cljs$lang$applyTo = (function (seq30629){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30629));
}));

/**
 * Accepts a table name to create and optionally a
 *   flag to trigger IF NOT EXISTS in the SQL:
 * 
 *   (create-table :foo)
 *   (create-table :foo :if-not-exists)
 */
honey.sql.helpers.create_table = (function honey$sql$helpers$create_table(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31240 = arguments.length;
var i__5898__auto___31243 = (0);
while(true){
if((i__5898__auto___31243 < len__5897__auto___31240)){
args__5903__auto__.push((arguments[i__5898__auto___31243]));

var G__31245 = (i__5898__auto___31243 + (1));
i__5898__auto___31243 = G__31245;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.create_table.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.create_table.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"create-table","create-table",1297148194),args);
}));

(honey.sql.helpers.create_table.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.create_table.cljs$lang$applyTo = (function (seq30630){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30630));
}));

/**
 * Accepts a table name to create and optionally a
 *   flag to trigger IF NOT EXISTS in the SQL:
 * 
 *   (create-table-as :foo)
 *   (create-table-as :foo :if-not-exists)
 */
honey.sql.helpers.create_table_as = (function honey$sql$helpers$create_table_as(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31251 = arguments.length;
var i__5898__auto___31252 = (0);
while(true){
if((i__5898__auto___31252 < len__5897__auto___31251)){
args__5903__auto__.push((arguments[i__5898__auto___31252]));

var G__31254 = (i__5898__auto___31252 + (1));
i__5898__auto___31252 = G__31254;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.create_table_as.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.create_table_as.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"create-table-as","create-table-as",209299497),args);
}));

(honey.sql.helpers.create_table_as.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.create_table_as.cljs$lang$applyTo = (function (seq30637){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30637));
}));

/**
 * Accepts an extension name to create and optionally a
 *   flag to trigger IF NOT EXISTS in the SQL:
 * 
 *   (create-extension :postgis)
 *   (create-extension :postgis :if-not-exists)
 */
honey.sql.helpers.create_extension = (function honey$sql$helpers$create_extension(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31270 = arguments.length;
var i__5898__auto___31272 = (0);
while(true){
if((i__5898__auto___31272 < len__5897__auto___31270)){
args__5903__auto__.push((arguments[i__5898__auto___31272]));

var G__31273 = (i__5898__auto___31272 + (1));
i__5898__auto___31272 = G__31273;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.create_extension.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.create_extension.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"create-extension","create-extension",853957283),args);
}));

(honey.sql.helpers.create_extension.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.create_extension.cljs$lang$applyTo = (function (seq30643){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30643));
}));

/**
 * Accepts any number of column descriptions. Each
 *   column description is a sequence of SQL elements
 *   that specify the name and the attributes.
 * 
 *   (with-columns [:id :int [:not nil]]
 *              [:name [:varchar 32] [:default ""]])
 * 
 *   Produces:
 *  id INT NOT NULL,
 *  name VARCHAR(32) DEFAULT ''
 * 
 *   Can also accept a single argument which is a
 *   collection of column descriptions (mostly for
 *   compatibility with nilenso/honeysql-postgres
 *   which used to be needed for DDL).
 */
honey.sql.helpers.with_columns = (function honey$sql$helpers$with_columns(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31278 = arguments.length;
var i__5898__auto___31279 = (0);
while(true){
if((i__5898__auto___31279 < len__5897__auto___31278)){
args__5903__auto__.push((arguments[i__5898__auto___31279]));

var G__31281 = (i__5898__auto___31279 + (1));
i__5898__auto___31279 = G__31281;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.with_columns.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.with_columns.cljs$core$IFn$_invoke$arity$variadic = (function (args){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(args))) && (((cljs.core.sequential_QMARK_(cljs.core.first(args))) && (cljs.core.sequential_QMARK_(cljs.core.ffirst(args))))))){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"with-columns","with-columns",-1220776498),cljs.core.cons(cljs.core.PersistentArrayMap.EMPTY,cljs.core.first(args)));
} else {
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((2),cljs.core.count(args))) && (((cljs.core.map_QMARK_(cljs.core.first(args))) && (((cljs.core.sequential_QMARK_(cljs.core.second(args))) && (cljs.core.sequential_QMARK_(cljs.core.first(cljs.core.second(args)))))))))){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"with-columns","with-columns",-1220776498),cljs.core.cons(cljs.core.first(args),cljs.core.second(args)));
} else {
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"with-columns","with-columns",-1220776498),args);

}
}
}));

(honey.sql.helpers.with_columns.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.with_columns.cljs$lang$applyTo = (function (seq30651){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30651));
}));

/**
 *  Accepts a single view name to create.
 * 
 * (-> (create-view :cities)
 *  (select :*) (from :city)) 
 */
honey.sql.helpers.create_view = (function honey$sql$helpers$create_view(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31287 = arguments.length;
var i__5898__auto___31288 = (0);
while(true){
if((i__5898__auto___31288 < len__5897__auto___31287)){
args__5903__auto__.push((arguments[i__5898__auto___31288]));

var G__31289 = (i__5898__auto___31288 + (1));
i__5898__auto___31288 = G__31289;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.create_view.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.create_view.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"create-view","create-view",-485638509),args);
}));

(honey.sql.helpers.create_view.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.create_view.cljs$lang$applyTo = (function (seq30659){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30659));
}));

/**
 * Accepts a single view name to create.
 * 
 *   (-> (create-or-replace-view :cities)
 *    (select :*) (from :city))
 */
honey.sql.helpers.create_or_replace_view = (function honey$sql$helpers$create_or_replace_view(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31290 = arguments.length;
var i__5898__auto___31291 = (0);
while(true){
if((i__5898__auto___31291 < len__5897__auto___31290)){
args__5903__auto__.push((arguments[i__5898__auto___31291]));

var G__31292 = (i__5898__auto___31291 + (1));
i__5898__auto___31291 = G__31292;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.create_or_replace_view.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.create_or_replace_view.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"create-or-replace-view","create-or-replace-view",1887806804),args);
}));

(honey.sql.helpers.create_or_replace_view.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.create_or_replace_view.cljs$lang$applyTo = (function (seq30675){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30675));
}));

/**
 * Accepts a single view name to create.
 * 
 *   (-> (create-materialized-view :cities)
 *    (select :*) (from :city))
 *    (with-data true)
 */
honey.sql.helpers.create_materialized_view = (function honey$sql$helpers$create_materialized_view(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31293 = arguments.length;
var i__5898__auto___31294 = (0);
while(true){
if((i__5898__auto___31294 < len__5897__auto___31293)){
args__5903__auto__.push((arguments[i__5898__auto___31294]));

var G__31295 = (i__5898__auto___31294 + (1));
i__5898__auto___31294 = G__31295;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.create_materialized_view.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.create_materialized_view.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"create-materialized-view","create-materialized-view",-1173241),args);
}));

(honey.sql.helpers.create_materialized_view.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.create_materialized_view.cljs$lang$applyTo = (function (seq30691){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30691));
}));

/**
 * Accepts one or more table names to drop.
 * 
 *   (drop-table :foo)
 */
honey.sql.helpers.drop_table = (function honey$sql$helpers$drop_table(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31296 = arguments.length;
var i__5898__auto___31297 = (0);
while(true){
if((i__5898__auto___31297 < len__5897__auto___31296)){
args__5903__auto__.push((arguments[i__5898__auto___31297]));

var G__31298 = (i__5898__auto___31297 + (1));
i__5898__auto___31297 = G__31298;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.drop_table.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.drop_table.cljs$core$IFn$_invoke$arity$variadic = (function (tables){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"drop-table","drop-table",371446895),tables);
}));

(honey.sql.helpers.drop_table.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.drop_table.cljs$lang$applyTo = (function (seq30705){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30705));
}));

/**
 * Accepts one or more extension names to drop.
 */
honey.sql.helpers.drop_extension = (function honey$sql$helpers$drop_extension(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31299 = arguments.length;
var i__5898__auto___31300 = (0);
while(true){
if((i__5898__auto___31300 < len__5897__auto___31299)){
args__5903__auto__.push((arguments[i__5898__auto___31300]));

var G__31301 = (i__5898__auto___31300 + (1));
i__5898__auto___31300 = G__31301;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.drop_extension.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.drop_extension.cljs$core$IFn$_invoke$arity$variadic = (function (extensions){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"drop-extension","drop-extension",-1677190153),extensions);
}));

(honey.sql.helpers.drop_extension.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.drop_extension.cljs$lang$applyTo = (function (seq30711){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30711));
}));

/**
 * Accepts one or more view names to drop.
 */
honey.sql.helpers.drop_view = (function honey$sql$helpers$drop_view(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31302 = arguments.length;
var i__5898__auto___31303 = (0);
while(true){
if((i__5898__auto___31303 < len__5897__auto___31302)){
args__5903__auto__.push((arguments[i__5898__auto___31303]));

var G__31304 = (i__5898__auto___31303 + (1));
i__5898__auto___31303 = G__31304;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.drop_view.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.drop_view.cljs$core$IFn$_invoke$arity$variadic = (function (views){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"drop-view","drop-view",1167937644),views);
}));

(honey.sql.helpers.drop_view.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.drop_view.cljs$lang$applyTo = (function (seq30719){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30719));
}));

/**
 * Accepts one or more materialied view names to drop.
 */
honey.sql.helpers.drop_materialized_view = (function honey$sql$helpers$drop_materialized_view(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31305 = arguments.length;
var i__5898__auto___31306 = (0);
while(true){
if((i__5898__auto___31306 < len__5897__auto___31305)){
args__5903__auto__.push((arguments[i__5898__auto___31306]));

var G__31307 = (i__5898__auto___31306 + (1));
i__5898__auto___31306 = G__31307;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.drop_materialized_view.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.drop_materialized_view.cljs$core$IFn$_invoke$arity$variadic = (function (views){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"drop-materialized-view","drop-materialized-view",-1779110488),views);
}));

(honey.sql.helpers.drop_materialized_view.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.drop_materialized_view.cljs$lang$applyTo = (function (seq30725){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30725));
}));

/**
 * Accepts a materialied view name to refresh.
 */
honey.sql.helpers.refresh_materialized_view = (function honey$sql$helpers$refresh_materialized_view(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31309 = arguments.length;
var i__5898__auto___31310 = (0);
while(true){
if((i__5898__auto___31310 < len__5897__auto___31309)){
args__5903__auto__.push((arguments[i__5898__auto___31310]));

var G__31311 = (i__5898__auto___31310 + (1));
i__5898__auto___31310 = G__31311;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.refresh_materialized_view.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.refresh_materialized_view.cljs$core$IFn$_invoke$arity$variadic = (function (views){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"refresh-materialized-view","refresh-materialized-view",-121074453),views);
}));

(honey.sql.helpers.refresh_materialized_view.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.refresh_materialized_view.cljs$lang$applyTo = (function (seq30734){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30734));
}));

/**
 * Accepts an index spexification and a column specification. The column
 *   specification consists of table name and one or more columns.
 * 
 *   (create-index :name-of-idx [:table :col])
 *   (create-index :name-of-idx [:table :col1 :col2])
 *   (create-index [:unique :name-of-idx] [:table :col])
 * 
 *   PostgreSQL also supports :if-not-exists and expressions instead of columns.
 * 
 *   (create-index [:name-of-idx :if-not-exists] [:table :%lower.col])
 */
honey.sql.helpers.create_index = (function honey$sql$helpers$create_index(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31312 = arguments.length;
var i__5898__auto___31313 = (0);
while(true){
if((i__5898__auto___31313 < len__5897__auto___31312)){
args__5903__auto__.push((arguments[i__5898__auto___31313]));

var G__31314 = (i__5898__auto___31313 + (1));
i__5898__auto___31313 = G__31314;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.create_index.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.create_index.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"create-index","create-index",154861140),args);
}));

(honey.sql.helpers.create_index.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.create_index.cljs$lang$applyTo = (function (seq30742){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30742));
}));

/**
 * Accepts one or more time settings for a query.
 */
honey.sql.helpers.setting = (function honey$sql$helpers$setting(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31315 = arguments.length;
var i__5898__auto___31316 = (0);
while(true){
if((i__5898__auto___31316 < len__5897__auto___31315)){
args__5903__auto__.push((arguments[i__5898__auto___31316]));

var G__31317 = (i__5898__auto___31316 + (1));
i__5898__auto___31316 = G__31317;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.setting.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.setting.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"setting","setting",928308078),args);
}));

(honey.sql.helpers.setting.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.setting.cljs$lang$applyTo = (function (seq30749){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30749));
}));

/**
 * Accepts one or more CTE definitions.
 * 
 *   See the documentation for the `:with` clause.
 */
honey.sql.helpers.with$ = (function honey$sql$helpers$with(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31319 = arguments.length;
var i__5898__auto___31320 = (0);
while(true){
if((i__5898__auto___31320 < len__5897__auto___31319)){
args__5903__auto__.push((arguments[i__5898__auto___31320]));

var G__31321 = (i__5898__auto___31320 + (1));
i__5898__auto___31320 = G__31321;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.with$.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.with$.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"with","with",-1536296876),args);
}));

(honey.sql.helpers.with$.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.with$.cljs$lang$applyTo = (function (seq30751){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30751));
}));

/**
 * Accepts one or more CTE definitions.
 * 
 *   See the documentation for the `:with` clause.
 */
honey.sql.helpers.with_recursive = (function honey$sql$helpers$with_recursive(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31325 = arguments.length;
var i__5898__auto___31326 = (0);
while(true){
if((i__5898__auto___31326 < len__5897__auto___31325)){
args__5903__auto__.push((arguments[i__5898__auto___31326]));

var G__31327 = (i__5898__auto___31326 + (1));
i__5898__auto___31326 = G__31327;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.with_recursive.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.with_recursive.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"with-recursive","with-recursive",-331779146),args);
}));

(honey.sql.helpers.with_recursive.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.with_recursive.cljs$lang$applyTo = (function (seq30753){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30753));
}));

/**
 * Accepts any number of SQL clauses (queries) on
 *   which to perform a set intersection.
 */
honey.sql.helpers.intersect = (function honey$sql$helpers$intersect(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31330 = arguments.length;
var i__5898__auto___31331 = (0);
while(true){
if((i__5898__auto___31331 < len__5897__auto___31330)){
args__5903__auto__.push((arguments[i__5898__auto___31331]));

var G__31332 = (i__5898__auto___31331 + (1));
i__5898__auto___31331 = G__31332;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.intersect.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.intersect.cljs$core$IFn$_invoke$arity$variadic = (function (clauses){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"intersect","intersect",-2039792392),cljs.core.cons(cljs.core.PersistentArrayMap.EMPTY,clauses));
}));

(honey.sql.helpers.intersect.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.intersect.cljs$lang$applyTo = (function (seq30763){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30763));
}));

/**
 * Accepts any number of SQL clauses (queries) on
 *   which to perform a set union.
 */
honey.sql.helpers.union = (function honey$sql$helpers$union(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31333 = arguments.length;
var i__5898__auto___31334 = (0);
while(true){
if((i__5898__auto___31334 < len__5897__auto___31333)){
args__5903__auto__.push((arguments[i__5898__auto___31334]));

var G__31336 = (i__5898__auto___31334 + (1));
i__5898__auto___31334 = G__31336;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.union.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.union.cljs$core$IFn$_invoke$arity$variadic = (function (clauses){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"union","union",2142937499),cljs.core.cons(cljs.core.PersistentArrayMap.EMPTY,clauses));
}));

(honey.sql.helpers.union.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.union.cljs$lang$applyTo = (function (seq30772){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30772));
}));

/**
 * Accepts any number of SQL clauses (queries) on
 *   which to perform a set union all.
 */
honey.sql.helpers.union_all = (function honey$sql$helpers$union_all(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31338 = arguments.length;
var i__5898__auto___31339 = (0);
while(true){
if((i__5898__auto___31339 < len__5897__auto___31338)){
args__5903__auto__.push((arguments[i__5898__auto___31339]));

var G__31340 = (i__5898__auto___31339 + (1));
i__5898__auto___31339 = G__31340;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.union_all.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.union_all.cljs$core$IFn$_invoke$arity$variadic = (function (clauses){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"union-all","union-all",672741919),cljs.core.cons(cljs.core.PersistentArrayMap.EMPTY,clauses));
}));

(honey.sql.helpers.union_all.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.union_all.cljs$lang$applyTo = (function (seq30783){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30783));
}));

/**
 * Accepts any number of SQL clauses (queries) on
 *   which to perform a set except.
 */
honey.sql.helpers.except = (function honey$sql$helpers$except(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31341 = arguments.length;
var i__5898__auto___31342 = (0);
while(true){
if((i__5898__auto___31342 < len__5897__auto___31341)){
args__5903__auto__.push((arguments[i__5898__auto___31342]));

var G__31343 = (i__5898__auto___31342 + (1));
i__5898__auto___31342 = G__31343;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.except.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.except.cljs$core$IFn$_invoke$arity$variadic = (function (clauses){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"except","except",1116893347),cljs.core.cons(cljs.core.PersistentArrayMap.EMPTY,clauses));
}));

(honey.sql.helpers.except.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.except.cljs$lang$applyTo = (function (seq30788){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30788));
}));

/**
 * Accepts any number of SQL clauses (queries) on
 *   which to perform a set except all.
 */
honey.sql.helpers.except_all = (function honey$sql$helpers$except_all(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31344 = arguments.length;
var i__5898__auto___31345 = (0);
while(true){
if((i__5898__auto___31345 < len__5897__auto___31344)){
args__5903__auto__.push((arguments[i__5898__auto___31345]));

var G__31346 = (i__5898__auto___31345 + (1));
i__5898__auto___31345 = G__31346;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.except_all.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.except_all.cljs$core$IFn$_invoke$arity$variadic = (function (clauses){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"except-all","except-all",1562150045),cljs.core.cons(cljs.core.PersistentArrayMap.EMPTY,clauses));
}));

(honey.sql.helpers.except_all.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.except_all.cljs$lang$applyTo = (function (seq30797){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30797));
}));

/**
 * Accepts an expression (predicate).
 * 
 *   Produces: ASSERT expression
 */
honey.sql.helpers.assert = (function honey$sql$helpers$assert(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31347 = arguments.length;
var i__5898__auto___31348 = (0);
while(true){
if((i__5898__auto___31348 < len__5897__auto___31347)){
args__5903__auto__.push((arguments[i__5898__auto___31348]));

var G__31349 = (i__5898__auto___31348 + (1));
i__5898__auto___31348 = G__31349;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.assert.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.assert.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"assert","assert",-963103026),args);
}));

(honey.sql.helpers.assert.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.assert.cljs$lang$applyTo = (function (seq30815){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30815));
}));

/**
 * Accepts any number of column names, or column/alias
 *   pairs, or SQL expressions (optionally aliased):
 * 
 *   (select :id [:foo :bar] [[:max :quux]])
 * 
 *   Produces: SELECT id, foo AS bar, MAX(quux)
 * 
 *   The special column name :* produces * for 'all columns'.
 *   You can also specify :t.* for 'all columns' from the
 *   table (or alias) t.
 */
honey.sql.helpers.select = (function honey$sql$helpers$select(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31350 = arguments.length;
var i__5898__auto___31351 = (0);
while(true){
if((i__5898__auto___31351 < len__5897__auto___31350)){
args__5903__auto__.push((arguments[i__5898__auto___31351]));

var G__31352 = (i__5898__auto___31351 + (1));
i__5898__auto___31351 = G__31352;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.select.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.select.cljs$core$IFn$_invoke$arity$variadic = (function (exprs){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"select","select",1147833503),exprs);
}));

(honey.sql.helpers.select.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.select.cljs$lang$applyTo = (function (seq30822){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30822));
}));

/**
 * Like `select` but produces SELECT DISTINCT.
 */
honey.sql.helpers.select_distinct = (function honey$sql$helpers$select_distinct(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31353 = arguments.length;
var i__5898__auto___31354 = (0);
while(true){
if((i__5898__auto___31354 < len__5897__auto___31353)){
args__5903__auto__.push((arguments[i__5898__auto___31354]));

var G__31355 = (i__5898__auto___31354 + (1));
i__5898__auto___31354 = G__31355;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.select_distinct.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.select_distinct.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"select-distinct","select-distinct",-412636114),args);
}));

(honey.sql.helpers.select_distinct.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.select_distinct.cljs$lang$applyTo = (function (seq30824){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30824));
}));

/**
 * Accepts a sequence of one or more columns for the
 *   distinct clause, followed by any number of column
 *   names, or column/alias pairs, or SQL expressions
 *   (optionally aliased), as for `select`:
 * 
 *   (select-distinct-on [:a :b] :c [:d :dd])
 * 
 *   Produces: SELECT DISTINCT ON(a, b) c, d AS dd
 */
honey.sql.helpers.select_distinct_on = (function honey$sql$helpers$select_distinct_on(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31356 = arguments.length;
var i__5898__auto___31357 = (0);
while(true){
if((i__5898__auto___31357 < len__5897__auto___31356)){
args__5903__auto__.push((arguments[i__5898__auto___31357]));

var G__31358 = (i__5898__auto___31357 + (1));
i__5898__auto___31357 = G__31358;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.select_distinct_on.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.select_distinct_on.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"select-distinct-on","select-distinct-on",1224000227),args);
}));

(honey.sql.helpers.select_distinct_on.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.select_distinct_on.cljs$lang$applyTo = (function (seq30830){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30830));
}));

/**
 * Accepts a TOP expression, followed by any number of
 *   column names, or column/alias pairs, or SQL expressions
 *   (optionally aliased), as for `select`. The TOP expression
 *   can be a simple numeric expression, or a sequence with
 *   a numeric expression followed by keywords (or symbols)
 *   for PERCENT and/or WITH TIES.
 */
honey.sql.helpers.select_top = (function honey$sql$helpers$select_top(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31359 = arguments.length;
var i__5898__auto___31360 = (0);
while(true){
if((i__5898__auto___31360 < len__5897__auto___31359)){
args__5903__auto__.push((arguments[i__5898__auto___31360]));

var G__31361 = (i__5898__auto___31360 + (1));
i__5898__auto___31360 = G__31361;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.select_top.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.select_top.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"select-top","select-top",-1243842074),args);
}));

(honey.sql.helpers.select_top.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.select_top.cljs$lang$applyTo = (function (seq30837){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30837));
}));

/**
 * Like `select-top` but produces SELECT DISTINCT TOP...
 */
honey.sql.helpers.select_distinct_top = (function honey$sql$helpers$select_distinct_top(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31364 = arguments.length;
var i__5898__auto___31365 = (0);
while(true){
if((i__5898__auto___31365 < len__5897__auto___31364)){
args__5903__auto__.push((arguments[i__5898__auto___31365]));

var G__31366 = (i__5898__auto___31365 + (1));
i__5898__auto___31365 = G__31366;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.select_distinct_top.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.select_distinct_top.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"select-distinct-top","select-distinct-top",781185536),args);
}));

(honey.sql.helpers.select_distinct_top.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.select_distinct_top.cljs$lang$applyTo = (function (seq30847){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30847));
}));

/**
 * Produces RECORDS {...}, {...}, ...
 *   Like `values` so it accepts a collection of maps.
 */
honey.sql.helpers.records = (function honey$sql$helpers$records(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31367 = arguments.length;
var i__5898__auto___31368 = (0);
while(true){
if((i__5898__auto___31368 < len__5897__auto___31367)){
args__5903__auto__.push((arguments[i__5898__auto___31368]));

var G__31369 = (i__5898__auto___31368 + (1));
i__5898__auto___31368 = G__31369;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.records.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.records.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"records","records",1326822832),args);
}));

(honey.sql.helpers.records.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.records.cljs$lang$applyTo = (function (seq30853){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30853));
}));

/**
 * Like `select-distinct` but produces DISTINCT...
 */
honey.sql.helpers.distinct = (function honey$sql$helpers$distinct(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31370 = arguments.length;
var i__5898__auto___31371 = (0);
while(true){
if((i__5898__auto___31371 < len__5897__auto___31370)){
args__5903__auto__.push((arguments[i__5898__auto___31371]));

var G__31372 = (i__5898__auto___31371 + (1));
i__5898__auto___31371 = G__31372;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.distinct.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.distinct.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"distinct","distinct",-1788879121),args);
}));

(honey.sql.helpers.distinct.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.distinct.cljs$lang$applyTo = (function (seq30861){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30861));
}));

/**
 * Like `distinct` but produces ... (i.e., just the expression that follows).
 */
honey.sql.helpers.expr = (function honey$sql$helpers$expr(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31373 = arguments.length;
var i__5898__auto___31374 = (0);
while(true){
if((i__5898__auto___31374 < len__5897__auto___31373)){
args__5903__auto__.push((arguments[i__5898__auto___31374]));

var G__31375 = (i__5898__auto___31374 + (1));
i__5898__auto___31374 = G__31375;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.expr.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.expr.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"expr","expr",745722291),args);
}));

(honey.sql.helpers.expr.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.expr.cljs$lang$applyTo = (function (seq30868){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30868));
}));

/**
 * Accepts one or more column names to exclude from a select list.
 */
honey.sql.helpers.exclude = (function honey$sql$helpers$exclude(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31378 = arguments.length;
var i__5898__auto___31379 = (0);
while(true){
if((i__5898__auto___31379 < len__5897__auto___31378)){
args__5903__auto__.push((arguments[i__5898__auto___31379]));

var G__31380 = (i__5898__auto___31379 + (1));
i__5898__auto___31379 = G__31380;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.exclude.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.exclude.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"exclude","exclude",-1230250334),args);
}));

(honey.sql.helpers.exclude.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.exclude.cljs$lang$applyTo = (function (seq30874){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30874));
}));

/**
 * Accepts one or more column names with aliases to rename in a select list.
 */
honey.sql.helpers.rename = (function honey$sql$helpers$rename(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31382 = arguments.length;
var i__5898__auto___31383 = (0);
while(true){
if((i__5898__auto___31383 < len__5897__auto___31382)){
args__5903__auto__.push((arguments[i__5898__auto___31383]));

var G__31384 = (i__5898__auto___31383 + (1));
i__5898__auto___31383 = G__31384;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.rename.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.rename.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"rename","rename",1508157613),args);
}));

(honey.sql.helpers.rename.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.rename.cljs$lang$applyTo = (function (seq30879){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30879));
}));

/**
 * Accepts table name, optionally followed a database name.
 */
honey.sql.helpers.into = (function honey$sql$helpers$into(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31385 = arguments.length;
var i__5898__auto___31386 = (0);
while(true){
if((i__5898__auto___31386 < len__5897__auto___31385)){
args__5903__auto__.push((arguments[i__5898__auto___31386]));

var G__31387 = (i__5898__auto___31386 + (1));
i__5898__auto___31386 = G__31387;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.into.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.into.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"into","into",-150836029),args);
}));

(honey.sql.helpers.into.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.into.cljs$lang$applyTo = (function (seq30888){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30888));
}));

/**
 * Accepts a variable name, optionally followed by a limit
 *   expression.
 */
honey.sql.helpers.bulk_collect_into = (function honey$sql$helpers$bulk_collect_into(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31388 = arguments.length;
var i__5898__auto___31389 = (0);
while(true){
if((i__5898__auto___31389 < len__5897__auto___31388)){
args__5903__auto__.push((arguments[i__5898__auto___31389]));

var G__31391 = (i__5898__auto___31389 + (1));
i__5898__auto___31389 = G__31391;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.bulk_collect_into.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.bulk_collect_into.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"bulk-collect-into","bulk-collect-into",1601778032),args);
}));

(honey.sql.helpers.bulk_collect_into.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.bulk_collect_into.cljs$lang$applyTo = (function (seq30898){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30898));
}));

honey.sql.helpers.stuff_into = (function honey$sql$helpers$stuff_into(k,args){
var vec__30914 = ((cljs.core.map_QMARK_(cljs.core.first(args)))?args:cljs.core.cons(cljs.core.PersistentArrayMap.EMPTY,args));
var seq__30915 = cljs.core.seq(vec__30914);
var first__30916 = cljs.core.first(seq__30915);
var seq__30915__$1 = cljs.core.next(seq__30915);
var data = first__30916;
var args__$1 = seq__30915__$1;
var args_SINGLEQUOTE_ = vec__30914;
var vec__30917 = args__$1;
var table = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30917,(0),null);
var cols = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30917,(1),null);
var statement = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30917,(2),null);
if(((cljs.core.sequential_QMARK_(cols)) && (cljs.core.map_QMARK_(statement)))){
return honey.sql.helpers.generic(k,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [data,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [table,cols], null),statement], null));
} else {
return honey.sql.helpers.generic(k,args_SINGLEQUOTE_);
}
});
/**
 * Accepts a table name or a table/alias pair. That
 *   can optionally be followed by a collection of
 *   column names. That can optionally be followed by
 *   a (select) statement clause.
 * 
 *   (insert-into :table)
 *   (insert-into [:table :t])
 *   (insert-into :table [:id :name :cost])
 *   (insert-into :table (-> (select :*) (from :other)))
 *   (insert-into [:table :t]
 *             [:id :name :cost]
 *             (-> (select :*) (from :other)))
 */
honey.sql.helpers.insert_into = (function honey$sql$helpers$insert_into(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31393 = arguments.length;
var i__5898__auto___31394 = (0);
while(true){
if((i__5898__auto___31394 < len__5897__auto___31393)){
args__5903__auto__.push((arguments[i__5898__auto___31394]));

var G__31395 = (i__5898__auto___31394 + (1));
i__5898__auto___31394 = G__31395;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.insert_into.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.insert_into.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.stuff_into(new cljs.core.Keyword(null,"insert-into","insert-into",382212789),args);
}));

(honey.sql.helpers.insert_into.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.insert_into.cljs$lang$applyTo = (function (seq30931){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30931));
}));

/**
 * Accepts a table name or a table/alias pair. That
 *   can optionally be followed by a collection of
 *   column names. That can optionally be followed by
 *   a (select) statement clause.
 * 
 *   The arguments are identical to insert-into.
 *   The PATCH INTO statement is only supported by
 *   XTDB.
 */
honey.sql.helpers.patch_into = (function honey$sql$helpers$patch_into(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31396 = arguments.length;
var i__5898__auto___31397 = (0);
while(true){
if((i__5898__auto___31397 < len__5897__auto___31396)){
args__5903__auto__.push((arguments[i__5898__auto___31397]));

var G__31398 = (i__5898__auto___31397 + (1));
i__5898__auto___31397 = G__31398;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.patch_into.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.patch_into.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.stuff_into(new cljs.core.Keyword(null,"patch-into","patch-into",-245698135),args);
}));

(honey.sql.helpers.patch_into.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.patch_into.cljs$lang$applyTo = (function (seq30941){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30941));
}));

/**
 * Accepts a table name or a table/alias pair. That
 *   can optionally be followed by a collection of
 *   column names. That can optionally be followed by
 *   a (select) statement clause.
 * 
 *   The arguments are identical to insert-into.
 *   The REPLACE INTO statement is only supported by
 *   MySQL and SQLite.
 */
honey.sql.helpers.replace_into = (function honey$sql$helpers$replace_into(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31400 = arguments.length;
var i__5898__auto___31401 = (0);
while(true){
if((i__5898__auto___31401 < len__5897__auto___31400)){
args__5903__auto__.push((arguments[i__5898__auto___31401]));

var G__31402 = (i__5898__auto___31401 + (1));
i__5898__auto___31401 = G__31402;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.replace_into.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.replace_into.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.stuff_into(new cljs.core.Keyword(null,"replace-into","replace-into",139321349),args);
}));

(honey.sql.helpers.replace_into.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.replace_into.cljs$lang$applyTo = (function (seq30949){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30949));
}));

/**
 * Accepts either a table name or a table/alias pair.
 * 
 *   (-> (update :table) (set {:id 1 :cost 32.1}))
 */
honey.sql.helpers.update = (function honey$sql$helpers$update(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31404 = arguments.length;
var i__5898__auto___31405 = (0);
while(true){
if((i__5898__auto___31405 < len__5897__auto___31404)){
args__5903__auto__.push((arguments[i__5898__auto___31405]));

var G__31406 = (i__5898__auto___31405 + (1));
i__5898__auto___31405 = G__31406;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.update.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.update.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"update","update",1045576396),args);
}));

(honey.sql.helpers.update.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.update.cljs$lang$applyTo = (function (seq30952){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30952));
}));

/**
 * For deleting from multiple tables.
 *   Accepts a collection of table names to delete from.
 * 
 *   (-> (delete [:films :directors]) (where [:= :id 1]))
 */
honey.sql.helpers.delete$ = (function honey$sql$helpers$delete(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31407 = arguments.length;
var i__5898__auto___31408 = (0);
while(true){
if((i__5898__auto___31408 < len__5897__auto___31407)){
args__5903__auto__.push((arguments[i__5898__auto___31408]));

var G__31409 = (i__5898__auto___31408 + (1));
i__5898__auto___31408 = G__31409;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.delete$.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.delete$.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"delete","delete",-1768633620),args);
}));

(honey.sql.helpers.delete$.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.delete$.cljs$lang$applyTo = (function (seq30960){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30960));
}));

/**
 * For deleting from a single table.
 *   Accepts a single table name to delete from.
 * 
 *   (-> (delete-from :films) (where [:= :id 1]))
 */
honey.sql.helpers.delete_from = (function honey$sql$helpers$delete_from(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31410 = arguments.length;
var i__5898__auto___31411 = (0);
while(true){
if((i__5898__auto___31411 < len__5897__auto___31410)){
args__5903__auto__.push((arguments[i__5898__auto___31411]));

var G__31412 = (i__5898__auto___31411 + (1));
i__5898__auto___31411 = G__31412;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.delete_from.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.delete_from.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"delete-from","delete-from",670763966),args);
}));

(honey.sql.helpers.delete_from.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.delete_from.cljs$lang$applyTo = (function (seq30963){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30963));
}));

/**
 * For erasing (hard delete) from a single table (XTDB).
 *   Accepts a single table name to erase from.
 * 
 *   (-> (erase-from :films) (where [:= :id 1]))
 */
honey.sql.helpers.erase_from = (function honey$sql$helpers$erase_from(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31415 = arguments.length;
var i__5898__auto___31416 = (0);
while(true){
if((i__5898__auto___31416 < len__5897__auto___31415)){
args__5903__auto__.push((arguments[i__5898__auto___31416]));

var G__31417 = (i__5898__auto___31416 + (1));
i__5898__auto___31416 = G__31417;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.erase_from.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.erase_from.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"erase-from","erase-from",565088869),args);
}));

(honey.sql.helpers.erase_from.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.erase_from.cljs$lang$applyTo = (function (seq30969){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30969));
}));

/**
 * Accepts a single table name to truncate.
 */
honey.sql.helpers.truncate = (function honey$sql$helpers$truncate(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31420 = arguments.length;
var i__5898__auto___31421 = (0);
while(true){
if((i__5898__auto___31421 < len__5897__auto___31420)){
args__5903__auto__.push((arguments[i__5898__auto___31421]));

var G__31422 = (i__5898__auto___31421 + (1));
i__5898__auto___31421 = G__31422;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.truncate.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.truncate.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"truncate","truncate",-1327322939),args);
}));

(honey.sql.helpers.truncate.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.truncate.cljs$lang$applyTo = (function (seq30970){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30970));
}));

/**
 * To be used with `insert-into` to specify the list of
 *   column names for the insert operation. Accepts any number
 *   of column names:
 * 
 *   (-> (insert-into :foo)
 *    (columns :a :b :c)
 *    (values [[1 2 3] [2 4 6]]))
 * 
 *   Produces:
 *  INSERT INTO foo (a, b, c) VALUES (?, ?, ?), (?, ?, ?)
 *   Parameters: 1 2 3 2 4 6
 */
honey.sql.helpers.columns = (function honey$sql$helpers$columns(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31423 = arguments.length;
var i__5898__auto___31424 = (0);
while(true){
if((i__5898__auto___31424 < len__5897__auto___31423)){
args__5903__auto__.push((arguments[i__5898__auto___31424]));

var G__31425 = (i__5898__auto___31424 + (1));
i__5898__auto___31424 = G__31425;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.columns.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.columns.cljs$core$IFn$_invoke$arity$variadic = (function (cols){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"columns","columns",1998437288),cols);
}));

(honey.sql.helpers.columns.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.columns.cljs$lang$applyTo = (function (seq30972){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30972));
}));

/**
 * Accepts a hash map specifying column names and the
 *   values to be assigned to them, as part of `update`:
 * 
 *   (-> (update :foo)
 *    (set {:a 1 :b nil}))
 * 
 *   Produces: UPDATE foo SET a = ?, b = NULL
 */
honey.sql.helpers.set = (function honey$sql$helpers$set(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31426 = arguments.length;
var i__5898__auto___31427 = (0);
while(true){
if((i__5898__auto___31427 < len__5897__auto___31426)){
args__5903__auto__.push((arguments[i__5898__auto___31427]));

var G__31428 = (i__5898__auto___31427 + (1));
i__5898__auto___31427 = G__31428;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.set.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.set.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"set","set",304602554),args);
}));

(honey.sql.helpers.set.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.set.cljs$lang$applyTo = (function (seq30974){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30974));
}));

/**
 * Accepts one or more table names, or table/alias pairs.
 * 
 *   (-> (select :*)
 *    (from [:foo :bar]))
 * 
 *   Produces: SELECT * FROM foo AS bar
 */
honey.sql.helpers.from = (function honey$sql$helpers$from(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31430 = arguments.length;
var i__5898__auto___31431 = (0);
while(true){
if((i__5898__auto___31431 < len__5897__auto___31430)){
args__5903__auto__.push((arguments[i__5898__auto___31431]));

var G__31432 = (i__5898__auto___31431 + (1));
i__5898__auto___31431 = G__31432;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.from.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.from.cljs$core$IFn$_invoke$arity$variadic = (function (tables){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"from","from",1815293044),tables);
}));

(honey.sql.helpers.from.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.from.cljs$lang$applyTo = (function (seq30976){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30976));
}));

/**
 * Accepts similar arguments to `select` as part of
 *   a SQL `USING` clause.
 */
honey.sql.helpers.using = (function honey$sql$helpers$using(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31433 = arguments.length;
var i__5898__auto___31434 = (0);
while(true){
if((i__5898__auto___31434 < len__5897__auto___31433)){
args__5903__auto__.push((arguments[i__5898__auto___31434]));

var G__31435 = (i__5898__auto___31434 + (1));
i__5898__auto___31434 = G__31435;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.using.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.using.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"using","using",1948623036),args);
}));

(honey.sql.helpers.using.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.using.cljs$lang$applyTo = (function (seq30986){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30986));
}));

/**
 * Accepts a sequence of join clauses to be generated
 *   in a specific order.
 * 
 *   (-> (select :*)
 *    (from :foo)
 *    (join-by :left [:bar [:= :foo.id :bar.id]]
 *             :join [:quux [:= :bar.qid :quux.id]]))
 * 
 *   This produces a LEFT JOIN followed by an INNER JOIN
 *   even though the 'natural' order for `left-join` and
 *   `join` would be to generate the INNER JOIN first,
 *   followed by the LEFT JOIN.
 */
honey.sql.helpers.join_by = (function honey$sql$helpers$join_by(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31437 = arguments.length;
var i__5898__auto___31438 = (0);
while(true){
if((i__5898__auto___31438 < len__5897__auto___31437)){
args__5903__auto__.push((arguments[i__5898__auto___31438]));

var G__31439 = (i__5898__auto___31438 + (1));
i__5898__auto___31438 = G__31439;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.join_by.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.join_by.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"join-by","join-by",1125837996),args);
}));

(honey.sql.helpers.join_by.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.join_by.cljs$lang$applyTo = (function (seq30990){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30990));
}));

/**
 * Accepts one or more (INNER) JOIN expressions. Each
 *   join expression is specified as a pair of arguments,
 *   where the first one is the table name (or a pair of
 *   table and alias) and the second one is the join
 *   condition:
 * 
 *   (join :table [:= :foo.id :table.foo_id])
 *   (join [:table :t] [:= :foo.id :t.foo_id])
 * 
 *   Produces:
 *   INNER JOIN table ON foo.id = table.foo_id
 *   INNER JOIN table AS t ON foo.id = t.foo_id
 */
honey.sql.helpers.join = (function honey$sql$helpers$join(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31440 = arguments.length;
var i__5898__auto___31441 = (0);
while(true){
if((i__5898__auto___31441 < len__5897__auto___31440)){
args__5903__auto__.push((arguments[i__5898__auto___31441]));

var G__31442 = (i__5898__auto___31441 + (1));
i__5898__auto___31441 = G__31442;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.join.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.join.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"join","join",-758861890),args);
}));

(honey.sql.helpers.join.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.join.cljs$lang$applyTo = (function (seq30992){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30992));
}));

/**
 * Accepts one or more LEFT JOIN expressions. Each
 *   join expression is specified as a pair of arguments,
 *   where the first one is the table name (or a pair of
 *   table and alias) and the second one is the join
 *   condition:
 * 
 *   (left-join :table [:= :foo.id :table.foo_id])
 *   (left-join [:table :t] [:= :foo.id :t.foo_id])
 * 
 *   Produces:
 *   LEFT JOIN table ON foo.id = table.foo_id
 *   LEFT JOIN table AS t ON foo.id = t.foo_id
 */
honey.sql.helpers.left_join = (function honey$sql$helpers$left_join(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31444 = arguments.length;
var i__5898__auto___31445 = (0);
while(true){
if((i__5898__auto___31445 < len__5897__auto___31444)){
args__5903__auto__.push((arguments[i__5898__auto___31445]));

var G__31446 = (i__5898__auto___31445 + (1));
i__5898__auto___31445 = G__31446;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.left_join.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.left_join.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"left-join","left-join",-672831855),args);
}));

(honey.sql.helpers.left_join.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.left_join.cljs$lang$applyTo = (function (seq30998){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq30998));
}));

/**
 * Accepts one or more RIGHT JOIN expressions. Each
 *   join expression is specified as a pair of arguments,
 *   where the first one is the table name (or a pair of
 *   table and alias) and the second one is the join
 *   condition:
 * 
 *   (right-join :table [:= :foo.id :table.foo_id])
 *   (right-join [:table :t] [:= :foo.id :t.foo_id])
 * 
 *   Produces:
 *   RIGHT JOIN table ON foo.id = table.foo_id
 *   RIGHT JOIN table AS t ON foo.id = t.foo_id
 */
honey.sql.helpers.right_join = (function honey$sql$helpers$right_join(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31447 = arguments.length;
var i__5898__auto___31448 = (0);
while(true){
if((i__5898__auto___31448 < len__5897__auto___31447)){
args__5903__auto__.push((arguments[i__5898__auto___31448]));

var G__31449 = (i__5898__auto___31448 + (1));
i__5898__auto___31448 = G__31449;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.right_join.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.right_join.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"right-join","right-join",-56349359),args);
}));

(honey.sql.helpers.right_join.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.right_join.cljs$lang$applyTo = (function (seq31001){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31001));
}));

/**
 * An alternative name to `join`, this accepts one or
 *   more INNER JOIN expressions. Each join expression
 *   is specified as a pair of arguments, where the
 *   first one is the table name (or a pair of table
 *   and alias) and the second one is the join condition:
 * 
 *   (inner-join :table [:= :foo.id :table.foo_id])
 *   (inner-join [:table :t] [:= :foo.id :t.foo_id])
 * 
 *   Produces:
 *   INNER JOIN table ON foo.id = table.foo_id
 *   INNER JOIN table AS t ON foo.id = t.foo_id
 */
honey.sql.helpers.inner_join = (function honey$sql$helpers$inner_join(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31450 = arguments.length;
var i__5898__auto___31451 = (0);
while(true){
if((i__5898__auto___31451 < len__5897__auto___31450)){
args__5903__auto__.push((arguments[i__5898__auto___31451]));

var G__31452 = (i__5898__auto___31451 + (1));
i__5898__auto___31451 = G__31452;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.inner_join.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.inner_join.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"inner-join","inner-join",659431740),args);
}));

(honey.sql.helpers.inner_join.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.inner_join.cljs$lang$applyTo = (function (seq31009){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31009));
}));

/**
 * Accepts one or more OUTER JOIN expressions. Each
 *   join expression is specified as a pair of arguments,
 *   where the first one is the table name (or a pair of
 *   table and alias) and the second one is the join
 *   condition:
 * 
 *   (outer-join :table [:= :foo.id :table.foo_id])
 *   (outer-join [:table :t] [:= :foo.id :t.foo_id])
 * 
 *   Produces:
 *   OUTER JOIN table ON foo.id = table.foo_id
 *   OUTER JOIN table AS t ON foo.id = t.foo_id
 */
honey.sql.helpers.outer_join = (function honey$sql$helpers$outer_join(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31453 = arguments.length;
var i__5898__auto___31454 = (0);
while(true){
if((i__5898__auto___31454 < len__5897__auto___31453)){
args__5903__auto__.push((arguments[i__5898__auto___31454]));

var G__31455 = (i__5898__auto___31454 + (1));
i__5898__auto___31454 = G__31455;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.outer_join.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.outer_join.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"outer-join","outer-join",1845838048),args);
}));

(honey.sql.helpers.outer_join.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.outer_join.cljs$lang$applyTo = (function (seq31013){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31013));
}));

/**
 * Accepts one or more FULL JOIN expressions. Each
 *   join expression is specified as a pair of arguments,
 *   where the first one is the table name (or a pair of
 *   table and alias) and the second one is the join
 *   condition:
 * 
 *   (full-join :table [:= :foo.id :table.foo_id])
 *   (full-join [:table :t] [:= :foo.id :t.foo_id])
 * 
 *   Produces:
 *   FULL JOIN table ON foo.id = table.foo_id
 *   FULL JOIN table AS t ON foo.id = t.foo_id
 */
honey.sql.helpers.full_join = (function honey$sql$helpers$full_join(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31456 = arguments.length;
var i__5898__auto___31457 = (0);
while(true){
if((i__5898__auto___31457 < len__5897__auto___31456)){
args__5903__auto__.push((arguments[i__5898__auto___31457]));

var G__31458 = (i__5898__auto___31457 + (1));
i__5898__auto___31457 = G__31458;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.full_join.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.full_join.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"full-join","full-join",1305476385),args);
}));

(honey.sql.helpers.full_join.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.full_join.cljs$lang$applyTo = (function (seq31018){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31018));
}));

/**
 * Accepts one or more CROSS JOIN expressions. Each
 *   cross join expression is specified as a table
 *   name (or a pair of table and alias):
 * 
 *   (cross-join :table)
 *   (cross-join [:table :t])
 * 
 *   Produces:
 *   CROSS JOIN table
 *   CROSS JOIN table AS t
 */
honey.sql.helpers.cross_join = (function honey$sql$helpers$cross_join(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31462 = arguments.length;
var i__5898__auto___31463 = (0);
while(true){
if((i__5898__auto___31463 < len__5897__auto___31462)){
args__5903__auto__.push((arguments[i__5898__auto___31463]));

var G__31464 = (i__5898__auto___31463 + (1));
i__5898__auto___31463 = G__31464;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.cross_join.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.cross_join.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"cross-join","cross-join",-1043003533),args);
}));

(honey.sql.helpers.cross_join.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.cross_join.cljs$lang$applyTo = (function (seq31025){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31025));
}));

/**
 * Accepts one or more SQL expressions (conditions) and
 *   combines them with AND (by default):
 * 
 *   (where [:= :status 0] [:<> :task "backup"])
 *   or:
 *   (where :and [:= :status 0] [:<> :task "backup"])
 * 
 *   Produces: WHERE (status = ?) AND (task <> ?)
 *   Parameters: 0 "backup"
 * 
 *   For a single expression, the brackets can be omitted:
 * 
 *   (where := :status 0) ; same as (where [:= :status 0])
 * 
 *   With multiple expressions, the conjunction may be
 *   specified as a leading symbol:
 * 
 *   (where :or [:= :status 0] [:= :task "stop"])
 * 
 *   Produces: WHERE (status = 0) OR (task = ?)
 *   Parameters: 0 "stop"
 */
honey.sql.helpers.where = (function honey$sql$helpers$where(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31465 = arguments.length;
var i__5898__auto___31466 = (0);
while(true){
if((i__5898__auto___31466 < len__5897__auto___31465)){
args__5903__auto__.push((arguments[i__5898__auto___31466]));

var G__31470 = (i__5898__auto___31466 + (1));
i__5898__auto___31466 = G__31470;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.where.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.where.cljs$core$IFn$_invoke$arity$variadic = (function (exprs){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"where","where",-2044795965),exprs);
}));

(honey.sql.helpers.where.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.where.cljs$lang$applyTo = (function (seq31026){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31026));
}));

/**
 * Accepts one or more SQL expressions to group by.
 * 
 *   (group-by :foo :bar)
 *   (group-by [:date :baz])
 * 
 *   Produces:
 *   GROUP BY foo, bar
 *   GROUP BY DATE(baz)
 */
honey.sql.helpers.group_by = (function honey$sql$helpers$group_by(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31471 = arguments.length;
var i__5898__auto___31472 = (0);
while(true){
if((i__5898__auto___31472 < len__5897__auto___31471)){
args__5903__auto__.push((arguments[i__5898__auto___31472]));

var G__31473 = (i__5898__auto___31472 + (1));
i__5898__auto___31472 = G__31473;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.group_by.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.group_by.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"group-by","group-by",-379139802),args);
}));

(honey.sql.helpers.group_by.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.group_by.cljs$lang$applyTo = (function (seq31033){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31033));
}));

/**
 * Like `where`, accepts one or more SQL expressions
 *   (conditions) and combines them with AND (by default):
 * 
 *   (having [:> :count 0] [:<> :name nil])
 *   or:
 *   (having :and [:> :count 0] [:<> :name nil])
 * 
 *   Produces: HAVING (count > ?) AND (name IS NOT NULL)
 *   Parameters: 0
 * 
 *   (having :> :count 0)
 * 
 *   Produces: HAVING count > ?
 *   Parameters: 0
 * 
 *   (having :or [:> :count 0] [:= :name ""])
 * 
 *   Produces: HAVING (count > ?) OR (name = ?)
 *   Parameters: 0 ""
 */
honey.sql.helpers.having = (function honey$sql$helpers$having(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31474 = arguments.length;
var i__5898__auto___31475 = (0);
while(true){
if((i__5898__auto___31475 < len__5897__auto___31474)){
args__5903__auto__.push((arguments[i__5898__auto___31475]));

var G__31476 = (i__5898__auto___31475 + (1));
i__5898__auto___31475 = G__31476;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.having.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.having.cljs$core$IFn$_invoke$arity$variadic = (function (exprs){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"having","having",-399543166),exprs);
}));

(honey.sql.helpers.having.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.having.cljs$lang$applyTo = (function (seq31036){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31036));
}));

/**
 * Like `where`, accepts one or more SQL expressions
 *   (conditions) and combines them with AND (by default):
 * 
 *   (qualify [:> :count 0] [:<> :name nil])
 *   or:
 *   (qualify :and [:> :count 0] [:<> :name nil])
 * 
 *   Produces: QUALIFY (count > ?) AND (name IS NOT NULL)
 *   Parameters: 0
 * 
 *   (qualify :> :count 0)
 * 
 *   Produces: QUALIFY count > ?
 *   Parameters: 0
 * 
 *   (qualify :or [:> :count 0] [:= :name ""])
 * 
 *   Produces: QUALIFY (count > ?) OR (name = ?)
 *   Parameters: 0 ""
 */
honey.sql.helpers.qualify = (function honey$sql$helpers$qualify(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31477 = arguments.length;
var i__5898__auto___31478 = (0);
while(true){
if((i__5898__auto___31478 < len__5897__auto___31477)){
args__5903__auto__.push((arguments[i__5898__auto___31478]));

var G__31479 = (i__5898__auto___31478 + (1));
i__5898__auto___31478 = G__31479;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.qualify.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.qualify.cljs$core$IFn$_invoke$arity$variadic = (function (exprs){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"qualify","qualify",1565609728),exprs);
}));

(honey.sql.helpers.qualify.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.qualify.cljs$lang$applyTo = (function (seq31037){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31037));
}));

/**
 * Accepts a window name followed by a partition by clause.
 */
honey.sql.helpers.window = (function honey$sql$helpers$window(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31480 = arguments.length;
var i__5898__auto___31481 = (0);
while(true){
if((i__5898__auto___31481 < len__5897__auto___31480)){
args__5903__auto__.push((arguments[i__5898__auto___31481]));

var G__31482 = (i__5898__auto___31481 + (1));
i__5898__auto___31481 = G__31482;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.window.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.window.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"window","window",724519534),args);
}));

(honey.sql.helpers.window.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.window.cljs$lang$applyTo = (function (seq31040){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31040));
}));

/**
 * Accepts one or more columns or SQL expressions to
 *   partition by as part of a `WINDOW` expression.
 */
honey.sql.helpers.partition_by = (function honey$sql$helpers$partition_by(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31484 = arguments.length;
var i__5898__auto___31485 = (0);
while(true){
if((i__5898__auto___31485 < len__5897__auto___31484)){
args__5903__auto__.push((arguments[i__5898__auto___31485]));

var G__31489 = (i__5898__auto___31485 + (1));
i__5898__auto___31485 = G__31489;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.partition_by.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.partition_by.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"partition-by","partition-by",1324497520),args);
}));

(honey.sql.helpers.partition_by.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.partition_by.cljs$lang$applyTo = (function (seq31045){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31045));
}));

/**
 * Accepts one or more expressions to order by.
 * 
 *   An ordering expression may be a simple column name
 *   which is assumed to be ordered `ASC`, or a pair of
 *   an expression and a direction (`:asc` or `:desc`):
 * 
 *   (order-by :foo)
 *   (order-by [:bar :desc])
 *   (order-by [[:date :baz] :asc])
 * 
 *   Produces:
 *   ORDER BY foo ASC
 *   ORDER BY bar DESC
 *   ORDER BY DATE(baz) ASC
 */
honey.sql.helpers.order_by = (function honey$sql$helpers$order_by(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31490 = arguments.length;
var i__5898__auto___31491 = (0);
while(true){
if((i__5898__auto___31491 < len__5897__auto___31490)){
args__5903__auto__.push((arguments[i__5898__auto___31491]));

var G__31493 = (i__5898__auto___31491 + (1));
i__5898__auto___31491 = G__31493;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.order_by.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.order_by.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"order-by","order-by",1527318070),args);
}));

(honey.sql.helpers.order_by.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.order_by.cljs$lang$applyTo = (function (seq31048){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31048));
}));

/**
 * Specific to some databases (notabley MySQL),
 *   accepts a single SQL expression:
 * 
 *   (limit 40)
 * 
 *   Produces: LIMIT ?
 *   Parameters: 40
 * 
 *   The two-argument syntax is not supported: use `offset`
 *   instead:
 * 
 *   `LIMIT 20,10` is equivalent to `LIMIT 10 OFFSET 20`
 * 
 *   (-> (limit 10) (offset 20))
 */
honey.sql.helpers.limit = (function honey$sql$helpers$limit(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31494 = arguments.length;
var i__5898__auto___31495 = (0);
while(true){
if((i__5898__auto___31495 < len__5897__auto___31494)){
args__5903__auto__.push((arguments[i__5898__auto___31495]));

var G__31496 = (i__5898__auto___31495 + (1));
i__5898__auto___31495 = G__31496;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.limit.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.limit.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"limit","limit",-1355822363),args);
}));

(honey.sql.helpers.limit.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.limit.cljs$lang$applyTo = (function (seq31052){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31052));
}));

/**
 * Accepts a single SQL expression:
 * 
 *   (offset 10)
 * 
 *   Produces: OFFSET ?
 *   Parameters: 10
 */
honey.sql.helpers.offset = (function honey$sql$helpers$offset(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31497 = arguments.length;
var i__5898__auto___31498 = (0);
while(true){
if((i__5898__auto___31498 < len__5897__auto___31497)){
args__5903__auto__.push((arguments[i__5898__auto___31498]));

var G__31499 = (i__5898__auto___31498 + (1));
i__5898__auto___31498 = G__31499;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.offset.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.offset.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"offset","offset",296498311),args);
}));

(honey.sql.helpers.offset.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.offset.cljs$lang$applyTo = (function (seq31053){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31053));
}));

/**
 * Accepts a single SQL expression:
 * 
 *   (fetch 10)
 * 
 *   Produces: FETCH ? ONLY
 *   Parameters: 10
 */
honey.sql.helpers.fetch = (function honey$sql$helpers$fetch(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31500 = arguments.length;
var i__5898__auto___31501 = (0);
while(true){
if((i__5898__auto___31501 < len__5897__auto___31500)){
args__5903__auto__.push((arguments[i__5898__auto___31501]));

var G__31502 = (i__5898__auto___31501 + (1));
i__5898__auto___31501 = G__31502;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.fetch.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.fetch.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"fetch","fetch",-1081994244),args);
}));

(honey.sql.helpers.fetch.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.fetch.cljs$lang$applyTo = (function (seq31057){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31057));
}));

/**
 * Accepts a lock strength, optionally followed by one or
 *   more table names, optionally followed by a qualifier.
 */
honey.sql.helpers.for$ = (function honey$sql$helpers$for(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31508 = arguments.length;
var i__5898__auto___31511 = (0);
while(true){
if((i__5898__auto___31511 < len__5897__auto___31508)){
args__5903__auto__.push((arguments[i__5898__auto___31511]));

var G__31512 = (i__5898__auto___31511 + (1));
i__5898__auto___31511 = G__31512;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.for$.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.for$.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"for","for",-1323786319),args);
}));

(honey.sql.helpers.for$.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.for$.cljs$lang$applyTo = (function (seq31058){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31058));
}));

/**
 * Intended for MySQL, this accepts a lock mode.
 * 
 *   It will accept the same type of syntax as `for` even
 *   though MySQL's `lock` clause is less powerful.
 */
honey.sql.helpers.lock = (function honey$sql$helpers$lock(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31513 = arguments.length;
var i__5898__auto___31514 = (0);
while(true){
if((i__5898__auto___31514 < len__5897__auto___31513)){
args__5903__auto__.push((arguments[i__5898__auto___31514]));

var G__31515 = (i__5898__auto___31514 + (1));
i__5898__auto___31514 = G__31515;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.lock.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.lock.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"lock","lock",-488188066),args);
}));

(honey.sql.helpers.lock.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.lock.cljs$lang$applyTo = (function (seq31068){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31068));
}));

/**
 * Accepts a single argument: a collection of row values.
 *   Each row value can be either a sequence of column values
 *   or a hash map of column name/column value pairs.
 * 
 *   Used with `insert-into`.
 * 
 *   (-> (insert-into :foo)
 *    (values [{:id 1, :name "John"}
 *             {:id 2, :name "Fred"}]))
 * 
 *   Produces: INSERT INTO foo (id, name) VALUES (?, ?), (?, ?)
 *   Parameters: 1 "John" 2 "Fred"
 */
honey.sql.helpers.values = (function honey$sql$helpers$values(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31517 = arguments.length;
var i__5898__auto___31518 = (0);
while(true){
if((i__5898__auto___31518 < len__5897__auto___31517)){
args__5903__auto__.push((arguments[i__5898__auto___31518]));

var G__31519 = (i__5898__auto___31518 + (1));
i__5898__auto___31518 = G__31519;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.values.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.values.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"values","values",372645556),args);
}));

(honey.sql.helpers.values.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.values.cljs$lang$applyTo = (function (seq31078){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31078));
}));

/**
 * Accepts zero or more SQL entities (keywords or symbols),
 *   optionally followed by a single SQL clause (`{:where <condition>}`).
 *   Ex.: `(on-conflict :mom :dad {:where [:= :race "human"]}`
 */
honey.sql.helpers.on_conflict = (function honey$sql$helpers$on_conflict(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31520 = arguments.length;
var i__5898__auto___31521 = (0);
while(true){
if((i__5898__auto___31521 < len__5897__auto___31520)){
args__5903__auto__.push((arguments[i__5898__auto___31521]));

var G__31522 = (i__5898__auto___31521 + (1));
i__5898__auto___31521 = G__31522;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.on_conflict.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.on_conflict.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"on-conflict","on-conflict",1595391642),args);
}));

(honey.sql.helpers.on_conflict.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.on_conflict.cljs$lang$applyTo = (function (seq31085){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31085));
}));

/**
 * Accepts a single constraint name.
 */
honey.sql.helpers.on_constraint = (function honey$sql$helpers$on_constraint(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31523 = arguments.length;
var i__5898__auto___31524 = (0);
while(true){
if((i__5898__auto___31524 < len__5897__auto___31523)){
args__5903__auto__.push((arguments[i__5898__auto___31524]));

var G__31525 = (i__5898__auto___31524 + (1));
i__5898__auto___31524 = G__31525;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.on_constraint.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.on_constraint.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"on-constraint","on-constraint",1484874675),args);
}));

(honey.sql.helpers.on_constraint.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.on_constraint.cljs$lang$applyTo = (function (seq31089){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31089));
}));

/**
 * Called with no arguments, produces DO NOTHING
 */
honey.sql.helpers.do_nothing = (function honey$sql$helpers$do_nothing(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31530 = arguments.length;
var i__5898__auto___31531 = (0);
while(true){
if((i__5898__auto___31531 < len__5897__auto___31530)){
args__5903__auto__.push((arguments[i__5898__auto___31531]));

var G__31532 = (i__5898__auto___31531 + (1));
i__5898__auto___31531 = G__31532;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.do_nothing.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.do_nothing.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"do-nothing","do-nothing",1030476282),args);
}));

(honey.sql.helpers.do_nothing.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.do_nothing.cljs$lang$applyTo = (function (seq31090){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31090));
}));

/**
 * Accepts one or more columns to update, or a hash map
 *   of column/value pairs (like `set`), optionally followed
 *   by a `WHERE` clause. Can also accept a single hash map
 *   with a `:fields` entry specifying the columns to update
 *   and a `:where` entry specifying the `WHERE` clause.
 */
honey.sql.helpers.do_update_set = (function honey$sql$helpers$do_update_set(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31533 = arguments.length;
var i__5898__auto___31534 = (0);
while(true){
if((i__5898__auto___31534 < len__5897__auto___31533)){
args__5903__auto__.push((arguments[i__5898__auto___31534]));

var G__31535 = (i__5898__auto___31534 + (1));
i__5898__auto___31534 = G__31535;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.do_update_set.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.do_update_set.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"do-update-set","do-update-set",-2028298967),args);
}));

(honey.sql.helpers.do_update_set.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.do_update_set.cljs$lang$applyTo = (function (seq31094){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31094));
}));

/**
 * MySQL's upsert facility. Accepts a hash map of
 *   column/value pairs to be updated (like `set` does).
 */
honey.sql.helpers.on_duplicate_key_update = (function honey$sql$helpers$on_duplicate_key_update(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31540 = arguments.length;
var i__5898__auto___31541 = (0);
while(true){
if((i__5898__auto___31541 < len__5897__auto___31540)){
args__5903__auto__.push((arguments[i__5898__auto___31541]));

var G__31542 = (i__5898__auto___31541 + (1));
i__5898__auto___31541 = G__31542;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.on_duplicate_key_update.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.on_duplicate_key_update.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"on-duplicate-key-update","on-duplicate-key-update",596044873),args);
}));

(honey.sql.helpers.on_duplicate_key_update.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.on_duplicate_key_update.cljs$lang$applyTo = (function (seq31096){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31096));
}));

/**
 * Accepts any number of column names to return from an
 *   insert operation:
 * 
 *   (returning :*) and (returning :a :b)
 * 
 *   Produce: RETURNING * and RETURNING a, b respectively.
 */
honey.sql.helpers.returning = (function honey$sql$helpers$returning(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31543 = arguments.length;
var i__5898__auto___31544 = (0);
while(true){
if((i__5898__auto___31544 < len__5897__auto___31543)){
args__5903__auto__.push((arguments[i__5898__auto___31544]));

var G__31545 = (i__5898__auto___31544 + (1));
i__5898__auto___31544 = G__31545;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.returning.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.returning.cljs$core$IFn$_invoke$arity$variadic = (function (cols){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"returning","returning",-387623629),cols);
}));

(honey.sql.helpers.returning.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.returning.cljs$lang$applyTo = (function (seq31098){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31098));
}));

/**
 * Accepts a single table name and produces TABLE name
 * 
 *   This is equivalent to: SELECT * FROM name
 */
honey.sql.helpers.table = (function honey$sql$helpers$table(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31546 = arguments.length;
var i__5898__auto___31547 = (0);
while(true){
if((i__5898__auto___31547 < len__5897__auto___31546)){
args__5903__auto__.push((arguments[i__5898__auto___31547]));

var G__31548 = (i__5898__auto___31547 + (1));
i__5898__auto___31547 = G__31548;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.table.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.table.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"table","table",-564943036),args);
}));

(honey.sql.helpers.table.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.table.cljs$lang$applyTo = (function (seq31101){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31101));
}));

/**
 * Accepts a Boolean determining WITH DATA vs WITH NO DATA.
 */
honey.sql.helpers.with_data = (function honey$sql$helpers$with_data(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31549 = arguments.length;
var i__5898__auto___31550 = (0);
while(true){
if((i__5898__auto___31550 < len__5897__auto___31549)){
args__5903__auto__.push((arguments[i__5898__auto___31550]));

var G__31551 = (i__5898__auto___31550 + (1));
i__5898__auto___31550 = G__31551;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.with_data.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.with_data.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic_1(new cljs.core.Keyword(null,"with-data","with-data",-1106621804),args);
}));

(honey.sql.helpers.with_data.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.with_data.cljs$lang$applyTo = (function (seq31121){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31121));
}));

/**
 * Accepts any number of SQL expressions and produces
 *   a composite value from them:
 * 
 *   (composite :a 42)
 * 
 *   Produces: (a, ?)
 *   Parameters: 42
 */
honey.sql.helpers.composite = (function honey$sql$helpers$composite(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31552 = arguments.length;
var i__5898__auto___31553 = (0);
while(true){
if((i__5898__auto___31553 < len__5897__auto___31552)){
args__5903__auto__.push((arguments[i__5898__auto___31553]));

var G__31554 = (i__5898__auto___31553 + (1));
i__5898__auto___31553 = G__31554;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.composite.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.composite.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"composite","composite",-257118970)], null),args);
}));

(honey.sql.helpers.composite.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.composite.cljs$lang$applyTo = (function (seq31125){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31125));
}));

/**
 * Accepts alternating expressions and clauses and
 *   produces a FILTER expression:
 * 
 *   (filter :%count.* (where :> i 5))
 * 
 *   Produces: COUNT(*) FILTER (WHERE i > ?)
 *   Parameters: 5
 */
honey.sql.helpers.filter = (function honey$sql$helpers$filter(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31555 = arguments.length;
var i__5898__auto___31556 = (0);
while(true){
if((i__5898__auto___31556 < len__5897__auto___31555)){
args__5903__auto__.push((arguments[i__5898__auto___31556]));

var G__31557 = (i__5898__auto___31556 + (1));
i__5898__auto___31556 = G__31557;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.filter.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.filter.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"filter","filter",-948537934)], null),args);
}));

(honey.sql.helpers.filter.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.filter.cljs$lang$applyTo = (function (seq31131){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31131));
}));

/**
 * Accepts a SQL clause or a SQL expression:
 * 
 *   (lateral (-> (select '*) (from 'foo)))
 *   (lateral '(calc_value bar))
 * 
 *   Produces:
 *   LATERAL (SELECT * FROM foo)
 *   LATERAL CALC_VALUE(bar)
 */
honey.sql.helpers.lateral = (function honey$sql$helpers$lateral(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31558 = arguments.length;
var i__5898__auto___31559 = (0);
while(true){
if((i__5898__auto___31559 < len__5897__auto___31558)){
args__5903__auto__.push((arguments[i__5898__auto___31559]));

var G__31560 = (i__5898__auto___31559 + (1));
i__5898__auto___31559 = G__31560;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.lateral.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.lateral.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"lateral","lateral",2094286431)], null),args);
}));

(honey.sql.helpers.lateral.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.lateral.cljs$lang$applyTo = (function (seq31136){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31136));
}));

/**
 * Accepts any number of OVER clauses, each of which
 *   is a pair of an aggregate function and a window function
 *   or a triple of an aggregate function, a window function,
 *   and an alias:
 * 
 *   (select :id (over [[:avg :salary] (partition-by :department)]))
 * 
 *   Produces: SELECT id, AVG(salary) OVER ()PARTITION BY department)
 */
honey.sql.helpers.over = (function honey$sql$helpers$over(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31562 = arguments.length;
var i__5898__auto___31563 = (0);
while(true){
if((i__5898__auto___31563 < len__5897__auto___31562)){
args__5903__auto__.push((arguments[i__5898__auto___31563]));

var G__31564 = (i__5898__auto___31563 + (1));
i__5898__auto___31563 = G__31564;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.over.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.over.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"over","over",192553051)], null),args)], null);
}));

(honey.sql.helpers.over.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.over.cljs$lang$applyTo = (function (seq31142){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31142));
}));

/**
 * Accepts alternating expressions and clauses and
 *   produces a WITHIN GROUP expression:
 * 
 *   (within-group :%count.* (where :> i 5))
 * 
 *   Produces: COUNT(*) WITHIN GROUP (WHERE i > ?)
 *   Parameters: 5
 */
honey.sql.helpers.within_group = (function honey$sql$helpers$within_group(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31565 = arguments.length;
var i__5898__auto___31566 = (0);
while(true){
if((i__5898__auto___31566 < len__5897__auto___31565)){
args__5903__auto__.push((arguments[i__5898__auto___31566]));

var G__31567 = (i__5898__auto___31566 + (1));
i__5898__auto___31566 = G__31567;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.within_group.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.within_group.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"within-group","within-group",-1794793927)], null),args);
}));

(honey.sql.helpers.within_group.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.within_group.cljs$lang$applyTo = (function (seq31148){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31148));
}));

/**
 * Accepts any number of column names, or column/alias
 *   pairs, or SQL expressions (optionally aliased):
 * 
 *   (facet :id [:foo :bar] [[:max :quux]])
 * 
 *   Produces: FACET id, foo AS bar, MAX(quux)
 */
honey.sql.helpers.facet = (function honey$sql$helpers$facet(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31569 = arguments.length;
var i__5898__auto___31570 = (0);
while(true){
if((i__5898__auto___31570 < len__5897__auto___31569)){
args__5903__auto__.push((arguments[i__5898__auto___31570]));

var G__31571 = (i__5898__auto___31570 + (1));
i__5898__auto___31570 = G__31571;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.facet.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.facet.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"facet","facet",-801327574),args);
}));

(honey.sql.helpers.facet.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.facet.cljs$lang$applyTo = (function (seq31153){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31153));
}));

/**
 * Accepts a time interval such as:
 * 
 *   (since 2 :days :ago)
 * 
 *   Produces: SINCE 2 DAYS AGO
 */
honey.sql.helpers.since = (function honey$sql$helpers$since(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31572 = arguments.length;
var i__5898__auto___31573 = (0);
while(true){
if((i__5898__auto___31573 < len__5897__auto___31572)){
args__5903__auto__.push((arguments[i__5898__auto___31573]));

var G__31574 = (i__5898__auto___31573 + (1));
i__5898__auto___31573 = G__31574;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.since.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.since.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"since","since",315379842),args);
}));

(honey.sql.helpers.since.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.since.cljs$lang$applyTo = (function (seq31155){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31155));
}));

/**
 * Accepts a time interval such as:
 * 
 *   (until 1 :month :ago)
 * 
 *   Produces: UNTIL 1 MONTH AGO
 */
honey.sql.helpers.until = (function honey$sql$helpers$until(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31576 = arguments.length;
var i__5898__auto___31577 = (0);
while(true){
if((i__5898__auto___31577 < len__5897__auto___31576)){
args__5903__auto__.push((arguments[i__5898__auto___31577]));

var G__31578 = (i__5898__auto___31577 + (1));
i__5898__auto___31577 = G__31578;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.until.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.until.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"until","until",-1189166390),args);
}));

(honey.sql.helpers.until.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.until.cljs$lang$applyTo = (function (seq31157){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31157));
}));

/**
 * Accepts a time interval such as:
 * 
 *   (compare-with 1 :week :ago)
 * 
 *   Produces: COMPARE WITH 1 WEEK AGO
 */
honey.sql.helpers.compare_with = (function honey$sql$helpers$compare_with(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31581 = arguments.length;
var i__5898__auto___31582 = (0);
while(true){
if((i__5898__auto___31582 < len__5897__auto___31581)){
args__5903__auto__.push((arguments[i__5898__auto___31582]));

var G__31584 = (i__5898__auto___31582 + (1));
i__5898__auto___31582 = G__31584;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.compare_with.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.compare_with.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"compare-with","compare-with",715346425),args);
}));

(honey.sql.helpers.compare_with.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.compare_with.cljs$lang$applyTo = (function (seq31159){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31159));
}));

/**
 * Accepts a time interval such as:
 * 
 *   (timeseries 1 :day)
 * 
 *   or:
 * 
 *   (timeseries :auto)
 * 
 *   Produces: TIMESERIES 1 DAY
 *   Or:       TIMESERIES AUTO
 */
honey.sql.helpers.timeseries = (function honey$sql$helpers$timeseries(var_args){
var args__5903__auto__ = [];
var len__5897__auto___31588 = arguments.length;
var i__5898__auto___31589 = (0);
while(true){
if((i__5898__auto___31589 < len__5897__auto___31588)){
args__5903__auto__.push((arguments[i__5898__auto___31589]));

var G__31590 = (i__5898__auto___31589 + (1));
i__5898__auto___31589 = G__31590;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return honey.sql.helpers.timeseries.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(honey.sql.helpers.timeseries.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return honey.sql.helpers.generic(new cljs.core.Keyword(null,"timeseries","timeseries",958915787),args);
}));

(honey.sql.helpers.timeseries.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(honey.sql.helpers.timeseries.cljs$lang$applyTo = (function (seq31161){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq31161));
}));

/**
 * Provided purely to ease migration from nilenso/honeysql-postgres
 *   this accepts a single clause, constructed from on-conflict,
 *   do-nothing or do-update-set, and where. Any of those are optional.
 * 
 *   This helper unpacks that clause and turns it into what HoneySQL
 *   2.x expects, with any where clause being an argument to the
 *   do-update-set helper, along with the `:fields`.
 * 
 *   nilenso/honeysql-postgres:
 * 
 *   (-> ...
 *    (upsert (-> (on-conflict :col)
 *                do-nothing)))
 *   (-> ...
 *    (upsert (-> (on-conflict :col)
 *                (do-update-set :x)
 *                (where [:<> :x nil]))))
 * 
 *   HoneySQL 2.x:
 * 
 *   (-> ...
 *    (on-conflict :col)
 *    do-nothing)
 *   (-> ...
 *    (on-conflict :col)
 *    (do-update-set {:fields [:x]
 *                    :where [:<> :x nil]}))
 * 
 *   Alternative structure for that second one:
 * 
 *   (-> ...
 *    (on-conflict :col)
 *    (do-update-set :x {:where [:<> :x nil]}))
 */
honey.sql.helpers.upsert = (function honey$sql$helpers$upsert(var_args){
var G__31167 = arguments.length;
switch (G__31167) {
case 1:
return honey.sql.helpers.upsert.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return honey.sql.helpers.upsert.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(honey.sql.helpers.upsert.cljs$core$IFn$_invoke$arity$1 = (function (clause){
return honey.sql.helpers.upsert.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,clause);
}));

(honey.sql.helpers.upsert.cljs$core$IFn$_invoke$arity$2 = (function (data,clause){
var map__31174 = clause;
var map__31174__$1 = cljs.core.__destructure_map(map__31174);
var on_conflict = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31174__$1,new cljs.core.Keyword(null,"on-conflict","on-conflict",1595391642));
var on_constraint = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31174__$1,new cljs.core.Keyword(null,"on-constraint","on-constraint",1484874675));
var do_nothing = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31174__$1,new cljs.core.Keyword(null,"do-nothing","do-nothing",1030476282));
var do_update_set = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31174__$1,new cljs.core.Keyword(null,"do-update-set","do-update-set",-2028298967));
var where = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31174__$1,new cljs.core.Keyword(null,"where","where",-2044795965));
var G__31175 = data;
var G__31175__$1 = (cljs.core.truth_(on_conflict)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__31175,new cljs.core.Keyword(null,"on-conflict","on-conflict",1595391642),on_conflict):G__31175);
var G__31175__$2 = (cljs.core.truth_(on_constraint)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__31175__$1,new cljs.core.Keyword(null,"on-constraint","on-constraint",1484874675),on_constraint):G__31175__$1);
var G__31175__$3 = (cljs.core.truth_(do_nothing)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__31175__$2,new cljs.core.Keyword(null,"do-nothing","do-nothing",1030476282),do_nothing):G__31175__$2);
if(cljs.core.truth_(do_update_set)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__31175__$3,new cljs.core.Keyword(null,"do-update-set","do-update-set",-2028298967),(cljs.core.truth_(where)?new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"fields","fields",-1932066230),((((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(do_update_set))) && (cljs.core.map_QMARK_(cljs.core.first(do_update_set)))))?cljs.core.first(do_update_set):((cljs.core.every_QMARK_((function (p1__31165_SHARP_){
return ((cljs.core.vector_QMARK_(p1__31165_SHARP_)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((2),cljs.core.count(p1__31165_SHARP_))));
}),do_update_set))?honey.sql.helpers.into.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.PersistentArrayMap.EMPTY,do_update_set], 0)):do_update_set
)),new cljs.core.Keyword(null,"where","where",-2044795965),where], null):do_update_set));
} else {
return G__31175__$3;
}
}));

(honey.sql.helpers.upsert.cljs$lang$maxFixedArity = 2);

/**
 * Most clauses that accept a sequence of items can be implemented
 *   using this helper, as:
 * 
 *   (defn my-helper [& args] (generic-helper-variadic :my-clause args))
 */
honey.sql.helpers.generic_helper_variadic = (function honey$sql$helpers$generic_helper_variadic(k,args){
return honey.sql.helpers.generic(k,args);
});
/**
 * Clauses that accept only a single item can be implemented
 *   using this helper, as:
 * 
 *   (defn my-helper [& args] (generic-helper-unary :my-clause args))
 * 
 *   Even though your helper is designed for clauses that accept
 *   only a single item, you should still define it as variadic,
 *   because that is the convention all helpers use here.
 */
honey.sql.helpers.generic_helper_unary = (function honey$sql$helpers$generic_helper_unary(k,args){
return honey.sql.helpers.generic_1(k,args);
});

//# sourceMappingURL=honey.sql.helpers.js.map
