import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./shadow.esm.esm_import$node_fs.js";
import "./shadow.esm.esm_import$puppeteer_core.js";
goog.provide('knoxx.backend.infra.svg_render');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.svg_render !== 'undefined') && (typeof knoxx.backend.infra.svg_render.browser_atom !== 'undefined')){
} else {
knoxx.backend.infra.svg_render.browser_atom = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.svg_render !== 'undefined') && (typeof knoxx.backend.infra.svg_render.browser_promise_atom !== 'undefined')){
} else {
knoxx.backend.infra.svg_render.browser_promise_atom = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
knoxx.backend.infra.svg_render.chromium_candidate_paths = new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, ["/usr/bin/chromium","/usr/bin/chromium-browser","/usr/bin/google-chrome-stable","/usr/bin/google-chrome","/snap/bin/chromium"], null);
knoxx.backend.infra.svg_render.env_value = (function knoxx$backend$infra$svg_render$env_value(k){
var v = (process.env[k]);
if((((!((v == null)))) && ((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(v)))))))){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(v));
} else {
return null;
}
});
knoxx.backend.infra.svg_render.existing_file_QMARK_ = (function knoxx$backend$infra$svg_render$existing_file_QMARK_(path){
try{return shadow.esm.esm_import$node_fs.existsSync(path);
}catch (e26655){var _ = e26655;
return false;
}});
knoxx.backend.infra.svg_render.executable_path = (function knoxx$backend$infra$svg_render$executable_path(){
var or__5162__auto__ = knoxx.backend.infra.svg_render.env_value("PUPPETEER_EXECUTABLE_PATH");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.svg_render.env_value("KNOXX_CHROMIUM_PATH");
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.some((function (p1__26656_SHARP_){
if(cljs.core.truth_(knoxx.backend.infra.svg_render.existing_file_QMARK_(p1__26656_SHARP_))){
return p1__26656_SHARP_;
} else {
return null;
}
}),knoxx.backend.infra.svg_render.chromium_candidate_paths);
}
}
});
knoxx.backend.infra.svg_render.puppeteer_module = (function knoxx$backend$infra$svg_render$puppeteer_module(){
var or__5162__auto__ = shadow.esm.esm_import$puppeteer_core.default;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return shadow.esm.esm_import$puppeteer_core;
}
});
knoxx.backend.infra.svg_render.launch_options = (function knoxx$backend$infra$svg_render$launch_options(){
var opts = ({"args": ["--no-sandbox","--disable-setuid-sandbox"]});
var temp__5825__auto___26731 = knoxx.backend.infra.svg_render.executable_path();
if(cljs.core.truth_(temp__5825__auto___26731)){
var path_26732 = temp__5825__auto___26731;
(opts["executablePath"] = path_26732);
} else {
}

return opts;
});
knoxx.backend.infra.svg_render.remember_browser_BANG_ = (function knoxx$backend$infra$svg_render$remember_browser_BANG_(browser){
cljs.core.reset_BANG_(knoxx.backend.infra.svg_render.browser_atom,browser);

cljs.core.reset_BANG_(knoxx.backend.infra.svg_render.browser_promise_atom,null);

return browser;
});
knoxx.backend.infra.svg_render.forget_launch_BANG_ = (function knoxx$backend$infra$svg_render$forget_launch_BANG_(err){
cljs.core.reset_BANG_(knoxx.backend.infra.svg_render.browser_promise_atom,null);

throw err;
});
knoxx.backend.infra.svg_render.launch_browser_BANG_ = (async function knoxx$backend$infra$svg_render$launch_browser_BANG_(){
try{return knoxx.backend.infra.svg_render.remember_browser_BANG_((await knoxx.backend.infra.svg_render.puppeteer_module().launch(knoxx.backend.infra.svg_render.launch_options())));
}catch (e26677){var err = e26677;
return knoxx.backend.infra.svg_render.forget_launch_BANG_(err);
}});
knoxx.backend.infra.svg_render.get_browser = (async function knoxx$backend$infra$svg_render$get_browser(){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.svg_render.browser_atom))){
return cljs.core.deref(knoxx.backend.infra.svg_render.browser_atom);
} else {
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.svg_render.browser_promise_atom))){
return (await cljs.core.deref(knoxx.backend.infra.svg_render.browser_promise_atom));
} else {
var launch_promise = knoxx.backend.infra.svg_render.launch_browser_BANG_();
cljs.core.reset_BANG_(knoxx.backend.infra.svg_render.browser_promise_atom,launch_promise);

return (await launch_promise);

}
}
});
knoxx.backend.infra.svg_render.svg_document = (function knoxx$backend$infra$svg_render$svg_document(svg_string){
return (""+"<!doctype html>"+"<html><head><meta charset='utf-8'></head>"+"<body style='margin:0;padding:0;background:transparent'>"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(svg_string)+"</body></html>");
});
knoxx.backend.infra.svg_render.render_svg_BANG_ = (async function knoxx$backend$infra$svg_render$render_svg_BANG_(page,svg_string,width,height){
var _ = (await page.setViewport(({"width": width, "height": height})));
var ___$1 = (await page.setJavaScriptEnabled(false));
var ___$2 = (await page.setContent(knoxx.backend.infra.svg_render.svg_document(svg_string),({"waitUntil": "networkidle0"})));
var element = (await page.$("svg"));
if(cljs.core.truth_(element)){
} else {
throw (new Error("Cannot render SVG: no <svg> element found."));
}

var png = (await element.screenshot(({"type": "png", "omitBackground": true})));
return Buffer.from(png);
});
knoxx.backend.infra.svg_render.render_page_BANG_ = (function knoxx$backend$infra$svg_render$render_page_BANG_(page,svg_string,width,height){
var render_promise = knoxx.backend.infra.svg_render.render_svg_BANG_(page,svg_string,width,height);
return render_promise.finally((function (){
return page.close();
}));
});
/**
 * Renders an SVG string to a PNG Node Buffer via headless Chromium.
 * Returns a js/Promise<Buffer>.
 */
knoxx.backend.infra.svg_render.svg__GT_png = (async function knoxx$backend$infra$svg_render$svg__GT_png(svg_string,p__26710){
var map__26712 = p__26710;
var map__26712__$1 = cljs.core.__destructure_map(map__26712);
var width = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__26712__$1,new cljs.core.Keyword(null,"width","width",-384071477),(600));
var height = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__26712__$1,new cljs.core.Keyword(null,"height","height",1025178622),(300));
var browser = (await knoxx.backend.infra.svg_render.get_browser());
var page = (await browser.newPage());
return knoxx.backend.infra.svg_render.render_page_BANG_(page,svg_string,width,height);
});
/**
 * Closes the warm Chromium browser, if present. Returns a js/Promise.
 */
knoxx.backend.infra.svg_render.shutdown_BANG_ = (async function knoxx$backend$infra$svg_render$shutdown_BANG_(){
var temp__5823__auto__ = cljs.core.deref(knoxx.backend.infra.svg_render.browser_atom);
if(cljs.core.truth_(temp__5823__auto__)){
var browser = temp__5823__auto__;
cljs.core.reset_BANG_(knoxx.backend.infra.svg_render.browser_atom,null);

cljs.core.reset_BANG_(knoxx.backend.infra.svg_render.browser_promise_atom,null);

try{(await browser.close());

return true;
}catch (e26725){var err = e26725;
console.warn("[svg-render] failed to close Chromium",err);

return false;
}} else {
return true;
}
});

//# sourceMappingURL=knoxx.backend.infra.svg_render.js.map
