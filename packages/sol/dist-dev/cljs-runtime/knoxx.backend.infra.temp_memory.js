import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.stores.mongo_temp_memory.js";
goog.provide('knoxx.backend.infra.temp_memory');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.temp_memory !== 'undefined') && (typeof knoxx.backend.infra.temp_memory.local_store_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.temp_memory.local_store_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
knoxx.backend.infra.temp_memory.default_ttl_ms = (((60) * (60)) * (1000));
/**
 * Accept ISO-8601 duration string or integer seconds.
 */
knoxx.backend.infra.temp_memory.parse_ttl_ms = (function knoxx$backend$infra$temp_memory$parse_ttl_ms(ttl){
if(typeof ttl === 'number'){
return (ttl * (1000));
} else {
if(typeof ttl === 'string'){
var vec__27972 = cljs.core.re_find(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/,ttl);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27972,(0),null);
var h = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27972,(1),null);
var m = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27972,(2),null);
var s = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27972,(3),null);
var total = ((((function (){var or__5162__auto__ = cljs.core.parse_long((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(h)));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})() * (3600000)) + ((function (){var or__5162__auto__ = cljs.core.parse_long((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(m)));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})() * (60000))) + ((function (){var or__5162__auto__ = cljs.core.parse_long((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(s)));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})() * (1000)));
if((total > (0))){
return total;
} else {
return knoxx.backend.infra.temp_memory.default_ttl_ms;
}
} else {
return knoxx.backend.infra.temp_memory.default_ttl_ms;

}
}
});
knoxx.backend.infra.temp_memory.now_ms = (function knoxx$backend$infra$temp_memory$now_ms(){
return Date.now();
});
knoxx.backend.infra.temp_memory.LOCAL_STORE_MAX = (256);
/**
 * Remove expired entries from local-store*. Called on writes to prevent unbounded growth.
 */
knoxx.backend.infra.temp_memory.sweep_expired_BANG_ = (function knoxx$backend$infra$temp_memory$sweep_expired_BANG_(){
var now = knoxx.backend.infra.temp_memory.now_ms();
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.temp_memory.local_store_STAR_,(function (store){
if((cljs.core.count(store) <= knoxx.backend.infra.temp_memory.LOCAL_STORE_MAX)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.filter.cljs$core$IFn$_invoke$arity$1((function (p__27980){
var vec__27981 = p__27980;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27981,(0),null);
var map__27984 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27981,(1),null);
var map__27984__$1 = cljs.core.__destructure_map(map__27984);
var expires_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27984__$1,new cljs.core.Keyword(null,"expires-at","expires-at",1654982210));
return (expires_at > now);
})),store);
} else {
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.take.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.temp_memory.LOCAL_STORE_MAX,cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2((function (p__27986){
var vec__27987 = p__27986;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27987,(0),null);
var map__27990 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27987,(1),null);
var map__27990__$1 = cljs.core.__destructure_map(map__27990);
var expires_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27990__$1,new cljs.core.Keyword(null,"expires-at","expires-at",1654982210));
return (- expires_at);
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p__27991){
var vec__27992 = p__27991;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27992,(0),null);
var map__27995 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27992,(1),null);
var map__27995__$1 = cljs.core.__destructure_map(map__27995);
var expires_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27995__$1,new cljs.core.Keyword(null,"expires-at","expires-at",1654982210));
return (expires_at > now);
}),store))));
}
}));
});
knoxx.backend.infra.temp_memory.local_set_BANG_ = (function knoxx$backend$infra$temp_memory$local_set_BANG_(k,v,ttl_ms){
knoxx.backend.infra.temp_memory.sweep_expired_BANG_();

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.temp_memory.local_store_STAR_,cljs.core.assoc,k,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"value","value",305978217),v,new cljs.core.Keyword(null,"expires-at","expires-at",1654982210),(knoxx.backend.infra.temp_memory.now_ms() + ttl_ms)], null));

