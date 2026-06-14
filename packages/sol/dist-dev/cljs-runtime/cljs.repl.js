import "./cljs_env.js";
import "./cljs.core.js";
import "./cljs.spec.alpha.js";
import "./goog.string.string.js";
import "./goog.string.stringformat.js";
goog.provide('cljs.repl');
cljs.repl.print_doc = (function cljs$repl$print_doc(p__25655){
var map__25657 = p__25655;
var map__25657__$1 = cljs.core.__destructure_map(map__25657);
var m = map__25657__$1;
var n = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25657__$1,new cljs.core.Keyword(null,"ns","ns",441598760));
var nm = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25657__$1,new cljs.core.Keyword(null,"name","name",1843675177));
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["-------------------------"], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"spec","spec",347520401).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var temp__5825__auto__ = new cljs.core.Keyword(null,"ns","ns",441598760).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(temp__5825__auto__)){
var ns = temp__5825__auto__;
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns)+"/");
} else {
return null;
}
})())+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(m)));
}
})()], 0));

if(cljs.core.truth_(new cljs.core.Keyword(null,"protocol","protocol",652470118).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Protocol"], 0));
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"forms","forms",2045992350).cljs$core$IFn$_invoke$arity$1(m))){
var seq__25665_25811 = cljs.core.seq(new cljs.core.Keyword(null,"forms","forms",2045992350).cljs$core$IFn$_invoke$arity$1(m));
var chunk__25667_25812 = null;
var count__25668_25813 = (0);
var i__25669_25814 = (0);
while(true){
if((i__25669_25814 < count__25668_25813)){
var f_25815 = chunk__25667_25812.cljs$core$IIndexed$_nth$arity$2(null,i__25669_25814);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  ",f_25815], 0));


var G__25822 = seq__25665_25811;
var G__25823 = chunk__25667_25812;
var G__25824 = count__25668_25813;
var G__25825 = (i__25669_25814 + (1));
seq__25665_25811 = G__25822;
chunk__25667_25812 = G__25823;
count__25668_25813 = G__25824;
i__25669_25814 = G__25825;
continue;
} else {
var temp__5825__auto___25828 = cljs.core.seq(seq__25665_25811);
if(temp__5825__auto___25828){
var seq__25665_25829__$1 = temp__5825__auto___25828;
if(cljs.core.chunked_seq_QMARK_(seq__25665_25829__$1)){
var c__5694__auto___25831 = cljs.core.chunk_first(seq__25665_25829__$1);
var G__25832 = cljs.core.chunk_rest(seq__25665_25829__$1);
var G__25833 = c__5694__auto___25831;
var G__25834 = cljs.core.count(c__5694__auto___25831);
var G__25835 = (0);
seq__25665_25811 = G__25832;
chunk__25667_25812 = G__25833;
count__25668_25813 = G__25834;
i__25669_25814 = G__25835;
continue;
} else {
var f_25837 = cljs.core.first(seq__25665_25829__$1);
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["  ",f_25837], 0));


var G__25838 = cljs.core.next(seq__25665_25829__$1);
var G__25839 = null;
var G__25840 = (0);
var G__25841 = (0);
seq__25665_25811 = G__25838;
chunk__25667_25812 = G__25839;
count__25668_25813 = G__25840;
i__25669_25814 = G__25841;
continue;
}
} else {
}
}
break;
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m))){
var arglists_25844 = new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"macro","macro",-867863404).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"repl-special-function","repl-special-function",1262603725).cljs$core$IFn$_invoke$arity$1(m);
}
})())){
cljs.core.prn.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([arglists_25844], 0));
} else {
cljs.core.prn.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"quote","quote",1377916282,null),cljs.core.first(arglists_25844)))?cljs.core.second(arglists_25844):arglists_25844)], 0));
}
} else {
}
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"special-form","special-form",-1326536374).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Special Form"], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",new cljs.core.Keyword(null,"doc","doc",1913296891).cljs$core$IFn$_invoke$arity$1(m)], 0));

if(cljs.core.contains_QMARK_(m,new cljs.core.Keyword(null,"url","url",276297046))){
if(cljs.core.truth_(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(m))){
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(""+"\n  Please see http://clojure.org/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(m)))], 0));
} else {
return null;
}
} else {
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(""+"\n  Please see http://clojure.org/special_forms#"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(m)))], 0));
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"macro","macro",-867863404).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Macro"], 0));
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"spec","spec",347520401).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Spec"], 0));
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"repl-special-function","repl-special-function",1262603725).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["REPL Special Function"], 0));
} else {
}

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",new cljs.core.Keyword(null,"doc","doc",1913296891).cljs$core$IFn$_invoke$arity$1(m)], 0));

