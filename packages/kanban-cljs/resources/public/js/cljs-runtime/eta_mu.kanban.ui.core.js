goog.provide('eta_mu.kanban.ui.core');
var module$node_modules$react_dom$client=shadow.js.require("module$node_modules$react_dom$client", {});
eta_mu.kanban.ui.core.fetch_json = (function eta_mu$kanban$ui$core$fetch_json(url){
return fetch(url).then((function (res){
return res.json();
})).then((function (data){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(data,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
}));
});
eta_mu.kanban.ui.core.fetch_boards = (function eta_mu$kanban$ui$core$fetch_boards(){
return eta_mu.kanban.ui.core.fetch_json("/api/boards");
});
eta_mu.kanban.ui.core.fetch_compose = (function eta_mu$kanban$ui$core$fetch_compose(params){
var qs = str.join("&",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__7189){
var vec__7190 = p__7189;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7190,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7190,(1),null);
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.name(k))+"="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(v)));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$1((function (p__7193){
var vec__7194 = p__7193;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7194,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7194,(1),null);
var and__5160__auto__ = v;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(v,"");
} else {
return and__5160__auto__;
}
}))));
var url = ((cljs.core.seq(qs))?(""+"/api/board/compose?"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(qs)):"/api/board/compose");
return eta_mu.kanban.ui.core.fetch_json(url);
});
eta_mu.kanban.ui.core.fetch_task_content = (function eta_mu$kanban$ui$core$fetch_task_content(task_uuid,project_id){
return eta_mu.kanban.ui.core.fetch_json((""+"/api/task/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(task_uuid)+"/content?project="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(project_id)));
});

eta_mu.kanban.ui.core.app = (function (){var G__7198 = (function eta_mu$kanban$ui$core$app_render(props__6382__auto__,maybe_ref__6383__auto__){
var vec__7199 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [helix.core.extract_cljs_props(props__6382__auto__),maybe_ref__6383__auto__], null);

var vec__7202 = (helix.hooks.useState.cljs$core$IFn$_invoke$arity$1 ? helix.hooks.useState.cljs$core$IFn$_invoke$arity$1(null) : helix.hooks.useState.call(null,null));
var boards = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7202,(0),null);
var set_boards = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7202,(1),null);
var vec__7205 = (helix.hooks.useState.cljs$core$IFn$_invoke$arity$1 ? helix.hooks.useState.cljs$core$IFn$_invoke$arity$1(null) : helix.hooks.useState.call(null,null));
var board_data = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7205,(0),null);
var set_board_data = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7205,(1),null);
var vec__7208 = (function (){var G__7220 = cljs.core.PersistentArrayMap.EMPTY;
return (helix.hooks.useState.cljs$core$IFn$_invoke$arity$1 ? helix.hooks.useState.cljs$core$IFn$_invoke$arity$1(G__7220) : helix.hooks.useState.call(null,G__7220));
})();
var filters = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7208,(0),null);
var set_filters = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7208,(1),null);
var vec__7211 = (helix.hooks.useState.cljs$core$IFn$_invoke$arity$1 ? helix.hooks.useState.cljs$core$IFn$_invoke$arity$1(null) : helix.hooks.useState.call(null,null));
var selected = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7211,(0),null);
var set_selected = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7211,(1),null);
var vec__7214 = (helix.hooks.useState.cljs$core$IFn$_invoke$arity$1 ? helix.hooks.useState.cljs$core$IFn$_invoke$arity$1(null) : helix.hooks.useState.call(null,null));
var detail = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7214,(0),null);
var set_detail = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7214,(1),null);
var vec__7217 = (helix.hooks.useState.cljs$core$IFn$_invoke$arity$1 ? helix.hooks.useState.cljs$core$IFn$_invoke$arity$1(true) : helix.hooks.useState.call(null,true));
var loading = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7217,(0),null);
var set_loading = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7217,(1),null);
var G__7221_7284 = helix.hooks.wrap_fx((function (){
return eta_mu.kanban.ui.core.fetch_boards().then((function (data){
(set_boards.cljs$core$IFn$_invoke$arity$1 ? set_boards.cljs$core$IFn$_invoke$arity$1(data) : set_boards.call(null,data));

return (set_loading.cljs$core$IFn$_invoke$arity$1 ? set_loading.cljs$core$IFn$_invoke$arity$1(false) : set_loading.call(null,false));
}));
}));
var G__7222_7285 = [];
(helix.hooks.raw_use_effect.cljs$core$IFn$_invoke$arity$2 ? helix.hooks.raw_use_effect.cljs$core$IFn$_invoke$arity$2(G__7221_7284,G__7222_7285) : helix.hooks.raw_use_effect.call(null,G__7221_7284,G__7222_7285));

