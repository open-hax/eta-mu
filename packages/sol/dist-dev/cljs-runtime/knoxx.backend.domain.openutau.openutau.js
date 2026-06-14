import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.domain.openutau.openutau');
knoxx.backend.domain.openutau.openutau.default_ustx_version = "0.6";
knoxx.backend.domain.openutau.openutau.default_ticks_per_quarter = (480);
knoxx.backend.domain.openutau.openutau.default_renderer = "WORLDLINE-R";
knoxx.backend.domain.openutau.openutau.default_track_color = "Blue";
knoxx.backend.domain.openutau.openutau.available_singers = new cljs.core.PersistentArrayMap(null, 3, ["teto",new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"name","name",1843675177),"\u91CD\u97F3\u30C6\u30C8 OU\u7528\u65E5\u672C\u8A9E\u7D71\u5408\u30E9\u30A4\u30D6\u30E9\u30EA\u30FC",new cljs.core.Keyword(null,"phonemizer","phonemizer",-1364007211),"OpenUtau.Core.Ustx.JapaneseCVPhonemizer",new cljs.core.Keyword(null,"language","language",-1591107564),"ja",new cljs.core.Keyword(null,"description","description",-1428560544),"Kasane Teto - Japanese integrated voicebank"], null),"ritsu",new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"name","name",1843675177),"\u6CE2\u97F3\u30EA\u30C4\u9023\u7D9A\u97F3Ver1.5.1",new cljs.core.Keyword(null,"phonemizer","phonemizer",-1364007211),"OpenUtau.Plugin.Builtin.JapaneseVCVPhonemizer",new cljs.core.Keyword(null,"language","language",-1591107564),"ja",new cljs.core.Keyword(null,"description","description",-1428560544),"Namine Ritsu - Japanese VCV connected voicebank"], null),"teto-en",new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"name","name",1843675177),"\u91CD\u97F3\u30C6\u30C8\u97F3\u58F0\u30E9\u30A4\u30D6\u30E9\u30EA\u30FC",new cljs.core.Keyword(null,"phonemizer","phonemizer",-1364007211),"OpenUtau.Plugin.Builtin.ArpasingPhonemizer",new cljs.core.Keyword(null,"language","language",-1591107564),"en",new cljs.core.Keyword(null,"description","description",-1428560544),"Kasane Teto - English voicebank"], null)], null);
knoxx.backend.domain.openutau.openutau.default_singer = "teto";
/**
 * Resolve singer config by ID or return default.
 */
