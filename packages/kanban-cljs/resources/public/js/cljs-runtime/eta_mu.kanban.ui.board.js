goog.provide('eta_mu.kanban.ui.board');
eta_mu.kanban.ui.board.priority_color = (function eta_mu$kanban$ui$board$priority_color(p){
var G__7192 = p;
switch (G__7192) {
case "P0":
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"bg","bg",-206688421),"var(--token-colors-badge-error-bg)",new cljs.core.Keyword(null,"fg","fg",-101797208),"var(--token-colors-badge-error-fg)"], null);

break;
case "P1":
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"bg","bg",-206688421),"var(--token-colors-badge-warning-bg)",new cljs.core.Keyword(null,"fg","fg",-101797208),"var(--token-colors-badge-warning-fg)"], null);

break;
case "P2":
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"bg","bg",-206688421),"var(--token-colors-badge-info-bg)",new cljs.core.Keyword(null,"fg","fg",-101797208),"var(--token-colors-badge-info-fg)"], null);

break;
default:
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"bg","bg",-206688421),"var(--token-colors-badge-success-bg)",new cljs.core.Keyword(null,"fg","fg",-101797208),"var(--token-colors-badge-success-fg)"], null);

}
});

eta_mu.kanban.ui.board.task_card = (function (){var G__7202 = (function eta_mu$kanban$ui$board$task_card_render(props__6382__auto__,maybe_ref__6383__auto__){
var vec__7203 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [helix.core.extract_cljs_props(props__6382__auto__),maybe_ref__6383__auto__], null);
var map__7206 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7203,(0),null);
var map__7206__$1 = cljs.core.__destructure_map(map__7206);
var task = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7206__$1,new cljs.core.Keyword(null,"task","task",-1476607993));
var on_select = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7206__$1,new cljs.core.Keyword(null,"on-select","on-select",-192407950));

var prio = eta_mu.kanban.ui.board.priority_color(new cljs.core.Keyword(null,"priority","priority",1431093715).cljs$core$IFn$_invoke$arity$1(task));
var G__7207 = "div";
var G__7208 = (function (){var obj7210 = ({"onClick":(function (){
return (on_select.cljs$core$IFn$_invoke$arity$1 ? on_select.cljs$core$IFn$_invoke$arity$1(task) : on_select.call(null,task));
}),"style":(function (){var obj7213 = ({"background":helix.impl.props.__GT_js("var(--token-colors-background-elevated)"),"border":helix.impl.props.__GT_js("1px solid var(--token-colors-border-subtle)"),"borderRadius":helix.impl.props.__GT_js("6px"),"padding":helix.impl.props.__GT_js("8px 10px"),"marginBottom":helix.impl.props.__GT_js("6px"),"cursor":helix.impl.props.__GT_js("pointer")});
return obj7213;
})(),"children":[(function (){var G__7216 = "div";
var G__7217 = (function (){var obj7219 = ({"style":(function (){var obj7222 = ({"display":helix.impl.props.__GT_js("flex"),"alignItems":helix.impl.props.__GT_js("center"),"gap":helix.impl.props.__GT_js("6px"),"marginBottom":helix.impl.props.__GT_js("4px")});
return obj7222;
})(),"children":[(function (){var G__7226 = "span";
var G__7227 = (function (){var obj7229 = ({"style":(function (){var obj7231 = ({"background":helix.impl.props.__GT_js(new cljs.core.Keyword(null,"bg","bg",-206688421).cljs$core$IFn$_invoke$arity$1(prio)),"color":helix.impl.props.__GT_js(new cljs.core.Keyword(null,"fg","fg",-101797208).cljs$core$IFn$_invoke$arity$1(prio)),"fontSize":helix.impl.props.__GT_js("10px"),"fontWeight":helix.impl.props.__GT_js("600"),"padding":helix.impl.props.__GT_js("1px 5px"),"borderRadius":helix.impl.props.__GT_js("3px")});
return obj7231;
})(),"children":new cljs.core.Keyword(null,"priority","priority",1431093715).cljs$core$IFn$_invoke$arity$1(task)});
return obj7229;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7226,G__7227) : helix.core.jsx.call(null,G__7226,G__7227));
})(),(cljs.core.truth_(new cljs.core.Keyword(null,"source-board","source-board",717012848).cljs$core$IFn$_invoke$arity$1(task))?(function (){var G__7237 = "span";
var G__7238 = (function (){var obj7240 = ({"style":(function (){var obj7243 = ({"color":helix.impl.props.__GT_js("var(--token-colors-text-muted)"),"fontSize":helix.impl.props.__GT_js("10px")});
return obj7243;
})(),"children":new cljs.core.Keyword(null,"source-board","source-board",717012848).cljs$core$IFn$_invoke$arity$1(task)});
return obj7240;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7237,G__7238) : helix.core.jsx.call(null,G__7237,G__7238));
})():null)]});
return obj7219;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__7216,G__7217) : helix.core.jsxs.call(null,G__7216,G__7217));
})(),(function (){var G__7245 = "div";
var G__7246 = (function (){var obj7251 = ({"style":(function (){var obj7254 = ({"fontSize":helix.impl.props.__GT_js("13px"),"fontWeight":helix.impl.props.__GT_js("500"),"lineHeight":helix.impl.props.__GT_js("1.35"),"color":helix.impl.props.__GT_js("var(--token-colors-text-default)")});
return obj7254;
})(),"children":new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(task)});
return obj7251;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7245,G__7246) : helix.core.jsx.call(null,G__7245,G__7246));
})()]});
return obj7210;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__7207,G__7208) : helix.core.jsxs.call(null,G__7207,G__7208));
});
if(goog.DEBUG === true){
var G__7256 = G__7202;
(G__7256.displayName = "eta-mu.kanban.ui.board/task-card");

return G__7256;
} else {
return G__7202;
}
})();




