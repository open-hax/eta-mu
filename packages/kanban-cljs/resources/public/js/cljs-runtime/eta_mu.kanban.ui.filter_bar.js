goog.provide('eta_mu.kanban.ui.filter_bar');

eta_mu.kanban.ui.filter_bar.filter_dropdown = (function (){var G__7191 = (function eta_mu$kanban$ui$filter_bar$filter_dropdown_render(props__6382__auto__,maybe_ref__6383__auto__){
var vec__7193 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [helix.core.extract_cljs_props(props__6382__auto__),maybe_ref__6383__auto__], null);
var map__7196 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7193,(0),null);
var map__7196__$1 = cljs.core.__destructure_map(map__7196);
var label = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7196__$1,new cljs.core.Keyword(null,"label","label",1718410804));
var options = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7196__$1,new cljs.core.Keyword(null,"options","options",99638489));
var value = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7196__$1,new cljs.core.Keyword(null,"value","value",305978217));
var on_change = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7196__$1,new cljs.core.Keyword(null,"on-change","on-change",-732046149));

var G__7198 = "select";
var G__7199 = (function (){var obj7201 = ({"value":helix.impl.props.or_undefined((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),"onChange":(function (p1__7189_SHARP_){
var G__7211 = (function (){var v = p1__7189_SHARP_.target.value;
if(cljs.core.seq(v)){
return v;
} else {
return null;
}
})();
return (on_change.cljs$core$IFn$_invoke$arity$1 ? on_change.cljs$core$IFn$_invoke$arity$1(G__7211) : on_change.call(null,G__7211));
}),"style":(function (){var obj7215 = ({"background":helix.impl.props.__GT_js("var(--token-colors-background-surface)"),"color":helix.impl.props.__GT_js("var(--token-colors-text-default)"),"border":helix.impl.props.__GT_js("1px solid var(--token-colors-border-default)"),"borderRadius":helix.impl.props.__GT_js("4px"),"padding":helix.impl.props.__GT_js("4px 8px"),"fontSize":helix.impl.props.__GT_js("12px"),"cursor":helix.impl.props.__GT_js("pointer")});
return obj7215;
})(),"children":[(function (){var G__7220 = "option";
var G__7223 = (function (){var obj7225 = ({"value":helix.impl.props.or_undefined(""),"children":(""+"All "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label))});
return obj7225;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7220,G__7223) : helix.core.jsx.call(null,G__7220,G__7223));
})(),cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2((function (i,opt){
var G__7232 = "option";
var G__7233 = (function (){var obj7236 = ({"value":helix.impl.props.or_undefined(opt),"children":opt});
return obj7236;
})();
var G__7234 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(i));
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$3 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$3(G__7232,G__7233,G__7234) : helix.core.jsx.call(null,G__7232,G__7233,G__7234));
}),options)]});
return obj7201;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__7198,G__7199) : helix.core.jsxs.call(null,G__7198,G__7199));
});
if(goog.DEBUG === true){
var G__7241 = G__7191;
(G__7241.displayName = "eta-mu.kanban.ui.filter-bar/filter-dropdown");

return G__7241;
} else {
return G__7191;
}
})();




eta_mu.kanban.ui.filter_bar.filter_bar = (function (){var G__7258 = (function eta_mu$kanban$ui$filter_bar$filter_bar_render(props__6382__auto__,maybe_ref__6383__auto__){
var vec__7259 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [helix.core.extract_cljs_props(props__6382__auto__),maybe_ref__6383__auto__], null);
var map__7262 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__7259,(0),null);
var map__7262__$1 = cljs.core.__destructure_map(map__7262);
var boards = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7262__$1,new cljs.core.Keyword(null,"boards","boards",1912049694));
var filters = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7262__$1,new cljs.core.Keyword(null,"filters","filters",974726919));
var on_change = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__7262__$1,new cljs.core.Keyword(null,"on-change","on-change",-732046149));

