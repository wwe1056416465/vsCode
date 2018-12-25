/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";function getApplicationPath(){return process.env.VSCODE_DEV?appRoot:"darwin"===process.platform?path.dirname(path.dirname(path.dirname(appRoot))):path.dirname(path.dirname(appRoot))}function getPortableDataPath(){if(process.env.VSCODE_PORTABLE)return process.env.VSCODE_PORTABLE;if("win32"===process.platform||"linux"===process.platform)return path.join(getApplicationPath(),"data");{const e=product.portable||`${product.applicationName}-portable-data`;return path.join(path.dirname(getApplicationPath()),e)}}function stripComments(e){return e.replace(/("(?:[^\\\"]*(?:\\.)?)*")|('(?:[^\\\']*(?:\\.)?)*')|(\/\*(?:\r?\n|.)*?\*\/)|(\/{2,}.*?(?:(?:\r?\n)|$))/g,function(e,a,t,r,n){if(r)return"";if(n){let e=n.length;return e>2&&"\n"===n[e-1]?"\r"===n[e-2]?"\r\n":"\n":""}return e})}function mkdirp(e){return mkdir(e).then(null,a=>{if(a&&"ENOENT"===a.code){const a=path.dirname(e);if(a!==e)return mkdirp(a).then(()=>mkdir(e))}throw a})}function resolveJSFlags(...e){
return args["js-flags"]&&e.push(args["js-flags"]),args["max-memory"]&&!/max_old_space_size=(\d+)/g.exec(args["js-flags"])&&e.push(`--max_old_space_size=${args["max-memory"]}`),e.length>0?e.join(" "):null}function getUserDefinedLocale(){let e=args.locale;if(e)return Promise.resolve(e.toLowerCase());let a=app.getPath("userData"),t=path.join(a,"User","locale.json");return exists(t).then(e=>e?readFile(t).then(e=>{e=stripComments(e);try{let a=JSON.parse(e).locale;return a&&"string"==typeof a?a.toLowerCase():void 0}catch(e){return}}):void 0)}function getLanguagePackConfigurations(){let e=app.getPath("userData"),a=path.join(e,"languagepacks.json");try{return require(a)}catch(e){}}function resolveLanguagePackLocale(e,a){try{for(;a;){if(e[a])return a;{let e=a.lastIndexOf("-");if(!(e>0))return;a=a.substring(0,e)}}}catch(e){console.error("Resolving language pack configuration failed.",e)}}function getNLSConfiguration(e){if("pseudo"===e)return Promise.resolve({locale:e,availableLanguages:{},pseudo:!0})
;if(process.env.VSCODE_DEV)return Promise.resolve({locale:e,availableLanguages:{}});let a=app.getPath("userData");if(e&&("en"==e||e.startsWith("en-")))return Promise.resolve({locale:e,availableLanguages:{}});let t=e;perf.mark("nlsGeneration:start");let r=function(e){return perf.mark("nlsGeneration:end"),Promise.resolve({locale:e,availableLanguages:{}})};try{let n=product.commit;if(!n)return r(t);let o=getLanguagePackConfigurations();if(!o)return r(t);if(!(e=resolveLanguagePackLocale(o,e)))return r(t);let s,i=o[e];return i&&"string"==typeof i.hash&&i.translations&&"string"==typeof(s=i.translations.vscode)?exists(s).then(o=>{if(!o)return r(t);let l=i.hash+"."+e,p=path.join(a,"clp",l),c=path.join(p,n),u=path.join(p,"tcf.json"),f={locale:t,availableLanguages:{"*":e},_languagePackId:l,_translationsConfigFile:u,_cacheRoot:p,_resolvedLanguagePackCoreLocation:c};return exists(c).then(a=>a?(touch(c).catch(()=>{}),perf.mark("nlsGeneration:end"),
f):mkdirp(c).then(()=>Promise.all([readFile(path.join(__dirname,"nls.metadata.json")),readFile(s)])).then(e=>{let a=JSON.parse(e[0]),t=JSON.parse(e[1]).contents,r=Object.keys(a.bundles),n=[];for(let e of r){let r=a.bundles[e],o=Object.create(null);for(let e of r){let r,n=a.keys[e],s=a.messages[e],i=t[e];if(i){r=[];for(let e=0;e<n.length;e++){let a=n[e],t=i["string"==typeof a?a:a.key];void 0===t&&(t=s[e]),r.push(t)}}else r=s;o[e]=r}n.push(writeFile(path.join(c,e.replace(/\//g,"!")+".nls.json"),JSON.stringify(o)))}return n.push(writeFile(u,JSON.stringify(i.translations))),Promise.all(n)}).then(()=>(perf.mark("nlsGeneration:end"),f)).catch(a=>(console.error("Generating translation files failed.",a),r(e))))}):r(t)}catch(a){return console.error("Generating translation files failed.",a),r(e)}}function getUserDataPath(){return isPortable?path.join(portableDataPath,"user-data"):path.resolve(args["user-data-dir"]||paths.getDefaultUserDataPath(process.platform))}const perf=require("./vs/base/common/performance")
;perf.mark("main:started"),global.perfStartTime=Date.now(),Error.stackTraceLimit=100;const fs=require("fs"),path=require("path"),product=require("../product.json"),appRoot=path.dirname(__dirname),portableDataPath=getPortableDataPath(),isPortable=fs.existsSync(portableDataPath),portableTempPath=path.join(portableDataPath,"tmp"),isTempPortable=isPortable&&fs.existsSync(portableTempPath);isPortable?process.env.VSCODE_PORTABLE=portableDataPath:delete process.env.VSCODE_PORTABLE,isTempPortable&&(process.env["win32"===process.platform?"TEMP":"TMPDIR"]=portableTempPath),function(){const e=require("path"),a=require("module"),t=e.join(__dirname,"../node_modules"),r=t+".asar",n=a._resolveLookupPaths;a._resolveLookupPaths=function(e,a,o){const s=n(e,a,o),i=o?s:s[1];for(let e=0,a=i.length;e<a;e++)if(i[e]===t){i.splice(e,0,r);break}return s}}();const app=require("electron").app,minimist=require("minimist"),paths=require("./paths"),args=minimist(process.argv,{string:["user-data-dir","locale","js-flags","max-memory"]
}),mkdir=e=>new Promise((a,t)=>fs.mkdir(e,r=>r&&"EEXIST"!==r.code?t(r):a(e))),exists=e=>new Promise(a=>fs.exists(e,a)),readFile=e=>new Promise((a,t)=>fs.readFile(e,"utf8",(e,r)=>e?t(e):a(r))),writeFile=(e,a)=>new Promise((t,r)=>fs.writeFile(e,a,"utf8",e=>e?r(e):t())),touch=e=>new Promise((a,t)=>{const r=new Date;fs.utimes(e,r,r,e=>e?t(e):a())}),nodeCachedDataDir=new class{constructor(){this.value=this._compute()}jsFlags(){return this.value?"--nolazy":void 0}ensureExists(){return mkdirp(this.value).then(()=>this.value,()=>{})}_compute(){if(process.argv.indexOf("--no-cached-data")>0)return;if(process.env.VSCODE_DEV)return;let e=product.commit;if(e)return path.join(app.getPath("userData"),"CachedData",e)}};app.setPath("userData",getUserDataPath());try{"win32"===process.platform?(process.env.VSCODE_CWD=process.cwd(),process.chdir(path.dirname(app.getPath("exe")))):process.env.VSCODE_CWD&&process.chdir(process.env.VSCODE_CWD)}catch(e){console.error(e)}global.macOpenFiles=[],app.on("open-file",function(e,a){
global.macOpenFiles.push(a)});let openUrls=[],onOpenUrl=function(e,a){e.preventDefault(),openUrls.push(a)};app.on("will-finish-launching",function(){app.on("open-url",onOpenUrl)}),global.getOpenUrls=function(){return app.removeListener("open-url",onOpenUrl),openUrls};let nlsConfiguration=void 0,userDefinedLocale=getUserDefinedLocale();userDefinedLocale.then(e=>{e&&!nlsConfiguration&&(nlsConfiguration=getNLSConfiguration(e))});let jsFlags=resolveJSFlags(nodeCachedDataDir.jsFlags());jsFlags&&app.commandLine.appendSwitch("--js-flags",jsFlags),app.once("ready",function(){perf.mark("main:appReady"),Promise.all([nodeCachedDataDir.ensureExists(),userDefinedLocale]).then(([e,a])=>{a&&!nlsConfiguration&&(nlsConfiguration=getNLSConfiguration(a)),nlsConfiguration||(nlsConfiguration=Promise.resolve(void 0)),nlsConfiguration.then(a=>{let t=a=>{process.env.VSCODE_NLS_CONFIG=JSON.stringify(a),e&&(process.env["VSCODE_NODE_CACHED_DATA_DIR_"+process.pid]=e),require("./bootstrap-amd").bootstrap("vs/code/electron-main/main")}
;if(a)t(a);else{let e=app.getLocale();e?getNLSConfiguration(e=e.toLowerCase()).then(a=>{a||(a={locale:e,availableLanguages:{}}),t(a)}):t({locale:"en",availableLanguages:{}})}})},console.error)});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/0f080e5267e829de46638128001aeb7ca2d6d50e/core/main.js.map