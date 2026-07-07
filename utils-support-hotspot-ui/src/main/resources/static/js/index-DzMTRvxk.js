const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["static/js/simpleFrame-CqF90PwO.js","static/js/index-DsQ9-pB_.js","static/css/index-B-32fySL.css","static/css/simpleFrame-GA3vjNPo.css"])))=>i.map(i=>d[i]);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const import_meta = {};
import { _ as _export_sfc, c as createElementBlock, o as openBlock, h as createBaseVNode, b8 as defineAsyncComponent, C as getConfig, s as __vitePreload, bd as echarts, y as http, be as Y, bf as compileStringAsync, aI as X, bb as scEcharts, bg as path, r as ref, $ as $t, bh as TokenKey, a6 as defaultRouterArrays, bi as formatToken, bj as getPlatformConfig, bk as getStaticPlatformConfig, bl as getToken, bm as globalSetting, bn as handRefreshToken, bo as hasAuth, bp as i18n, bq as injectResponsiveStorage, br as localesConfigs, bs as logOut, bt as multipleTabsKey, bu as putConfig, bv as removeToken, bw as resolveAbsolutePath, D as responsiveStorageNameSpace, bx as setConfig, by as setLoginOutFunction, bz as setRefreshTokenFunction, bA as setToken, bB as setUserPerm, bC as setUserRole, O as transformI18n, bD as upgrade, ba as useI18n, bE as userKey, __tla as __tla_0 } from "./index-DsQ9-pB_.js";
import { a as date } from "./index-Df2x6qn1.js";
let __vite_glob_1_5, __vite_glob_1_4, __vite_glob_1_3, __vite_glob_1_2, des, __vite_glob_1_1, fetchMineSfc, __vite_glob_1_0, loadSfcModule, resolvePath, uuid;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch (e) {
    }
  })()
]).then(() => __async(null, null, function* () {
  const Config = Object.freeze(Object.defineProperty({
    __proto__: null,
    get $t() {
      return $t;
    },
    get DesType() {
      return DesType;
    },
    get TokenKey() {
      return TokenKey;
    },
    get clearObject() {
      return clearObject;
    },
    get defaultRouterArrays() {
      return defaultRouterArrays;
    },
    get des() {
      return des;
    },
    get encodeSearchParams() {
      return encodeSearchParams;
    },
    get formatDuration() {
      return formatDuration;
    },
    get formatDurationObject() {
      return formatDurationObject;
    },
    get formatSize() {
      return formatSize;
    },
    get formatToken() {
      return formatToken;
    },
    get generateUUID() {
      return generateUUID;
    },
    get getAssetsImages() {
      return getAssetsImages;
    },
    get getConfig() {
      return getConfig;
    },
    get getPlatformConfig() {
      return getPlatformConfig;
    },
    get getStaticPlatformConfig() {
      return getStaticPlatformConfig;
    },
    get getToken() {
      return getToken;
    },
    get getUrlType() {
      return getUrlType;
    },
    get globalSetting() {
      return globalSetting;
    },
    get guid() {
      return guid;
    },
    get handRefreshToken() {
      return handRefreshToken;
    },
    get hasAuth() {
      return hasAuth;
    },
    get i18n() {
      return i18n;
    },
    get injectResponsiveStorage() {
      return injectResponsiveStorage;
    },
    get judementSameArr() {
      return judementSameArr;
    },
    get localesConfigs() {
      return localesConfigs;
    },
    get logOut() {
      return logOut;
    },
    get multipleTabsKey() {
      return multipleTabsKey;
    },
    get normalizePath() {
      return normalizePath;
    },
    get paginate() {
      return paginate;
    },
    get putConfig() {
      return putConfig;
    },
    get queryEmail() {
      return queryEmail;
    },
    get removeToken() {
      return removeToken;
    },
    get resolveAbsolutePath() {
      return resolveAbsolutePath;
    },
    get resolvePath() {
      return resolvePath;
    },
    get responsiveStorageNameSpace() {
      return responsiveStorageNameSpace;
    },
    get setConfig() {
      return setConfig;
    },
    get setLoginOutFunction() {
      return setLoginOutFunction;
    },
    get setRefreshTokenFunction() {
      return setRefreshTokenFunction;
    },
    get setToken() {
      return setToken;
    },
    get setUserPerm() {
      return setUserPerm;
    },
    get setUserRole() {
      return setUserRole;
    },
    get sizeFormat() {
      return sizeFormat;
    },
    get stringToColor() {
      return stringToColor;
    },
    get t() {
      return transformI18n;
    },
    get transformI18n() {
      return transformI18n;
    },
    get upgrade() {
      return upgrade;
    },
    get useDefer() {
      return useDefer;
    },
    get useI18n() {
      return useI18n;
    },
    get userKey() {
      return userKey;
    },
    get uuid() {
      return uuid;
    }
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const config$4 = '{\r\n  "sysSfcId": "local-calendar",\r\n  "sysSfcName": "LocalCalendar",\r\n  "sysSfcChineseName": "\u672C\u5730\u65E5\u5386"\r\n}\r\n';
  __vite_glob_1_0 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: config$4
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const config$3 = '{\r\n  "sysSfcId": "local-day",\r\n  "sysSfcName": "LocalDay",\r\n  "sysSfcChineseName": "\u672C\u65E5\u5929\u6C14"\r\n}\r\n';
  __vite_glob_1_1 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: config$3
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const config$2 = '{\r\n  "sysSfcId": "public-ip",\r\n  "sysSfcName": "PublicIP",\r\n  "sysSfcChineseName": "\u516C\u7F51IP"\r\n}\r\n';
  __vite_glob_1_2 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: config$2
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const _package = '{\r\n  "name": "@repo/module",\r\n  "version": "1.0.0",\r\n  "description": "",\r\n  "main": "index.js",\r\n  "scripts": {\r\n    "test": "echo \\"Error: no test specified\\" && exit 1"\r\n  },\r\n  "keywords": [],\r\n  "author": "",\r\n  "license": "ISC",\r\n  "dependencies": {\r\n    "@fullcalendar/core": "catalog:",\r\n    "@fullcalendar/daygrid": "catalog:",\r\n    "@fullcalendar/interaction": "catalog:",\r\n    "@fullcalendar/vue3": "catalog:"\r\n  }\r\n}\r\n';
  __vite_glob_1_3 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: _package
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const config$1 = '{\r\n  "sysSfcId": "local-time",\r\n  "sysSfcName": "LocalTime",\r\n  "sysSfcChineseName": "\u672C\u5730\u65F6\u949F"\r\n}\r\n';
  __vite_glob_1_4 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: config$1
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const config = '{\r\n  "sysSfcId": "local-weather",\r\n  "sysSfcName": "LocalWeather",\r\n  "sysSfcChineseName": "\u672C\u5730\u5929\u6C14"\r\n}\r\n';
  __vite_glob_1_5 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: config
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const _sfc_main = {
    name: "LoadingComponent"
  };
  const _hoisted_1 = {
    class: "loading-container"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1, [
      ..._cache[0] || (_cache[0] = [
        createBaseVNode("div", {
          class: "spinner"
        }, null, -1),
        createBaseVNode("p", null, "Loading...", -1)
      ])
    ]);
  }
  const LoadingComponent = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__scopeId",
      "data-v-63aadb4e"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/components/ScLoadCompent/index.vue"
    ]
  ]);
  function loadJS(src, keyName, callbackName) {
    return new Promise((resolve, reject) => {
      const existingScript = document.head.querySelector(`script[loadKey="${keyName}"]`);
      if (existingScript) {
        return resolve(window[keyName]);
      }
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = src;
      script.setAttribute("loadKey", keyName);
      document.head.appendChild(script);
      script.onload = () => {
        {
          setTimeout(() => {
            resolve(window[keyName]);
          }, 50);
        }
      };
      script.onerror = (error) => {
        reject(error);
      };
    });
  }
  const getOptions = (name, sysSfcId) => {
    return {
      moduleCache: {
        vue: Y,
        date,
        http,
        config: Config,
        echarts
      },
      devMode: true,
      loadModule(id) {
        if (id.indexOf("vue.js") > -1) {
          return Y;
        }
        if (id.indexOf("scEcharts/index.vue") > -1) {
          return scEcharts;
        }
        if (id.indexOf("utils/http") > -1) {
          return http;
        }
        if (id.indexOf("utils/date") > -1) {
          return date;
        }
        if (id.indexOf("config/index.ts") > -1) {
          return Config;
        }
      },
      pathResolve({ refPath, relPath }) {
        let path2 = refPath;
        if (relPath === ".") {
          path2 = refPath;
        } else if (relPath.indexOf("iconify-icons") !== -1) {
          path2 = String(new URL(relPath.replace("@", "/node_modules/@"), window.location.href)) + ".js";
        } else if (relPath[0] === "@" && relPath.indexOf(".") === -1) {
          path2 = String(new URL(relPath.replace("@", "/src/"), window.location.href)) + ".ts";
        } else if (relPath[0] === "@" && relPath.indexOf(".") != -1) {
          path2 = String(new URL(relPath.replace("@", "/src/"), window.location.href));
        } else if (relPath[0] !== "." && relPath[0] !== "/") {
          path2 = relPath;
        } else if (relPath[0] == ".") {
          path2 = String(new URL("/src" + relPath.substring(1), window.location.href));
        } else {
          path2 = String(new URL(relPath, window.location.href));
        }
        return path2;
      },
      getFile(url) {
        return __async(this, null, function* () {
          if (url === name && sysSfcId && X(sysSfcId)) {
            const params = {
              sysSfcId
            };
            const code = yield http.request("get", "/v2/sfc/get", {
              params
            });
            return code == null ? void 0 : code.data;
          }
          url = /.*?\.js|.mjs|.ts|.css|.less|.vue$/.test(url) ? url : `${url}.vue`;
          const type = /.*?\.js|.mjs.*$/.test(url) ? ".mjs" : /.*?\.vue.*$/.test(url) ? ".vue" : /.*?\.css.*$/.test(url) ? ".css" : /.*?\.ts.*$/.test(url) ? ".ts" : ".vue";
          const getContentData = () => __async(null, null, function* () {
            const res = yield fetch(url);
            const rs = yield res.text();
            return rs;
          });
          return {
            getContentData,
            type
          };
        });
      },
      handleModule(type, getContentData, path2, options) {
        return __async(this, null, function* () {
          switch (type) {
            case ".css":
              const res = yield getContentData(false);
              options.addStyle(res);
              return null;
            case ".less":
              console.error(".......");
          }
        });
      },
      processStyles(src, lang, filename, options) {
        return __async(this, null, function* () {
          const sassDepImporter = {
            canonicalize: (str) => new URL(str, "file:"),
            load: (url) => __async(null, null, function* () {
              const res = options.getResource({
                refPath: filename,
                relPath: url.pathname
              }, options);
              const content = yield res.getContent();
              return {
                contents: yield content.getContentData(false),
                syntax: content.type.slice(1)
              };
            })
          };
          try {
            const compiled = yield compileStringAsync(src, {
              importers: [
                sassDepImporter
              ]
            });
            return compiled.css;
          } catch (ex) {
            options.log("error", ex.message);
            return void 0;
          }
        });
      },
      log(type, ...args) {
      },
      addStyle(textContent) {
        const style = Object.assign(document.createElement("style"), {
          textContent
        });
        const ref2 = document.head.getElementsByTagName("style")[0] || null;
        document.head.insertBefore(style, ref2);
      }
    };
  };
  const cacheLoadModule = {};
  const loadRemoteModule = (name, sysSfcId, sysSfc) => {
    return defineAsyncComponent({
      loadingComponent: LoadingComponent,
      delay: sysSfc.delay || 0,
      timeout: sysSfc.timeout || 1e3,
      loader: () => __async(null, null, function* () {
        var _a, _b;
        let module = cacheLoadModule[sysSfcId];
        if (module) {
          if (module.timestamp + 36e4 < (/* @__PURE__ */ new Date()).getTime()) {
            cacheLoadModule[sysSfcId] = null;
          } else {
            return module.module;
          }
        }
        let res = null;
        yield loadJS(getConfig().SfcScriptUrl, "js");
        const loadModule = ((_a = exports["vue3-sfc-loader"]) == null ? void 0 : _a.loadModule) || ((_b = window["vue3-sfc-loader"]) == null ? void 0 : _b.loadModule);
        res = yield loadModule(name, getOptions(name, sysSfcId));
        cacheLoadModule[sysSfcId] = {
          timestamp: (/* @__PURE__ */ new Date()).getTime(),
          module: res
        };
        return res;
      })
    });
  };
  let localModule = null;
  const _loadLocationModule = () => {
    if (localModule == null) {
      localModule = {};
      Object.entries(Object.assign({
        "../../../module/calendar/config.json": __vite_glob_1_0,
        "../../../module/day/config.json": __vite_glob_1_1,
        "../../../module/ip/config.json": __vite_glob_1_2,
        "../../../module/package.json": __vite_glob_1_3,
        "../../../module/time/config.json": __vite_glob_1_4,
        "../../../module/weather/config.json": __vite_glob_1_5
      })).map(([key, value]) => {
        const setting = JSON.parse(value.default);
        setting.vue = key.replace("config.json", "index.vue");
        localModule[key.replace("../../..", "@repo").replace("config.json", "index.vue") + ""] = setting;
      });
      return;
    }
  };
  const loadRemoteAddressModule = (name, sysSfcId, sysSfc) => {
    return defineAsyncComponent(() => __vitePreload(() => import("./simpleFrame-CqF90PwO.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0));
  };
  const _cacheLoadedModule = {};
  loadSfcModule = (name, sysSfcId, sysSfc) => {
    if (sysSfc.vue) {
      _cacheLoadedModule[sysSfcId] = {
        module: sysSfc.vue,
        timestamp: (/* @__PURE__ */ new Date()).getTime()
      };
    }
    const _module = _cacheLoadedModule[sysSfcId];
    if (_module) {
      if (_module.timestamp + 36e4 < (/* @__PURE__ */ new Date()).getTime()) {
        cacheLoadModule[sysSfcId] = null;
      } else {
        return _module.module;
      }
    }
    const _loadSfcModule = (name2, sysSfcId2, sysSfc2) => {
      _loadLocationModule();
      if (!sysSfc2.sysSfcType || sysSfc2.sysSfcType === 0 || sysSfc2.sysSfcType === 1) {
        return loadRemoteModule(name2, sysSfcId2, sysSfc2);
      }
      if (sysSfc2.sysSfcType === 2) {
        return loadRemoteAddressModule();
      }
      const url = localModule[sysSfc2.sysSfcPath]["vue"];
      return defineAsyncComponent(() => import(url).then((m) => __async(null, null, function* () {
        yield m.__tla;
        return m;
      })));
    };
    const rs = _loadSfcModule(name, sysSfcId, sysSfc);
    _cacheLoadedModule[sysSfcId] = {
      module: rs,
      timestamp: (/* @__PURE__ */ new Date()).getTime()
    };
    return rs;
  };
  fetchMineSfc = (params) => {
    return http.request("get", "/v2/sfc/mine", {
      params
    });
  };
  var DesType = ((DesType2) => {
    DesType2[DesType2["phone"] = 0] = "phone";
    DesType2[DesType2["card"] = 1] = "card";
    DesType2[DesType2["name"] = 2] = "name";
    return DesType2;
  })(DesType || {});
  resolvePath = function(relative, base) {
    return path.posix.resolve(relative, base);
  };
  function getAssetsImages(name) {
    if (name) {
      name = name.toLowerCase();
    }
    if (name.indexOf(".") == -1) {
      name = name + ".png";
    }
    const url = new URL(Object.assign({})[`/src/assets/images/${name}`], import_meta.url).href;
    if (url && !url.endsWith("undefined")) {
      return url;
    }
    return new URL("/src/assets/images/unknown.png", import_meta.url).href;
  }
  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      let value = hash >> i * 8 & 255;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }
  function normalizePath(path2) {
    const isWindows = path2.match(/^[A-Za-z]:\\/);
    if (isWindows) {
      path2 = path2.replace(/\\/g, "/");
    }
    const parts = path2.split("/");
    const newParts = [];
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === "..") {
        newParts.pop();
      } else if (parts[i] === "." || parts[i] === "") {
        continue;
      } else {
        newParts.push(parts[i]);
      }
    }
    path2 = newParts.join("/");
    if (isWindows) {
      path2 = path2.replace(/^\//, "");
      path2 = path2.replace(/^([A-Za-z]):\//, "$1:/");
    }
    return path2;
  }
  function sizeFormat(fileSizeInBytes) {
    const sizeUnit = [
      "B",
      "K",
      "M",
      "G",
      "T"
    ];
    const sizeType = parseInt(Math.floor(Math.log(fileSizeInBytes) / Math.log(1024)).toString());
    const size = (fileSizeInBytes / Math.pow(1024, sizeType)).toFixed(2);
    return size + sizeUnit[sizeType];
  }
  function getUrlType(url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function() {
        var contentType = xhr.getResponseHeader("Content-Type");
        if (contentType) {
          resolve(contentType);
          xhr.abort();
        } else {
          reject();
        }
      };
      xhr.send();
    });
  }
  function formatSize(bytes, onlyGb = false, showUnit = true) {
    if (onlyGb) {
      const gb = 1024 * 1024 * 1024;
      const sizeInGB = bytes / gb;
      return `${sizeInGB.toFixed(2)}` + (showUnit ? "GB" : "");
    }
    if (bytes === 0) return "0 \u5B57\u8282";
    const k = 1024;
    const sizes = [
      "B",
      "KB",
      "MB",
      "GB",
      "TB",
      "PB",
      "EB",
      "ZB",
      "YB"
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${showUnit ? sizes[i] : ""}`;
  }
  function formatDurationObject(milliseconds) {
    const second = 1e3;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(milliseconds / day);
    const hours = Math.floor(milliseconds % day / hour);
    const minutes = Math.floor(milliseconds % day % hour / minute);
    const seconds = Math.floor(milliseconds % day % hour % minute / second);
    let formatted = "";
    const res = {
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    };
    if (days > 0) {
      res.day = days;
    }
    if (hours > 0) {
      res.hour = hours;
    }
    if (minutes > 0) {
      res.minute = minutes;
    }
    if (seconds > 0 || seconds === 0 && formatted === "") {
      res.second = seconds;
    }
    return res;
  }
  function formatDuration(milliseconds, showUnit = true, showOne = false) {
    const second = 1e3;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(milliseconds / day);
    const hours = Math.floor(milliseconds % day / hour);
    const minutes = Math.floor(milliseconds % day % hour / minute);
    const seconds = Math.floor(milliseconds % day % hour % minute / second);
    let formatted = "";
    if (days > 0) {
      formatted += `${days} ` + (showUnit ? "\u5929 " : "");
      if (showOne) {
        return formatted;
      }
    }
    if (hours > 0) {
      formatted += `${hours} ` + (showUnit ? "\u5C0F\u65F6 " : "");
      if (showOne) {
        return formatted;
      }
    }
    if (minutes > 0) {
      formatted += `${minutes} ` + (showUnit ? "\u5206 " : "");
      if (showOne) {
        return formatted;
      }
    }
    if (seconds > 0 || seconds === 0 && formatted === "") {
      formatted += `${seconds}` + (showUnit ? "\u79D2" : "");
      if (showOne) {
        return formatted;
      }
    }
    return formatted.trim();
  }
  function useDefer(maxFrameCount = 1e3) {
    const frameCount = ref(0);
    const refreshFrameCount = () => {
      requestAnimationFrame(() => {
        frameCount.value++;
        if (frameCount.value < maxFrameCount) {
          refreshFrameCount();
        }
      });
    };
    refreshFrameCount();
    return function(showInFrameCount) {
      return frameCount.value >= showInFrameCount;
    };
  }
  function queryEmail(queryString, callback) {
    const emailList = [
      {
        value: "@qq.com"
      },
      {
        value: "@gmail.com"
      },
      {
        value: "@yahoo.com"
      },
      {
        value: "@126.com"
      },
      {
        value: "@163.com"
      }
    ];
    let results = [];
    let queryList = [];
    emailList.map((item) => queryList.push({
      value: queryString.split("@")[0] + item.value
    }));
    results = queryString ? queryList.filter((item) => item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : queryList;
    callback(results);
  }
  function encodeSearchParams(obj) {
    const params = [];
    Object.keys(obj).forEach((key) => {
      let value = obj[key];
      if (typeof value === "undefined") {
        value = "";
      }
      params.push([
        key,
        encodeURIComponent(value)
      ].join("="));
    });
    return params.join("&");
  }
  function paginate(array, pageSize, pageNumber, filter) {
    --pageNumber;
    if (!filter) {
      return {
        data: array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize),
        total: array.length
      };
    }
    const rs = [];
    const start = pageNumber * pageSize;
    const max = (pageNumber + 1) * pageSize;
    for (let i = 0; i < array.length; i++) {
      if (filter(array[i])) {
        rs.push(array[i]);
      }
    }
    return {
      data: rs.slice(start, max),
      total: rs.length
    };
  }
  function guid() {
    function S4() {
      return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
    }
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
  }
  uuid = function(len, radix) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    var uuid2 = [], i;
    radix = radix || chars.length;
    if (len) {
      for (i = 0; i < len; i++) uuid2[i] = chars[0 | Math.random() * radix];
    } else {
      var r;
      uuid2[8] = uuid2[13] = uuid2[18] = uuid2[23] = "-";
      uuid2[14] = "4";
      for (i = 0; i < 36; i++) {
        if (!uuid2[i]) {
          r = 0 | Math.random() * 16;
          uuid2[i] = chars[i == 19 ? r & 3 | 8 : r];
        }
      }
    }
    return uuid2.join("");
  };
  function generateUUID() {
    var d = (/* @__PURE__ */ new Date()).getTime();
    var uuid2 = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : r & 3 | 8).toString(16);
    });
    return uuid2;
  }
  des = (val, fillChar = "*", type = 0) => {
    if (type === 0) {
      return desPhone(val, fillChar);
    }
    if (type === 1) {
      return desensitizeCardNumber(val, fillChar);
    }
    if (type === 2) {
      return desensitizeName(val);
    }
    return val;
  };
  const clearObject = (obj, props = {}) => {
    for (let key in obj) {
      delete obj[key];
    }
    Object.assign(obj, props);
  };
  function judementSameArr(news, old) {
    let count = 0;
    const leng = news.length;
    for (let i in news) {
      for (let j in old) {
        if (news[i] === old[j]) {
          count++;
        }
      }
    }
    return count === leng;
  }
  function desensitizeName(name, fillChar = "*") {
    const length = name.length;
    if (length <= 1) {
      return name;
    }
    const firstChar = name.substring(0, 1);
    const desensitizedPart = fillChar.repeat(length - 1);
    const desensitizedName = firstChar + desensitizedPart;
    return desensitizedName;
  }
  function desensitizeCardNumber(cardNumber, fillChar = "*") {
    const length = cardNumber.length;
    if (length <= 4) {
      return cardNumber;
    }
    const firstTwo = cardNumber.substring(0, 2);
    const lastFour = cardNumber.substring(length - 4);
    const middle = fillChar.repeat(length - 6);
    const desensitizedCardNumber = firstTwo + middle + lastFour;
    return desensitizedCardNumber;
  }
  function desPhone(content, fillChar = "*") {
    if (!content) {
      return "";
    }
    content = content.toString();
    if (content.length < 11) {
      return content;
    }
    let index = 1;
    let result = "";
    for (let char of content) {
      if (index < 4 || index > content.length - 4) {
        result += char;
      } else {
        result += fillChar;
      }
      index++;
    }
    return result;
  }
}));
export {
  __vite_glob_1_5 as _,
  __tla,
  __vite_glob_1_4 as a,
  __vite_glob_1_3 as b,
  __vite_glob_1_2 as c,
  des as d,
  __vite_glob_1_1 as e,
  fetchMineSfc as f,
  __vite_glob_1_0 as g,
  loadSfcModule as l,
  resolvePath as r,
  uuid as u
};