return null;
});
knoxx.backend.infra.temp_memory.local_get = (function knoxx$backend$infra$temp_memory$local_get(k){
var map__27999 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.temp_memory.local_store_STAR_),k);
var map__27999__$1 = cljs.core.__destructure_map(map__27999);
var value = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27999__$1,new cljs.core.Keyword(null,"value","value",305978217));
var expires_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27999__$1,new cljs.core.Keyword(null,"expires-at","expires-at",1654982210));
if(cljs.core.truth_((function (){var and__5160__auto__ = value;
if(cljs.core.truth_(and__5160__auto__)){
return (expires_at > knoxx.backend.infra.temp_memory.now_ms());
} else {
return and__5160__auto__;
}
})())){
return value;
} else {
return null;
}
});
knoxx.backend.infra.temp_memory.local_del_BANG_ = (function knoxx$backend$infra$temp_memory$local_del_BANG_(k){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.temp_memory.local_store_STAR_,cljs.core.dissoc,k);

return null;
});
/**
 * Write `value` under `key` with optional `ttl` (ISO-8601 or seconds).
 * Returns a Promise resolving to {:key k :written true}.
 */
knoxx.backend.infra.temp_memory.mem_set_BANG_ = (async function knoxx$backend$infra$temp_memory$mem_set_BANG_(var_args){
var args__5903__auto__ = [];
var len__5897__auto___28189 = arguments.length;
var i__5898__auto___28190 = (0);
while(true){
if((i__5898__auto___28190 < len__5897__auto___28189)){
args__5903__auto__.push((arguments[i__5898__auto___28190]));

var G__28191 = (i__5898__auto___28190 + (1));
i__5898__auto___28190 = G__28191;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((2) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((2)),(0),null)):null);
return knoxx.backend.infra.temp_memory.mem_set_BANG_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5904__auto__);
});

(knoxx.backend.infra.temp_memory.mem_set_BANG_.cljs$core$IFn$_invoke$arity$variadic = (async function (k,v,p__28015){
var vec__28017 = p__28015;
var map__28020 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28017,(0),null);
var map__28020__$1 = cljs.core.__destructure_map(map__28020);
var ttl = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28020__$1,new cljs.core.Keyword(null,"ttl","ttl",-1115275118));
var ttl_ms = knoxx.backend.infra.temp_memory.parse_ttl_ms((await (async function (){var or__5162__auto__ = ttl;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.temp_memory.default_ttl_ms;
}
})()));
var ttl_sec = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),Math.ceil((ttl_ms / (1000))));
try{var result = (await knoxx.backend.infra.stores.mongo_temp_memory.set_memory_BANG_.cljs$core$IFn$_invoke$arity$3(k,v,ttl_sec));
if(cljs.core.truth_(result)){
return result;
} else {
knoxx.backend.infra.temp_memory.local_set_BANG_(k,v,ttl_ms);

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"key","key",-1516042587),k,new cljs.core.Keyword(null,"written","written",-1069705267),true,new cljs.core.Keyword(null,"backend","backend",-847489124),new cljs.core.Keyword(null,"local","local",-1497766724)], null);
}
}catch (e28024){var _ = e28024;
knoxx.backend.infra.temp_memory.local_set_BANG_(k,v,ttl_ms);

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"key","key",-1516042587),k,new cljs.core.Keyword(null,"written","written",-1069705267),true,new cljs.core.Keyword(null,"backend","backend",-847489124),new cljs.core.Keyword(null,"local","local",-1497766724)], null);
}}));

(knoxx.backend.infra.temp_memory.mem_set_BANG_.cljs$lang$maxFixedArity = (2));

/** @this {Function} */
(knoxx.backend.infra.temp_memory.mem_set_BANG_.cljs$lang$applyTo = (function (seq28009){
var G__28010 = cljs.core.first(seq28009);
var seq28009__$1 = cljs.core.next(seq28009);
var G__28011 = cljs.core.first(seq28009__$1);
var seq28009__$2 = cljs.core.next(seq28009__$1);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__28010,G__28011,seq28009__$2);
}));

/**
 * Read the value at `key`. Returns Promise<value | nil>.
 */