if(cljs.core.truth_(new cljs.core.Keyword(null,"protocol","protocol",652470118).cljs$core$IFn$_invoke$arity$1(m))){
var seq__25674_25847 = cljs.core.seq(new cljs.core.Keyword(null,"methods","methods",453930866).cljs$core$IFn$_invoke$arity$1(m));
var chunk__25675_25848 = null;
var count__25676_25849 = (0);
var i__25677_25850 = (0);
while(true){
if((i__25677_25850 < count__25676_25849)){
var vec__25692_25852 = chunk__25675_25848.cljs$core$IIndexed$_nth$arity$2(null,i__25677_25850);
var name_25853 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25692_25852,(0),null);
var map__25695_25854 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25692_25852,(1),null);
var map__25695_25855__$1 = cljs.core.__destructure_map(map__25695_25854);
var doc_25856 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25695_25855__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
var arglists_25857 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25695_25855__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
cljs.core.println();

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",name_25853], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",arglists_25857], 0));

if(cljs.core.truth_(doc_25856)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",doc_25856], 0));
} else {
}


var G__25858 = seq__25674_25847;
var G__25859 = chunk__25675_25848;
var G__25860 = count__25676_25849;
var G__25861 = (i__25677_25850 + (1));
seq__25674_25847 = G__25858;
chunk__25675_25848 = G__25859;
count__25676_25849 = G__25860;
i__25677_25850 = G__25861;
continue;
} else {
var temp__5825__auto___25863 = cljs.core.seq(seq__25674_25847);
if(temp__5825__auto___25863){
var seq__25674_25865__$1 = temp__5825__auto___25863;
if(cljs.core.chunked_seq_QMARK_(seq__25674_25865__$1)){
var c__5694__auto___25869 = cljs.core.chunk_first(seq__25674_25865__$1);
var G__25870 = cljs.core.chunk_rest(seq__25674_25865__$1);
var G__25871 = c__5694__auto___25869;
var G__25872 = cljs.core.count(c__5694__auto___25869);
var G__25873 = (0);
seq__25674_25847 = G__25870;
chunk__25675_25848 = G__25871;
count__25676_25849 = G__25872;
i__25677_25850 = G__25873;
continue;
} else {
var vec__25697_25874 = cljs.core.first(seq__25674_25865__$1);
var name_25875 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25697_25874,(0),null);
var map__25700_25876 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25697_25874,(1),null);
var map__25700_25877__$1 = cljs.core.__destructure_map(map__25700_25876);
var doc_25878 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25700_25877__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
var arglists_25879 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25700_25877__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
cljs.core.println();

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",name_25875], 0));

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",arglists_25879], 0));

if(cljs.core.truth_(doc_25878)){
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([" ",doc_25878], 0));
} else {
}


var G__25881 = cljs.core.next(seq__25674_25865__$1);
var G__25882 = null;
var G__25883 = (0);
var G__25884 = (0);
seq__25674_25847 = G__25881;
chunk__25675_25848 = G__25882;
count__25676_25849 = G__25883;
i__25677_25850 = G__25884;
continue;
}
} else {
}
}
break;
}
} else {
}

if(cljs.core.truth_(n)){
var temp__5825__auto__ = cljs.spec.alpha.get_spec(cljs.core.symbol.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.ns_name(n))),cljs.core.name(nm)));
if(cljs.core.truth_(temp__5825__auto__)){
var fnspec = temp__5825__auto__;
cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Spec"], 0));

var seq__25706 = cljs.core.seq(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"args","args",1315556576),new cljs.core.Keyword(null,"ret","ret",-468222814),new cljs.core.Keyword(null,"fn","fn",-1175266204)], null));
var chunk__25707 = null;
var count__25708 = (0);
var i__25709 = (0);
while(true){
if((i__25709 < count__25708)){
var role = chunk__25707.cljs$core$IIndexed$_nth$arity$2(null,i__25709);
var temp__5825__auto___25890__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(fnspec,role);
if(cljs.core.truth_(temp__5825__auto___25890__$1)){
var spec_25892 = temp__5825__auto___25890__$1;
cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(""+"\n "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.name(role))+":"),cljs.spec.alpha.describe(spec_25892)], 0));
} else {
}