var domains = cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__7244_SHARP_){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(p1__7244_SHARP_,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"meta","meta",1499536964),new cljs.core.Keyword(null,"domain","domain",1847214937)], null));
}),new cljs.core.Keyword(null,"projects","projects",-364845983).cljs$core$IFn$_invoke$arity$2(boards,cljs.core.PersistentVector.EMPTY)));
var statuses = new cljs.core.PersistentVector(null, 11, 5, cljs.core.PersistentVector.EMPTY_NODE, ["incoming","breakdown","ready","todo","in_progress","review","done","icebox","blocked","accepted","rejected"], null);
var priorities = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, ["P0","P1","P2","P3"], null);
var set_filter = (function (k,v){
var G__7274 = (cljs.core.truth_(v)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(filters,k,v):cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(filters,k));
return (on_change.cljs$core$IFn$_invoke$arity$1 ? on_change.cljs$core$IFn$_invoke$arity$1(G__7274) : on_change.call(null,G__7274));
});
var G__7277 = "div";
var G__7278 = (function (){var obj7284 = ({"style":(function (){var obj7286 = ({"display":helix.impl.props.__GT_js("flex"),"alignItems":helix.impl.props.__GT_js("center"),"gap":helix.impl.props.__GT_js("8px"),"padding":helix.impl.props.__GT_js("8px 16px"),"borderBottom":helix.impl.props.__GT_js("1px solid var(--token-colors-border-subtle)"),"background":helix.impl.props.__GT_js("var(--token-colors-background-surface)")});
return obj7286;
})(),"children":[(function (){var G__7291 = "input";
var G__7292 = (function (){var obj7296 = ({"type":"text","placeholder":"Search tasks...","value":helix.impl.props.or_undefined((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"q","q",689001697).cljs$core$IFn$_invoke$arity$1(filters);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),"onChange":(function (p1__7247_SHARP_){
return set_filter(new cljs.core.Keyword(null,"q","q",689001697),p1__7247_SHARP_.target.value);
}),"style":(function (){var obj7304 = ({"background":helix.impl.props.__GT_js("var(--token-colors-background-default)"),"color":helix.impl.props.__GT_js("var(--token-colors-text-default)"),"border":helix.impl.props.__GT_js("1px solid var(--token-colors-border-default)"),"borderRadius":helix.impl.props.__GT_js("4px"),"padding":helix.impl.props.__GT_js("4px 10px"),"fontSize":helix.impl.props.__GT_js("12px"),"width":helix.impl.props.__GT_js("200px")});
return obj7304;
})()});
return obj7296;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7291,G__7292) : helix.core.jsx.call(null,G__7291,G__7292));
})(),(function (){var G__7313 = eta_mu.kanban.ui.filter_bar.filter_dropdown;
var G__7315 = (function (){var obj7317 = ({"label":"Domain","options":domains,"value":new cljs.core.Keyword(null,"domain","domain",1847214937).cljs$core$IFn$_invoke$arity$1(filters),"on-change":(function (p1__7248_SHARP_){
return set_filter(new cljs.core.Keyword(null,"domain","domain",1847214937),p1__7248_SHARP_);
})});
return obj7317;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7313,G__7315) : helix.core.jsx.call(null,G__7313,G__7315));
})(),(function (){var G__7320 = eta_mu.kanban.ui.filter_bar.filter_dropdown;
var G__7321 = (function (){var obj7323 = ({"label":"Status","options":statuses,"value":new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(filters),"on-change":(function (p1__7249_SHARP_){
return set_filter(new cljs.core.Keyword(null,"status","status",-1997798413),p1__7249_SHARP_);
})});
return obj7323;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7320,G__7321) : helix.core.jsx.call(null,G__7320,G__7321));
})(),(function (){var G__7324 = eta_mu.kanban.ui.filter_bar.filter_dropdown;
var G__7325 = (function (){var obj7327 = ({"label":"Priority","options":priorities,"value":new cljs.core.Keyword(null,"priority","priority",1431093715).cljs$core$IFn$_invoke$arity$1(filters),"on-change":(function (p1__7252_SHARP_){
return set_filter(new cljs.core.Keyword(null,"priority","priority",1431093715),p1__7252_SHARP_);
})});
return obj7327;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7324,G__7325) : helix.core.jsx.call(null,G__7324,G__7325));
})(),((cljs.core.seq(filters))?(function (){var G__7329 = "button";
var G__7330 = (function (){var obj7332 = ({"onClick":(function (){
var G__7334 = cljs.core.PersistentArrayMap.EMPTY;
return (on_change.cljs$core$IFn$_invoke$arity$1 ? on_change.cljs$core$IFn$_invoke$arity$1(G__7334) : on_change.call(null,G__7334));
}),"style":(function (){var obj7337 = ({"background":helix.impl.props.__GT_js("var(--token-colors-button-ghost-bg)"),"color":helix.impl.props.__GT_js("var(--token-colors-button-ghost-fg)"),"border":helix.impl.props.__GT_js("none"),"borderRadius":helix.impl.props.__GT_js("4px"),"padding":helix.impl.props.__GT_js("4px 10px"),"fontSize":helix.impl.props.__GT_js("12px"),"cursor":helix.impl.props.__GT_js("pointer")});
return obj7337;
})(),"children":"Clear"});
return obj7332;
})();
return (helix.core.jsx.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsx.cljs$core$IFn$_invoke$arity$2(G__7329,G__7330) : helix.core.jsx.call(null,G__7329,G__7330));
})():null)]});
return obj7284;
})();
return (helix.core.jsxs.cljs$core$IFn$_invoke$arity$2 ? helix.core.jsxs.cljs$core$IFn$_invoke$arity$2(G__7277,G__7278) : helix.core.jsxs.call(null,G__7277,G__7278));
});
if(goog.DEBUG === true){
var G__7343 = G__7258;
(G__7343.displayName = "eta-mu.kanban.ui.filter-bar/filter-bar");

return G__7343;
} else {
return G__7258;
}
})();




//# sourceMappingURL=eta_mu.kanban.ui.filter_bar.js.map