eta_mu.kanban.ui.board.column_view = (function (){var G__7263 = (function eta_mu$kanban$ui$board$column_view_render(props__6382__auto__,maybe_ref__6383__auto__){
var vec__7264 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [helix.core.extract_cljs_props(props__6382__auto__),maybe_ref__6383__auto__], null);
var map__7267 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7264,(0),null);
var map__7267__$1 = cljs.core.__destructure_map(map__7267);
var column = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7267__$1,new cljs.core.Keyword(null,"column","column",2078222095));
var on_select = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7267__$1,new cljs.core.Keyword(null,"on-select","on-select",-192407950));

var G__7268 = "div";
var G__7269 = (function (){var obj7271 = ({"style":(function (){var obj7273 = ({"minWidth":helix.impl.props.__GT_js("220px"),"maxWidth":helix.impl.props.__GT_js("280px"),"flexShrink":helix.impl.props.__GT_js("0")});
return obj7273;
})(),"children":[(function (){var G__7275 = "div";
var G__7276 = (function (){var obj7280 = ({"style":(function (){var obj7282 = ({"display":helix.impl.props.__GT_js("flex"),"alignItems":helix.impl.props.__GT_js("center"),"gap":helix.impl.props.__GT_js("6px"),"padding":helix.impl.props.__GT_js("8px 4px"),"marginBottom":helix.impl.props.__GT_js("6px")});
return obj7282;
})(),"children":[(function (){var G__7287 = "h3";
var G__7288 = (function (){var obj7290 = ({"style":(function (){var obj7294 = ({"fontSize":helix.impl.props.__GT_js("12px"),"fontWeight":helix.impl.props.__GT_js("600"),"textTransform":helix.impl.props.__GT_js("uppercase"),"letterSpacing":helix.impl.props.__GT_js("0.05em"),"color":helix.impl.props.__GT_js("var(--token-colors-text-muted)"),"margin":helix.impl.props.__GT_js("0")});
return obj7294;
})(),"children":new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(column)});
return obj7290;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7287,G__7288) : helix.core.jsx.call(null,G__7287,G__7288));
})(),(function (){var G__7297 = "span";
var G__7298 = (function (){var obj7300 = ({"style":(function (){var obj7302 = ({"fontSize":helix.impl.props.__GT_js("11px"),"color":helix.impl.props.__GT_js("var(--token-colors-text-soft)"),"background":helix.impl.props.__GT_js("var(--token-colors-background-surface)"),"padding":helix.impl.props.__GT_js("1px 6px"),"borderRadius":helix.impl.props.__GT_js("10px")});
return obj7302;
})(),"children":(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"taskCount","taskCount",-1266392271).cljs$core$IFn$_invoke$arity$1(column)))});
return obj7300;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7297,G__7298) : helix.core.jsx.call(null,G__7297,G__7298));
})()]});
return obj7280;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__7275,G__7276) : helix.core.jsxs.call(null,G__7275,G__7276));
})(),(function (){var G__7305 = "div";
var G__7306 = (function (){var obj7308 = ({"style":(function (){var obj7310 = ({"display":helix.impl.props.__GT_js("flex"),"flexDirection":helix.impl.props.__GT_js("column")});
return obj7310;
})(),"children":cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2((function (i,task){
var G__7311 = eta_mu.kanban.ui.board.task_card;
var G__7312 = (function (){var obj7319 = ({"task":task,"on-select":on_select});
return obj7319;
})();
var G__7314 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"uuid","uuid",-2145095719).cljs$core$IFn$_invoke$arity$1(task);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(i));
}
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$3 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$3(G__7311,G__7312,G__7314) : helix.core.jsx.call(null,G__7311,G__7312,G__7314));
}),new cljs.core.Keyword(null,"tasks","tasks",-1754368880).cljs$core$IFn$_invoke$arity$1(column))});
return obj7308;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7305,G__7306) : helix.core.jsx.call(null,G__7305,G__7306));
})()]});
return obj7271;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__7268,G__7269) : helix.core.jsxs.call(null,G__7268,G__7269));
});
if(goog.DEBUG === true){
var G__7328 = G__7263;
(G__7328.displayName = "eta-mu.kanban.ui.board/column-view");

return G__7328;
} else {
return G__7263;
}
})();




