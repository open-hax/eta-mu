import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.domain.event.normalize');
knoxx.backend.domain.event.normalize.now_iso = (function knoxx$backend$domain$event$normalize$now_iso(){
return (new Date()).toISOString();
});
knoxx.backend.domain.event.normalize.nonblank = (function knoxx$backend$domain$event$normalize$nonblank(value){
var G__35562 = value;
var G__35562__$1 = (((G__35562 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__35562)));
var G__35562__$2 = (((G__35562__$1 == null))?null:clojure.string.trim(G__35562__$1));
if((G__35562__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__35562__$2);
}
});
knoxx.backend.domain.event.normalize.event_type = (function knoxx$backend$domain$event$normalize$event_type(value){
if((value instanceof cljs.core.Keyword)){
return value;
} else {
if((value == null)){
return null;
} else {
var raw = knoxx.backend.domain.event.normalize.nonblank(value);
if(cljs.core.truth_(raw)){
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(raw);
} else {
return null;
}

}
}
});
knoxx.backend.domain.event.normalize.event_types = (function knoxx$backend$domain$event$normalize$event_types(event){
var explicit = (function (){var or__5162__auto__ = new cljs.core.Keyword("event","types","event/types",753963593).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"eventTypes","eventTypes",-1966249997).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"eventKinds","eventKinds",360827289).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"event-kinds","event-kinds",1770855958).cljs$core$IFn$_invoke$arity$1(event);
}
}
}
})();
var primary = (function (){var or__5162__auto__ = new cljs.core.Keyword("event","type","event/type",1532247862).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"eventType","eventType",-1525570624).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"eventKind","eventKind",2138897648).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"event-kind","event-kind",-191230187).cljs$core$IFn$_invoke$arity$1(event);
}
}
}
})();
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.event.normalize.event_type,cljs.core.concat.cljs$core$IFn$_invoke$arity$2((cljs.core.truth_(primary)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [primary], null):null),explicit))));
});
knoxx.backend.domain.event.normalize.normalize_event = (function knoxx$backend$domain$event$normalize$normalize_event(event){
var event__$1 = (function (){var or__5162__auto__ = event;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var payload = (function (){var or__5162__auto__ = new cljs.core.Keyword("event","payload","event/payload",242016970).cljs$core$IFn$_invoke$arity$1(event__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"payload","payload",-383036092).cljs$core$IFn$_invoke$arity$1(event__$1);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
}
})();
var types = knoxx.backend.domain.event.normalize.event_types(event__$1);
var generator_kind = (function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(event__$1,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("event","generator","event/generator",-736110419),new cljs.core.Keyword(null,"kind","kind",-717265803)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"generatorKind","generatorKind",573777661).cljs$core$IFn$_invoke$arity$1(event__$1);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"generator-kind","generator-kind",1367391263).cljs$core$IFn$_invoke$arity$1(event__$1);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"generator","generator",-572962281).cljs$core$IFn$_invoke$arity$1(event__$1);
}
}
}
})();
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword("event","id","event/id",-1282332774),(function (){var or__5162__auto__ = knoxx.backend.domain.event.normalize.nonblank(new cljs.core.Keyword("event","id","event/id",-1282332774).cljs$core$IFn$_invoke$arity$1(event__$1));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.event.normalize.nonblank(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(event__$1));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (""+"evt_"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(Date.now()));
}
}
})(),new cljs.core.Keyword("event","type","event/type",1532247862),(function (){var or__5162__auto__ = cljs.core.first(types);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword("manual","event","manual/event",-773004436);
}
})(),new cljs.core.Keyword("event","types","event/types",753963593),((cljs.core.seq(types))?types:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("manual","event","manual/event",-773004436)], null)),new cljs.core.Keyword("event","actor","event/actor",-1927656555),(function (){var or__5162__auto__ = knoxx.backend.domain.event.normalize.nonblank(new cljs.core.Keyword("event","actor","event/actor",-1927656555).cljs$core$IFn$_invoke$arity$1(event__$1));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.event.normalize.nonblank(new cljs.core.Keyword(null,"actorId","actorId",989542370).cljs$core$IFn$_invoke$arity$1(event__$1));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.domain.event.normalize.nonblank(new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(event__$1));
}
}
})(),new cljs.core.Keyword("event","generator","event/generator",-736110419),(function (){var G__35623 = (function (){var or__5162__auto__ = new cljs.core.Keyword("event","generator","event/generator",-736110419).cljs$core$IFn$_invoke$arity$1(event__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
if(cljs.core.truth_(generator_kind)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__35623,new cljs.core.Keyword(null,"kind","kind",-717265803),generator_kind);
} else {
return G__35623;
}
})(),new cljs.core.Keyword("event","payload","event/payload",242016970),payload,new cljs.core.Keyword("event","timestamp","event/timestamp",-1672439471),(function (){var or__5162__auto__ = knoxx.backend.domain.event.normalize.nonblank(new cljs.core.Keyword("event","timestamp","event/timestamp",-1672439471).cljs$core$IFn$_invoke$arity$1(event__$1));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.event.normalize.nonblank(new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(event__$1));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.domain.event.normalize.now_iso();
}
}
})()], null);
});

//# sourceMappingURL=knoxx.backend.domain.event.normalize.js.map