var G__25893 = seq__25706;
var G__25894 = chunk__25707;
var G__25895 = count__25708;
var G__25896 = (i__25709 + (1));
seq__25706 = G__25893;
chunk__25707 = G__25894;
count__25708 = G__25895;
i__25709 = G__25896;
continue;
} else {
var temp__5825__auto____$1 = cljs.core.seq(seq__25706);
if(temp__5825__auto____$1){
var seq__25706__$1 = temp__5825__auto____$1;
if(cljs.core.chunked_seq_QMARK_(seq__25706__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__25706__$1);
var G__25897 = cljs.core.chunk_rest(seq__25706__$1);
var G__25898 = c__5694__auto__;
var G__25899 = cljs.core.count(c__5694__auto__);
var G__25900 = (0);
seq__25706 = G__25897;
chunk__25707 = G__25898;
count__25708 = G__25899;
i__25709 = G__25900;
continue;
} else {
var role = cljs.core.first(seq__25706__$1);
var temp__5825__auto___25901__$2 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(fnspec,role);
if(cljs.core.truth_(temp__5825__auto___25901__$2)){
var spec_25902 = temp__5825__auto___25901__$2;
cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(""+"\n "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.name(role))+":"),cljs.spec.alpha.describe(spec_25902)], 0));
} else {
}


var G__25903 = cljs.core.next(seq__25706__$1);
var G__25904 = null;
var G__25905 = (0);
var G__25906 = (0);
seq__25706 = G__25903;
chunk__25707 = G__25904;
count__25708 = G__25905;
i__25709 = G__25906;
continue;
}
} else {
return null;
}
}
break;
}
} else {
return null;
}
} else {
return null;
}
}
});
/**
 * Constructs a data representation for a Error with keys:
 *  :cause - root cause message
 *  :phase - error phase
 *  :via - cause chain, with cause keys:
 *           :type - exception class symbol
 *           :message - exception message
 *           :data - ex-data
 *           :at - top stack element
 *  :trace - root cause stack elements
 */
cljs.repl.Error__GT_map = (function cljs$repl$Error__GT_map(o){
return cljs.core.Throwable__GT_map(o);
});
/**
 * Returns an analysis of the phase, error, cause, and location of an error that occurred
 *   based on Throwable data, as returned by Throwable->map. All attributes other than phase
 *   are optional:
 *  :clojure.error/phase - keyword phase indicator, one of:
 *    :read-source :compile-syntax-check :compilation :macro-syntax-check :macroexpansion
 *    :execution :read-eval-result :print-eval-result
 *  :clojure.error/source - file name (no path)
 *  :clojure.error/line - integer line number
 *  :clojure.error/column - integer column number
 *  :clojure.error/symbol - symbol being expanded/compiled/invoked
 *  :clojure.error/class - cause exception class symbol
 *  :clojure.error/cause - cause exception message
 *  :clojure.error/spec - explain-data for spec error
 */
cljs.repl.ex_triage = (function cljs$repl$ex_triage(datafied_throwable){
var map__25718 = datafied_throwable;
var map__25718__$1 = cljs.core.__destructure_map(map__25718);
var via = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25718__$1,new cljs.core.Keyword(null,"via","via",-1904457336));
var trace = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25718__$1,new cljs.core.Keyword(null,"trace","trace",-1082747415));
var phase = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__25718__$1,new cljs.core.Keyword(null,"phase","phase",575722892),new cljs.core.Keyword(null,"execution","execution",253283524));
var map__25719 = cljs.core.last(via);
var map__25719__$1 = cljs.core.__destructure_map(map__25719);
var type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25719__$1,new cljs.core.Keyword(null,"type","type",1174270348));
var message = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25719__$1,new cljs.core.Keyword(null,"message","message",-406056002));
var data = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25719__$1,new cljs.core.Keyword(null,"data","data",-232669377));
var map__25720 = data;
var map__25720__$1 = cljs.core.__destructure_map(map__25720);
var problems = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25720__$1,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814));
var fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25720__$1,new cljs.core.Keyword("cljs.spec.alpha","fn","cljs.spec.alpha/fn",408600443));
var caller = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25720__$1,new cljs.core.Keyword("cljs.spec.test.alpha","caller","cljs.spec.test.alpha/caller",-398302390));
var map__25721 = new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(cljs.core.first(via));
var map__25721__$1 = cljs.core.__destructure_map(map__25721);
var top_data = map__25721__$1;
var source = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25721__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3((function (){var G__25729 = phase;
var G__25729__$1 = (((G__25729 instanceof cljs.core.Keyword))?G__25729.fqn:null);
switch (G__25729__$1) {
case "read-source":
var map__25732 = data;
var map__25732__$1 = cljs.core.__destructure_map(map__25732);
var line = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25732__$1,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471));
var column = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25732__$1,new cljs.core.Keyword("clojure.error","column","clojure.error/column",304721553));
var G__25733 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(cljs.core.second(via)),top_data], 0));
var G__25733__$1 = (cljs.core.truth_(source)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25733,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),source):G__25733);
var G__25733__$2 = (cljs.core.truth_((function (){var fexpr__25734 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null);
return (fexpr__25734.cljs$core$IFn$_invoke$arity$1 ? fexpr__25734.cljs$core$IFn$_invoke$arity$1(source) : fexpr__25734.call(null,source));
})())?cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__25733__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397)):G__25733__$1);
if(cljs.core.truth_(message)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25733__$2,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message);
} else {
return G__25733__$2;
}

