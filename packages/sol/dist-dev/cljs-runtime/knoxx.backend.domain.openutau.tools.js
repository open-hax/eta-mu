import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.openutau.openutau.js";
goog.provide('knoxx.backend.domain.openutau.tools');
knoxx.backend.domain.openutau.tools.default_render_script_path = "render-ustx.sh";
knoxx.backend.domain.openutau.tools.render_script_path = (function knoxx$backend$domain$openutau$tools$render_script_path(){
var or__5162__auto__ = (process.env["KNOXX_OPENUTAU_RENDER_SCRIPT"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.openutau.tools.default_render_script_path;
}
});
knoxx.backend.domain.openutau.tools.default_ustx_version = knoxx.backend.domain.openutau.openutau.default_ustx_version;
knoxx.backend.domain.openutau.tools.default_ticks_per_quarter = knoxx.backend.domain.openutau.openutau.default_ticks_per_quarter;
knoxx.backend.domain.openutau.tools.default_renderer = knoxx.backend.domain.openutau.openutau.default_renderer;
knoxx.backend.domain.openutau.tools.default_track_color = knoxx.backend.domain.openutau.openutau.default_track_color;
knoxx.backend.domain.openutau.tools.available_singers = knoxx.backend.domain.openutau.openutau.available_singers;
knoxx.backend.domain.openutau.tools.default_singer = knoxx.backend.domain.openutau.openutau.default_singer;
knoxx.backend.domain.openutau.tools.min_renderable_notes = (12);
knoxx.backend.domain.openutau.tools.resolve_singer = knoxx.backend.domain.openutau.openutau.resolve_singer;
knoxx.backend.domain.openutau.tools.slugify = knoxx.backend.domain.openutau.openutau.slugify;
knoxx.backend.domain.openutau.tools.default_project_relative_path = knoxx.backend.domain.openutau.openutau.default_project_relative_path;
knoxx.backend.domain.openutau.tools.sanitize_lyric = knoxx.backend.domain.openutau.openutau.sanitize_lyric;
knoxx.backend.domain.openutau.tools.lyric_text = knoxx.backend.domain.openutau.openutau.lyric_text;
knoxx.backend.domain.openutau.tools.normalize_notes = knoxx.backend.domain.openutau.openutau.normalize_notes;
knoxx.backend.domain.openutau.tools.build_project = knoxx.backend.domain.openutau.openutau.build_project;
knoxx.backend.domain.openutau.tools.emit_yaml_lines = knoxx.backend.domain.openutau.openutau.emit_yaml_lines;
knoxx.backend.domain.openutau.tools.project__GT_ustx_yaml = knoxx.backend.domain.openutau.openutau.project__GT_ustx_yaml;
knoxx.backend.domain.openutau.tools.readme_markdown = knoxx.backend.domain.openutau.openutau.readme_markdown;
/**
 * Render a .ustx file to .wav using the headless OpenUTAU pipeline.
 * Returns a promise that resolves to {:wav_path string} or rejects with error.
 */
knoxx.backend.domain.openutau.tools.render_ustx_to_wav = (async function knoxx$backend$domain$openutau$tools$render_ustx_to_wav(ustx_path,output_wav_path){
var child_process = require("node:child_process");
var util = require("node:util");
var exec_file = util.promisify(child_process.execFile);
var script = knoxx.backend.domain.openutau.tools.render_script_path();
var result = (await (await (async function (){var G__27091 = script;
var G__27092 = [ustx_path,output_wav_path];
var G__27093 = ({"timeout": (600000), "maxBuffer": (4194304)});
return (exec_file.cljs$core$IFn$_invoke$arity$3 ? exec_file.cljs$core$IFn$_invoke$arity$3(G__27091,G__27092,G__27093) : exec_file.call(null,G__27091,G__27092,G__27093));
})()));
var stdout = result.stdout;
if(clojure.string.includes_QMARK_(stdout,"Success!")){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"wav_path","wav_path",-1821986741),output_wav_path,new cljs.core.Keyword(null,"stdout","stdout",-531490018),stdout], null);
} else {
throw (new Error((""+"Render did not report success. stdout: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(stdout))));
}
});

//# sourceMappingURL=knoxx.backend.domain.openutau.tools.js.map
