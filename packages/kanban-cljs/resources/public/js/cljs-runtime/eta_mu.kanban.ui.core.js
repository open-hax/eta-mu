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
var qs = str.join("&",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__12003){
var vec__12004 = p__12003;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12004,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12004,(1),null);
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.name(k))+"="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(v)));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$1((function (p__12007){
var vec__12008 = p__12007;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12008,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12008,(1),null);
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

eta_mu.kanban.ui.core.app = (function (){var G__12012 = (function eta_mu$kanban$ui$core$app_render(props__11196__auto__,maybe_ref__11197__auto__){
var vec__12013 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [helix.core.extract_cljs_props(props__11196__auto__),maybe_ref__11197__auto__], null);

var vec__12016 = (helix.hooks.useState.cljs$core$IFn$_invoke$arity$1 ? helix.hooks.useState.cljs$core$IFn$_invoke$arity$1(null) : helix.hooks.useState.call(null,null));
var boards = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12016,(0),null);
var set_boards = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12016,(1),null);
var vec__12019 = (helix.hooks.useState.cljs$core$IFn$_invoke$arity$1 ? helix.hooks.useState.cljs$core$IFn$_invoke$arity$1(null) : helix.hooks.useState.call(null,null));
var board_data = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12019,(0),null);
var set_board_data = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12019,(1),null);
var vec__12022 = (function (){var G__12034 = cljs.core.PersistentArrayMap.EMPTY;
return (helix.hooks.useState.cljs$core$IFn$_invoke$arity$1 ? helix.hooks.useState.cljs$core$IFn$_invoke$arity$1(G__12034) : helix.hooks.useState.call(null,G__12034));
})();
var filters = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12022,(0),null);
var set_filters = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12022,(1),null);
var vec__12025 = (helix.hooks.useState.cljs$core$IFn$_invoke$arity$1 ? helix.hooks.useState.cljs$core$IFn$_invoke$arity$1(null) : helix.hooks.useState.call(null,null));
var selected = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12025,(0),null);
var set_selected = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12025,(1),null);
var vec__12028 = (helix.hooks.useState.cljs$core$IFn$_invoke$arity$1 ? helix.hooks.useState.cljs$core$IFn$_invoke$arity$1(null) : helix.hooks.useState.call(null,null));
var detail = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12028,(0),null);
var set_detail = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12028,(1),null);
var vec__12031 = (helix.hooks.useState.cljs$core$IFn$_invoke$arity$1 ? helix.hooks.useState.cljs$core$IFn$_invoke$arity$1(true) : helix.hooks.useState.call(null,true));
var loading = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12031,(0),null);
var set_loading = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__12031,(1),null);
var G__12035_12098 = helix.hooks.wrap_fx((function (){
return eta_mu.kanban.ui.core.fetch_boards().then((function (data){
(set_boards.cljs$core$IFn$_invoke$arity$1 ? set_boards.cljs$core$IFn$_invoke$arity$1(data) : set_boards.call(null,data));

return (set_loading.cljs$core$IFn$_invoke$arity$1 ? set_loading.cljs$core$IFn$_invoke$arity$1(false) : set_loading.call(null,false));
}));
}));
var G__12036_12099 = [];
(helix.hooks.raw_use_effect.cljs$core$IFn$_invoke$arity$2 ? helix.hooks.raw_use_effect.cljs$core$IFn$_invoke$arity$2(G__12035_12098,G__12036_12099) : helix.hooks.raw_use_effect.call(null,G__12035_12098,G__12036_12099));

var G__12037_12100 = helix.hooks.wrap_fx((function (){
(set_loading.cljs$core$IFn$_invoke$arity$1 ? set_loading.cljs$core$IFn$_invoke$arity$1(true) : set_loading.call(null,true));

return eta_mu.kanban.ui.core.fetch_compose(filters).then((function (data){
(set_board_data.cljs$core$IFn$_invoke$arity$1 ? set_board_data.cljs$core$IFn$_invoke$arity$1(data) : set_board_data.call(null,data));

return (set_loading.cljs$core$IFn$_invoke$arity$1 ? set_loading.cljs$core$IFn$_invoke$arity$1(false) : set_loading.call(null,false));
}));
}));
var G__12038_12101 = [filters];
(helix.hooks.raw_use_effect.cljs$core$IFn$_invoke$arity$2 ? helix.hooks.raw_use_effect.cljs$core$IFn$_invoke$arity$2(G__12037_12100,G__12038_12101) : helix.hooks.raw_use_effect.call(null,G__12037_12100,G__12038_12101));

var G__12039_12102 = helix.hooks.wrap_fx((function (){
if(cljs.core.truth_(selected)){
return eta_mu.kanban.ui.core.fetch_task_content(new cljs.core.Keyword(null,"uuid","uuid",-2145095719).cljs$core$IFn$_invoke$arity$1(selected),new cljs.core.Keyword(null,"source-board","source-board",717012848).cljs$core$IFn$_invoke$arity$2(selected,"knoxx")).then((function (data){
return (set_detail.cljs$core$IFn$_invoke$arity$1 ? set_detail.cljs$core$IFn$_invoke$arity$1(data) : set_detail.call(null,data));
}));
} else {
return null;
}
}));
var G__12040_12103 = [selected];
(helix.hooks.raw_use_effect.cljs$core$IFn$_invoke$arity$2 ? helix.hooks.raw_use_effect.cljs$core$IFn$_invoke$arity$2(G__12039_12102,G__12040_12103) : helix.hooks.raw_use_effect.call(null,G__12039_12102,G__12040_12103));

