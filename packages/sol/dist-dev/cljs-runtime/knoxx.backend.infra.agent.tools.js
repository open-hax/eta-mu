import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.agent.content.js";
import "./knoxx.backend.domain.text.js";
goog.provide('knoxx.backend.infra.agent.tools');
knoxx.backend.infra.agent.tools.normalize_tool_name = (function knoxx$backend$infra$agent$tools$normalize_tool_name(tool_name){
return clojure.string.lower_case(cljs.core.last(clojure.string.split.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = tool_name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/[.\/:]/)));
});
knoxx.backend.infra.agent.tools.coerce_tool_args = (function knoxx$backend$infra$agent$tools$coerce_tool_args(raw_args){
if(cljs.core.map_QMARK_(raw_args)){
return raw_args;
} else {
if(cljs.core.truth_((function (){var and__5160__auto__ = raw_args;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(raw_args,undefined);
} else {
return and__5160__auto__;
}
})())){
try{return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(raw_args,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
}catch (e21885){var _ = e21885;
return null;
}} else {
return null;

}
}
});
knoxx.backend.infra.agent.tools.map_arg_value = (function knoxx$backend$infra$agent$tools$map_arg_value(m,k){
if(((cljs.core.map_QMARK_(m)) && ((k instanceof cljs.core.Keyword)))){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(m,k);
} else {
if(((cljs.core.map_QMARK_(m)) && (typeof k === 'string'))){
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(m,k);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(m,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(k));
}
} else {
return null;

}
}
});
knoxx.backend.infra.agent.tools.js_arg_value = (function knoxx$backend$infra$agent$tools$js_arg_value(raw_args,k){
if(cljs.core.truth_((function (){var and__5160__auto__ = raw_args;
if(cljs.core.truth_(and__5160__auto__)){
return ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(raw_args,undefined)) && (((cljs.core.object_QMARK_(raw_args)) || (cljs.core.fn_QMARK_(raw_args)))));
} else {
return and__5160__auto__;
}
})())){
return (raw_args[(((k instanceof cljs.core.Keyword))?cljs.core.name(k):(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(k)))]);
} else {
return null;
}
});
knoxx.backend.infra.agent.tools.arg_value = (function knoxx$backend$infra$agent$tools$arg_value(var_args){
var args__5903__auto__ = [];
var len__5897__auto___21947 = arguments.length;
var i__5898__auto___21948 = (0);
while(true){
if((i__5898__auto___21948 < len__5897__auto___21947)){
args__5903__auto__.push((arguments[i__5898__auto___21948]));

var G__21951 = (i__5898__auto___21948 + (1));
i__5898__auto___21948 = G__21951;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((2) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((2)),(0),null)):null);
return knoxx.backend.infra.agent.tools.arg_value.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5904__auto__);
});

(knoxx.backend.infra.agent.tools.arg_value.cljs$core$IFn$_invoke$arity$variadic = (function (args,raw_args,keys){
var or__5162__auto__ = cljs.core.some((function (p1__21887_SHARP_){
return knoxx.backend.infra.agent.tools.map_arg_value(args,p1__21887_SHARP_);
}),keys);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.some((function (p1__21888_SHARP_){
return knoxx.backend.infra.agent.tools.map_arg_value(raw_args,p1__21888_SHARP_);
}),keys);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.some((function (p1__21889_SHARP_){
return knoxx.backend.infra.agent.tools.js_arg_value(raw_args,p1__21889_SHARP_);
}),keys);
}
}
}));

(knoxx.backend.infra.agent.tools.arg_value.cljs$lang$maxFixedArity = (2));

/** @this {Function} */
(knoxx.backend.infra.agent.tools.arg_value.cljs$lang$applyTo = (function (seq21890){
var G__21891 = cljs.core.first(seq21890);
var seq21890__$1 = cljs.core.next(seq21890);
var G__21892 = cljs.core.first(seq21890__$1);
var seq21890__$2 = cljs.core.next(seq21890__$1);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__21891,G__21892,seq21890__$2);
}));