knoxx.backend.domain.openutau.openutau.resolve_singer = (function knoxx$backend$domain$openutau$openutau$resolve_singer(singer_id){
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.openutau.openutau.available_singers,clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(singer_id))));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.openutau.openutau.available_singers,knoxx.backend.domain.openutau.openutau.default_singer);
}
});
knoxx.backend.domain.openutau.openutau.slugify = (function knoxx$backend$domain$openutau$openutau$slugify(value){
var base = clojure.string.replace(clojure.string.replace(clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "openutau-project";
}
})()))),/[^a-z0-9]+/,"-"),/^-+|-+$/,"");
if(clojure.string.blank_QMARK_(base)){
return "openutau-project";
} else {
return base;
}
});
knoxx.backend.domain.openutau.openutau.default_project_relative_path = (function knoxx$backend$domain$openutau$openutau$default_project_relative_path(project_name){
var slug = knoxx.backend.domain.openutau.openutau.slugify(project_name);
return (""+"orgs/open-hax/openplanner/packages/agents/knoxx/uploads/openutau/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(slug)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(slug)+".ustx");
});
knoxx.backend.domain.openutau.openutau.finite_number_QMARK_ = (function knoxx$backend$domain$openutau$openutau$finite_number_QMARK_(value){
var and__5160__auto__ = typeof value === 'number';
if(and__5160__auto__){
return Number.isFinite(value);
} else {
return and__5160__auto__;
}
});
knoxx.backend.domain.openutau.openutau.parse_number = (function knoxx$backend$domain$openutau$openutau$parse_number(value){
if(cljs.core.truth_(knoxx.backend.domain.openutau.openutau.finite_number_QMARK_(value))){
return value;
} else {
if(typeof value === 'string'){
var parsed = parseFloat(value);
if(cljs.core.truth_(Number.isFinite(parsed))){
return parsed;
} else {
return null;
}
} else {
return null;

}
}
});
knoxx.backend.domain.openutau.openutau.clamp_int = (function knoxx$backend$domain$openutau$openutau$clamp_int(value,fallback,min_value,max_value){
var n = knoxx.backend.domain.openutau.openutau.parse_number(value);
if((n == null)){
return fallback;
} else {
return cljs.core.min.cljs$core$IFn$_invoke$arity$2(cljs.core.max.cljs$core$IFn$_invoke$arity$2(Math.round(n),min_value),max_value);
}
});
knoxx.backend.domain.openutau.openutau.clamp_float = (function knoxx$backend$domain$openutau$openutau$clamp_float(value,fallback,min_value,max_value){
var n = knoxx.backend.domain.openutau.openutau.parse_number(value);
if((n == null)){
return fallback;
} else {
return cljs.core.min.cljs$core$IFn$_invoke$arity$2(cljs.core.max.cljs$core$IFn$_invoke$arity$2(n,min_value),max_value);
}
});
/**
 * Lyric strings that hang OpenUTAU's renderer after phonemization.
 * Map of problematic -> safe replacement.
 */
knoxx.backend.domain.openutau.openutau.known_problematic_lyrics = new cljs.core.PersistentArrayMap(null, 1, ["kyoukai","kaikyou"], null);
/**
 * Sanitize lyric text to avoid OpenUTAU renderer hangs.
 * - Removes hyphens and spaces
 * - Replaces known problematic romaji patterns
 * - Falls back to 'a' for empty strings
 */
knoxx.backend.domain.openutau.openutau.sanitize_lyric = (function knoxx$backend$domain$openutau$openutau$sanitize_lyric(lyric){
if(cljs.core.truth_(lyric)){
var cleaned = clojure.string.lower_case(clojure.string.replace(clojure.string.trim(lyric),/[-\s]+/,""));
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.openutau.openutau.known_problematic_lyrics,cleaned);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.not_empty(cleaned);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "a";
}
}
} else {
return null;
}
});
knoxx.backend.domain.openutau.openutau.lyric_text = (function knoxx$backend$domain$openutau$openutau$lyric_text(note){
var lyric = (function (){var G__33539 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"lyric","lyric",164436415).cljs$core$IFn$_invoke$arity$1(note);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(note);
}
})();
var G__33539__$1 = (((G__33539 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33539)));
var G__33539__$2 = (((G__33539__$1 == null))?null:clojure.string.trim(G__33539__$1));
if((G__33539__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33539__$2);
}
})();
var phonetic_hint = (function (){var G__33541 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"phonetic_hint","phonetic_hint",1425882362).cljs$core$IFn$_invoke$arity$1(note);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"phonetic-hint","phonetic-hint",999705969).cljs$core$IFn$_invoke$arity$1(note);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"phoneticHint","phoneticHint",-2094145553).cljs$core$IFn$_invoke$arity$1(note);
}
}
})();
var G__33541__$1 = (((G__33541 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33541)));
var G__33541__$2 = (((G__33541__$1 == null))?null:clojure.string.trim(G__33541__$1));
if((G__33541__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33541__$2);
}
})();
if(cljs.core.truth_((function (){var and__5160__auto__ = lyric;
if(cljs.core.truth_(and__5160__auto__)){
return phonetic_hint;
} else {
return and__5160__auto__;
}
})())){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.openutau.openutau.sanitize_lyric(lyric))+" ["+cljs.core.str.cljs$core$IFn$_invoke$arity$1(phonetic_hint)+"]");
} else {
if(cljs.core.truth_(phonetic_hint)){
return (""+"["+cljs.core.str.cljs$core$IFn$_invoke$arity$1(phonetic_hint)+"]");
} else {
if(cljs.core.truth_(lyric)){
return knoxx.backend.domain.openutau.openutau.sanitize_lyric(lyric);
} else {
return "a";

}
}
}
});
/**
 * OpenUTAU's WORLDLINE-R renderer appears to hang when processing
 * voice parts with fewer than ~12 notes. Pad with safe syllables to ensure
 * reliable headless rendering.
 */