var G__7223_7286 = helix.hooks.wrap_fx((function (){
(set_loading.cljs$core$IFn$_invoke$arity$1 ? set_loading.cljs$core$IFn$_invoke$arity$1(true) : set_loading.call(null,true));

return eta_mu.kanban.ui.core.fetch_compose(filters).then((function (data){
(set_board_data.cljs$core$IFn$_invoke$arity$1 ? set_board_data.cljs$core$IFn$_invoke$arity$1(data) : set_board_data.call(null,data));

return (set_loading.cljs$core$IFn$_invoke$arity$1 ? set_loading.cljs$core$IFn$_invoke$arity$1(false) : set_loading.call(null,false));
}));
}));
var G__7224_7287 = [filters];
(helix.hooks.raw_use_effect.cljs$core$IFn$_invoke$arity$2 ? helix.hooks.raw_use_effect.cljs$core$IFn$_invoke$arity$2(G__7223_7286,G__7224_7287) : helix.hooks.raw_use_effect.call(null,G__7223_7286,G__7224_7287));

var G__7225_7288 = helix.hooks.wrap_fx((function (){
if(cljs.core.truth_(selected)){
return eta_mu.kanban.ui.core.fetch_task_content(new cljs.core.Keyword(null,"uuid","uuid",-2145095719).cljs$core$IFn$_invoke$arity$1(selected),new cljs.core.Keyword(null,"source-board","source-board",717012848).cljs$core$IFn$_invoke$arity$2(selected,"knoxx")).then((function (data){
return (set_detail.cljs$core$IFn$_invoke$arity$1 ? set_detail.cljs$core$IFn$_invoke$arity$1(data) : set_detail.call(null,data));
}));
} else {
return null;
}
}));
var G__7226_7289 = [selected];
(helix.hooks.raw_use_effect.cljs$core$IFn$_invoke$arity$2 ? helix.hooks.raw_use_effect.cljs$core$IFn$_invoke$arity$2(G__7225_7288,G__7226_7289) : helix.hooks.raw_use_effect.call(null,G__7225_7288,G__7226_7289));