eta_mu.kanban.ui.board.board_view = (function (){var G__7338 = (function eta_mu$kanban$ui$board$board_view_render(props__6382__auto__,maybe_ref__6383__auto__){
var vec__7339 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [helix.core.extract_cljs_props(props__6382__auto__),maybe_ref__6383__auto__], null);
var map__7342 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7339,(0),null);
var map__7342__$1 = cljs.core.__destructure_map(map__7342);
var board = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7342__$1,new cljs.core.Keyword(null,"board","board",-1907017633));
var on_select = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7342__$1,new cljs.core.Keyword(null,"on-select","on-select",-192407950));

var columns = cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__7333_SHARP_){
return (new cljs.core.Keyword(null,"taskCount","taskCount",-1266392271).cljs$core$IFn$_invoke$arity$2(p1__7333_SHARP_,(0)) > (0));
}),new cljs.core.Keyword(null,"columns","columns",1998437288).cljs$core$IFn$_invoke$arity$2(board,cljs.core.PersistentVector.EMPTY));
var G__7344 = "div";
var G__7345 = (function (){var obj7347 = ({"style":(function (){var obj7349 = ({"display":helix.impl.props.__GT_js("flex"),"gap":helix.impl.props.__GT_js("16px"),"overflowX":helix.impl.props.__GT_js("auto"),"paddingBottom":helix.impl.props.__GT_js("16px")});
return obj7349;
})(),"children":cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2((function (i,col){
var G__7350 = eta_mu.kanban.ui.board.column_view;
var G__7351 = (function (){var obj7354 = ({"column":col,"on-select":on_select});
return obj7354;
})();
var G__7352 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(col);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(i));
}
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$3 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$3(G__7350,G__7351,G__7352) : helix.core.jsx.call(null,G__7350,G__7351,G__7352));
}),columns)});
return obj7347;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7344,G__7345) : helix.core.jsx.call(null,G__7344,G__7345));
});
if(goog.DEBUG === true){
var G__7355 = G__7338;
(G__7355.displayName = "eta-mu.kanban.ui.board/board-view");

return G__7355;
} else {
return G__7338;
}
})();




//# sourceMappingURL=eta_mu.kanban.ui.board.js.map