break;
case "compile-syntax-check":
case "compilation":
case "macro-syntax-check":
case "macroexpansion":
var G__25736 = top_data;
var G__25736__$1 = (cljs.core.truth_(source)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25736,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),source):G__25736);
var G__25736__$2 = (cljs.core.truth_((function (){var fexpr__25737 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null);
return (fexpr__25737.cljs$core$IFn$_invoke$arity$1 ? fexpr__25737.cljs$core$IFn$_invoke$arity$1(source) : fexpr__25737.call(null,source));
})())?cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__25736__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397)):G__25736__$1);
var G__25736__$3 = (cljs.core.truth_(type)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25736__$2,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type):G__25736__$2);
var G__25736__$4 = (cljs.core.truth_(message)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25736__$3,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message):G__25736__$3);
if(cljs.core.truth_(problems)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25736__$4,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595),data);
} else {
return G__25736__$4;
}

break;
case "read-eval-result":
case "print-eval-result":
var vec__25738 = cljs.core.first(trace);
var source__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25738,(0),null);
var method = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25738,(1),null);
var file = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25738,(2),null);
var line = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25738,(3),null);
var G__25744 = top_data;
var G__25744__$1 = (cljs.core.truth_(line)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25744,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471),line):G__25744);
var G__25744__$2 = (cljs.core.truth_(file)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25744__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),file):G__25744__$1);
var G__25744__$3 = (cljs.core.truth_((function (){var and__5160__auto__ = source__$1;
if(cljs.core.truth_(and__5160__auto__)){
return method;
} else {
return and__5160__auto__;
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25744__$2,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[source__$1,method],null))):G__25744__$2);
var G__25744__$4 = (cljs.core.truth_(type)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25744__$3,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type):G__25744__$3);
if(cljs.core.truth_(message)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25744__$4,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message);
} else {
return G__25744__$4;
}

break;
case "execution":
var vec__25746 = cljs.core.first(trace);
var source__$1 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25746,(0),null);
var method = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25746,(1),null);
var file = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25746,(2),null);
var line = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25746,(3),null);
var file__$1 = cljs.core.first(cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p1__25717_SHARP_){
var or__5162__auto__ = (p1__25717_SHARP_ == null);
if(or__5162__auto__){
return or__5162__auto__;
} else {
var fexpr__25749 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["NO_SOURCE_PATH",null,"NO_SOURCE_FILE",null], null), null);
return (fexpr__25749.cljs$core$IFn$_invoke$arity$1 ? fexpr__25749.cljs$core$IFn$_invoke$arity$1(p1__25717_SHARP_) : fexpr__25749.call(null,p1__25717_SHARP_));
}
}),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"file","file",-1269645878).cljs$core$IFn$_invoke$arity$1(caller),file], null)));
var err_line = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"line","line",212345235).cljs$core$IFn$_invoke$arity$1(caller);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return line;
}
})();
var G__25751 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890),type], null);
var G__25751__$1 = (cljs.core.truth_(err_line)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25751,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471),err_line):G__25751);
var G__25751__$2 = (cljs.core.truth_(message)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25751__$1,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742),message):G__25751__$1);
var G__25751__$3 = (cljs.core.truth_((function (){var or__5162__auto__ = fn;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var and__5160__auto__ = source__$1;
if(cljs.core.truth_(and__5160__auto__)){
return method;
} else {
return and__5160__auto__;
}
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25751__$2,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994),(function (){var or__5162__auto__ = fn;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[source__$1,method],null));
}
})()):G__25751__$2);
var G__25751__$4 = (cljs.core.truth_(file__$1)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25751__$3,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397),file__$1):G__25751__$3);
if(cljs.core.truth_(problems)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25751__$4,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595),data);
} else {
return G__25751__$4;
}