knoxx.backend.infra.agent.tools.bash_tool_preview = (function knoxx$backend$infra$agent$tools$bash_tool_preview(args,raw_args){
if(cljs.core.map_QMARK_(args)){
var cmd = knoxx.backend.infra.agent.tools.arg_value.cljs$core$IFn$_invoke$arity$variadic(args,raw_args,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"command","command",-894540724),new cljs.core.Keyword(null,"cmd","cmd",-302931143)], 0));
var timeout = knoxx.backend.infra.agent.tools.arg_value.cljs$core$IFn$_invoke$arity$variadic(args,raw_args,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"timeout","timeout",-318625318),new cljs.core.Keyword(null,"timeoutSeconds","timeoutSeconds",-815612016),new cljs.core.Keyword(null,"timeoutMs","timeoutMs",-716622575)], 0));
if(((typeof cmd === 'string') && ((!(clojure.string.blank_QMARK_(cmd)))))){
var vec__21914 = knoxx.backend.domain.text.clip_text.cljs$core$IFn$_invoke$arity$2(cmd,(20000));
var clipped_cmd = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21914,(0),null);
var clipped_QMARK_ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21914,(1),null);
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.agent.content.fenced("bash",(cljs.core.truth_(clipped_QMARK_)?(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clipped_cmd)+"\u2026"):clipped_cmd)))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(clipped_QMARK_)?"\n\n_(truncated)_":null))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((((!((timeout == null))))?(""+"\n\n- timeout: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(timeout)):null)));
} else {
return null;
}
} else {
return null;
}
});
knoxx.backend.infra.agent.tools.read_tool_preview = (function knoxx$backend$infra$agent$tools$read_tool_preview(args,raw_args){
var path = knoxx.backend.infra.agent.tools.arg_value.cljs$core$IFn$_invoke$arity$variadic(args,raw_args,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"path","path",-188191168),"path"], 0));
var offset = knoxx.backend.infra.agent.tools.arg_value.cljs$core$IFn$_invoke$arity$variadic(args,raw_args,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"offset","offset",296498311),"offset"], 0));
var limit = knoxx.backend.infra.agent.tools.arg_value.cljs$core$IFn$_invoke$arity$variadic(args,raw_args,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"limit","limit",-1355822363),"limit"], 0));
if(((typeof path === 'string') && ((!(clojure.string.blank_QMARK_(path)))))){
return knoxx.backend.domain.agent.content.fenced("yaml",(""+"path: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)+"\noffset: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((((!((offset == null))))?offset:"(default)"))+"\nlimit: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((((!((limit == null))))?limit:"(default)"))));
} else {
return null;
}
});
/**
 * Tool-specific input previews that are always human readable (no raw JSON).
 */
knoxx.backend.infra.agent.tools.tool_args__GT_markdown_preview = (function knoxx$backend$infra$agent$tools$tool_args__GT_markdown_preview(tool_name,raw_args){
var tool_name__$1 = knoxx.backend.infra.agent.tools.normalize_tool_name(tool_name);
var args = knoxx.backend.infra.agent.tools.coerce_tool_args(raw_args);
var G__21928 = tool_name__$1;
switch (G__21928) {
case "bash":
return knoxx.backend.infra.agent.tools.bash_tool_preview(args,raw_args);

break;
case "read":
return knoxx.backend.infra.agent.tools.read_tool_preview(args,raw_args);

break;
default:
return null;

}
});
knoxx.backend.infra.agent.tools.copy_js_object = (function knoxx$backend$infra$agent$tools$copy_js_object(value){
if(cljs.core.truth_((function (){var and__5160__auto__ = value;
if(cljs.core.truth_(and__5160__auto__)){
return ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(value,undefined)) && (((cljs.core.not(cljs.core.array_QMARK_(value))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("object",goog.typeOf(value))))));
} else {
return and__5160__auto__;
}
})())){
var copy = ({});
var own_keys = cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(Object.keys(value)),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(Object.getOwnPropertyNames(value))));
var seq__21933_21955 = cljs.core.seq(own_keys);
var chunk__21934_21956 = null;
var count__21935_21957 = (0);
var i__21936_21958 = (0);
while(true){
if((i__21936_21958 < count__21935_21957)){
var k_21959 = chunk__21934_21956.cljs$core$IIndexed$_nth$arity$2(null,i__21936_21958);
(copy[k_21959] = (value[k_21959]));


var G__21960 = seq__21933_21955;
var G__21961 = chunk__21934_21956;
var G__21962 = count__21935_21957;
var G__21963 = (i__21936_21958 + (1));
seq__21933_21955 = G__21960;
chunk__21934_21956 = G__21961;
count__21935_21957 = G__21962;
i__21936_21958 = G__21963;
continue;
} else {
var temp__5825__auto___21964 = cljs.core.seq(seq__21933_21955);
if(temp__5825__auto___21964){
var seq__21933_21965__$1 = temp__5825__auto___21964;
if(cljs.core.chunked_seq_QMARK_(seq__21933_21965__$1)){
var c__5694__auto___21966 = cljs.core.chunk_first(seq__21933_21965__$1);
var G__21970 = cljs.core.chunk_rest(seq__21933_21965__$1);
var G__21971 = c__5694__auto___21966;
var G__21972 = cljs.core.count(c__5694__auto___21966);
var G__21973 = (0);
seq__21933_21955 = G__21970;
chunk__21934_21956 = G__21971;
count__21935_21957 = G__21972;
i__21936_21958 = G__21973;
continue;
} else {
var k_21974 = cljs.core.first(seq__21933_21965__$1);
(copy[k_21974] = (value[k_21974]));


var G__21975 = cljs.core.next(seq__21933_21965__$1);
var G__21976 = null;
var G__21977 = (0);
var G__21978 = (0);
seq__21933_21955 = G__21975;
chunk__21934_21956 = G__21976;
count__21935_21957 = G__21977;
i__21936_21958 = G__21978;
continue;
}
} else {
}
}
break;
}