knoxx.backend.infra.temp_memory.mem_get = (async function knoxx$backend$infra$temp_memory$mem_get(k){
try{var result = (await knoxx.backend.infra.stores.mongo_temp_memory.get_memory_BANG_.cljs$core$IFn$_invoke$arity$1(k));
var or__5162__auto__ = result;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.temp_memory.local_get(k);
}
}catch (e28026){var _ = e28026;
return knoxx.backend.infra.temp_memory.local_get(k);
}});
/**
 * Delete `key`. Returns Promise<{:key k :deleted true}>.
 */
knoxx.backend.infra.temp_memory.mem_del_BANG_ = (async function knoxx$backend$infra$temp_memory$mem_del_BANG_(k){
try{(await knoxx.backend.infra.stores.mongo_temp_memory.delete_memory_BANG_.cljs$core$IFn$_invoke$arity$1(k));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"key","key",-1516042587),k,new cljs.core.Keyword(null,"deleted","deleted",-510100639),true], null);
}catch (e28034){var _ = e28034;
knoxx.backend.infra.temp_memory.local_del_BANG_(k);

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"key","key",-1516042587),k,new cljs.core.Keyword(null,"deleted","deleted",-510100639),true,new cljs.core.Keyword(null,"backend","backend",-847489124),new cljs.core.Keyword(null,"local","local",-1497766724)], null);
}});
knoxx.backend.infra.temp_memory.temp_key_re = /\{\{memory\.temp:([^}]+)\}\}/;
/**
 * Walk a data structure and collect all {{memory.temp:k}} keys.
 */