break;
default:
throw (new Error((""+"No matching clause: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25729__$1))));

}
})(),new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358),phase);
});
/**
 * Returns a string from exception data, as produced by ex-triage.
 *   The first line summarizes the exception phase and location.
 *   The subsequent lines describe the cause.
 */
cljs.repl.ex_str = (function cljs$repl$ex_str(p__25758){
var map__25759 = p__25758;
var map__25759__$1 = cljs.core.__destructure_map(map__25759);
var triage_data = map__25759__$1;
var phase = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25759__$1,new cljs.core.Keyword("clojure.error","phase","clojure.error/phase",275140358));
var source = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25759__$1,new cljs.core.Keyword("clojure.error","source","clojure.error/source",-2011936397));
var line = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25759__$1,new cljs.core.Keyword("clojure.error","line","clojure.error/line",-1816287471));
var column = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25759__$1,new cljs.core.Keyword("clojure.error","column","clojure.error/column",304721553));
var symbol = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25759__$1,new cljs.core.Keyword("clojure.error","symbol","clojure.error/symbol",1544821994));
var class$ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25759__$1,new cljs.core.Keyword("clojure.error","class","clojure.error/class",278435890));
var cause = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25759__$1,new cljs.core.Keyword("clojure.error","cause","clojure.error/cause",-1879175742));
var spec = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25759__$1,new cljs.core.Keyword("clojure.error","spec","clojure.error/spec",2055032595));
var loc = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = source;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "<cljs repl>";
}
})())+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = line;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (1);
}
})())+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(column)?(""+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(column)):"")));
var class_name = cljs.core.name((function (){var or__5162__auto__ = class$;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var simple_class = class_name;
var cause_type = ((cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["RuntimeException",null,"Exception",null], null), null),simple_class))?"":(""+" ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(simple_class)+")"));
var format = goog.string.format;
var G__25761 = phase;
var G__25761__$1 = (((G__25761 instanceof cljs.core.Keyword))?G__25761.fqn:null);
switch (G__25761__$1) {
case "read-source":
return (format.cljs$core$IFn$_invoke$arity$3 ? format.cljs$core$IFn$_invoke$arity$3("Syntax error reading source at (%s).\n%s\n",loc,cause) : format.call(null,"Syntax error reading source at (%s).\n%s\n",loc,cause));

break;
case "macro-syntax-check":
var G__25762 = "Syntax error macroexpanding %sat (%s).\n%s";
var G__25763 = (cljs.core.truth_(symbol)?(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)+" "):"");
var G__25764 = loc;
var G__25765 = (cljs.core.truth_(spec)?(function (){var sb__5816__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR__orig_val__25766_25930 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR__orig_val__25767_25931 = cljs.core._STAR_print_fn_STAR_;
var _STAR_print_newline_STAR__temp_val__25768_25932 = true;
var _STAR_print_fn_STAR__temp_val__25769_25933 = (function (x__5817__auto__){
return sb__5816__auto__.append(x__5817__auto__);
});
(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__temp_val__25768_25932);

(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__temp_val__25769_25933);

try{cljs.spec.alpha.explain_out(cljs.core.update.cljs$core$IFn$_invoke$arity$3(spec,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814),(function (probs){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__25755_SHARP_){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(p1__25755_SHARP_,new cljs.core.Keyword(null,"in","in",-1531184865));
}),probs);
}))
);
}finally {(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__orig_val__25767_25931);

(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__orig_val__25766_25930);
}
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sb__5816__auto__));
})():(format.cljs$core$IFn$_invoke$arity$2 ? format.cljs$core$IFn$_invoke$arity$2("%s\n",cause) : format.call(null,"%s\n",cause)));
return (format.cljs$core$IFn$_invoke$arity$4 ? format.cljs$core$IFn$_invoke$arity$4(G__25762,G__25763,G__25764,G__25765) : format.call(null,G__25762,G__25763,G__25764,G__25765));

