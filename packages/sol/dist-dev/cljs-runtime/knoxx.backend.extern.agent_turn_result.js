import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('knoxx.backend.extern.agent_turn_result');
knoxx.backend.extern.agent_turn_result.usage_tokens = (function knoxx$backend$extern$agent_turn_result$usage_tokens(assistant_message){
var usage = (cljs.core.truth_(assistant_message)?(function (){var or__5162__auto__ = (assistant_message["usage"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})():null);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"input-tokens","input-tokens",-1422664530),(function (){var or__5162__auto__ = (function (){var G__34669 = usage;
if((G__34669 == null)){
return null;
} else {
return (G__34669["input"]);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})(),new cljs.core.Keyword(null,"output-tokens","output-tokens",-1759201012),(function (){var or__5162__auto__ = (function (){var G__34670 = usage;
if((G__34670 == null)){
return null;
} else {
return (G__34670["output"]);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()], null);
});

//# sourceMappingURL=knoxx.backend.extern.agent_turn_result.js.map