var G__7227 = "div";
var G__7228 = (function (){var obj7230 = ({"className":"kanban-app","style":(function (){var obj7232 = ({"display":helix.impl.props.__GT_js("flex"),"flexDirection":helix.impl.props.__GT_js("column"),"height":helix.impl.props.__GT_js("100vh"),"background":helix.impl.props.__GT_js("var(--token-colors-background-default)")});
return obj7232;
})(),"children":[(function (){var G__7233 = "header";
var G__7234 = (function (){var obj7236 = ({"style":(function (){var obj7238 = ({"display":helix.impl.props.__GT_js("flex"),"alignItems":helix.impl.props.__GT_js("center"),"gap":helix.impl.props.__GT_js("12px"),"padding":helix.impl.props.__GT_js("8px 16px"),"borderBottom":helix.impl.props.__GT_js("1px solid var(--token-colors-border-default)"),"background":helix.impl.props.__GT_js("var(--token-colors-background-surface)")});
return obj7238;
})(),"children":[(function (){var G__7239 = "h1";
var G__7240 = (function (){var obj7242 = ({"style":(function (){var obj7244 = ({"fontSize":helix.impl.props.__GT_js("16px"),"fontWeight":helix.impl.props.__GT_js("600"),"margin":helix.impl.props.__GT_js("0")});
return obj7244;
})(),"children":"Kanban"});
return obj7242;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7239,G__7240) : helix.core.jsx.call(null,G__7239,G__7240));
})(),(function (){var G__7245 = "span";
var G__7246 = (function (){var obj7248 = ({"style":(function (){var obj7250 = ({"color":helix.impl.props.__GT_js("var(--token-colors-text-muted)"),"fontSize":helix.impl.props.__GT_js("12px")});
return obj7250;
})(),"children":(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"totalTasks","totalTasks",262546229).cljs$core$IFn$_invoke$arity$2(board_data,(0)))+" tasks")});
return obj7248;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7245,G__7246) : helix.core.jsx.call(null,G__7245,G__7246));
})()]});
return obj7236;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__7233,G__7234) : helix.core.jsxs.call(null,G__7233,G__7234));
})(),(function (){var G__7251 = eta_mu.kanban.ui.filter_bar.filter_bar;
var G__7252 = (function (){var obj7254 = ({"boards":boards,"filters":filters,"on-change":set_filters});
return obj7254;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7251,G__7252) : helix.core.jsx.call(null,G__7251,G__7252));
})(),(function (){var G__7255 = "div";
var G__7256 = (function (){var obj7258 = ({"style":(function (){var obj7260 = ({"display":helix.impl.props.__GT_js("flex"),"flex":helix.impl.props.__GT_js("1"),"overflow":helix.impl.props.__GT_js("hidden")});
return obj7260;
})(),"children":[(function (){var G__7261 = "div";
var G__7262 = (function (){var obj7264 = ({"style":(function (){var obj7266 = ({"flex":helix.impl.props.__GT_js("1"),"overflow":helix.impl.props.__GT_js("auto"),"padding":helix.impl.props.__GT_js("16px")});
return obj7266;
})(),"children":(cljs.core.truth_(loading)?(function (){var G__7267 = "div";
var G__7268 = (function (){var obj7270 = ({"style":(function (){var obj7272 = ({"textAlign":helix.impl.props.__GT_js("center"),"padding":helix.impl.props.__GT_js("40px"),"color":helix.impl.props.__GT_js("var(--token-colors-text-muted)")});
return obj7272;
})(),"children":"Loading..."});
return obj7270;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7267,G__7268) : helix.core.jsx.call(null,G__7267,G__7268));
})():(function (){var G__7273 = eta_mu.kanban.ui.board.board_view;
var G__7274 = (function (){var obj7276 = ({"board":board_data,"on-select":(function (task){
return (set_selected.cljs$core$IFn$_invoke$arity$1 ? set_selected.cljs$core$IFn$_invoke$arity$1(task) : set_selected.call(null,task));
})});
return obj7276;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7273,G__7274) : helix.core.jsx.call(null,G__7273,G__7274));
})())});
return obj7264;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7261,G__7262) : helix.core.jsx.call(null,G__7261,G__7262));
})(),(cljs.core.truth_(selected)?(function (){var G__7277 = eta_mu.kanban.ui.sidebar.task_sidebar;
var G__7278 = (function (){var obj7280 = ({"task":selected,"detail":detail,"on-close":(function (){
(set_selected.cljs$core$IFn$_invoke$arity$1 ? set_selected.cljs$core$IFn$_invoke$arity$1(null) : set_selected.call(null,null));

return (set_detail.cljs$core$IFn$_invoke$arity$1 ? set_detail.cljs$core$IFn$_invoke$arity$1(null) : set_detail.call(null,null));
})});
return obj7280;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7277,G__7278) : helix.core.jsx.call(null,G__7277,G__7278));
})():null)]});
return obj7258;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__7255,G__7256) : helix.core.jsxs.call(null,G__7255,G__7256));
})()]});
return obj7230;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__7227,G__7228) : helix.core.jsxs.call(null,G__7227,G__7228));
});
if(goog.DEBUG === true){
var G__7281 = G__7198;
(G__7281.displayName = "eta-mu.kanban.ui.core/app");

return G__7281;
} else {
return G__7198;
}
})();



eta_mu.kanban.ui.core.init = (function eta_mu$kanban$ui$core$init(){
var root = module$node_modules$react_dom$client.createRoot(document.getElementById("root"));
return root.render((function (){var G__7282 = eta_mu.kanban.ui.core.app;
var G__7283 = ({});
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7282,G__7283) : helix.core.jsx.call(null,G__7282,G__7283));
})());
});
goog.exportSymbol('eta_mu.kanban.ui.core.init', eta_mu.kanban.ui.core.init);

//# sourceMappingURL=eta_mu.kanban.ui.core.js.map