return copy;
} else {
return null;
}
});
knoxx.backend.infra.agent.tools.tool_call_input_preview = (function knoxx$backend$infra$agent$tools$tool_call_input_preview(tool_name,raw_args){
var or__5162__auto__ = knoxx.backend.infra.agent.tools.tool_args__GT_markdown_preview(tool_name,raw_args);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.agent.content.preview_text_nonblank(raw_args,(20000));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.agent.content.json_preview_nonblank(raw_args,(20000));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var copied = knoxx.backend.infra.agent.tools.copy_js_object(raw_args);
var or__5162__auto____$3 = knoxx.backend.infra.agent.tools.tool_args__GT_markdown_preview(tool_name,copied);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = knoxx.backend.domain.agent.content.preview_text_nonblank(copied,(20000));
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return knoxx.backend.domain.agent.content.json_preview_nonblank(copied,(20000));
}
}
}
}
}
});
knoxx.backend.infra.agent.tools.tool_call_preview_from_part = (function knoxx$backend$infra$agent$tools$tool_call_preview_from_part(part){
var part_type = (function (){var G__21942 = (part["type"]);
var G__21942__$1 = (((G__21942 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21942)));
if((G__21942__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__21942__$1);
}
})();
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["tool_call",null,"toolcall",null], null), null),part_type)){
var tool_call_id = (function (){var G__21943 = (part["id"]);
var G__21943__$1 = (((G__21943 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21943)));
if((G__21943__$1 == null)){
return null;
} else {
return knoxx.backend.domain.agent.content.nonblank(G__21943__$1);
}
})();
var tool_name = (function (){var G__21944 = (part["name"]);
var G__21944__$1 = (((G__21944 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21944)));
if((G__21944__$1 == null)){
return null;
} else {
return knoxx.backend.domain.agent.content.nonblank(G__21944__$1);
}
})();
var arguments$ = (part["arguments"]);
var input_preview = knoxx.backend.infra.agent.tools.tool_call_input_preview(tool_name,arguments$);
if(cljs.core.truth_((function (){var and__5160__auto__ = tool_call_id;
if(cljs.core.truth_(and__5160__auto__)){
return input_preview;
} else {
return and__5160__auto__;
}
})())){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517),tool_call_id,new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name,new cljs.core.Keyword(null,"input_preview","input_preview",2048529734),input_preview], null);
} else {
return null;
}
} else {
return null;
}
});
knoxx.backend.infra.agent.tools.assistant_tool_call_previews = (function knoxx$backend$infra$agent$tools$assistant_tool_call_previews(assistant_message){
var content = (cljs.core.truth_(assistant_message)?(assistant_message["content"]):null);
if(cljs.core.truth_(cljs.core.array_QMARK_(content))){
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.tools.tool_call_preview_from_part,cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(content)));
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
goog.exportSymbol('knoxx.backend.infra.agent.tools.assistant_tool_call_previews', knoxx.backend.infra.agent.tools.assistant_tool_call_previews);

//# sourceMappingURL=knoxx.backend.infra.agent.tools.js.map
