goog.provide('eta_mu.kanban.ui.sidebar');

eta_mu.kanban.ui.sidebar.task_sidebar = (function (){var G__10865 = (function eta_mu$kanban$ui$sidebar$task_sidebar_render(props__8616__auto__,maybe_ref__8617__auto__){
var vec__10868 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [helix.core.extract_cljs_props(props__8616__auto__),maybe_ref__8617__auto__], null);
var map__10871 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__10868,(0),null);
var map__10871__$1 = cljs.core.__destructure_map(map__10871);
var task = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__10871__$1,new cljs.core.Keyword(null,"task","task",-1476607993));
var detail = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__10871__$1,new cljs.core.Keyword(null,"detail","detail",-1545345025));
var on_close = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__10871__$1,new cljs.core.Keyword(null,"on-close","on-close",-761178394));

var G__10876 = "div";
var G__10877 = (function (){var obj10883 = ({"style":(function (){var obj10885 = ({"width":helix.impl.props.__GT_js("380px"),"minWidth":helix.impl.props.__GT_js("380px"),"borderLeft":helix.impl.props.__GT_js("1px solid var(--token-colors-border-default)"),"background":helix.impl.props.__GT_js("var(--token-colors-background-surface)"),"overflowY":helix.impl.props.__GT_js("auto"),"display":helix.impl.props.__GT_js("flex"),"flexDirection":helix.impl.props.__GT_js("column")});
return obj10885;
})(),"children":[(function (){var G__10886 = "div";
var G__10887 = (function (){var obj10889 = ({"style":(function (){var obj10891 = ({"display":helix.impl.props.__GT_js("flex"),"alignItems":helix.impl.props.__GT_js("center"),"justifyContent":helix.impl.props.__GT_js("space-between"),"padding":helix.impl.props.__GT_js("12px 16px"),"borderBottom":helix.impl.props.__GT_js("1px solid var(--token-colors-border-subtle)")});
return obj10891;
})(),"children":[(function (){var G__10892 = "div";
var G__10893 = (function (){var obj10895 = ({"style":(function (){var obj10897 = ({"display":helix.impl.props.__GT_js("flex"),"alignItems":helix.impl.props.__GT_js("center"),"gap":helix.impl.props.__GT_js("8px")});
return obj10897;
})(),"children":[(function (){var G__10903 = "span";
var G__10904 = (function (){var obj10906 = ({"style":(function (){var obj10908 = ({"background":helix.impl.props.__GT_js("var(--token-colors-badge-default-bg)"),"color":helix.impl.props.__GT_js("var(--token-colors-badge-default-fg)"),"fontSize":helix.impl.props.__GT_js("10px"),"fontWeight":helix.impl.props.__GT_js("600"),"padding":helix.impl.props.__GT_js("2px 6px"),"borderRadius":helix.impl.props.__GT_js("3px")});
return obj10908;
})(),"children":new cljs.core.Keyword(null,"priority","priority",1431093715).cljs$core$IFn$_invoke$arity$1(task)});
return obj10906;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__10903,G__10904) : helix.core.jsx.call(null,G__10903,G__10904));
})(),(function (){var G__10912 = "span";
var G__10913 = (function (){var obj10917 = ({"style":(function (){var obj10919 = ({"fontSize":helix.impl.props.__GT_js("11px"),"color":helix.impl.props.__GT_js("var(--token-colors-text-muted)")});
return obj10919;
})(),"children":new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(task)});
return obj10917;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__10912,G__10913) : helix.core.jsx.call(null,G__10912,G__10913));
})()]});
return obj10895;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__10892,G__10893) : helix.core.jsxs.call(null,G__10892,G__10893));
})(),(function (){var G__10920 = "button";
var G__10921 = (function (){var obj10923 = ({"onClick":on_close,"style":(function (){var obj10926 = ({"background":helix.impl.props.__GT_js("none"),"border":helix.impl.props.__GT_js("none"),"color":helix.impl.props.__GT_js("var(--token-colors-text-muted)"),"cursor":helix.impl.props.__GT_js("pointer"),"fontSize":helix.impl.props.__GT_js("16px"),"padding":helix.impl.props.__GT_js("4px")});
return obj10926;
})(),"children":"\u00D7"});
return obj10923;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__10920,G__10921) : helix.core.jsx.call(null,G__10920,G__10921));
})()]});
return obj10889;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__10886,G__10887) : helix.core.jsxs.call(null,G__10886,G__10887));
})(),(function (){var G__10927 = "div";
var G__10928 = (function (){var obj10931 = ({"style":(function (){var obj10933 = ({"padding":helix.impl.props.__GT_js("12px 16px"),"borderBottom":helix.impl.props.__GT_js("1px solid var(--token-colors-border-subtle)")});
return obj10933;
})(),"children":[(function (){var G__10934 = "h2";
var G__10935 = (function (){var obj10939 = ({"style":(function (){var obj10943 = ({"fontSize":helix.impl.props.__GT_js("15px"),"fontWeight":helix.impl.props.__GT_js("600"),"margin":helix.impl.props.__GT_js("0 0 6px"),"lineHeight":helix.impl.props.__GT_js("1.35")});
return obj10943;
})(),"children":new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(task)});
return obj10939;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__10934,G__10935) : helix.core.jsx.call(null,G__10934,G__10935));
})(),(function (){var G__10945 = "div";
var G__10946 = (function (){var obj10948 = ({"style":(function (){var obj10950 = ({"fontSize":helix.impl.props.__GT_js("11px"),"color":helix.impl.props.__GT_js("var(--token-colors-text-muted)")});
return obj10950;
})(),"children":new cljs.core.Keyword(null,"uuid","uuid",-2145095719).cljs$core$IFn$_invoke$arity$1(task)});
return obj10948;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__10945,G__10946) : helix.core.jsx.call(null,G__10945,G__10946));
})()]});
return obj10931;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__10927,G__10928) : helix.core.jsxs.call(null,G__10927,G__10928));
})(),((cljs.core.seq(new cljs.core.Keyword(null,"labels","labels",-626734591).cljs$core$IFn$_invoke$arity$1(task)))?(function (){var G__10951 = "div";
var G__10952 = (function (){var obj10954 = ({"style":(function (){var obj10956 = ({"padding":helix.impl.props.__GT_js("8px 16px"),"borderBottom":helix.impl.props.__GT_js("1px solid var(--token-colors-border-subtle)"),"display":helix.impl.props.__GT_js("flex"),"flexWrap":helix.impl.props.__GT_js("wrap"),"gap":helix.impl.props.__GT_js("4px")});
return obj10956;
})(),"children":(function (){var iter__5649__auto__ = (function eta_mu$kanban$ui$sidebar$task_sidebar_render_$_iter__10957(s__10958){
return (new cljs.core.LazySeq(null,(function (){
var s__10958__$1 = s__10958;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__10958__$1);
if(temp__5825__auto__){
var s__10958__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__10958__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__10958__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__10960 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__10959 = (0);
while(true){
if((i__10959 < size__5648__auto__)){
var label = cljs.core._nth(c__5647__auto__,i__10959);
cljs.core.chunk_append(b__10960,(function (){var G__10961 = "span";
var G__10962 = (function (){var obj10966 = ({"style":(function (){var obj10968 = ({"fontSize":helix.impl.props.__GT_js("11px"),"color":helix.impl.props.__GT_js("var(--token-colors-text-muted)"),"background":helix.impl.props.__GT_js("var(--token-colors-background-default)"),"padding":helix.impl.props.__GT_js("2px 6px"),"borderRadius":helix.impl.props.__GT_js("3px")});
return obj10968;
})(),"children":label});
return obj10966;
})();
var G__10963 = label;
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$3 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$3(G__10961,G__10962,G__10963) : helix.core.jsx.call(null,G__10961,G__10962,G__10963));
})());

var G__11037 = (i__10959 + (1));
i__10959 = G__11037;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__10960),eta_mu$kanban$ui$sidebar$task_sidebar_render_$_iter__10957(cljs.core.chunk_rest(s__10958__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__10960),null);
}
} else {
var label = cljs.core.first(s__10958__$2);
return cljs.core.cons((function (){var G__10973 = "span";
var G__10974 = (function (){var obj10977 = ({"style":(function (){var obj10979 = ({"fontSize":helix.impl.props.__GT_js("11px"),"color":helix.impl.props.__GT_js("var(--token-colors-text-muted)"),"background":helix.impl.props.__GT_js("var(--token-colors-background-default)"),"padding":helix.impl.props.__GT_js("2px 6px"),"borderRadius":helix.impl.props.__GT_js("3px")});
return obj10979;
})(),"children":label});
return obj10977;
})();
var G__10975 = label;
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$3 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$3(G__10973,G__10974,G__10975) : helix.core.jsx.call(null,G__10973,G__10974,G__10975));
})(),eta_mu$kanban$ui$sidebar$task_sidebar_render_$_iter__10957(cljs.core.rest(s__10958__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(new cljs.core.Keyword(null,"labels","labels",-626734591).cljs$core$IFn$_invoke$arity$1(task));
})()});
return obj10954;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__10951,G__10952) : helix.core.jsx.call(null,G__10951,G__10952));
})():null),(cljs.core.truth_(new cljs.core.Keyword(null,"sourcePath","sourcePath",-986600405).cljs$core$IFn$_invoke$arity$1(task))?(function (){var G__10987 = "div";
var G__10988 = (function (){var obj10990 = ({"style":(function (){var obj10992 = ({"padding":helix.impl.props.__GT_js("8px 16px"),"borderBottom":helix.impl.props.__GT_js("1px solid var(--token-colors-border-subtle)"),"fontSize":helix.impl.props.__GT_js("11px"),"color":helix.impl.props.__GT_js("var(--token-colors-text-muted)"),"wordBreak":helix.impl.props.__GT_js("break-all")});
return obj10992;
})(),"children":new cljs.core.Keyword(null,"sourcePath","sourcePath",-986600405).cljs$core$IFn$_invoke$arity$1(task)});
return obj10990;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__10987,G__10988) : helix.core.jsx.call(null,G__10987,G__10988));
})():null),(function (){var G__10997 = "div";
var G__10998 = (function (){var obj11000 = ({"style":(function (){var obj11002 = ({"flex":helix.impl.props.__GT_js("1"),"padding":helix.impl.props.__GT_js("12px 16px"),"overflowY":helix.impl.props.__GT_js("auto")});
return obj11002;
})(),"children":(cljs.core.truth_(detail)?(function (){var G__11005 = "div";
var G__11006 = (function (){var obj11008 = ({"className":"md","dangerouslySetInnerHTML":new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"__html","__html",674048345),marked((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(detail);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())], null)});
return obj11008;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__11005,G__11006) : helix.core.jsx.call(null,G__11005,G__11006));
})():(function (){var G__11013 = "div";
var G__11014 = (function (){var obj11016 = ({"style":(function (){var obj11018 = ({"color":helix.impl.props.__GT_js("var(--token-colors-text-muted)"),"fontSize":helix.impl.props.__GT_js("12px")});
return obj11018;
})(),"children":"Loading..."});
return obj11016;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__11013,G__11014) : helix.core.jsx.call(null,G__11013,G__11014));
})())});
return obj11000;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__10997,G__10998) : helix.core.jsx.call(null,G__10997,G__10998));
})()]});
return obj10883;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__10876,G__10877) : helix.core.jsxs.call(null,G__10876,G__10877));
});
if(goog.DEBUG === true){
var G__11023 = G__10865;
(G__11023.displayName = "eta-mu.kanban.ui.sidebar/task-sidebar");

return G__11023;
} else {
return G__10865;
}
})();




//# sourceMappingURL=eta_mu.kanban.ui.sidebar.js.map