knoxx.backend.domain.openutau.openutau.min_renderable_notes = (12);
/**
 * Cyclic pool of safe hiragana syllables for note padding.
 * JapaneseCVPhonemizer accepts these; romaji vowels like 'a' hang.
 */
knoxx.backend.domain.openutau.openutau.hiragana_pad_lyrics = new cljs.core.PersistentVector(null, 12, 5, cljs.core.PersistentVector.EMPTY_NODE, ["\u3042","\u3044","\u3046","\u3048","\u304A","\u304B","\u304D","\u304F","\u3051","\u3053","\u3055","\u3057"], null);
/**
 * Ensure at least MIN-RENDERABLE-NOTES by appending hiragana pad notes.
 * OpenUTAU's WORLDLINE-R renderer hangs with fewer than ~12 singable notes.
 * Pads with cyclic hiragana (never rests/romaji) to keep phonemizer happy.
 */
knoxx.backend.domain.openutau.openutau.pad_notes = (function knoxx$backend$domain$openutau$openutau$pad_notes(notes){
var current_count = cljs.core.count(notes);
if((current_count >= (12))){
return notes;
} else {
var last_end = ((cljs.core.seq(notes))?(new cljs.core.Keyword(null,"position","position",-2011731912).cljs$core$IFn$_invoke$arity$1(cljs.core.last(notes)) + new cljs.core.Keyword(null,"duration","duration",1444101068).cljs$core$IFn$_invoke$arity$1(cljs.core.last(notes))):(0));
var pad_duration = knoxx.backend.domain.openutau.openutau.default_ticks_per_quarter;
var needed = ((12) - current_count);
var pad_notes = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (i){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"position","position",-2011731912),(last_end + (i * pad_duration)),new cljs.core.Keyword(null,"duration","duration",1444101068),pad_duration,new cljs.core.Keyword(null,"tone","tone",-1422788785),(60),new cljs.core.Keyword(null,"lyric","lyric",164436415),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.openutau.openutau.hiragana_pad_lyrics,cljs.core.mod(i,cljs.core.count(knoxx.backend.domain.openutau.openutau.hiragana_pad_lyrics)))], null);
}),cljs.core.range.cljs$core$IFn$_invoke$arity$1(needed));
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(notes,pad_notes);
}
});
knoxx.backend.domain.openutau.openutau.normalize_notes = (function knoxx$backend$domain$openutau$openutau$normalize_notes(notes){
var remaining = cljs.core.seq(notes);
var cursor = (0);
var normalized = cljs.core.PersistentVector.EMPTY;
while(true){
if(cljs.core.not(remaining)){
return knoxx.backend.domain.openutau.openutau.pad_notes(normalized);
} else {
var note = cljs.core.first(remaining);
var explicit_position = knoxx.backend.domain.openutau.openutau.parse_number((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"position","position",-2011731912).cljs$core$IFn$_invoke$arity$1(note);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"start_tick","start_tick",-2101810776).cljs$core$IFn$_invoke$arity$1(note);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"start-tick","start-tick",1709314339).cljs$core$IFn$_invoke$arity$1(note);
}
}
})());
var position = (((explicit_position == null))?cursor:cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),Math.round(explicit_position)));
var duration = knoxx.backend.domain.openutau.openutau.clamp_int((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"duration","duration",1444101068).cljs$core$IFn$_invoke$arity$1(note);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"duration_ticks","duration_ticks",1004912450).cljs$core$IFn$_invoke$arity$1(note);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"duration-ticks","duration-ticks",-468631450).cljs$core$IFn$_invoke$arity$1(note);
}
}
})(),knoxx.backend.domain.openutau.openutau.default_ticks_per_quarter,(10),((64) * knoxx.backend.domain.openutau.openutau.default_ticks_per_quarter));
var tone = knoxx.backend.domain.openutau.openutau.clamp_int((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tone","tone",-1422788785).cljs$core$IFn$_invoke$arity$1(note);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"midi","midi",1256960668).cljs$core$IFn$_invoke$arity$1(note);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"note","note",1426297904).cljs$core$IFn$_invoke$arity$1(note);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"pitch","pitch",1495126700).cljs$core$IFn$_invoke$arity$1(note);
}
}
}
})(),(60),(0),(127));
var normalized_note = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"position","position",-2011731912),position,new cljs.core.Keyword(null,"duration","duration",1444101068),duration,new cljs.core.Keyword(null,"tone","tone",-1422788785),tone,new cljs.core.Keyword(null,"lyric","lyric",164436415),knoxx.backend.domain.openutau.openutau.lyric_text(note)], null);
var G__33698 = cljs.core.next(remaining);
var G__33699 = (position + duration);
var G__33700 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(normalized,normalized_note);
remaining = G__33698;
cursor = G__33699;
normalized = G__33700;
continue;
}
break;
}
});
knoxx.backend.domain.openutau.openutau.voice_part_duration = (function knoxx$backend$domain$openutau$openutau$voice_part_duration(normalized_notes){
return (cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (max_end,p__33588){
var map__33590 = p__33588;
var map__33590__$1 = cljs.core.__destructure_map(map__33590);
var position = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33590__$1,new cljs.core.Keyword(null,"position","position",-2011731912));
var duration = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33590__$1,new cljs.core.Keyword(null,"duration","duration",1444101068));
return cljs.core.max.cljs$core$IFn$_invoke$arity$2(max_end,(position + duration));
}),(0),normalized_notes) + knoxx.backend.domain.openutau.openutau.default_ticks_per_quarter);
});
knoxx.backend.domain.openutau.openutau.project_name = (function knoxx$backend$domain$openutau$openutau$project_name(opts){
var or__5162__auto__ = (function (){var G__33596 = new cljs.core.Keyword(null,"project_name","project_name",-1535411620).cljs$core$IFn$_invoke$arity$1(opts);
var G__33596__$1 = (((G__33596 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33596)));
var G__33596__$2 = (((G__33596__$1 == null))?null:clojure.string.trim(G__33596__$1));
if((G__33596__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33596__$2);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__33605 = new cljs.core.Keyword(null,"project-name","project-name",1486861539).cljs$core$IFn$_invoke$arity$1(opts);
var G__33605__$1 = (((G__33605 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33605)));
var G__33605__$2 = (((G__33605__$1 == null))?null:clojure.string.trim(G__33605__$1));
if((G__33605__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33605__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "Knoxx OpenUtau Project";
}
}
});
knoxx.backend.domain.openutau.openutau.time_signature = (function knoxx$backend$domain$openutau$openutau$time_signature(opts){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.domain.openutau.openutau.clamp_int((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"beat_per_bar","beat_per_bar",-752938484).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"beat-per-bar","beat-per-bar",914529868).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(opts,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"time_signature","time_signature",-98519217),new cljs.core.Keyword(null,"beat_per_bar","beat_per_bar",-752938484)], null));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(opts,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"time_signature","time_signature",-98519217),new cljs.core.Keyword(null,"beat-per-bar","beat-per-bar",914529868)], null));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(opts,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"time-signature","time-signature",-1730387952),new cljs.core.Keyword(null,"beat_per_bar","beat_per_bar",-752938484)], null));
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(opts,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"time-signature","time-signature",-1730387952),new cljs.core.Keyword(null,"beat-per-bar","beat-per-bar",914529868)], null));
}
}
}
}
}
})(),(4),(1),(32)),knoxx.backend.domain.openutau.openutau.clamp_int((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"beat_unit","beat_unit",1360431781).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"beat-unit","beat-unit",-869271375).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(opts,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"time_signature","time_signature",-98519217),new cljs.core.Keyword(null,"beat_unit","beat_unit",1360431781)], null));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(opts,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"time_signature","time_signature",-98519217),new cljs.core.Keyword(null,"beat-unit","beat-unit",-869271375)], null));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(opts,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"time-signature","time-signature",-1730387952),new cljs.core.Keyword(null,"beat_unit","beat_unit",1360431781)], null));
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(opts,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"time-signature","time-signature",-1730387952),new cljs.core.Keyword(null,"beat-unit","beat-unit",-869271375)], null));
}
}
}
}
}
})(),(4),(1),(32))], null);
});
knoxx.backend.domain.openutau.openutau.singer_settings = (function knoxx$backend$domain$openutau$openutau$singer_settings(opts){
var singer_config = knoxx.backend.domain.openutau.openutau.resolve_singer((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"singer_id","singer_id",1456162645).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"singer-id","singer-id",705189264).cljs$core$IFn$_invoke$arity$1(opts);
}
})());
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"singer-id","singer-id",705189264),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(singer_config),new cljs.core.Keyword(null,"phonemizer","phonemizer",-1364007211),(function (){var or__5162__auto__ = (function (){var G__33628 = new cljs.core.Keyword(null,"phonemizer","phonemizer",-1364007211).cljs$core$IFn$_invoke$arity$1(opts);
var G__33628__$1 = (((G__33628 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33628)));
var G__33628__$2 = (((G__33628__$1 == null))?null:clojure.string.trim(G__33628__$1));
if((G__33628__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33628__$2);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"phonemizer","phonemizer",-1364007211).cljs$core$IFn$_invoke$arity$1(singer_config);
}
})()], null);
});
knoxx.backend.domain.openutau.openutau.ustx_note = (function knoxx$backend$domain$openutau$openutau$ustx_note(p__33631){
var map__33632 = p__33631;
var map__33632__$1 = cljs.core.__destructure_map(map__33632);
var position = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33632__$1,new cljs.core.Keyword(null,"position","position",-2011731912));
var duration = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33632__$1,new cljs.core.Keyword(null,"duration","duration",1444101068));
var tone = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33632__$1,new cljs.core.Keyword(null,"tone","tone",-1422788785));
var lyric = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33632__$1,new cljs.core.Keyword(null,"lyric","lyric",164436415));
return (new cljs.core.PersistentArrayMap(null,(8),["position",position,"duration",duration,"tone",tone,"lyric",lyric,"pitch",(new cljs.core.PersistentArrayMap(null,(2),["data",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentArrayMap(null,(3),["x",(-40),"y",(0),"shape","io"],null)),(new cljs.core.PersistentArrayMap(null,(3),["x",(40),"y",(0),"shape","io"],null))], null),"snap_first",true],null)),"vibrato",(new cljs.core.PersistentArrayMap(null,(8),["length",(0),"period",(175),"depth",(25),"in",(10),"out",(10),"shift",(0),"drift",(0),"vol_link",(0)],null)),"phoneme_expressions",cljs.core.PersistentVector.EMPTY,"phoneme_overrides",cljs.core.PersistentVector.EMPTY],null));
});
knoxx.backend.domain.openutau.openutau.track_settings = (function knoxx$backend$domain$openutau$openutau$track_settings(opts,singer_id,phonemizer){
return (new cljs.core.PersistentArrayMap(null,(10),["singer",singer_id,"phonemizer",phonemizer,"renderer_settings",(new cljs.core.PersistentArrayMap(null,(1),["renderer",knoxx.backend.domain.openutau.openutau.default_renderer],null)),"track_name",(function (){var or__5162__auto__ = (function (){var G__33635 = new cljs.core.Keyword(null,"track_name","track_name",1331132230).cljs$core$IFn$_invoke$arity$1(opts);
var G__33635__$1 = (((G__33635 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33635)));
var G__33635__$2 = (((G__33635__$1 == null))?null:clojure.string.trim(G__33635__$1));
if((G__33635__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33635__$2);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__33637 = new cljs.core.Keyword(null,"track-name","track-name",2146044267).cljs$core$IFn$_invoke$arity$1(opts);
var G__33637__$1 = (((G__33637 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33637)));
var G__33637__$2 = (((G__33637__$1 == null))?null:clojure.string.trim(G__33637__$1));
if((G__33637__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33637__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "Vocal";
}
}
})(),"track_color",knoxx.backend.domain.openutau.openutau.default_track_color,"mute",false,"solo",false,"volume",(0),"pan",(0),"voice_color_names",new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [""], null)],null));
});
knoxx.backend.domain.openutau.openutau.voice_part = (function knoxx$backend$domain$openutau$openutau$voice_part(opts,normalized_notes){
return (new cljs.core.PersistentArrayMap(null,(6),["duration",knoxx.backend.domain.openutau.openutau.voice_part_duration(normalized_notes),"name",(function (){var or__5162__auto__ = (function (){var G__33638 = new cljs.core.Keyword(null,"part_name","part_name",-334556537).cljs$core$IFn$_invoke$arity$1(opts);
var G__33638__$1 = (((G__33638 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33638)));
var G__33638__$2 = (((G__33638__$1 == null))?null:clojure.string.trim(G__33638__$1));
if((G__33638__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33638__$2);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__33641 = new cljs.core.Keyword(null,"part-name","part-name",-290002832).cljs$core$IFn$_invoke$arity$1(opts);
var G__33641__$1 = (((G__33641 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33641)));
var G__33641__$2 = (((G__33641__$1 == null))?null:clojure.string.trim(G__33641__$1));
if((G__33641__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33641__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "Main Part";
}
}
})(),"track_no",(0),"position",(0),"notes",cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.openutau.openutau.ustx_note,normalized_notes),"curves",cljs.core.PersistentVector.EMPTY],null));
});
knoxx.backend.domain.openutau.openutau.build_project = (function knoxx$backend$domain$openutau$openutau$build_project(opts,normalized_notes){
var vec__33643 = knoxx.backend.domain.openutau.openutau.time_signature(opts);
var beat_per_bar = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33643,(0),null);
var beat_unit = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33643,(1),null);
var map__33646 = knoxx.backend.domain.openutau.openutau.singer_settings(opts);
var map__33646__$1 = cljs.core.__destructure_map(map__33646);
var singer_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33646__$1,new cljs.core.Keyword(null,"singer-id","singer-id",705189264));
var phonemizer = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33646__$1,new cljs.core.Keyword(null,"phonemizer","phonemizer",-1364007211));
return (new cljs.core.PersistentArrayMap(null,(12),["name",knoxx.backend.domain.openutau.openutau.project_name(opts),"comment",(function (){var or__5162__auto__ = (function (){var G__33648 = new cljs.core.Keyword(null,"comment","comment",532206069).cljs$core$IFn$_invoke$arity$1(opts);
var G__33648__$1 = (((G__33648 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33648)));
var G__33648__$2 = (((G__33648__$1 == null))?null:clojure.string.trim(G__33648__$1));
if((G__33648__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__33648__$2);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Generated by Knoxx for OpenUtau. Open in OpenUtau and export audio from the UI.";
}
})(),"output_dir","Export","cache_dir","UCache","ustx_version",knoxx.backend.domain.openutau.openutau.default_ustx_version,"resolution",knoxx.backend.domain.openutau.openutau.default_ticks_per_quarter,"key",knoxx.backend.domain.openutau.openutau.clamp_int(new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(opts),(0),(0),(11)),"time_signatures",new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentArrayMap(null,(3),["bar_position",(0),"beat_per_bar",beat_per_bar,"beat_unit",beat_unit],null))], null),"tempos",new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentArrayMap(null,(2),["position",(0),"bpm",knoxx.backend.domain.openutau.openutau.clamp_float(new cljs.core.Keyword(null,"tempo","tempo",-1555208453).cljs$core$IFn$_invoke$arity$1(opts),(120),(20),(300))],null))], null),"tracks",new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.domain.openutau.openutau.track_settings(opts,singer_id,phonemizer)], null),"voice_parts",new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.domain.openutau.openutau.voice_part(opts,normalized_notes)], null),"wave_parts",cljs.core.PersistentVector.EMPTY],null));
});
knoxx.backend.domain.openutau.openutau.yaml_scalar = (function knoxx$backend$domain$openutau$openutau$yaml_scalar(value){
if((value == null)){
return "null";
} else {
if(typeof value === 'string'){
return (""+"'"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.replace(value,/'/,"''"))+"'");
} else {
if((value instanceof cljs.core.Keyword)){
var G__33652 = cljs.core.name(value);
return (knoxx.backend.domain.openutau.openutau.yaml_scalar.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.openutau.openutau.yaml_scalar.cljs$core$IFn$_invoke$arity$1(G__33652) : knoxx.backend.domain.openutau.openutau.yaml_scalar.call(null,G__33652));
} else {
if(cljs.core.boolean_QMARK_(value)){
if(value){
return "true";
} else {
return "false";
}
} else {
if(typeof value === 'number'){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));
} else {
var G__33653 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));
return (knoxx.backend.domain.openutau.openutau.yaml_scalar.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.openutau.openutau.yaml_scalar.cljs$core$IFn$_invoke$arity$1(G__33653) : knoxx.backend.domain.openutau.openutau.yaml_scalar.call(null,G__33653));

}
}
}
}
}
});
knoxx.backend.domain.openutau.openutau.indent_str = (function knoxx$backend$domain$openutau$openutau$indent_str(n){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.repeat.cljs$core$IFn$_invoke$arity$2(n," "));
});
knoxx.backend.domain.openutau.openutau.emit_map_lines = (function knoxx$backend$domain$openutau$openutau$emit_map_lines(m,indent){
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p__33655){
var vec__33656 = p__33655;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33656,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33656,(1),null);
var key = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(k));
var prefix = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.openutau.openutau.indent_str(indent))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(key));
if(cljs.core.map_QMARK_(v)){
if(cljs.core.empty_QMARK_(v)){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+": {}")], null);
} else {
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+":")], null),(function (){var G__33659 = v;
var G__33660 = (indent + (2));
return (knoxx.backend.domain.openutau.openutau.emit_yaml_lines.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.openutau.openutau.emit_yaml_lines.cljs$core$IFn$_invoke$arity$2(G__33659,G__33660) : knoxx.backend.domain.openutau.openutau.emit_yaml_lines.call(null,G__33659,G__33660));
})());
}
} else {
if(cljs.core.vector_QMARK_(v)){
if(cljs.core.empty_QMARK_(v)){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+": []")], null);
} else {
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+":")], null),(function (){var G__33661 = v;
var G__33662 = (indent + (2));
return (knoxx.backend.domain.openutau.openutau.emit_yaml_lines.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.openutau.openutau.emit_yaml_lines.cljs$core$IFn$_invoke$arity$2(G__33661,G__33662) : knoxx.backend.domain.openutau.openutau.emit_yaml_lines.call(null,G__33661,G__33662));
})());
}
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.openutau.openutau.yaml_scalar(v)))], null);

}
}
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([m], 0));
});
knoxx.backend.domain.openutau.openutau.emit_vector_lines = (function knoxx$backend$domain$openutau$openutau$emit_vector_lines(xs,indent){
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (item){
var prefix = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.openutau.openutau.indent_str(indent))+"-");
if(cljs.core.map_QMARK_(item)){
if(cljs.core.empty_QMARK_(item)){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+" {}")], null);
} else {
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [prefix], null),(function (){var G__33666 = item;
var G__33667 = (indent + (2));
return (knoxx.backend.domain.openutau.openutau.emit_yaml_lines.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.openutau.openutau.emit_yaml_lines.cljs$core$IFn$_invoke$arity$2(G__33666,G__33667) : knoxx.backend.domain.openutau.openutau.emit_yaml_lines.call(null,G__33666,G__33667));
})());
}
} else {
if(cljs.core.vector_QMARK_(item)){
if(cljs.core.empty_QMARK_(item)){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+" []")], null);
} else {
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [prefix], null),(function (){var G__33670 = item;
var G__33671 = (indent + (2));
return (knoxx.backend.domain.openutau.openutau.emit_yaml_lines.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.openutau.openutau.emit_yaml_lines.cljs$core$IFn$_invoke$arity$2(G__33670,G__33671) : knoxx.backend.domain.openutau.openutau.emit_yaml_lines.call(null,G__33670,G__33671));
})());
}
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+" "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.openutau.openutau.yaml_scalar(item)))], null);

}
}
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([xs], 0));
});
knoxx.backend.domain.openutau.openutau.emit_yaml_lines = (function knoxx$backend$domain$openutau$openutau$emit_yaml_lines(value,indent){
if(cljs.core.map_QMARK_(value)){
return knoxx.backend.domain.openutau.openutau.emit_map_lines(value,indent);
} else {
if(cljs.core.vector_QMARK_(value)){
return knoxx.backend.domain.openutau.openutau.emit_vector_lines(value,indent);
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.openutau.openutau.indent_str(indent))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.openutau.openutau.yaml_scalar(value)))], null);

}
}
});
knoxx.backend.domain.openutau.openutau.project__GT_ustx_yaml = (function knoxx$backend$domain$openutau$openutau$project__GT_ustx_yaml(project){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",knoxx.backend.domain.openutau.openutau.emit_yaml_lines(project,(0))))+"\n");
});
knoxx.backend.domain.openutau.openutau.readme_markdown = (function knoxx$backend$domain$openutau$openutau$readme_markdown(p__33677){
var map__33678 = p__33677;
var map__33678__$1 = cljs.core.__destructure_map(map__33678);
var project_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33678__$1,new cljs.core.Keyword(null,"project-name","project-name",1486861539));
var ustx_path = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33678__$1,new cljs.core.Keyword(null,"ustx-path","ustx-path",242803323));
var readme_path = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33678__$1,new cljs.core.Keyword(null,"readme-path","readme-path",205242972));
var note_count = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33678__$1,new cljs.core.Keyword(null,"note-count","note-count",-2010784834));
var tempo = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33678__$1,new cljs.core.Keyword(null,"tempo","tempo",-1555208453));
var singer_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33678__$1,new cljs.core.Keyword(null,"singer-id","singer-id",705189264));
var phonemizer = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33678__$1,new cljs.core.Keyword(null,"phonemizer","phonemizer",-1364007211));
return (""+"# "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(project_name)+"\n\n"+"Generated by Knoxx as an OpenUtau singing-project scaffold.\n\n"+"## Files\n"+"- `"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ustx_path)+"` \u2014 OpenUtau `.ustx` project\n"+"- `"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(readme_path)+"` \u2014 this workflow note\n\n"+"## Current settings\n"+"- Notes: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(note_count)+"\n"+"- Tempo: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tempo)+" BPM\n"+"- Renderer: `"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.openutau.openutau.default_renderer)+"`\n"+"- Singer: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(singer_id))))?"_(choose in OpenUtau)_":(""+"`"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(singer_id)+"`")))+"\n"+"- Phonemizer: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(phonemizer))))?"_(choose in OpenUtau if needed)_":(""+"`"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(phonemizer)+"`")))+"\n\n"+"## Render workflow\n"+"1. Open `"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ustx_path)+"` in OpenUtau.\n"+"2. If singer or phonemizer is blank, select them on the vocal track.\n"+"3. Review lyrics, phonemes, and pitch/timing.\n"+"4. Export audio with `File > Export Audio > Export wav Files` or `Mixdown To Wav File`.\n\n"+"## Headless render\n"+"Use the `voice.openutau_render` tool to render this project to WAV without opening the UI.\n"+"Requires: Xvfb + OpenUTAU + voicebank + WORLDLINE-R renderer.\n"+"\n"+"## Available singers\n"+"- `teto` \u2014 \u91CD\u97F3\u30C6\u30C8 OU\u7528\u65E5\u672C\u8A9E\u7D71\u5408\u30E9\u30A4\u30D6\u30E9\u30EA\u30FC (Kasane Teto - Japanese)\n"+"- `ritsu` \u2014 \u6CE2\u97F3\u30EA\u30C4\u9023\u7D9A\u97F3Ver1.5.1 (Namine Ritsu - Japanese)\n"+"- `teto-en` \u2014 \u91CD\u97F3\u30C6\u30C8\u97F3\u58F0\u30E9\u30A4\u30D6\u30E9\u30EA\u30FC (Kasane Teto - English)\n");
});

//# sourceMappingURL=knoxx.backend.domain.openutau.openutau.js.map