knoxx.backend.infra.temp_memory.collect_temp_keys = (function knoxx$backend$infra$temp_memory$collect_temp_keys(m){
var keys_found = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashSet.EMPTY);
var walk = (function knoxx$backend$infra$temp_memory$collect_temp_keys_$_walk(v){
if(typeof v === 'string'){
var seq__28076 = cljs.core.seq(cljs.core.re_seq(knoxx.backend.infra.temp_memory.temp_key_re,v));
var chunk__28077 = null;
var count__28078 = (0);
var i__28079 = (0);
while(true){
if((i__28079 < count__28078)){
var vec__28088 = chunk__28077.cljs$core$IIndexed$_nth$arity$2(null,i__28079);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28088,(0),null);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28088,(1),null);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(keys_found,cljs.core.conj,k);


var G__28215 = seq__28076;
var G__28216 = chunk__28077;
var G__28217 = count__28078;
var G__28218 = (i__28079 + (1));
seq__28076 = G__28215;
chunk__28077 = G__28216;
count__28078 = G__28217;
i__28079 = G__28218;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__28076);
if(temp__5825__auto__){
var seq__28076__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28076__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__28076__$1);
var G__28219 = cljs.core.chunk_rest(seq__28076__$1);
var G__28220 = c__5694__auto__;
var G__28221 = cljs.core.count(c__5694__auto__);
var G__28222 = (0);
seq__28076 = G__28219;
chunk__28077 = G__28220;
count__28078 = G__28221;
i__28079 = G__28222;
continue;
} else {
var vec__28098 = cljs.core.first(seq__28076__$1);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28098,(0),null);
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28098,(1),null);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(keys_found,cljs.core.conj,k);


var G__28227 = cljs.core.next(seq__28076__$1);
var G__28228 = null;
var G__28229 = (0);
var G__28230 = (0);
seq__28076 = G__28227;
chunk__28077 = G__28228;
count__28078 = G__28229;
i__28079 = G__28230;
continue;
}
} else {
return null;
}
}
break;
}
} else {
if(cljs.core.map_QMARK_(v)){
var seq__28102 = cljs.core.seq(cljs.core.vals(v));
var chunk__28103 = null;
var count__28104 = (0);
var i__28105 = (0);
while(true){
if((i__28105 < count__28104)){
var val = chunk__28103.cljs$core$IIndexed$_nth$arity$2(null,i__28105);
knoxx$backend$infra$temp_memory$collect_temp_keys_$_walk(val);


var G__28234 = seq__28102;
var G__28235 = chunk__28103;
var G__28236 = count__28104;
var G__28237 = (i__28105 + (1));
seq__28102 = G__28234;
chunk__28103 = G__28235;
count__28104 = G__28236;
i__28105 = G__28237;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__28102);
if(temp__5825__auto__){
var seq__28102__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28102__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__28102__$1);
var G__28238 = cljs.core.chunk_rest(seq__28102__$1);
var G__28239 = c__5694__auto__;
var G__28240 = cljs.core.count(c__5694__auto__);
var G__28241 = (0);
seq__28102 = G__28238;
chunk__28103 = G__28239;
count__28104 = G__28240;
i__28105 = G__28241;
continue;
} else {
var val = cljs.core.first(seq__28102__$1);
knoxx$backend$infra$temp_memory$collect_temp_keys_$_walk(val);


var G__28243 = cljs.core.next(seq__28102__$1);
var G__28244 = null;
var G__28245 = (0);
var G__28246 = (0);
seq__28102 = G__28243;
chunk__28103 = G__28244;
count__28104 = G__28245;
i__28105 = G__28246;
continue;
}
} else {
return null;
}
}
break;
}
} else {
if(cljs.core.sequential_QMARK_(v)){
var seq__28119 = cljs.core.seq(v);
var chunk__28120 = null;
var count__28121 = (0);
var i__28122 = (0);
while(true){
if((i__28122 < count__28121)){
var item = chunk__28120.cljs$core$IIndexed$_nth$arity$2(null,i__28122);
knoxx$backend$infra$temp_memory$collect_temp_keys_$_walk(item);


var G__28248 = seq__28119;
var G__28249 = chunk__28120;
var G__28250 = count__28121;
var G__28251 = (i__28122 + (1));
seq__28119 = G__28248;
chunk__28120 = G__28249;
count__28121 = G__28250;
i__28122 = G__28251;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__28119);
if(temp__5825__auto__){
var seq__28119__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28119__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__28119__$1);
var G__28252 = cljs.core.chunk_rest(seq__28119__$1);
var G__28253 = c__5694__auto__;
var G__28254 = cljs.core.count(c__5694__auto__);
var G__28255 = (0);
seq__28119 = G__28252;
chunk__28120 = G__28253;
count__28121 = G__28254;
i__28122 = G__28255;
continue;
} else {
var item = cljs.core.first(seq__28119__$1);
knoxx$backend$infra$temp_memory$collect_temp_keys_$_walk(item);


var G__28257 = cljs.core.next(seq__28119__$1);
var G__28258 = null;
var G__28259 = (0);
var G__28260 = (0);
seq__28119 = G__28257;
chunk__28120 = G__28258;
count__28121 = G__28259;
i__28122 = G__28260;
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
}
}
});
walk(m);

return cljs.core.deref(keys_found);
});
/**
 * Given a map m, find all {{memory.temp:k}} keys and resolve them from temp memory.
 * Returns a map of {key resolved-value}.
 */