var G__12041 = "div";
var G__12042 = (function (){var obj12044 = ({"className":"kanban-app","style":(function (){var obj12046 = ({"display":helix.impl.props.__GT_js("flex"),"flexDirection":helix.impl.props.__GT_js("column"),"height":helix.impl.props.__GT_js("100vh"),"background":helix.impl.props.__GT_js("var(--token-colors-background-default)")});
return obj12046;
})(),"children":[(function (){var G__12047 = "header";
var G__12048 = (function (){var obj12050 = ({"style":(function (){var obj12052 = ({"display":helix.impl.props.__GT_js("flex"),"alignItems":helix.impl.props.__GT_js("center"),"gap":helix.impl.props.__GT_js("12px"),"padding":helix.impl.props.__GT_js("8px 16px"),"borderBottom":helix.impl.props.__GT_js("1px solid var(--token-colors-border-default)"),"background":helix.impl.props.__GT_js("var(--token-colors-background-surface)")});
return obj12052;
})(),"children":[(function (){var G__12053 = "h1";
var G__12054 = (function (){var obj12056 = ({"style":(function (){var obj12058 = ({"fontSize":helix.impl.props.__GT_js("16px"),"fontWeight":helix.impl.props.__GT_js("600"),"margin":helix.impl.props.__GT_js("0")});
return obj12058;
})(),"children":"Kanban"});
return obj12056;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__12053,G__12054) : helix.core.jsx.call(null,G__12053,G__12054));
})(),(function (){var G__12059 = "span";
var G__12060 = (function (){var obj12062 = ({"style":(function (){var obj12064 = ({"color":helix.impl.props.__GT_js("var(--token-colors-text-muted)"),"fontSize":helix.impl.props.__GT_js("12px")});
return obj12064;
})(),"children":(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"totalTasks","totalTasks",262546229).cljs$core$IFn$_invoke$arity$2(board_data,(0)))+" tasks")});
return obj12062;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__12059,G__12060) : helix.core.jsx.call(null,G__12059,G__12060));
})()]});
return obj12050;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__12047,G__12048) : helix.core.jsxs.call(null,G__12047,G__12048));
})(),(function (){var G__12065 = eta_mu.kanban.ui.filter_bar.filter_bar;
var G__12066 = (function (){var obj12068 = ({"boards":boards,"filters":filters,"on-change":set_filters});
return obj12068;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__12065,G__12066) : helix.core.jsx.call(null,G__12065,G__12066));
})(),(function (){var G__12069 = "div";
var G__12070 = (function (){var obj12072 = ({"style":(function (){var obj12074 = ({"display":helix.impl.props.__GT_js("flex"),"flex":helix.impl.props.__GT_js("1"),"overflow":helix.impl.props.__GT_js("hidden")});
return obj12074;
})(),"children":[(function (){var G__12075 = "div";
var G__12076 = (function (){var obj12078 = ({"style":(function (){var obj12080 = ({"flex":helix.impl.props.__GT_js("1"),"overflow":helix.impl.props.__GT_js("auto"),"padding":helix.impl.props.__GT_js("16px")});
return obj12080;
})(),"children":(cljs.core.truth_(loading)?(function (){var G__12081 = "div";
var G__12082 = (function (){var obj12084 = ({"style":(function (){var obj12086 = ({"textAlign":helix.impl.props.__GT_js("center"),"padding":helix.impl.props.__GT_js("40px"),"color":helix.impl.props.__GT_js("var(--token-colors-text-muted)")});
return obj12086;
})(),"children":"Loading..."});
return obj12084;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__12081,G__12082) : helix.core.jsx.call(null,G__12081,G__12082));
})():(function (){var G__12087 = eta_mu.kanban.ui.board.board_view;
var G__12088 = (function (){var obj12090 = ({"board":board_data,"on-select":(function (task){
return (set_selected.cljs$core$IFn$_invoke$arity$1 ? set_selected.cljs$core$IFn$_invoke$arity$1(task) : set_selected.call(null,task));
})});
return obj12090;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__12087,G__12088) : helix.core.jsx.call(null,G__12087,G__12088));
})())});
return obj12078;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__12075,G__12076) : helix.core.jsx.call(null,G__12075,G__12076));
})(),(cljs.core.truth_(selected)?(function (){var G__12091 = eta_mu.kanban.ui.sidebar.task_sidebar;
var G__12092 = (function (){var obj12094 = ({"task":selected,"detail":detail,"on-close":(function (){
(set_selected.cljs$core$IFn$_invoke$arity$1 ? set_selected.cljs$core$IFn$_invoke$arity$1(null) : set_selected.call(null,null));

return (set_detail.cljs$core$IFn$_invoke$arity$1 ? set_detail.cljs$core$IFn$_invoke$arity$1(null) : set_detail.call(null,null));
})});
return obj12094;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__12091,G__12092) : helix.core.jsx.call(null,G__12091,G__12092));
})():null)]});
return obj12072;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__12069,G__12070) : helix.core.jsxs.call(null,G__12069,G__12070));
})()]});
return obj12044;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__12041,G__12042) : helix.core.jsxs.call(null,G__12041,G__12042));
});
if(goog.DEBUG === true){
var G__12095 = G__12012;
(G__12095.displayName = "eta-mu.kanban.ui.core/app");

return G__12095;
} else {
return G__12012;
}
})();



eta_mu.kanban.ui.core.init = (function eta_mu$kanban$ui$core$init(){
var root = module$node_modules$react_dom$client.createRoot(document.getElementById("root"));
return root.render((function (){var G__12096 = eta_mu.kanban.ui.core.app;
var G__12097 = ({});
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__12096,G__12097) : helix.core.jsx.call(null,G__12096,G__12097));
})());
});
goog.exportSymbol('eta_mu.kanban.ui.core.init', eta_mu.kanban.ui.core.init);

//# sourceMappingURL=eta_mu.kanban.ui.core.js.map