break;
case "macroexpansion":
var G__25771 = "Unexpected error%s macroexpanding %sat (%s).\n%s\n";
var G__25772 = cause_type;
var G__25773 = (cljs.core.truth_(symbol)?(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)+" "):"");
var G__25774 = loc;
var G__25775 = cause;
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5(G__25771,G__25772,G__25773,G__25774,G__25775) : format.call(null,G__25771,G__25772,G__25773,G__25774,G__25775));

break;
case "compile-syntax-check":
var G__25776 = "Syntax error%s compiling %sat (%s).\n%s\n";
var G__25777 = cause_type;
var G__25778 = (cljs.core.truth_(symbol)?(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)+" "):"");
var G__25779 = loc;
var G__25780 = cause;
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5(G__25776,G__25777,G__25778,G__25779,G__25780) : format.call(null,G__25776,G__25777,G__25778,G__25779,G__25780));

break;
case "compilation":
var G__25781 = "Unexpected error%s compiling %sat (%s).\n%s\n";
var G__25782 = cause_type;
var G__25783 = (cljs.core.truth_(symbol)?(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)+" "):"");
var G__25784 = loc;
var G__25785 = cause;
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5(G__25781,G__25782,G__25783,G__25784,G__25785) : format.call(null,G__25781,G__25782,G__25783,G__25784,G__25785));

break;
case "read-eval-result":
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5("Error reading eval result%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause) : format.call(null,"Error reading eval result%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause));

break;
case "print-eval-result":
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5("Error printing return value%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause) : format.call(null,"Error printing return value%s at %s (%s).\n%s\n",cause_type,symbol,loc,cause));

break;
case "execution":
if(cljs.core.truth_(spec)){
var G__25788 = "Execution error - invalid arguments to %s at (%s).\n%s";
var G__25789 = symbol;
var G__25790 = loc;
var G__25791 = (function (){var sb__5816__auto__ = (new goog.string.StringBuffer());
var _STAR_print_newline_STAR__orig_val__25794_25937 = cljs.core._STAR_print_newline_STAR_;
var _STAR_print_fn_STAR__orig_val__25795_25938 = cljs.core._STAR_print_fn_STAR_;
var _STAR_print_newline_STAR__temp_val__25796_25939 = true;
var _STAR_print_fn_STAR__temp_val__25797_25940 = (function (x__5817__auto__){
return sb__5816__auto__.append(x__5817__auto__);
});
(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__temp_val__25796_25939);

(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__temp_val__25797_25940);

try{cljs.spec.alpha.explain_out(cljs.core.update.cljs$core$IFn$_invoke$arity$3(spec,new cljs.core.Keyword("cljs.spec.alpha","problems","cljs.spec.alpha/problems",447400814),(function (probs){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__25757_SHARP_){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(p1__25757_SHARP_,new cljs.core.Keyword(null,"in","in",-1531184865));
}),probs);
}))
);
}finally {(cljs.core._STAR_print_fn_STAR_ = _STAR_print_fn_STAR__orig_val__25795_25938);

(cljs.core._STAR_print_newline_STAR_ = _STAR_print_newline_STAR__orig_val__25794_25937);
}
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sb__5816__auto__));
})();
return (format.cljs$core$IFn$_invoke$arity$4 ? format.cljs$core$IFn$_invoke$arity$4(G__25788,G__25789,G__25790,G__25791) : format.call(null,G__25788,G__25789,G__25790,G__25791));
} else {
var G__25798 = "Execution error%s at %s(%s).\n%s\n";
var G__25799 = cause_type;
var G__25801 = (cljs.core.truth_(symbol)?(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(symbol)+" "):"");
var G__25802 = loc;
var G__25803 = cause;
return (format.cljs$core$IFn$_invoke$arity$5 ? format.cljs$core$IFn$_invoke$arity$5(G__25798,G__25799,G__25801,G__25802,G__25803) : format.call(null,G__25798,G__25799,G__25801,G__25802,G__25803));
}

break;
default:
throw (new Error((""+"No matching clause: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25761__$1))));

}
});
cljs.repl.error__GT_str = (function cljs$repl$error__GT_str(error){
return cljs.repl.ex_str(cljs.repl.ex_triage(cljs.repl.Error__GT_map(error)));
});

//# sourceMappingURL=cljs.repl.js.map