knoxx.backend.infra.temp_memory.resolve_temps = (async function knoxx$backend$infra$temp_memory$resolve_temps(m){
var all_keys = cljs.core.vec(knoxx.backend.infra.temp_memory.collect_temp_keys(m));
if(cljs.core.empty_QMARK_(all_keys)){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
var resolved = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var seq__28131_28262 = cljs.core.seq(all_keys);
var chunk__28132_28263 = null;
var count__28133_28264 = (0);
var i__28134_28265 = (0);
while(true){
if((i__28134_28265 < count__28133_28264)){
var k_28266 = chunk__28132_28263.cljs$core$IIndexed$_nth$arity$2(null,i__28134_28265);
var result_28268 = (await knoxx.backend.infra.temp_memory.mem_get(k_28266));
if(cljs.core.truth_(result_28268)){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(resolved,cljs.core.assoc,k_28266,result_28268);
} else {
}


var G__28269 = seq__28131_28262;
var G__28270 = chunk__28132_28263;
var G__28271 = count__28133_28264;
var G__28272 = (i__28134_28265 + (1));
seq__28131_28262 = G__28269;
chunk__28132_28263 = G__28270;
count__28133_28264 = G__28271;
i__28134_28265 = G__28272;
continue;
} else {
var temp__5825__auto___28273 = cljs.core.seq(seq__28131_28262);
if(temp__5825__auto___28273){
var seq__28131_28274__$1 = temp__5825__auto___28273;
if(cljs.core.chunked_seq_QMARK_(seq__28131_28274__$1)){
var c__5694__auto___28275 = cljs.core.chunk_first(seq__28131_28274__$1);
var G__28276 = cljs.core.chunk_rest(seq__28131_28274__$1);
var G__28277 = c__5694__auto___28275;
var G__28278 = cljs.core.count(c__5694__auto___28275);
var G__28279 = (0);
seq__28131_28262 = G__28276;
chunk__28132_28263 = G__28277;
count__28133_28264 = G__28278;
i__28134_28265 = G__28279;
continue;
} else {
var k_28280 = cljs.core.first(seq__28131_28274__$1);
var result_28281 = (await knoxx.backend.infra.temp_memory.mem_get(k_28280));
if(cljs.core.truth_(result_28281)){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(resolved,cljs.core.assoc,k_28280,result_28281);
} else {
}


var G__28282 = cljs.core.next(seq__28131_28274__$1);
var G__28283 = null;
var G__28284 = (0);
var G__28285 = (0);
seq__28131_28262 = G__28282;
chunk__28132_28263 = G__28283;
count__28133_28264 = G__28284;
i__28134_28265 = G__28285;
continue;
}
} else {
}
}
break;
}

return cljs.core.deref(resolved);
}
});
knoxx.backend.infra.temp_memory.tool_spec = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"id","id",-1388402092),"memory.temp",new cljs.core.Keyword(null,"label","label",1718410804),"Temporary Memory",new cljs.core.Keyword(null,"description","description",-1428560544),"Read or write short-lived keyed data with a TTL. Use for passing state between pipeline steps or caching within a session.",new cljs.core.Keyword(null,"params","params",710516235),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),"string",new cljs.core.Keyword(null,"enum","enum",1679018432),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["set","get","del"], null),new cljs.core.Keyword(null,"required","required",1807647006),true], null),new cljs.core.Keyword(null,"key","key",-1516042587),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"string",new cljs.core.Keyword(null,"required","required",1807647006),true], null),new cljs.core.Keyword(null,"value","value",305978217),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"any",new cljs.core.Keyword(null,"required","required",1807647006),false], null),new cljs.core.Keyword(null,"ttl","ttl",-1115275118),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"string",new cljs.core.Keyword(null,"description","description",-1428560544),"ISO-8601 duration or integer seconds. Default PT1H."], null)], null),new cljs.core.Keyword(null,"handler","handler",-195596612),(function (p__28155){
var map__28157 = p__28155;
var map__28157__$1 = cljs.core.__destructure_map(map__28157);
var op = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28157__$1,new cljs.core.Keyword(null,"op","op",-1882987955));
var key = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28157__$1,new cljs.core.Keyword(null,"key","key",-1516042587));
var value = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28157__$1,new cljs.core.Keyword(null,"value","value",305978217));
var ttl = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28157__$1,new cljs.core.Keyword(null,"ttl","ttl",-1115275118));
var G__28159 = op;
switch (G__28159) {
case "set":
return knoxx.backend.infra.temp_memory.mem_set_BANG_.cljs$core$IFn$_invoke$arity$variadic(key,value,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ttl","ttl",-1115275118),ttl], null)], 0));

break;
case "get":
return knoxx.backend.infra.temp_memory.mem_get(key);

break;
case "del":
return knoxx.backend.infra.temp_memory.mem_del_BANG_(key);

break;
default:
throw (new Error((""+"No matching clause: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__28159))));

}
})], null);

//# sourceMappingURL=knoxx.backend.infra.temp_memory.js.map
