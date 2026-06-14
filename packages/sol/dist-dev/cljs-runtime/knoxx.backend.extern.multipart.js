import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.extern.multipart');
knoxx.backend.extern.multipart.parts_BANG_ = (async function knoxx$backend$extern$multipart$parts_BANG_(request){
var parts = (await Array.fromAsync(request.parts()));
return cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(parts));
});
knoxx.backend.extern.multipart.file_part_QMARK_ = (function knoxx$backend$extern$multipart$file_part_QMARK_(part){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("file",(part["type"]));
});
knoxx.backend.extern.multipart.file_parts = (function knoxx$backend$extern$multipart$file_parts(parts){
return cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.extern.multipart.file_part_QMARK_,parts);
});
knoxx.backend.extern.multipart.part_filename = (function knoxx$backend$extern$multipart$part_filename(part){
var or__5162__auto__ = (part["filename"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "upload.bin";
}
});
knoxx.backend.extern.multipart.part_mime_type = (function knoxx$backend$extern$multipart$part_mime_type(part){
var or__5162__auto__ = (part["mimetype"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (part["type"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "application/octet-stream";
}
}
});
knoxx.backend.extern.multipart.part_size = (function knoxx$backend$extern$multipart$part_size(part){
var or__5162__auto__ = (part["size"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
});
knoxx.backend.extern.multipart.part_buffer_BANG_ = (async function knoxx$backend$extern$multipart$part_buffer_BANG_(part){
var buf = (await (new Response((part["file"]))).arrayBuffer());
return Buffer.from(buf);
});
knoxx.backend.extern.multipart.part_array_buffer_BANG_ = (function knoxx$backend$extern$multipart$part_array_buffer_BANG_(part){
return (new Response((part["file"]))).arrayBuffer();
});

//# sourceMappingURL=knoxx.backend.extern.multipart.js.map
