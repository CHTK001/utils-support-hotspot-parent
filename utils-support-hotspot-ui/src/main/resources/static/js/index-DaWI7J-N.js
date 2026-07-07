const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["static/js/404-B6xdgAzK.js","static/js/index-DsQ9-pB_.js","static/css/index-B-32fySL.css","static/js/ErrorPage-Dobz1U6-.js","static/css/ErrorPage-CX1Ygpt4.css","static/js/CustomLayout-rOqW_07u.js","static/js/interact.min-C7rynaR3.js","static/js/index-Df2x6qn1.js","static/js/index-DzMTRvxk.js","static/css/CustomLayout-BskhEKvZ.css"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
import { y as http, _ as _export_sfc, c as createElementBlock, o as openBlock, h as createBaseVNode, v as createCommentVNode, n as normalizeStyle, g as createVNode, t as toDisplayString, P as reactive, q as computed, l as onMounted, b as onUnmounted, aN as IconifyIconOnline, d as defineComponent, aK as h$1, F as Fragment, a$ as Teleport, e as resolveComponent, L as normalizeClass, m as renderList, k as withCtx, i as createTextVNode, al as watch, J as message, C as getConfig, ab as useUserStoreHook, j as createBlock, ba as useI18n, am as onBeforeUnmount, r as ref, w as withDirectives, aV as vModelText, aw as vShow, at as withModifiers, x as resolveDynamicComponent, ar as useRenderIcon, bb as scEcharts, z as defineStore, B as localStorageProxy, G as fetchGetUserLayout, H as toObject, bc as isArray, I as fetchUpdateUserLayout, b8 as defineAsyncComponent, s as __vitePreload, aA as shallowRef, Z as onBeforeMount, T as nextTick, __tla as __tla_0 } from "./index-DsQ9-pB_.js";
import { d as dateFormat } from "./index-Df2x6qn1.js";
import { f as fetchMineSfc, _ as __vite_glob_1_5, a as __vite_glob_1_4, b as __vite_glob_1_3, c as __vite_glob_1_2, e as __vite_glob_1_1, g as __vite_glob_1_0, l as loadSfcModule, __tla as __tla_1 } from "./index-DzMTRvxk.js";
let index$1, useLayoutLayoutStore;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch (e) {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch (e) {
    }
  })()
]).then(() => __async(null, null, function* () {
  const getCurrentIP = () => __async(null, null, function* () {
    const result = {
      ip: "",
      details: null,
      networkStatus: {
        isOnline: false,
        isPublic: false,
        lastChecked: null
      }
    };
    let loading = true;
    try {
      const isOnline = yield checkPublicNetwork();
      result.networkStatus.isOnline = isOnline;
      if (!isOnline) {
        result.ip = "\u79BB\u7EBF\u72B6\u6001";
        loading = false;
        return result;
      }
      const response = yield fetch("https://ip.useragentinfo.com/json");
      const data = yield response.json();
      result.ip = data.ip || data.ipaddress;
      result.networkStatus.isPublic = !isPrivateIP(result.ip);
      result.details = data;
      result.networkStatus.lastChecked = /* @__PURE__ */ new Date();
      return result;
    } catch (error) {
      console.error("\u83B7\u53D6 IP \u5730\u5740\u5931\u8D25:", error);
      result.ip = "\u83B7\u53D6\u5931\u8D25";
      return result;
    } finally {
      loading = false;
    }
  });
  const checkPublicNetwork = () => {
    const cacheKey = "network_status_cache";
    const cacheExpiry = "network_status_expiry";
    const cachedStatus = localStorage.getItem(cacheKey);
    const expiryTime = localStorage.getItem(cacheExpiry);
    if (cachedStatus && expiryTime) {
      if (Date.now() < parseInt(expiryTime)) {
        return Promise.resolve(cachedStatus === "true");
      }
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.src = "https://www.aliyun.com/favicon.ico?" + Math.random();
      img.onload = () => {
        localStorage.setItem(cacheKey, "true");
        localStorage.setItem(cacheExpiry, (Date.now() + 10 * 60 * 1e3).toString());
        resolve(true);
      };
      img.onerror = () => {
        localStorage.setItem(cacheKey, "false");
        localStorage.setItem(cacheExpiry, (Date.now() + 10 * 60 * 1e3).toString());
        resolve(false);
      };
    });
  };
  const isPrivateIP = (ip) => {
    if (!ip || typeof ip !== "string") {
      return false;
    }
    const ipAddress = ip.split(":")[0];
    const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ipAddress.match(ipPattern);
    if (!match) {
      return false;
    }
    const parts = match.slice(1).map(Number);
    if (parts.some((part) => part > 255)) {
      return false;
    }
    if (parts[0] === 10) {
      return true;
    }
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
      return true;
    }
    if (parts[0] === 192 && parts[1] === 168) {
      return true;
    }
    if (parts[0] === 169 && parts[1] === 254) {
      return true;
    }
    if (parts[0] === 127) {
      return true;
    }
    return false;
  };
  const fetchGetWeather = (params) => {
    return http.request("get", "/v1/weather/city", {
      params
    });
  };
  const _sfc_main$a = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const battery = reactive({
        level: 100,
        charging: false,
        chargingTime: 0,
        dischargingTime: 0,
        supported: true
      });
      let batteryRef = null;
      const updateBatteryInfo = (batteryManager) => {
        battery.level = Math.round(batteryManager.level * 100);
        battery.charging = batteryManager.charging;
        battery.chargingTime = batteryManager.chargingTime;
        battery.dischargingTime = batteryManager.dischargingTime;
      };
      const batteryIcon = computed(() => {
        if (battery.charging) {
          return "ri:battery-charge-line";
        }
        if (battery.level >= 90) return "ri:battery-fill";
        if (battery.level >= 70) return "ri:battery-2-fill";
        if (battery.level >= 40) return "ri:battery-low-line";
        if (battery.level >= 20) return "ri:battery-low-line";
        return "ri:battery-line";
      });
      const batteryColor = computed(() => {
        if (battery.charging) return "var(--el-color-success)";
        if (battery.level >= 60) return "var(--el-color-success)";
        if (battery.level >= 30) return "var(--el-color-warning)";
        return "var(--el-color-danger)";
      });
      const formatTime = (seconds) => {
        if (!seconds || seconds === Infinity) return "--";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds % 3600 / 60);
        if (hours > 0) {
          return `${hours}\u5C0F\u65F6${minutes}\u5206\u949F`;
        }
        return `${minutes}\u5206\u949F`;
      };
      onMounted(() => __async(null, null, function* () {
        if ("getBattery" in navigator) {
          try {
            batteryRef = yield navigator.getBattery();
            updateBatteryInfo(batteryRef);
            batteryRef.addEventListener("chargingchange", () => updateBatteryInfo(batteryRef));
            batteryRef.addEventListener("levelchange", () => updateBatteryInfo(batteryRef));
            batteryRef.addEventListener("chargingtimechange", () => updateBatteryInfo(batteryRef));
            batteryRef.addEventListener("dischargingtimechange", () => updateBatteryInfo(batteryRef));
          } catch (error) {
            console.error("\u83B7\u53D6\u7535\u6C60\u4FE1\u606F\u5931\u8D25:", error);
            battery.supported = false;
          }
        } else {
          battery.supported = false;
        }
      }));
      onUnmounted(() => {
        if (batteryRef) {
          batteryRef.removeEventListener("chargingchange", () => updateBatteryInfo(batteryRef));
          batteryRef.removeEventListener("levelchange", () => updateBatteryInfo(batteryRef));
        }
      });
      const __returned__ = {
        battery,
        get batteryRef() {
          return batteryRef;
        },
        set batteryRef(v2) {
          batteryRef = v2;
        },
        updateBatteryInfo,
        batteryIcon,
        batteryColor,
        formatTime,
        reactive,
        onMounted,
        onUnmounted,
        computed,
        get IconifyIconOnline() {
          return IconifyIconOnline;
        }
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  };
  const _hoisted_1$9 = {
    class: "battery-module"
  };
  const _hoisted_2$9 = {
    key: 0,
    class: "battery-module__content"
  };
  const _hoisted_3$9 = {
    class: "battery-module__card"
  };
  const _hoisted_4$9 = {
    class: "battery-module__info"
  };
  const _hoisted_5$9 = {
    class: "battery-module__status"
  };
  const _hoisted_6$9 = {
    class: "battery-module__progress"
  };
  const _hoisted_7$9 = {
    key: 0,
    class: "battery-module__time"
  };
  const _hoisted_8$7 = {
    key: 1,
    class: "battery-module__time"
  };
  const _hoisted_9$7 = {
    key: 1,
    class: "battery-module__unsupported"
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$9, [
      $setup.battery.supported ? (openBlock(), createElementBlock("div", _hoisted_2$9, [
        createBaseVNode("div", _hoisted_3$9, [
          createBaseVNode("div", {
            class: "battery-module__icon",
            style: normalizeStyle({
              color: $setup.batteryColor
            })
          }, [
            createVNode($setup["IconifyIconOnline"], {
              icon: $setup.batteryIcon
            }, null, 8, [
              "icon"
            ])
          ], 4),
          createBaseVNode("div", _hoisted_4$9, [
            createBaseVNode("div", {
              class: "battery-module__level",
              style: normalizeStyle({
                color: $setup.batteryColor
              })
            }, toDisplayString($setup.battery.level) + "% ", 5),
            createBaseVNode("div", _hoisted_5$9, toDisplayString($setup.battery.charging ? "\u6B63\u5728\u5145\u7535" : "\u4F7F\u7528\u7535\u6C60"), 1)
          ]),
          createBaseVNode("div", _hoisted_6$9, [
            createBaseVNode("div", {
              class: "battery-module__progress-bar",
              style: normalizeStyle({
                width: $setup.battery.level + "%",
                backgroundColor: $setup.batteryColor
              })
            }, null, 4)
          ]),
          $setup.battery.charging && $setup.battery.chargingTime ? (openBlock(), createElementBlock("div", _hoisted_7$9, " \u5145\u6EE1\u7EA6 " + toDisplayString($setup.formatTime($setup.battery.chargingTime)), 1)) : !$setup.battery.charging && $setup.battery.dischargingTime ? (openBlock(), createElementBlock("div", _hoisted_8$7, " \u5269\u4F59\u7EA6 " + toDisplayString($setup.formatTime($setup.battery.dischargingTime)), 1)) : createCommentVNode("", true)
        ])
      ])) : (openBlock(), createElementBlock("div", _hoisted_9$7, [
        createVNode($setup["IconifyIconOnline"], {
          icon: "ri:error-warning-line"
        }),
        _cache[0] || (_cache[0] = createBaseVNode("span", null, "\u60A8\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u7535\u6C60API", -1))
      ]))
    ]);
  }
  const index$d = _export_sfc(_sfc_main$a, [
    [
      "render",
      _sfc_render$a
    ],
    [
      "__scopeId",
      "data-v-ff8a033a"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/module/battery/index.vue"
    ]
  ]);
  const __vite_glob_0_0 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: index$d
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  var n, l$1, u$1, t, i$1, o, r$1, f$1, e$1, c$1, s$1, a$1, h = {}, p = [], v$1 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, y = Array.isArray;
  function d(n2, l2) {
    for (var u2 in l2) n2[u2] = l2[u2];
    return n2;
  }
  function w$1(n2) {
    var l2 = n2.parentNode;
    l2 && l2.removeChild(n2);
  }
  function _(l2, u2, t2) {
    var i2, o2, r2, f2 = {};
    for (r2 in u2) "key" == r2 ? i2 = u2[r2] : "ref" == r2 ? o2 = u2[r2] : f2[r2] = u2[r2];
    if (arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), "function" == typeof l2 && null != l2.defaultProps) for (r2 in l2.defaultProps) void 0 === f2[r2] && (f2[r2] = l2.defaultProps[r2]);
    return g$1(l2, f2, i2, o2, null);
  }
  function g$1(n2, t2, i2, o2, r2) {
    var f2 = {
      type: n2,
      props: t2,
      key: i2,
      ref: o2,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __d: void 0,
      __c: null,
      constructor: void 0,
      __v: null == r2 ? ++u$1 : r2,
      __i: -1,
      __u: 0
    };
    return null == r2 && null != l$1.vnode && l$1.vnode(f2), f2;
  }
  function m$1() {
    return {
      current: null
    };
  }
  function k$1(n2) {
    return n2.children;
  }
  function b(n2, l2) {
    this.props = n2, this.context = l2;
  }
  function x(n2, l2) {
    if (null == l2) return n2.__ ? x(n2.__, n2.__i + 1) : null;
    for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
    return "function" == typeof n2.type ? x(n2) : null;
  }
  function C$1(n2) {
    var l2, u2;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
        n2.__e = n2.__c.base = u2.__e;
        break;
      }
      return C$1(n2);
    }
  }
  function M$1(n2) {
    (!n2.__d && (n2.__d = true) && i$1.push(n2) && !P$1.__r++ || o !== l$1.debounceRendering) && ((o = l$1.debounceRendering) || r$1)(P$1);
  }
  function P$1() {
    var n2, u2, t2, o2, r2, e2, c2, s2;
    for (i$1.sort(f$1); n2 = i$1.shift(); ) n2.__d && (u2 = i$1.length, o2 = void 0, e2 = (r2 = (t2 = n2).__v).__e, c2 = [], s2 = [], t2.__P && ((o2 = d({}, r2)).__v = r2.__v + 1, l$1.vnode && l$1.vnode(o2), O$1(t2.__P, o2, r2, t2.__n, t2.__P.namespaceURI, 32 & r2.__u ? [
      e2
    ] : null, c2, null == e2 ? x(r2) : e2, !!(32 & r2.__u), s2), o2.__v = r2.__v, o2.__.__k[o2.__i] = o2, j$2(c2, o2, s2), o2.__e != e2 && C$1(o2)), i$1.length > u2 && i$1.sort(f$1));
    P$1.__r = 0;
  }
  function S(n2, l2, u2, t2, i2, o2, r2, f2, e2, c2, s2) {
    var a2, v2, y2, d2, w2, _2 = t2 && t2.__k || p, g2 = l2.length;
    for (u2.__d = e2, $$1(u2, l2, _2), e2 = u2.__d, a2 = 0; a2 < g2; a2++) null != (y2 = u2.__k[a2]) && "boolean" != typeof y2 && "function" != typeof y2 && (v2 = -1 === y2.__i ? h : _2[y2.__i] || h, y2.__i = a2, O$1(n2, y2, v2, i2, o2, r2, f2, e2, c2, s2), d2 = y2.__e, y2.ref && v2.ref != y2.ref && (v2.ref && N(v2.ref, null, y2), s2.push(y2.ref, y2.__c || d2, y2)), null == w2 && null != d2 && (w2 = d2), 65536 & y2.__u || v2.__k === y2.__k ? e2 = I(y2, e2, n2) : "function" == typeof y2.type && void 0 !== y2.__d ? e2 = y2.__d : d2 && (e2 = d2.nextSibling), y2.__d = void 0, y2.__u &= -196609);
    u2.__d = e2, u2.__e = w2;
  }
  function $$1(n2, l2, u2) {
    var t2, i2, o2, r2, f2, e2 = l2.length, c2 = u2.length, s2 = c2, a2 = 0;
    for (n2.__k = [], t2 = 0; t2 < e2; t2++) r2 = t2 + a2, null != (i2 = n2.__k[t2] = null == (i2 = l2[t2]) || "boolean" == typeof i2 || "function" == typeof i2 ? null : "string" == typeof i2 || "number" == typeof i2 || "bigint" == typeof i2 || i2.constructor == String ? g$1(null, i2, null, null, null) : y(i2) ? g$1(k$1, {
      children: i2
    }, null, null, null) : void 0 === i2.constructor && i2.__b > 0 ? g$1(i2.type, i2.props, i2.key, i2.ref ? i2.ref : null, i2.__v) : i2) ? (i2.__ = n2, i2.__b = n2.__b + 1, f2 = L$1(i2, u2, r2, s2), i2.__i = f2, o2 = null, -1 !== f2 && (s2--, (o2 = u2[f2]) && (o2.__u |= 131072)), null == o2 || null === o2.__v ? (-1 == f2 && a2--, "function" != typeof i2.type && (i2.__u |= 65536)) : f2 !== r2 && (f2 == r2 - 1 ? a2-- : f2 == r2 + 1 ? a2++ : f2 > r2 ? s2 > e2 - r2 ? a2 += f2 - r2 : a2-- : f2 < r2 && (f2 == r2 - a2 ? a2 -= f2 - r2 : a2++), f2 !== t2 + a2 && (i2.__u |= 65536))) : (o2 = u2[r2]) && null == o2.key && o2.__e && 0 == (131072 & o2.__u) && (o2.__e == n2.__d && (n2.__d = x(o2)), V$1(o2, o2, false), u2[r2] = null, s2--);
    if (s2) for (t2 = 0; t2 < c2; t2++) null != (o2 = u2[t2]) && 0 == (131072 & o2.__u) && (o2.__e == n2.__d && (n2.__d = x(o2)), V$1(o2, o2));
  }
  function I(n2, l2, u2) {
    var t2, i2;
    if ("function" == typeof n2.type) {
      for (t2 = n2.__k, i2 = 0; t2 && i2 < t2.length; i2++) t2[i2] && (t2[i2].__ = n2, l2 = I(t2[i2], l2, u2));
      return l2;
    }
    n2.__e != l2 && (l2 && n2.type && !u2.contains(l2) && (l2 = x(n2)), u2.insertBefore(n2.__e, l2 || null), l2 = n2.__e);
    do {
      l2 = l2 && l2.nextSibling;
    } while (null != l2 && 8 === l2.nodeType);
    return l2;
  }
  function H$1(n2, l2) {
    return l2 = l2 || [], null == n2 || "boolean" == typeof n2 || (y(n2) ? n2.some(function(n3) {
      H$1(n3, l2);
    }) : l2.push(n2)), l2;
  }
  function L$1(n2, l2, u2, t2) {
    var i2 = n2.key, o2 = n2.type, r2 = u2 - 1, f2 = u2 + 1, e2 = l2[u2];
    if (null === e2 || e2 && i2 == e2.key && o2 === e2.type && 0 == (131072 & e2.__u)) return u2;
    if (t2 > (null != e2 && 0 == (131072 & e2.__u) ? 1 : 0)) for (; r2 >= 0 || f2 < l2.length; ) {
      if (r2 >= 0) {
        if ((e2 = l2[r2]) && 0 == (131072 & e2.__u) && i2 == e2.key && o2 === e2.type) return r2;
        r2--;
      }
      if (f2 < l2.length) {
        if ((e2 = l2[f2]) && 0 == (131072 & e2.__u) && i2 == e2.key && o2 === e2.type) return f2;
        f2++;
      }
    }
    return -1;
  }
  function T$1(n2, l2, u2) {
    "-" === l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || v$1.test(l2) ? u2 : u2 + "px";
  }
  function A$1(n2, l2, u2, t2, i2) {
    var o2;
    n: if ("style" === l2) if ("string" == typeof u2) n2.style.cssText = u2;
    else {
      if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u2 && l2 in u2 || T$1(n2.style, l2, "");
      if (u2) for (l2 in u2) t2 && u2[l2] === t2[l2] || T$1(n2.style, l2, u2[l2]);
    }
    else if ("o" === l2[0] && "n" === l2[1]) o2 = l2 !== (l2 = l2.replace(/(PointerCapture)$|Capture$/i, "$1")), l2 = l2.toLowerCase() in n2 || "onFocusOut" === l2 || "onFocusIn" === l2 ? l2.toLowerCase().slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + o2] = u2, u2 ? t2 ? u2.u = t2.u : (u2.u = e$1, n2.addEventListener(l2, o2 ? s$1 : c$1, o2)) : n2.removeEventListener(l2, o2 ? s$1 : c$1, o2);
    else {
      if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
        n2[l2] = null == u2 ? "" : u2;
        break n;
      } catch (n3) {
      }
      "function" == typeof u2 || (null == u2 || false === u2 && "-" !== l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
    }
  }
  function F(n2) {
    return function(u2) {
      if (this.l) {
        var t2 = this.l[u2.type + n2];
        if (null == u2.t) u2.t = e$1++;
        else if (u2.t < t2.u) return;
        return t2(l$1.event ? l$1.event(u2) : u2);
      }
    };
  }
  function O$1(n2, u2, t2, i2, o2, r2, f2, e2, c2, s2) {
    var a2, h2, p2, v2, w2, _2, g2, m2, x2, C2, M2, P2, $2, I2, H2, L2, T2 = u2.type;
    if (void 0 !== u2.constructor) return null;
    128 & t2.__u && (c2 = !!(32 & t2.__u), r2 = [
      e2 = u2.__e = t2.__e
    ]), (a2 = l$1.__b) && a2(u2);
    n: if ("function" == typeof T2) try {
      if (m2 = u2.props, x2 = "prototype" in T2 && T2.prototype.render, C2 = (a2 = T2.contextType) && i2[a2.__c], M2 = a2 ? C2 ? C2.props.value : a2.__ : i2, t2.__c ? g2 = (h2 = u2.__c = t2.__c).__ = h2.__E : (x2 ? u2.__c = h2 = new T2(m2, M2) : (u2.__c = h2 = new b(m2, M2), h2.constructor = T2, h2.render = q), C2 && C2.sub(h2), h2.props = m2, h2.state || (h2.state = {}), h2.context = M2, h2.__n = i2, p2 = h2.__d = true, h2.__h = [], h2._sb = []), x2 && null == h2.__s && (h2.__s = h2.state), x2 && null != T2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = d({}, h2.__s)), d(h2.__s, T2.getDerivedStateFromProps(m2, h2.__s))), v2 = h2.props, w2 = h2.state, h2.__v = u2, p2) x2 && null == T2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), x2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
      else {
        if (x2 && null == T2.getDerivedStateFromProps && m2 !== v2 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(m2, M2), !h2.__e && (null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(m2, h2.__s, M2) || u2.__v === t2.__v)) {
          for (u2.__v !== t2.__v && (h2.props = m2, h2.state = h2.__s, h2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.forEach(function(n3) {
            n3 && (n3.__ = u2);
          }), P2 = 0; P2 < h2._sb.length; P2++) h2.__h.push(h2._sb[P2]);
          h2._sb = [], h2.__h.length && f2.push(h2);
          break n;
        }
        null != h2.componentWillUpdate && h2.componentWillUpdate(m2, h2.__s, M2), x2 && null != h2.componentDidUpdate && h2.__h.push(function() {
          h2.componentDidUpdate(v2, w2, _2);
        });
      }
      if (h2.context = M2, h2.props = m2, h2.__P = n2, h2.__e = false, $2 = l$1.__r, I2 = 0, x2) {
        for (h2.state = h2.__s, h2.__d = false, $2 && $2(u2), a2 = h2.render(h2.props, h2.state, h2.context), H2 = 0; H2 < h2._sb.length; H2++) h2.__h.push(h2._sb[H2]);
        h2._sb = [];
      } else do {
        h2.__d = false, $2 && $2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
      } while (h2.__d && ++I2 < 25);
      h2.state = h2.__s, null != h2.getChildContext && (i2 = d(d({}, i2), h2.getChildContext())), x2 && !p2 && null != h2.getSnapshotBeforeUpdate && (_2 = h2.getSnapshotBeforeUpdate(v2, w2)), S(n2, y(L2 = null != a2 && a2.type === k$1 && null == a2.key ? a2.props.children : a2) ? L2 : [
        L2
      ], u2, t2, i2, o2, r2, f2, e2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && f2.push(h2), g2 && (h2.__E = h2.__ = null);
    } catch (n3) {
      if (u2.__v = null, c2 || null != r2) {
        for (u2.__u |= c2 ? 160 : 32; e2 && 8 === e2.nodeType && e2.nextSibling; ) e2 = e2.nextSibling;
        r2[r2.indexOf(e2)] = null, u2.__e = e2;
      } else u2.__e = t2.__e, u2.__k = t2.__k;
      l$1.__e(n3, u2, t2);
    }
    else null == r2 && u2.__v === t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : u2.__e = z$2(t2.__e, u2, t2, i2, o2, r2, f2, c2, s2);
    (a2 = l$1.diffed) && a2(u2);
  }
  function j$2(n2, u2, t2) {
    u2.__d = void 0;
    for (var i2 = 0; i2 < t2.length; i2++) N(t2[i2], t2[++i2], t2[++i2]);
    l$1.__c && l$1.__c(u2, n2), n2.some(function(u3) {
      try {
        n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
          n3.call(u3);
        });
      } catch (n3) {
        l$1.__e(n3, u3.__v);
      }
    });
  }
  function z$2(l2, u2, t2, i2, o2, r2, f2, e2, c2) {
    var s2, a2, p2, v2, d2, _2, g2, m2 = t2.props, k2 = u2.props, b2 = u2.type;
    if ("svg" === b2 ? o2 = "http://www.w3.org/2000/svg" : "math" === b2 ? o2 = "http://www.w3.org/1998/Math/MathML" : o2 || (o2 = "http://www.w3.org/1999/xhtml"), null != r2) {
      for (s2 = 0; s2 < r2.length; s2++) if ((d2 = r2[s2]) && "setAttribute" in d2 == !!b2 && (b2 ? d2.localName === b2 : 3 === d2.nodeType)) {
        l2 = d2, r2[s2] = null;
        break;
      }
    }
    if (null == l2) {
      if (null === b2) return document.createTextNode(k2);
      l2 = document.createElementNS(o2, b2, k2.is && k2), r2 = null, e2 = false;
    }
    if (null === b2) m2 === k2 || e2 && l2.data === k2 || (l2.data = k2);
    else {
      if (r2 = r2 && n.call(l2.childNodes), m2 = t2.props || h, !e2 && null != r2) for (m2 = {}, s2 = 0; s2 < l2.attributes.length; s2++) m2[(d2 = l2.attributes[s2]).name] = d2.value;
      for (s2 in m2) if (d2 = m2[s2], "children" == s2) ;
      else if ("dangerouslySetInnerHTML" == s2) p2 = d2;
      else if ("key" !== s2 && !(s2 in k2)) {
        if ("value" == s2 && "defaultValue" in k2 || "checked" == s2 && "defaultChecked" in k2) continue;
        A$1(l2, s2, null, d2, o2);
      }
      for (s2 in k2) d2 = k2[s2], "children" == s2 ? v2 = d2 : "dangerouslySetInnerHTML" == s2 ? a2 = d2 : "value" == s2 ? _2 = d2 : "checked" == s2 ? g2 = d2 : "key" === s2 || e2 && "function" != typeof d2 || m2[s2] === d2 || A$1(l2, s2, d2, m2[s2], o2);
      if (a2) e2 || p2 && (a2.__html === p2.__html || a2.__html === l2.innerHTML) || (l2.innerHTML = a2.__html), u2.__k = [];
      else if (p2 && (l2.innerHTML = ""), S(l2, y(v2) ? v2 : [
        v2
      ], u2, t2, i2, "foreignObject" === b2 ? "http://www.w3.org/1999/xhtml" : o2, r2, f2, r2 ? r2[0] : t2.__k && x(t2, 0), e2, c2), null != r2) for (s2 = r2.length; s2--; ) null != r2[s2] && w$1(r2[s2]);
      e2 || (s2 = "value", void 0 !== _2 && (_2 !== l2[s2] || "progress" === b2 && !_2 || "option" === b2 && _2 !== m2[s2]) && A$1(l2, s2, _2, m2[s2], o2), s2 = "checked", void 0 !== g2 && g2 !== l2[s2] && A$1(l2, s2, g2, m2[s2], o2));
    }
    return l2;
  }
  function N(n2, u2, t2) {
    try {
      if ("function" == typeof n2) {
        var i2 = "function" == typeof n2.__u;
        i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
      } else n2.current = u2;
    } catch (n3) {
      l$1.__e(n3, t2);
    }
  }
  function V$1(n2, u2, t2) {
    var i2, o2;
    if (l$1.unmount && l$1.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current !== n2.__e || N(i2, null, u2)), null != (i2 = n2.__c)) {
      if (i2.componentWillUnmount) try {
        i2.componentWillUnmount();
      } catch (n3) {
        l$1.__e(n3, u2);
      }
      i2.base = i2.__P = null;
    }
    if (i2 = n2.__k) for (o2 = 0; o2 < i2.length; o2++) i2[o2] && V$1(i2[o2], u2, t2 || "function" != typeof n2.type);
    t2 || null == n2.__e || w$1(n2.__e), n2.__c = n2.__ = n2.__e = n2.__d = void 0;
  }
  function q(n2, l2, u2) {
    return this.constructor(n2, u2);
  }
  function B$2(u2, t2, i2) {
    var o2, r2, f2, e2;
    l$1.__ && l$1.__(u2, t2), r2 = (o2 = false) ? null : t2.__k, f2 = [], e2 = [], O$1(t2, u2 = t2.__k = _(k$1, null, [
      u2
    ]), r2 || h, h, t2.namespaceURI, r2 ? null : t2.firstChild ? n.call(t2.childNodes) : null, f2, r2 ? r2.__e : t2.firstChild, o2, e2), j$2(f2, u2, e2);
  }
  function G(n2, l2) {
    var u2 = {
      __c: l2 = "__cC" + a$1++,
      __: n2,
      Consumer: function(n3, l3) {
        return n3.children(l3);
      },
      Provider: function(n3) {
        var u3, t2;
        return this.getChildContext || (u3 = [], (t2 = {})[l2] = this, this.getChildContext = function() {
          return t2;
        }, this.componentWillUnmount = function() {
          u3 = null;
        }, this.shouldComponentUpdate = function(n4) {
          this.props.value !== n4.value && u3.some(function(n5) {
            n5.__e = true, M$1(n5);
          });
        }, this.sub = function(n4) {
          u3.push(n4);
          var l3 = n4.componentWillUnmount;
          n4.componentWillUnmount = function() {
            u3 && u3.splice(u3.indexOf(n4), 1), l3 && l3.call(n4);
          };
        }), n3.children;
      }
    };
    return u2.Provider.__ = u2.Consumer.contextType = u2;
  }
  n = p.slice, l$1 = {
    __e: function(n2, l2, u2, t2) {
      for (var i2, o2, r2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
        if ((o2 = i2.constructor) && null != o2.getDerivedStateFromError && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), r2 = i2.__d), r2) return i2.__E = i2;
      } catch (l3) {
        n2 = l3;
      }
      throw n2;
    }
  }, u$1 = 0, t = function(n2) {
    return null != n2 && null == n2.constructor;
  }, b.prototype.setState = function(n2, l2) {
    var u2;
    u2 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = d({}, this.state), "function" == typeof n2 && (n2 = n2(d({}, u2), this.props)), n2 && d(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), M$1(this));
  }, b.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), M$1(this));
  }, b.prototype.render = k$1, i$1 = [], r$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f$1 = function(n2, l2) {
    return n2.__v.__b - l2.__v.__b;
  }, P$1.__r = 0, e$1 = 0, c$1 = F(false), s$1 = F(true), a$1 = 0;
  var r, u, i, f = [], c = l$1, e = c.__b, a = c.__r, v = c.diffed, l = c.__c, m = c.unmount, s = c.__;
  function j$1() {
    for (var n2; n2 = f.shift(); ) if (n2.__P && n2.__H) try {
      n2.__H.__h.forEach(z$1), n2.__H.__h.forEach(B$1), n2.__H.__h = [];
    } catch (t2) {
      n2.__H.__h = [], c.__e(t2, n2.__v);
    }
  }
  c.__b = function(n2) {
    r = null, e && e(n2);
  }, c.__ = function(n2, t2) {
    n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), s && s(n2, t2);
  }, c.__r = function(n2) {
    a && a(n2);
    var i2 = (r = n2.__c).__H;
    i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.i = n3.__N = void 0;
    })) : (i2.__h.forEach(z$1), i2.__h.forEach(B$1), i2.__h = [], 0)), u = r;
  }, c.diffed = function(n2) {
    v && v(n2);
    var t2 = n2.__c;
    t2 && t2.__H && (t2.__H.__h.length && (1 !== f.push(t2) && i === c.requestAnimationFrame || ((i = c.requestAnimationFrame) || w)(j$1)), t2.__H.__.forEach(function(n3) {
      n3.i && (n3.__H = n3.i), n3.i = void 0;
    })), u = r = null;
  }, c.__c = function(n2, t2) {
    t2.some(function(n3) {
      try {
        n3.__h.forEach(z$1), n3.__h = n3.__h.filter(function(n4) {
          return !n4.__ || B$1(n4);
        });
      } catch (r2) {
        t2.some(function(n4) {
          n4.__h && (n4.__h = []);
        }), t2 = [], c.__e(r2, n3.__v);
      }
    }), l && l(n2, t2);
  }, c.unmount = function(n2) {
    m && m(n2);
    var t2, r2 = n2.__c;
    r2 && r2.__H && (r2.__H.__.forEach(function(n3) {
      try {
        z$1(n3);
      } catch (n4) {
        t2 = n4;
      }
    }), r2.__H = void 0, t2 && c.__e(t2, r2.__v));
  };
  var k = "function" == typeof requestAnimationFrame;
  function w(n2) {
    var t2, r2 = function() {
      clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n2);
    }, u2 = setTimeout(r2, 100);
    k && (t2 = requestAnimationFrame(r2));
  }
  function z$1(n2) {
    var t2 = r, u2 = n2.__c;
    "function" == typeof u2 && (n2.__c = void 0, u2()), r = t2;
  }
  function B$1(n2) {
    var t2 = r;
    n2.__c = n2.__(), r = t2;
  }
  function g(n2, t2) {
    for (var e2 in t2) n2[e2] = t2[e2];
    return n2;
  }
  function E(n2, t2) {
    for (var e2 in n2) if ("__source" !== e2 && !(e2 in t2)) return true;
    for (var r2 in t2) if ("__source" !== r2 && n2[r2] !== t2[r2]) return true;
    return false;
  }
  function C(n2, t2) {
    this.props = n2, this.context = t2;
  }
  (C.prototype = new b()).isPureReactComponent = true, C.prototype.shouldComponentUpdate = function(n2, t2) {
    return E(this.props, n2) || E(this.state, t2);
  };
  var R = l$1.__b;
  l$1.__b = function(n2) {
    n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), R && R(n2);
  };
  var M = l$1.__e;
  l$1.__e = function(n2, t2, e2, r2) {
    if (n2.then) {
      for (var u2, o2 = t2; o2 = o2.__; ) if ((u2 = o2.__c) && u2.__c) return null == t2.__e && (t2.__e = e2.__e, t2.__k = e2.__k), u2.__c(n2, t2);
    }
    M(n2, t2, e2, r2);
  };
  var T = l$1.unmount;
  function A(n2, t2, e2) {
    return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
      "function" == typeof n3.__c && n3.__c();
    }), n2.__c.__H = null), null != (n2 = g({}, n2)).__c && (n2.__c.__P === e2 && (n2.__c.__P = t2), n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
      return A(n3, t2, e2);
    })), n2;
  }
  function D(n2, t2, e2) {
    return n2 && e2 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
      return D(n3, t2, e2);
    }), n2.__c && n2.__c.__P === t2 && (n2.__e && e2.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e2)), n2;
  }
  function L() {
    this.__u = 0, this.t = null, this.__b = null;
  }
  function O(n2) {
    var t2 = n2.__.__c;
    return t2 && t2.__a && t2.__a(n2);
  }
  function U() {
    this.u = null, this.o = null;
  }
  l$1.unmount = function(n2) {
    var t2 = n2.__c;
    t2 && t2.__R && t2.__R(), t2 && 32 & n2.__u && (n2.type = null), T && T(n2);
  }, (L.prototype = new b()).__c = function(n2, t2) {
    var e2 = t2.__c, r2 = this;
    null == r2.t && (r2.t = []), r2.t.push(e2);
    var u2 = O(r2.__v), o2 = false, i2 = function() {
      o2 || (o2 = true, e2.__R = null, u2 ? u2(c2) : c2());
    };
    e2.__R = i2;
    var c2 = function() {
      if (!--r2.__u) {
        if (r2.state.__a) {
          var n3 = r2.state.__a;
          r2.__v.__k[0] = D(n3, n3.__c.__P, n3.__c.__O);
        }
        var t3;
        for (r2.setState({
          __a: r2.__b = null
        }); t3 = r2.t.pop(); ) t3.forceUpdate();
      }
    };
    r2.__u++ || 32 & t2.__u || r2.setState({
      __a: r2.__b = r2.__v.__k[0]
    }), n2.then(i2, i2);
  }, L.prototype.componentWillUnmount = function() {
    this.t = [];
  }, L.prototype.render = function(n2, e2) {
    if (this.__b) {
      if (this.__v.__k) {
        var r2 = document.createElement("div"), o2 = this.__v.__k[0].__c;
        this.__v.__k[0] = A(this.__b, r2, o2.__O = o2.__P);
      }
      this.__b = null;
    }
    var i2 = e2.__a && _(k$1, null, n2.fallback);
    return i2 && (i2.__u &= -33), [
      _(k$1, null, e2.__a ? null : n2.children),
      i2
    ];
  };
  var V = function(n2, t2, e2) {
    if (++e2[1] === e2[0] && n2.o.delete(t2), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.o.size)) for (e2 = n2.u; e2; ) {
      for (; e2.length > 3; ) e2.pop()();
      if (e2[1] < e2[0]) break;
      n2.u = e2 = e2[2];
    }
  };
  function W(n2) {
    return this.getChildContext = function() {
      return n2.context;
    }, n2.children;
  }
  function P(n2) {
    var e2 = this, r2 = n2.i;
    e2.componentWillUnmount = function() {
      B$2(null, e2.l), e2.l = null, e2.i = null;
    }, e2.i && e2.i !== r2 && e2.componentWillUnmount(), e2.l || (e2.i = r2, e2.l = {
      nodeType: 1,
      parentNode: r2,
      childNodes: [],
      contains: function() {
        return true;
      },
      appendChild: function(n3) {
        this.childNodes.push(n3), e2.i.appendChild(n3);
      },
      insertBefore: function(n3, t2) {
        this.childNodes.push(n3), e2.i.appendChild(n3);
      },
      removeChild: function(n3) {
        this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e2.i.removeChild(n3);
      }
    }), B$2(_(W, {
      context: e2.context
    }, n2.__v), e2.l);
  }
  function j(n2, e2) {
    var r2 = _(P, {
      __v: n2,
      i: e2
    });
    return r2.containerInfo = e2, r2;
  }
  (U.prototype = new b()).__a = function(n2) {
    var t2 = this, e2 = O(t2.__v), r2 = t2.o.get(n2);
    return r2[0]++, function(u2) {
      var o2 = function() {
        t2.props.revealOrder ? (r2.push(u2), V(t2, n2, r2)) : u2();
      };
      e2 ? e2(o2) : o2();
    };
  }, U.prototype.render = function(n2) {
    this.u = null, this.o = /* @__PURE__ */ new Map();
    var t2 = H$1(n2.children);
    n2.revealOrder && "b" === n2.revealOrder[0] && t2.reverse();
    for (var e2 = t2.length; e2--; ) this.o.set(t2[e2], this.u = [
      1,
      0,
      this.u
    ]);
    return n2.children;
  }, U.prototype.componentDidUpdate = U.prototype.componentDidMount = function() {
    var n2 = this;
    this.o.forEach(function(t2, e2) {
      V(n2, e2, t2);
    });
  };
  var z = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, B = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, H = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, Z = /[A-Z0-9]/g, Y = "undefined" != typeof document, $ = function(n2) {
    return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
  };
  b.prototype.isReactComponent = {}, [
    "componentWillMount",
    "componentWillReceiveProps",
    "componentWillUpdate"
  ].forEach(function(t2) {
    Object.defineProperty(b.prototype, t2, {
      configurable: true,
      get: function() {
        return this["UNSAFE_" + t2];
      },
      set: function(n2) {
        Object.defineProperty(this, t2, {
          configurable: true,
          writable: true,
          value: n2
        });
      }
    });
  });
  var J = l$1.event;
  function K() {
  }
  function Q() {
    return this.cancelBubble;
  }
  function X() {
    return this.defaultPrevented;
  }
  l$1.event = function(n2) {
    return J && (n2 = J(n2)), n2.persist = K, n2.isPropagationStopped = Q, n2.isDefaultPrevented = X, n2.nativeEvent = n2;
  };
  var tn = {
    enumerable: false,
    configurable: true,
    get: function() {
      return this.class;
    }
  }, en = l$1.vnode;
  l$1.vnode = function(n2) {
    "string" == typeof n2.type && (function(n3) {
      var t2 = n3.props, e2 = n3.type, u2 = {}, o2 = -1 === e2.indexOf("-");
      for (var i2 in t2) {
        var c2 = t2[i2];
        if (!("value" === i2 && "defaultValue" in t2 && null == c2 || Y && "children" === i2 && "noscript" === e2 || "class" === i2 || "className" === i2)) {
          var l2 = i2.toLowerCase();
          "defaultValue" === i2 && "value" in t2 && null == t2.value ? i2 = "value" : "download" === i2 && true === c2 ? c2 = "" : "translate" === l2 && "no" === c2 ? c2 = false : "o" === l2[0] && "n" === l2[1] ? "ondoubleclick" === l2 ? i2 = "ondblclick" : "onchange" !== l2 || "input" !== e2 && "textarea" !== e2 || $(t2.type) ? "onfocus" === l2 ? i2 = "onfocusin" : "onblur" === l2 ? i2 = "onfocusout" : H.test(i2) && (i2 = l2) : l2 = i2 = "oninput" : o2 && B.test(i2) ? i2 = i2.replace(Z, "-$&").toLowerCase() : null === c2 && (c2 = void 0), "oninput" === l2 && u2[i2 = l2] && (i2 = "oninputCapture"), u2[i2] = c2;
        }
      }
      "select" == e2 && u2.multiple && Array.isArray(u2.value) && (u2.value = H$1(t2.children).forEach(function(n4) {
        n4.props.selected = -1 != u2.value.indexOf(n4.props.value);
      })), "select" == e2 && null != u2.defaultValue && (u2.value = H$1(t2.children).forEach(function(n4) {
        n4.props.selected = u2.multiple ? -1 != u2.defaultValue.indexOf(n4.props.value) : u2.defaultValue == n4.props.value;
      })), t2.class && !t2.className ? (u2.class = t2.class, Object.defineProperty(u2, "className", tn)) : (t2.className && !t2.class || t2.class && t2.className) && (u2.class = u2.className = t2.className), n3.props = u2;
    })(n2), n2.$$typeof = z, en && en(n2);
  };
  var rn = l$1.__r;
  l$1.__r = function(n2) {
    rn && rn(n2), n2.__c;
  };
  var un = l$1.diffed;
  l$1.diffed = function(n2) {
    un && un(n2);
    var t2 = n2.props, e2 = n2.__e;
    null != e2 && "textarea" === n2.type && "value" in t2 && t2.value !== e2.value && (e2.value = null == t2.value ? "" : t2.value);
  };
  const styleTexts = [];
  const styleEls = /* @__PURE__ */ new Map();
  function injectStyles(styleText) {
    styleTexts.push(styleText);
    styleEls.forEach((styleEl) => {
      appendStylesTo(styleEl, styleText);
    });
  }
  function ensureElHasStyles(el) {
    if (el.isConnected && el.getRootNode) {
      registerStylesRoot(el.getRootNode());
    }
  }
  function registerStylesRoot(rootNode) {
    let styleEl = styleEls.get(rootNode);
    if (!styleEl || !styleEl.isConnected) {
      styleEl = rootNode.querySelector("style[data-fullcalendar]");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.setAttribute("data-fullcalendar", "");
        const nonce = getNonceValue();
        if (nonce) {
          styleEl.nonce = nonce;
        }
        const parentEl = rootNode === document ? document.head : rootNode;
        const insertBefore = rootNode === document ? parentEl.querySelector("script,link[rel=stylesheet],link[as=style],style") : parentEl.firstChild;
        parentEl.insertBefore(styleEl, insertBefore);
      }
      styleEls.set(rootNode, styleEl);
      hydrateStylesRoot(styleEl);
    }
  }
  function hydrateStylesRoot(styleEl) {
    for (const styleText of styleTexts) {
      appendStylesTo(styleEl, styleText);
    }
  }
  function appendStylesTo(styleEl, styleText) {
    const { sheet } = styleEl;
    const ruleCnt = sheet.cssRules.length;
    styleText.split("}").forEach((styleStr, i2) => {
      styleStr = styleStr.trim();
      if (styleStr) {
        sheet.insertRule(styleStr + "}", ruleCnt + i2);
      }
    });
  }
  let queriedNonceValue;
  function getNonceValue() {
    if (queriedNonceValue === void 0) {
      queriedNonceValue = queryNonceValue();
    }
    return queriedNonceValue;
  }
  function queryNonceValue() {
    const metaWithNonce = document.querySelector('meta[name="csp-nonce"]');
    if (metaWithNonce && metaWithNonce.hasAttribute("content")) {
      return metaWithNonce.getAttribute("content");
    }
    const elWithNonce = document.querySelector("script[nonce]");
    if (elWithNonce) {
      return elWithNonce.nonce || "";
    }
    return "";
  }
  if (typeof document !== "undefined") {
    registerStylesRoot(document);
  }
  var css_248z$1 = ':root{--fc-small-font-size:.85em;--fc-page-bg-color:#fff;--fc-neutral-bg-color:hsla(0,0%,82%,.3);--fc-neutral-text-color:grey;--fc-border-color:#ddd;--fc-button-text-color:#fff;--fc-button-bg-color:#2c3e50;--fc-button-border-color:#2c3e50;--fc-button-hover-bg-color:#1e2b37;--fc-button-hover-border-color:#1a252f;--fc-button-active-bg-color:#1a252f;--fc-button-active-border-color:#151e27;--fc-event-bg-color:#3788d8;--fc-event-border-color:#3788d8;--fc-event-text-color:#fff;--fc-event-selected-overlay-color:rgba(0,0,0,.25);--fc-more-link-bg-color:#d0d0d0;--fc-more-link-text-color:inherit;--fc-event-resizer-thickness:8px;--fc-event-resizer-dot-total-width:8px;--fc-event-resizer-dot-border-width:1px;--fc-non-business-color:hsla(0,0%,84%,.3);--fc-bg-event-color:#8fdf82;--fc-bg-event-opacity:0.3;--fc-highlight-color:rgba(188,232,241,.3);--fc-today-bg-color:rgba(255,220,40,.15);--fc-now-indicator-color:red}.fc{display:flex;flex-direction:column;gap:1.5em}.fc,.fc *,.fc :after,.fc :before{box-sizing:border-box}.fc-direction-ltr{direction:ltr;text-align:left}.fc-direction-rtl{direction:rtl;text-align:right}.fc-border,.fc-border-b,.fc-border-e,.fc-border-s,.fc-border-t{border:0 solid var(--fc-border-color)}.fc-border-transparent{border-color:transparent}.fc-border{border-width:1px}.fc-border-t{border-top-width:1px}.fc-border-b{border-bottom-width:1px}.fc-direction-ltr .fc-border-s,.fc-direction-rtl .fc-border-e{border-left-width:1px}.fc-direction-ltr .fc-border-e,.fc-direction-rtl .fc-border-s{border-right-width:1px}.fc-flex-row{display:flex;flex-direction:row}.fc-flex-col{display:flex;flex-direction:column}.fc-grow{flex-grow:1}.fc-basis0,.fc-liquid{flex-basis:0}.fc-liquid{flex-grow:1;min-height:0;min-width:0}.fc-media-screen .fc-print-header,.fc-media-screen .fc-print-root{display:flex;flex-direction:column}.fc-cell{margin:0!important;padding:0!important}.fc-cell-inner{flex-shrink:0;overflow:hidden;white-space:nowrap}.fc-celldivider,.fc-rowdivider{border:0 solid var(--fc-border-color)}.fc-rowdivider{border-width:1px 0}.fc-celldivider{border-width:0 1px}.fc-celldivider,.fc-rowdivider{background:var(--fc-neutral-bg-color)}.fc-celldivider{padding-left:2px}.fc-rowdivider{padding-bottom:2px}.fc-crop{overflow:hidden}.fc-rel{position:relative}.fc-abs{position:absolute}.fc-fill{bottom:0;top:0}.fc-fill,.fc-fill-top,.fc-fill-x{left:0;position:absolute;right:0}.fc-fill-start,.fc-fill-y{bottom:0;position:absolute;top:0}.fc-fill-top{top:0}.fc-fill-start{left:0;right:0;width:0}.fc-sticky-t{position:sticky;top:0}.fc-sticky-s{left:0;position:sticky;right:0}.fc-table-header-sticky{background:var(--fc-page-bg-color);position:sticky;top:0;z-index:3}.fc-content-box{box-sizing:content-box}.fc-offscreen{left:-10000px;position:absolute}.fc-shaded{background-color:var(--fc-neutral-bg-color)}.fc-filler{opacity:.5}.fc-padding-sm{padding:2px 4px}.fc-padding-md{padding:4px 5px}.fc-padding-lg{padding:8px}.fc-justify-center{justify-content:center}.fc-align-center{align-items:center}.fc-align-start{align-items:flex-start}.fc-footer-scrollbar-sticky{bottom:0;position:sticky;z-index:3}.fc-footer-scrollbar>.fc-scroller{margin-top:-1px}.fc-footer-scrollbar>.fc-scroller>*{height:1px}.fc-navlink{cursor:pointer}.fc-navlink:hover{text-decoration:underline}.fc-view-outer{position:relative}.fc-view-outer-liquid,.fc-view-outer-static{display:flex;flex-direction:column}.fc-view-outer-liquid,.fc-view-outer-liquid>.fc-view,.fc-view-outer-static>.fc-view{flex-basis:0;flex-grow:1;min-height:0;min-width:0}.fc-view-outer-aspect-ratio>.fc-view{bottom:0;left:0;position:absolute;right:0;top:0}a.fc-event,a.fc-event:hover{text-decoration:none}.fc-event.fc-event-draggable,.fc-event[href]{cursor:pointer}.fc-event-dragging:not(.fc-event-selected){opacity:.75}.fc-event-dragging.fc-event-selected{box-shadow:0 2px 7px rgba(0,0,0,.3)}.fc-event-selected:before{bottom:0;content:"";left:0;position:absolute;right:0;top:0;z-index:3}.fc-event-selected,.fc-event:focus:not(.fc-list-event){box-shadow:0 2px 5px rgba(0,0,0,.2)}.fc-event-selected:after,.fc-event:focus:not(.fc-list-event):after{background:var(--fc-event-selected-overlay-color);bottom:-1px;content:"";left:-1px;position:absolute;right:-1px;top:-1px;z-index:1}.fc-event-inner{position:relative;z-index:2}.fc-event-resizer{display:none;position:absolute;z-index:4}.fc-event-selected .fc-event-resizer,.fc-event:hover .fc-event-resizer{display:block}.fc-event-selected .fc-event-resizer{background:var(--fc-page-bg-color);border-color:inherit;border-radius:calc(var(--fc-event-resizer-dot-total-width)/2);border-style:solid;border-width:var(--fc-event-resizer-dot-border-width);height:var(--fc-event-resizer-dot-total-width);width:var(--fc-event-resizer-dot-total-width)}.fc-event-selected .fc-event-resizer:before{bottom:-20px;content:"";left:-20px;position:absolute;right:-20px;top:-20px}.fc-bg-event,.fc-highlight,.fc-non-business{bottom:0;left:0;position:absolute;right:0;top:0}.fc-non-business{background:var(--fc-non-business-color)}.fc-bg-event{background:var(--fc-bg-event-color);opacity:var(--fc-bg-event-opacity)}.fc-bg-event .fc-event-title{font-size:var(--fc-small-font-size);font-style:italic;margin:.5em}.fc-highlight{background:var(--fc-highlight-color)}.fc-day-disabled{background:var(--fc-neutral-bg-color)}.fc-h-event{background-color:var(--fc-event-bg-color);border:1px solid var(--fc-event-border-color);display:flex;flex-direction:column;position:relative}.fc-h-event.fc-event-mirror{z-index:1}.fc-h-event.fc-event-selected:before{bottom:-10px;top:-10px}.fc-h-event .fc-event-inner{color:var(--fc-event-text-color);display:flex;flex-direction:row}.fc-h-event .fc-event-time,.fc-h-event .fc-event-title{overflow:hidden;white-space:nowrap}.fc-media-print .fc-h-event .fc-event-time,.fc-media-print .fc-h-event .fc-event-title{overflow:hidden!important;white-space:nowrap!important}.fc-h-event .fc-event-title-outer{display:flex;flex-basis:0;flex-direction:row;flex-grow:1;min-height:0;min-width:0}.fc-h-event .fc-event-title{left:0;position:sticky;right:0}.fc-h-event:not(.fc-event-selected) .fc-event-resizer{bottom:0;top:0;width:var(--fc-event-resizer-thickness)}.fc-direction-ltr .fc-h-event:not(.fc-event-selected) .fc-event-resizer-start,.fc-direction-rtl .fc-h-event:not(.fc-event-selected) .fc-event-resizer-end{cursor:w-resize;left:calc(var(--fc-event-resizer-thickness)*-.5)}.fc-direction-ltr .fc-h-event:not(.fc-event-selected) .fc-event-resizer-end,.fc-direction-rtl .fc-h-event:not(.fc-event-selected) .fc-event-resizer-start{cursor:e-resize;right:calc(var(--fc-event-resizer-thickness)*-.5)}.fc-h-event.fc-event-selected .fc-event-resizer{margin-top:calc(var(--fc-event-resizer-dot-total-width)*-.5);top:50%}.fc-direction-ltr .fc-h-event.fc-event-selected .fc-event-resizer-start,.fc-direction-rtl .fc-h-event.fc-event-selected .fc-event-resizer-end{left:calc(var(--fc-event-resizer-dot-total-width)*-.5)}.fc-direction-ltr .fc-h-event.fc-event-selected .fc-event-resizer-end,.fc-direction-rtl .fc-h-event.fc-event-selected .fc-event-resizer-start{right:calc(var(--fc-event-resizer-dot-total-width)*-.5)}.fc-popover{box-shadow:0 2px 6px rgba(0,0,0,.15);position:absolute;z-index:4}.fc-popover-header{align-items:center;display:flex;flex-direction:row;justify-content:space-between;padding:3px 4px}.fc-popover-title{margin:0 2px}.fc-popover-close{cursor:pointer;font-size:1.1em;opacity:.65}.fc-theme-standard .fc-popover{background:var(--fc-page-bg-color);border:1px solid var(--fc-border-color)}.fc-theme-standard .fc-popover-header{background:var(--fc-neutral-bg-color)}.fc-scroller{padding:0!important}.fc-scroller-no-bars{-ms-overflow-style:none;scrollbar-width:none}.fc-scroller-no-bars::-webkit-scrollbar{display:none}.fc-not-allowed,.fc-not-allowed .fc-event{cursor:not-allowed}@font-face{font-family:fcicons;font-style:normal;font-weight:400;src:url("data:application/x-font-ttf;charset=utf-8;base64,AAEAAAALAIAAAwAwT1MvMg8SBfAAAAC8AAAAYGNtYXAXVtKNAAABHAAAAFRnYXNwAAAAEAAAAXAAAAAIZ2x5ZgYydxIAAAF4AAAFNGhlYWQUJ7cIAAAGrAAAADZoaGVhB20DzAAABuQAAAAkaG10eCIABhQAAAcIAAAALGxvY2ED4AU6AAAHNAAAABhtYXhwAA8AjAAAB0wAAAAgbmFtZXsr690AAAdsAAABhnBvc3QAAwAAAAAI9AAAACAAAwPAAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADpBgPA/8AAQAPAAEAAAAABAAAAAAAAAAAAAAAgAAAAAAADAAAAAwAAABwAAQADAAAAHAADAAEAAAAcAAQAOAAAAAoACAACAAIAAQAg6Qb//f//AAAAAAAg6QD//f//AAH/4xcEAAMAAQAAAAAAAAAAAAAAAQAB//8ADwABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAABAWIAjQKeAskAEwAAJSc3NjQnJiIHAQYUFwEWMjc2NCcCnuLiDQ0MJAz/AA0NAQAMJAwNDcni4gwjDQwM/wANIwz/AA0NDCMNAAAAAQFiAI0CngLJABMAACUBNjQnASYiBwYUHwEHBhQXFjI3AZ4BAA0N/wAMJAwNDeLiDQ0MJAyNAQAMIw0BAAwMDSMM4uINIwwNDQAAAAIA4gC3Ax4CngATACcAACUnNzY0JyYiDwEGFB8BFjI3NjQnISc3NjQnJiIPAQYUHwEWMjc2NCcB87e3DQ0MIw3VDQ3VDSMMDQ0BK7e3DQ0MJAzVDQ3VDCQMDQ3zuLcMJAwNDdUNIwzWDAwNIwy4twwkDA0N1Q0jDNYMDA0jDAAAAgDiALcDHgKeABMAJwAAJTc2NC8BJiIHBhQfAQcGFBcWMjchNzY0LwEmIgcGFB8BBwYUFxYyNwJJ1Q0N1Q0jDA0Nt7cNDQwjDf7V1Q0N1QwkDA0Nt7cNDQwkDLfWDCMN1Q0NDCQMt7gMIw0MDNYMIw3VDQ0MJAy3uAwjDQwMAAADAFUAAAOrA1UAMwBoAHcAABMiBgcOAQcOAQcOARURFBYXHgEXHgEXHgEzITI2Nz4BNz4BNz4BNRE0JicuAScuAScuASMFITIWFx4BFx4BFx4BFREUBgcOAQcOAQcOASMhIiYnLgEnLgEnLgE1ETQ2Nz4BNz4BNz4BMxMhMjY1NCYjISIGFRQWM9UNGAwLFQkJDgUFBQUFBQ4JCRULDBgNAlYNGAwLFQkJDgUFBQUFBQ4JCRULDBgN/aoCVgQIBAQHAwMFAQIBAQIBBQMDBwQECAT9qgQIBAQHAwMFAQIBAQIBBQMDBwQECASAAVYRGRkR/qoRGRkRA1UFBAUOCQkVDAsZDf2rDRkLDBUJCA4FBQUFBQUOCQgVDAsZDQJVDRkLDBUJCQ4FBAVVAgECBQMCBwQECAX9qwQJAwQHAwMFAQICAgIBBQMDBwQDCQQCVQUIBAQHAgMFAgEC/oAZEhEZGRESGQAAAAADAFUAAAOrA1UAMwBoAIkAABMiBgcOAQcOAQcOARURFBYXHgEXHgEXHgEzITI2Nz4BNz4BNz4BNRE0JicuAScuAScuASMFITIWFx4BFx4BFx4BFREUBgcOAQcOAQcOASMhIiYnLgEnLgEnLgE1ETQ2Nz4BNz4BNz4BMxMzFRQWMzI2PQEzMjY1NCYrATU0JiMiBh0BIyIGFRQWM9UNGAwLFQkJDgUFBQUFBQ4JCRULDBgNAlYNGAwLFQkJDgUFBQUFBQ4JCRULDBgN/aoCVgQIBAQHAwMFAQIBAQIBBQMDBwQECAT9qgQIBAQHAwMFAQIBAQIBBQMDBwQECASAgBkSEhmAERkZEYAZEhIZgBEZGREDVQUEBQ4JCRUMCxkN/asNGQsMFQkIDgUFBQUFBQ4JCBUMCxkNAlUNGQsMFQkJDgUEBVUCAQIFAwIHBAQIBf2rBAkDBAcDAwUBAgICAgEFAwMHBAMJBAJVBQgEBAcCAwUCAQL+gIASGRkSgBkSERmAEhkZEoAZERIZAAABAOIAjQMeAskAIAAAExcHBhQXFjI/ARcWMjc2NC8BNzY0JyYiDwEnJiIHBhQX4uLiDQ0MJAzi4gwkDA0N4uINDQwkDOLiDCQMDQ0CjeLiDSMMDQ3h4Q0NDCMN4uIMIw0MDOLiDAwNIwwAAAABAAAAAQAAa5n0y18PPPUACwQAAAAAANivOVsAAAAA2K85WwAAAAADqwNVAAAACAACAAAAAAAAAAEAAAPA/8AAAAQAAAAAAAOrAAEAAAAAAAAAAAAAAAAAAAALBAAAAAAAAAAAAAAAAgAAAAQAAWIEAAFiBAAA4gQAAOIEAABVBAAAVQQAAOIAAAAAAAoAFAAeAEQAagCqAOoBngJkApoAAQAAAAsAigADAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAA4ArgABAAAAAAABAAcAAAABAAAAAAACAAcAYAABAAAAAAADAAcANgABAAAAAAAEAAcAdQABAAAAAAAFAAsAFQABAAAAAAAGAAcASwABAAAAAAAKABoAigADAAEECQABAA4ABwADAAEECQACAA4AZwADAAEECQADAA4APQADAAEECQAEAA4AfAADAAEECQAFABYAIAADAAEECQAGAA4AUgADAAEECQAKADQApGZjaWNvbnMAZgBjAGkAYwBvAG4Ac1ZlcnNpb24gMS4wAFYAZQByAHMAaQBvAG4AIAAxAC4AMGZjaWNvbnMAZgBjAGkAYwBvAG4Ac2ZjaWNvbnMAZgBjAGkAYwBvAG4Ac1JlZ3VsYXIAUgBlAGcAdQBsAGEAcmZjaWNvbnMAZgBjAGkAYwBvAG4Ac0ZvbnQgZ2VuZXJhdGVkIGJ5IEljb01vb24uAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=") format("truetype")}.fc-icon{speak:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;display:inline-block;font-family:fcicons!important;font-style:normal;font-variant:normal;font-weight:400;height:1em;line-height:1;text-align:center;text-transform:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:1em}.fc-icon-chevron-left:before{content:"\\e900"}.fc-icon-chevron-right:before{content:"\\e901"}.fc-icon-chevrons-left:before{content:"\\e902"}.fc-icon-chevrons-right:before{content:"\\e903"}.fc-icon-minus-square:before{content:"\\e904"}.fc-icon-plus-square:before{content:"\\e905"}.fc-icon-x:before{content:"\\e906"}.fc-button{border-radius:0;font-family:inherit;font-size:inherit;line-height:inherit;margin:0;overflow:visible;text-transform:none}.fc-button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}.fc-button{-webkit-appearance:button}.fc-button:not(:disabled){cursor:pointer}.fc-button{background-color:transparent;border:1px solid transparent;border-radius:.25em;display:inline-block;font-size:1em;font-weight:400;line-height:1.5;padding:.4em .65em;text-align:center;-webkit-user-select:none;-moz-user-select:none;user-select:none;vertical-align:middle}.fc-button:hover{text-decoration:none}.fc-button:focus{box-shadow:0 0 0 .2rem rgba(44,62,80,.25);outline:0}.fc-button:disabled{opacity:.65}.fc-button-primary{background-color:var(--fc-button-bg-color);border-color:var(--fc-button-border-color);color:var(--fc-button-text-color)}.fc-button-primary:hover{background-color:var(--fc-button-hover-bg-color);border-color:var(--fc-button-hover-border-color);color:var(--fc-button-text-color)}.fc-button-primary:disabled{background-color:var(--fc-button-bg-color);border-color:var(--fc-button-border-color);color:var(--fc-button-text-color)}.fc-button-primary:focus{box-shadow:0 0 0 .2rem rgba(76,91,106,.5)}.fc-button-primary:not(:disabled).fc-button-active,.fc-button-primary:not(:disabled):active{background-color:var(--fc-button-active-bg-color);border-color:var(--fc-button-active-border-color);color:var(--fc-button-text-color)}.fc-button-primary:not(:disabled).fc-button-active:focus,.fc-button-primary:not(:disabled):active:focus{box-shadow:0 0 0 .2rem rgba(76,91,106,.5)}.fc-button .fc-icon{font-size:1.5em;vertical-align:middle}.fc-button-group{display:inline-flex;position:relative;vertical-align:middle}.fc-button-group>.fc-button{flex:1 1 auto;position:relative}.fc-button-group>.fc-button.fc-button-active,.fc-button-group>.fc-button:active,.fc-button-group>.fc-button:focus,.fc-button-group>.fc-button:hover{z-index:1}.fc-direction-ltr .fc-button-group>.fc-button:not(:first-child){border-bottom-left-radius:0;border-top-left-radius:0;margin-left:-1px}.fc-direction-ltr .fc-button-group>.fc-button:not(:last-child){border-bottom-right-radius:0;border-top-right-radius:0}.fc-direction-rtl .fc-button-group>.fc-button:not(:first-child){border-bottom-right-radius:0;border-top-right-radius:0;margin-right:-1px}.fc-direction-rtl .fc-button-group>.fc-button:not(:last-child){border-bottom-left-radius:0;border-top-left-radius:0}.fc-toolbar{align-items:center;justify-content:space-between}.fc-toolbar,.fc-toolbar-section{display:flex;flex-direction:row;gap:.75em}.fc-toolbar-section{flex-shrink:0}.fc-toolbar-title{font-size:1.75em;font-weight:700;white-space:nowrap}';
  injectStyles(css_248z$1);
  class DelayedRunner {
    constructor(drainedOption) {
      this.drainedOption = drainedOption;
      this.isRunning = false;
      this.isDirty = false;
      this.pauseDepths = {};
      this.timeoutId = 0;
    }
    request(delay) {
      this.isDirty = true;
      if (!this.isPaused()) {
        this.clearTimeout();
        if (delay == null) {
          this.tryDrain();
        } else {
          this.timeoutId = setTimeout(this.tryDrain.bind(this), delay);
        }
      }
    }
    pause(scope = "") {
      let { pauseDepths } = this;
      pauseDepths[scope] = (pauseDepths[scope] || 0) + 1;
      this.clearTimeout();
    }
    resume(scope = "", force) {
      let { pauseDepths } = this;
      if (scope in pauseDepths) {
        if (force) {
          delete pauseDepths[scope];
        } else {
          pauseDepths[scope] -= 1;
          let depth = pauseDepths[scope];
          if (depth <= 0) {
            delete pauseDepths[scope];
          }
        }
        this.tryDrain();
      }
    }
    isPaused() {
      return Object.keys(this.pauseDepths).length;
    }
    tryDrain() {
      if (!this.isRunning && !this.isPaused()) {
        this.isRunning = true;
        while (this.isDirty) {
          this.isDirty = false;
          this.drained();
        }
        this.isRunning = false;
      }
    }
    clear() {
      this.clearTimeout();
      this.isDirty = false;
      this.pauseDepths = {};
    }
    clearTimeout() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
      }
    }
    drained() {
      if (this.drainedOption) {
        this.drainedOption();
      }
    }
  }
  function preventDefault(ev) {
    ev.preventDefault();
  }
  function buildDelegationHandler(selector, handler) {
    return (ev) => {
      let matchedChild = ev.target.closest(selector);
      if (matchedChild) {
        handler.call(matchedChild, ev, matchedChild);
      }
    };
  }
  function listenBySelector(container, eventType, selector, handler) {
    let attachedHandler = buildDelegationHandler(selector, handler);
    container.addEventListener(eventType, attachedHandler);
    return () => {
      container.removeEventListener(eventType, attachedHandler);
    };
  }
  function listenToHoverBySelector(container, selector, onMouseEnter, onMouseLeave) {
    let currentMatchedChild;
    return listenBySelector(container, "mouseover", selector, (mouseOverEv, matchedChild) => {
      if (matchedChild !== currentMatchedChild) {
        currentMatchedChild = matchedChild;
        onMouseEnter(mouseOverEv, matchedChild);
        let realOnMouseLeave = (mouseLeaveEv) => {
          currentMatchedChild = null;
          onMouseLeave(mouseLeaveEv, matchedChild);
          matchedChild.removeEventListener("mouseleave", realOnMouseLeave);
        };
        matchedChild.addEventListener("mouseleave", realOnMouseLeave);
      }
    });
  }
  const transitionEventNames = [
    "webkitTransitionEnd",
    "otransitionend",
    "oTransitionEnd",
    "msTransitionEnd",
    "transitionend"
  ];
  function whenTransitionDone(el, callback) {
    let realCallback = (ev) => {
      callback(ev);
      transitionEventNames.forEach((eventName) => {
        el.removeEventListener(eventName, realCallback);
      });
    };
    transitionEventNames.forEach((eventName) => {
      el.addEventListener(eventName, realCallback);
    });
  }
  function createAriaClickAttrs(handler) {
    return Object.assign({
      onClick: handler
    }, createAriaKeyboardAttrs(handler));
  }
  function createAriaKeyboardAttrs(handler) {
    return {
      tabIndex: 0,
      onKeyDown(ev) {
        if (ev.key === "Enter" || ev.key === " ") {
          handler(ev);
          ev.preventDefault();
        }
      }
    };
  }
  let guidNumber = 0;
  function guid$1() {
    guidNumber += 1;
    return String(guidNumber);
  }
  function disableCursor() {
    document.body.classList.add("fc-not-allowed");
  }
  function enableCursor() {
    document.body.classList.remove("fc-not-allowed");
  }
  function preventSelection(el) {
    el.style.userSelect = "none";
    el.style.webkitUserSelect = "none";
    el.addEventListener("selectstart", preventDefault);
  }
  function allowSelection(el) {
    el.style.userSelect = "";
    el.style.webkitUserSelect = "";
    el.removeEventListener("selectstart", preventDefault);
  }
  function preventContextMenu(el) {
    el.addEventListener("contextmenu", preventDefault);
  }
  function allowContextMenu(el) {
    el.removeEventListener("contextmenu", preventDefault);
  }
  function parseFieldSpecs(input) {
    let specs = [];
    let tokens = [];
    let i2;
    let token;
    if (typeof input === "string") {
      tokens = input.split(/\s*,\s*/);
    } else if (typeof input === "function") {
      tokens = [
        input
      ];
    } else if (Array.isArray(input)) {
      tokens = input;
    }
    for (i2 = 0; i2 < tokens.length; i2 += 1) {
      token = tokens[i2];
      if (typeof token === "string") {
        specs.push(token.charAt(0) === "-" ? {
          field: token.substring(1),
          order: -1
        } : {
          field: token,
          order: 1
        });
      } else if (typeof token === "function") {
        specs.push({
          func: token
        });
      }
    }
    return specs;
  }
  function compareByFieldSpecs(obj0, obj1, fieldSpecs) {
    let i2;
    let cmp;
    for (i2 = 0; i2 < fieldSpecs.length; i2 += 1) {
      cmp = compareByFieldSpec(obj0, obj1, fieldSpecs[i2]);
      if (cmp) {
        return cmp;
      }
    }
    return 0;
  }
  function compareByFieldSpec(obj0, obj1, fieldSpec) {
    if (fieldSpec.func) {
      return fieldSpec.func(obj0, obj1);
    }
    return flexibleCompare(obj0[fieldSpec.field], obj1[fieldSpec.field]) * (fieldSpec.order || 1);
  }
  function flexibleCompare(a2, b2) {
    if (!a2 && !b2) {
      return 0;
    }
    if (b2 == null) {
      return -1;
    }
    if (a2 == null) {
      return 1;
    }
    if (typeof a2 === "string" || typeof b2 === "string") {
      return String(a2).localeCompare(String(b2));
    }
    return a2 - b2;
  }
  function padStart(val, len) {
    let s2 = String(val);
    return "000".substr(0, len - s2.length) + s2;
  }
  function formatWithOrdinals(formatter, args, fallbackText) {
    if (typeof formatter === "function") {
      return formatter(...args);
    }
    if (typeof formatter === "string") {
      return args.reduce((str, arg, index2) => str.replace("$" + index2, arg || ""), formatter);
    }
    return fallbackText;
  }
  function compareNumbers(a2, b2) {
    return a2 - b2;
  }
  function isInt(n2) {
    return n2 % 1 === 0;
  }
  const PARSE_RE = /^(-?)(?:(\d+)\.)?(\d+):(\d\d)(?::(\d\d)(?:\.(\d\d\d))?)?/;
  function createDuration(input, unit) {
    if (typeof input === "string") {
      return parseString(input);
    }
    if (typeof input === "object" && input) {
      return parseObject(input);
    }
    if (typeof input === "number") {
      return parseObject({
        [unit || "milliseconds"]: input
      });
    }
    return null;
  }
  function parseString(s2) {
    let m2 = PARSE_RE.exec(s2);
    if (m2) {
      let sign = m2[1] ? -1 : 1;
      return {
        years: 0,
        months: 0,
        days: sign * (m2[2] ? parseInt(m2[2], 10) : 0),
        milliseconds: sign * ((m2[3] ? parseInt(m2[3], 10) : 0) * 60 * 60 * 1e3 + (m2[4] ? parseInt(m2[4], 10) : 0) * 60 * 1e3 + (m2[5] ? parseInt(m2[5], 10) : 0) * 1e3 + (m2[6] ? parseInt(m2[6], 10) : 0))
      };
    }
    return null;
  }
  function parseObject(obj) {
    let duration = {
      years: obj.years || obj.year || 0,
      months: obj.months || obj.month || 0,
      days: obj.days || obj.day || 0,
      milliseconds: (obj.hours || obj.hour || 0) * 60 * 60 * 1e3 + (obj.minutes || obj.minute || 0) * 60 * 1e3 + (obj.seconds || obj.second || 0) * 1e3 + (obj.milliseconds || obj.millisecond || obj.ms || 0)
    };
    let weeks = obj.weeks || obj.week;
    if (weeks) {
      duration.days += weeks * 7;
      duration.specifiedWeeks = true;
    }
    return duration;
  }
  function durationsEqual(d0, d1) {
    return d0.years === d1.years && d0.months === d1.months && d0.days === d1.days && d0.milliseconds === d1.milliseconds;
  }
  function subtractDurations(d1, d0) {
    return {
      years: d1.years - d0.years,
      months: d1.months - d0.months,
      days: d1.days - d0.days,
      milliseconds: d1.milliseconds - d0.milliseconds
    };
  }
  function asRoughYears(dur) {
    return asRoughDays(dur) / 365;
  }
  function asRoughMonths(dur) {
    return asRoughDays(dur) / 30;
  }
  function asRoughDays(dur) {
    return asRoughMs(dur) / 864e5;
  }
  function asRoughMs(dur) {
    return dur.years * (365 * 864e5) + dur.months * (30 * 864e5) + dur.days * 864e5 + dur.milliseconds;
  }
  function greatestDurationDenominator(dur) {
    let ms = dur.milliseconds;
    if (ms) {
      if (ms % 1e3 !== 0) {
        return {
          unit: "millisecond",
          value: ms
        };
      }
      if (ms % (1e3 * 60) !== 0) {
        return {
          unit: "second",
          value: ms / 1e3
        };
      }
      if (ms % (1e3 * 60 * 60) !== 0) {
        return {
          unit: "minute",
          value: ms / (1e3 * 60)
        };
      }
      if (ms) {
        return {
          unit: "hour",
          value: ms / (1e3 * 60 * 60)
        };
      }
    }
    if (dur.days) {
      if (dur.specifiedWeeks && dur.days % 7 === 0) {
        return {
          unit: "week",
          value: dur.days / 7
        };
      }
      return {
        unit: "day",
        value: dur.days
      };
    }
    if (dur.months) {
      return {
        unit: "month",
        value: dur.months
      };
    }
    if (dur.years) {
      return {
        unit: "year",
        value: dur.years
      };
    }
    return {
      unit: "millisecond",
      value: 0
    };
  }
  function isArraysEqual(a0, a1, equalityFunc) {
    if (a0 === a1) {
      return true;
    }
    let len = a0.length;
    let i2;
    if (len !== a1.length) {
      return false;
    }
    for (i2 = 0; i2 < len; i2 += 1) {
      if (!(a0[i2] === a1[i2])) {
        return false;
      }
    }
    return true;
  }
  const DAY_IDS = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat"
  ];
  function addWeeks(m2, n2) {
    let a2 = dateToUtcArray(m2);
    a2[2] += n2 * 7;
    return arrayToUtcDate(a2);
  }
  function addDays(m2, n2) {
    let a2 = dateToUtcArray(m2);
    a2[2] += n2;
    return arrayToUtcDate(a2);
  }
  function addMs(m2, n2) {
    let a2 = dateToUtcArray(m2);
    a2[6] += n2;
    return arrayToUtcDate(a2);
  }
  function diffWeeks(m0, m1) {
    return diffDays(m0, m1) / 7;
  }
  function diffDays(m0, m1) {
    return (m1.valueOf() - m0.valueOf()) / (1e3 * 60 * 60 * 24);
  }
  function diffHours(m0, m1) {
    return (m1.valueOf() - m0.valueOf()) / (1e3 * 60 * 60);
  }
  function diffMinutes(m0, m1) {
    return (m1.valueOf() - m0.valueOf()) / (1e3 * 60);
  }
  function diffSeconds(m0, m1) {
    return (m1.valueOf() - m0.valueOf()) / 1e3;
  }
  function diffDayAndTime(m0, m1) {
    let m0day = startOfDay(m0);
    let m1day = startOfDay(m1);
    return {
      years: 0,
      months: 0,
      days: Math.round(diffDays(m0day, m1day)),
      milliseconds: m1.valueOf() - m1day.valueOf() - (m0.valueOf() - m0day.valueOf())
    };
  }
  function diffWholeWeeks(m0, m1) {
    let d2 = diffWholeDays(m0, m1);
    if (d2 !== null && d2 % 7 === 0) {
      return d2 / 7;
    }
    return null;
  }
  function diffWholeDays(m0, m1) {
    if (timeAsMs(m0) === timeAsMs(m1)) {
      return Math.round(diffDays(m0, m1));
    }
    return null;
  }
  function startOfDay(m2) {
    return arrayToUtcDate([
      m2.getUTCFullYear(),
      m2.getUTCMonth(),
      m2.getUTCDate()
    ]);
  }
  function startOfHour(m2) {
    return arrayToUtcDate([
      m2.getUTCFullYear(),
      m2.getUTCMonth(),
      m2.getUTCDate(),
      m2.getUTCHours()
    ]);
  }
  function startOfMinute(m2) {
    return arrayToUtcDate([
      m2.getUTCFullYear(),
      m2.getUTCMonth(),
      m2.getUTCDate(),
      m2.getUTCHours(),
      m2.getUTCMinutes()
    ]);
  }
  function startOfSecond(m2) {
    return arrayToUtcDate([
      m2.getUTCFullYear(),
      m2.getUTCMonth(),
      m2.getUTCDate(),
      m2.getUTCHours(),
      m2.getUTCMinutes(),
      m2.getUTCSeconds()
    ]);
  }
  function weekOfYear(marker, dow, doy) {
    let y2 = marker.getUTCFullYear();
    let w2 = weekOfGivenYear(marker, y2, dow, doy);
    if (w2 < 1) {
      return weekOfGivenYear(marker, y2 - 1, dow, doy);
    }
    let nextW = weekOfGivenYear(marker, y2 + 1, dow, doy);
    if (nextW >= 1) {
      return Math.min(w2, nextW);
    }
    return w2;
  }
  function weekOfGivenYear(marker, year, dow, doy) {
    let firstWeekStart = arrayToUtcDate([
      year,
      0,
      1 + firstWeekOffset(year, dow, doy)
    ]);
    let dayStart = startOfDay(marker);
    let days = Math.round(diffDays(firstWeekStart, dayStart));
    return Math.floor(days / 7) + 1;
  }
  function firstWeekOffset(year, dow, doy) {
    let fwd = 7 + dow - doy;
    let fwdlw = (7 + arrayToUtcDate([
      year,
      0,
      fwd
    ]).getUTCDay() - dow) % 7;
    return -fwdlw + fwd - 1;
  }
  function dateToLocalArray(date) {
    return [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ];
  }
  function arrayToLocalDate(a2) {
    return new Date(a2[0], a2[1] || 0, a2[2] == null ? 1 : a2[2], a2[3] || 0, a2[4] || 0, a2[5] || 0);
  }
  function dateToUtcArray(date) {
    return [
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    ];
  }
  function arrayToUtcDate(a2) {
    if (a2.length === 1) {
      a2 = a2.concat([
        0
      ]);
    }
    return new Date(Date.UTC(...a2));
  }
  function isValidDate(m2) {
    return !isNaN(m2.valueOf());
  }
  function timeAsMs(m2) {
    return m2.getUTCHours() * 1e3 * 60 * 60 + m2.getUTCMinutes() * 1e3 * 60 + m2.getUTCSeconds() * 1e3 + m2.getUTCMilliseconds();
  }
  function buildIsoString(marker, timeZoneOffset, stripZeroTime = false) {
    let s2 = marker.toISOString();
    s2 = s2.replace(".000", "");
    if (stripZeroTime) {
      s2 = s2.replace("T00:00:00Z", "");
    }
    if (s2.length > 10) {
      if (timeZoneOffset == null) {
        s2 = s2.replace("Z", "");
      } else if (timeZoneOffset !== 0) {
        s2 = s2.replace("Z", formatTimeZoneOffset(timeZoneOffset, true));
      }
    }
    return s2;
  }
  function formatDayString(marker) {
    return marker.toISOString().replace(/T.*$/, "");
  }
  function formatTimeZoneOffset(minutes, doIso = false) {
    let sign = minutes < 0 ? "-" : "+";
    let abs = Math.abs(minutes);
    let hours = Math.floor(abs / 60);
    let mins = Math.round(abs % 60);
    if (doIso) {
      return `${sign + padStart(hours, 2)}:${padStart(mins, 2)}`;
    }
    return `GMT${sign}${hours}${mins ? `:${padStart(mins, 2)}` : ""}`;
  }
  function memoize(workerFunc, resEquality, teardownFunc) {
    let currentArgs;
    let currentRes;
    return function(...newArgs) {
      if (!currentArgs) {
        currentRes = workerFunc.apply(this, newArgs);
      } else if (!isArraysEqual(currentArgs, newArgs)) {
        let res = workerFunc.apply(this, newArgs);
        if (!resEquality || !resEquality(res, currentRes)) {
          currentRes = res;
        }
      }
      currentArgs = newArgs;
      return currentRes;
    };
  }
  function memoizeObjArg(workerFunc, resEquality, teardownFunc) {
    let currentArg;
    let currentRes;
    return (newArg) => {
      if (!currentArg) {
        currentRes = workerFunc.call(this, newArg);
      } else if (!isPropsEqual(currentArg, newArg)) {
        let res = workerFunc.call(this, newArg);
        {
          currentRes = res;
        }
      }
      currentArg = newArg;
      return currentRes;
    };
  }
  const EXTENDED_SETTINGS_AND_SEVERITIES = {
    week: 3,
    separator: 0,
    omitZeroMinute: 0,
    meridiem: 0,
    omitCommas: 0
  };
  const STANDARD_DATE_PROP_SEVERITIES = {
    timeZoneName: 7,
    era: 6,
    year: 5,
    month: 4,
    day: 2,
    weekday: 2,
    hour: 1,
    minute: 1,
    second: 1
  };
  const MERIDIEM_RE = /\s*([ap])\.?m\.?/i;
  const COMMA_RE = /,/g;
  const MULTI_SPACE_RE = /\s+/g;
  const LTR_RE = /\u200e/g;
  const UTC_RE = /UTC|GMT/;
  class NativeFormatter {
    constructor(formatSettings) {
      let standardDateProps = {};
      let extendedSettings = {};
      let severity = 0;
      for (let name in formatSettings) {
        if (name in EXTENDED_SETTINGS_AND_SEVERITIES) {
          extendedSettings[name] = formatSettings[name];
          severity = Math.max(EXTENDED_SETTINGS_AND_SEVERITIES[name], severity);
        } else {
          standardDateProps[name] = formatSettings[name];
          if (name in STANDARD_DATE_PROP_SEVERITIES) {
            severity = Math.max(STANDARD_DATE_PROP_SEVERITIES[name], severity);
          }
        }
      }
      this.standardDateProps = standardDateProps;
      this.extendedSettings = extendedSettings;
      this.severity = severity;
      this.buildFormattingFunc = memoize(buildFormattingFunc);
    }
    format(date, context) {
      return this.buildFormattingFunc(this.standardDateProps, this.extendedSettings, context)(date);
    }
    formatRange(start, end, context, betterDefaultSeparator) {
      let { standardDateProps, extendedSettings } = this;
      let diffSeverity = computeMarkerDiffSeverity(start.marker, end.marker, context.calendarSystem);
      if (!diffSeverity) {
        return this.format(start, context);
      }
      let biggestUnitForPartial = diffSeverity;
      if (biggestUnitForPartial > 1 && (standardDateProps.year === "numeric" || standardDateProps.year === "2-digit") && (standardDateProps.month === "numeric" || standardDateProps.month === "2-digit") && (standardDateProps.day === "numeric" || standardDateProps.day === "2-digit")) {
        biggestUnitForPartial = 1;
      }
      let full0 = this.format(start, context);
      let full1 = this.format(end, context);
      if (full0 === full1) {
        return full0;
      }
      let partialDateProps = computePartialFormattingOptions(standardDateProps, biggestUnitForPartial);
      let partialFormattingFunc = buildFormattingFunc(partialDateProps, extendedSettings, context);
      let partial0 = partialFormattingFunc(start);
      let partial1 = partialFormattingFunc(end);
      let insertion = findCommonInsertion(full0, partial0, full1, partial1);
      let separator = extendedSettings.separator || betterDefaultSeparator || context.defaultSeparator || "";
      if (insertion) {
        return insertion.before + partial0 + separator + partial1 + insertion.after;
      }
      return full0 + separator + full1;
    }
    getLargestUnit() {
      switch (this.severity) {
        case 7:
        case 6:
        case 5:
          return "year";
        case 4:
          return "month";
        case 3:
          return "week";
        case 2:
          return "day";
        default:
          return "time";
      }
    }
  }
  function buildFormattingFunc(standardDateProps, extendedSettings, context) {
    let standardDatePropCnt = Object.keys(standardDateProps).length;
    if (standardDatePropCnt === 1 && standardDateProps.timeZoneName === "short") {
      return (date) => formatTimeZoneOffset(date.timeZoneOffset);
    }
    if (standardDatePropCnt === 0 && extendedSettings.week) {
      return (date) => formatWeekNumber(context.computeWeekNumber(date.marker), context.weekText, context.weekTextLong, context.locale, extendedSettings.week);
    }
    return buildNativeFormattingFunc(standardDateProps, extendedSettings, context);
  }
  function buildNativeFormattingFunc(standardDateProps, extendedSettings, context) {
    standardDateProps = Object.assign({}, standardDateProps);
    extendedSettings = Object.assign({}, extendedSettings);
    sanitizeSettings(standardDateProps, extendedSettings);
    standardDateProps.timeZone = "UTC";
    let normalFormat = new Intl.DateTimeFormat(context.locale.codes, standardDateProps);
    let zeroFormat;
    if (extendedSettings.omitZeroMinute) {
      let zeroProps = Object.assign({}, standardDateProps);
      delete zeroProps.minute;
      zeroFormat = new Intl.DateTimeFormat(context.locale.codes, zeroProps);
    }
    return (date) => {
      let { marker } = date;
      let format;
      if (zeroFormat && !marker.getUTCMinutes()) {
        format = zeroFormat;
      } else {
        format = normalFormat;
      }
      let s2 = format.format(marker);
      return postProcess(s2, date, standardDateProps, extendedSettings, context);
    };
  }
  function sanitizeSettings(standardDateProps, extendedSettings) {
    if (standardDateProps.timeZoneName) {
      if (!standardDateProps.hour) {
        standardDateProps.hour = "2-digit";
      }
      if (!standardDateProps.minute) {
        standardDateProps.minute = "2-digit";
      }
    }
    if (standardDateProps.timeZoneName === "long") {
      standardDateProps.timeZoneName = "short";
    }
    if (extendedSettings.omitZeroMinute && (standardDateProps.second || standardDateProps.millisecond)) {
      delete extendedSettings.omitZeroMinute;
    }
  }
  function postProcess(s2, date, standardDateProps, extendedSettings, context) {
    s2 = s2.replace(LTR_RE, "");
    if (standardDateProps.timeZoneName === "short") {
      s2 = injectTzoStr(s2, context.timeZone === "UTC" || date.timeZoneOffset == null ? "UTC" : formatTimeZoneOffset(date.timeZoneOffset));
    }
    if (extendedSettings.omitCommas) {
      s2 = s2.replace(COMMA_RE, "").trim();
    }
    if (extendedSettings.omitZeroMinute) {
      s2 = s2.replace(":00", "");
    }
    if (extendedSettings.meridiem === false) {
      s2 = s2.replace(MERIDIEM_RE, "").trim();
    } else if (extendedSettings.meridiem === "narrow") {
      s2 = s2.replace(MERIDIEM_RE, (m0, m1) => m1.toLocaleLowerCase());
    } else if (extendedSettings.meridiem === "short") {
      s2 = s2.replace(MERIDIEM_RE, (m0, m1) => `${m1.toLocaleLowerCase()}m`);
    } else if (extendedSettings.meridiem === "lowercase") {
      s2 = s2.replace(MERIDIEM_RE, (m0) => m0.toLocaleLowerCase());
    }
    s2 = s2.replace(MULTI_SPACE_RE, " ");
    s2 = s2.trim();
    return s2;
  }
  function injectTzoStr(s2, tzoStr) {
    let replaced = false;
    s2 = s2.replace(UTC_RE, () => {
      replaced = true;
      return tzoStr;
    });
    if (!replaced) {
      s2 += ` ${tzoStr}`;
    }
    return s2;
  }
  function formatWeekNumber(num, weekText, weekTextLong, locale, display) {
    let parts = [];
    if (display === "long") {
      parts.push(weekTextLong);
    } else if (display === "short" || display === "narrow") {
      parts.push(weekText);
    }
    if (display === "long" || display === "short") {
      parts.push(" ");
    }
    parts.push(locale.simpleNumberFormat.format(num));
    if (locale.options.direction === "rtl") {
      parts.reverse();
    }
    return parts.join("");
  }
  function computeMarkerDiffSeverity(d0, d1, ca) {
    if (ca.getMarkerYear(d0) !== ca.getMarkerYear(d1)) {
      return 5;
    }
    if (ca.getMarkerMonth(d0) !== ca.getMarkerMonth(d1)) {
      return 4;
    }
    if (ca.getMarkerDay(d0) !== ca.getMarkerDay(d1)) {
      return 2;
    }
    if (timeAsMs(d0) !== timeAsMs(d1)) {
      return 1;
    }
    return 0;
  }
  function computePartialFormattingOptions(options, biggestUnit) {
    let partialOptions = {};
    for (let name in options) {
      if (!(name in STANDARD_DATE_PROP_SEVERITIES) || STANDARD_DATE_PROP_SEVERITIES[name] <= biggestUnit) {
        partialOptions[name] = options[name];
      }
    }
    return partialOptions;
  }
  function findCommonInsertion(full0, partial0, full1, partial1) {
    let i0 = 0;
    while (i0 < full0.length) {
      let found0 = full0.indexOf(partial0, i0);
      if (found0 === -1) {
        break;
      }
      let before0 = full0.substr(0, found0);
      i0 = found0 + partial0.length;
      let after0 = full0.substr(i0);
      let i1 = 0;
      while (i1 < full1.length) {
        let found1 = full1.indexOf(partial1, i1);
        if (found1 === -1) {
          break;
        }
        let before1 = full1.substr(0, found1);
        i1 = found1 + partial1.length;
        let after1 = full1.substr(i1);
        if (before0 === before1 && after0 === after1) {
          return {
            before: before0,
            after: after0
          };
        }
      }
    }
    return null;
  }
  function expandZonedMarker(dateInfo, calendarSystem) {
    let a2 = calendarSystem.markerToArray(dateInfo.marker);
    return {
      marker: dateInfo.marker,
      timeZoneOffset: dateInfo.timeZoneOffset,
      array: a2,
      year: a2[0],
      month: a2[1],
      day: a2[2],
      hour: a2[3],
      minute: a2[4],
      second: a2[5],
      millisecond: a2[6]
    };
  }
  function createVerboseFormattingArg(start, end, context, betterDefaultSeparator) {
    let startInfo = expandZonedMarker(start, context.calendarSystem);
    let endInfo = end ? expandZonedMarker(end, context.calendarSystem) : null;
    return {
      date: startInfo,
      start: startInfo,
      end: endInfo,
      timeZone: context.timeZone,
      localeCodes: context.locale.codes,
      defaultSeparator: betterDefaultSeparator || context.defaultSeparator
    };
  }
  class CmdFormatter {
    constructor(cmdStr) {
      this.cmdStr = cmdStr;
    }
    format(date, context, betterDefaultSeparator) {
      return context.cmdFormatter(this.cmdStr, createVerboseFormattingArg(date, null, context, betterDefaultSeparator));
    }
    formatRange(start, end, context, betterDefaultSeparator) {
      return context.cmdFormatter(this.cmdStr, createVerboseFormattingArg(start, end, context, betterDefaultSeparator));
    }
  }
  class FuncFormatter {
    constructor(func) {
      this.func = func;
    }
    format(date, context, betterDefaultSeparator) {
      return this.func(createVerboseFormattingArg(date, null, context, betterDefaultSeparator));
    }
    formatRange(start, end, context, betterDefaultSeparator) {
      return this.func(createVerboseFormattingArg(start, end, context, betterDefaultSeparator));
    }
  }
  function createFormatter(input) {
    if (typeof input === "object" && input) {
      return new NativeFormatter(input);
    }
    if (typeof input === "string") {
      return new CmdFormatter(input);
    }
    if (typeof input === "function") {
      return new FuncFormatter(input);
    }
    return null;
  }
  const BASE_OPTION_REFINERS = {
    navLinkDayClick: identity,
    navLinkWeekClick: identity,
    duration: createDuration,
    bootstrapFontAwesome: identity,
    buttonIcons: identity,
    customButtons: identity,
    defaultAllDayEventDuration: createDuration,
    defaultTimedEventDuration: createDuration,
    nextDayThreshold: createDuration,
    scrollTime: createDuration,
    scrollTimeReset: Boolean,
    slotMinTime: createDuration,
    slotMaxTime: createDuration,
    dayPopoverFormat: createFormatter,
    slotDuration: createDuration,
    snapDuration: createDuration,
    headerToolbar: identity,
    footerToolbar: identity,
    defaultRangeSeparator: String,
    titleRangeSeparator: String,
    forceEventDuration: Boolean,
    dayHeaders: Boolean,
    dayHeaderFormat: createFormatter,
    dayHeaderClassNames: identity,
    dayHeaderContent: identity,
    dayHeaderDidMount: identity,
    dayHeaderWillUnmount: identity,
    dayCellClassNames: identity,
    dayCellContent: identity,
    dayCellDidMount: identity,
    dayCellWillUnmount: identity,
    initialView: String,
    aspectRatio: Number,
    weekends: Boolean,
    weekNumberCalculation: identity,
    weekNumbers: Boolean,
    weekNumberClassNames: identity,
    weekNumberContent: identity,
    weekNumberDidMount: identity,
    weekNumberWillUnmount: identity,
    editable: Boolean,
    viewClassNames: identity,
    viewDidMount: identity,
    viewWillUnmount: identity,
    nowIndicator: Boolean,
    nowIndicatorClassNames: identity,
    nowIndicatorContent: identity,
    nowIndicatorDidMount: identity,
    nowIndicatorWillUnmount: identity,
    showNonCurrentDates: Boolean,
    lazyFetching: Boolean,
    startParam: String,
    endParam: String,
    timeZoneParam: String,
    timeZone: String,
    locales: identity,
    locale: identity,
    themeSystem: String,
    dragRevertDuration: Number,
    dragScroll: Boolean,
    allDayMaintainDuration: Boolean,
    unselectAuto: Boolean,
    dropAccept: identity,
    eventOrder: parseFieldSpecs,
    eventOrderStrict: Boolean,
    eventSlicing: Boolean,
    longPressDelay: Number,
    eventDragMinDistance: Number,
    expandRows: Boolean,
    height: identity,
    contentHeight: identity,
    direction: String,
    weekNumberFormat: createFormatter,
    eventResizableFromStart: Boolean,
    displayEventTime: Boolean,
    displayEventEnd: Boolean,
    weekText: String,
    weekTextLong: String,
    progressiveEventRendering: Boolean,
    businessHours: identity,
    initialDate: identity,
    now: identity,
    eventDataTransform: identity,
    stickyHeaderDates: identity,
    stickyFooterScrollbar: identity,
    defaultAllDay: Boolean,
    eventSourceFailure: identity,
    eventSourceSuccess: identity,
    eventDisplay: String,
    eventStartEditable: Boolean,
    eventDurationEditable: Boolean,
    eventOverlap: identity,
    eventConstraint: identity,
    eventAllow: identity,
    eventBackgroundColor: String,
    eventBorderColor: String,
    eventTextColor: String,
    eventColor: String,
    eventClassNames: identity,
    eventContent: identity,
    eventDidMount: identity,
    eventWillUnmount: identity,
    selectConstraint: identity,
    selectOverlap: identity,
    selectAllow: identity,
    droppable: Boolean,
    unselectCancel: String,
    slotLabelFormat: identity,
    slotLaneClassNames: identity,
    slotLaneContent: identity,
    slotLaneDidMount: identity,
    slotLaneWillUnmount: identity,
    slotLabelClassNames: identity,
    slotLabelContent: identity,
    slotLabelDidMount: identity,
    slotLabelWillUnmount: identity,
    dayMaxEvents: identity,
    dayMaxEventRows: identity,
    dayMinWidth: Number,
    slotLabelInterval: createDuration,
    allDayText: String,
    allDayClassNames: identity,
    allDayContent: identity,
    allDayDidMount: identity,
    allDayWillUnmount: identity,
    timedText: String,
    slotMinWidth: Number,
    navLinks: Boolean,
    eventTimeFormat: createFormatter,
    rerenderDelay: Number,
    moreLinkText: identity,
    moreLinkHint: identity,
    selectMinDistance: Number,
    selectable: Boolean,
    selectLongPressDelay: Number,
    eventLongPressDelay: Number,
    selectMirror: Boolean,
    eventMaxStack: Number,
    eventMinHeight: Number,
    eventMinWidth: Number,
    eventShortHeight: Number,
    slotEventOverlap: Boolean,
    plugins: identity,
    firstDay: Number,
    dayCount: Number,
    dateAlignment: String,
    dateIncrement: createDuration,
    hiddenDays: identity,
    fixedWeekCount: Boolean,
    validRange: identity,
    visibleRange: identity,
    titleFormat: identity,
    eventInteractive: Boolean,
    noEventsText: String,
    viewHint: identity,
    viewChangeHint: String,
    navLinkHint: identity,
    closeHint: String,
    eventsHint: String,
    headingLevel: Number,
    moreLinkClick: identity,
    moreLinkClassNames: identity,
    moreLinkContent: identity,
    moreLinkDidMount: identity,
    moreLinkWillUnmount: identity,
    monthStartFormat: createFormatter,
    handleCustomRendering: identity,
    customRenderingMetaMap: identity,
    customRenderingReplaces: Boolean
  };
  const BASE_OPTION_DEFAULTS = {
    eventDisplay: "auto",
    defaultRangeSeparator: " - ",
    titleRangeSeparator: " \u2013 ",
    defaultTimedEventDuration: "01:00:00",
    defaultAllDayEventDuration: {
      day: 1
    },
    forceEventDuration: false,
    nextDayThreshold: "00:00:00",
    dayHeaders: true,
    initialView: "",
    aspectRatio: 1.35,
    headerToolbar: {
      start: "title",
      center: "",
      end: "today prev,next"
    },
    weekends: true,
    weekNumbers: false,
    weekNumberCalculation: "local",
    editable: false,
    nowIndicator: false,
    scrollTime: "06:00:00",
    scrollTimeReset: true,
    slotMinTime: "00:00:00",
    slotMaxTime: "24:00:00",
    showNonCurrentDates: true,
    lazyFetching: true,
    startParam: "start",
    endParam: "end",
    timeZoneParam: "timeZone",
    timeZone: "local",
    locales: [],
    locale: "",
    themeSystem: "standard",
    dragRevertDuration: 500,
    dragScroll: true,
    allDayMaintainDuration: false,
    unselectAuto: true,
    dropAccept: "*",
    eventOrder: "start,-duration,allDay,title",
    dayPopoverFormat: {
      month: "long",
      day: "numeric",
      year: "numeric"
    },
    longPressDelay: 1e3,
    eventDragMinDistance: 5,
    expandRows: false,
    navLinks: false,
    selectable: false,
    eventMinHeight: 15,
    eventMinWidth: 30,
    eventShortHeight: 30,
    monthStartFormat: {
      month: "long",
      day: "numeric"
    },
    headingLevel: 2
  };
  const CALENDAR_LISTENER_REFINERS = {
    datesSet: identity,
    eventsSet: identity,
    eventAdd: identity,
    eventChange: identity,
    eventRemove: identity,
    eventClick: identity,
    eventMouseEnter: identity,
    eventMouseLeave: identity,
    select: identity,
    unselect: identity,
    loading: identity,
    _unmount: identity,
    _beforeprint: identity,
    _afterprint: identity,
    _noEventDrop: identity,
    _noEventResize: identity,
    _timeScrollRequest: identity
  };
  const CALENDAR_OPTION_REFINERS = {
    buttonText: identity,
    buttonHints: identity,
    views: identity,
    plugins: identity,
    initialEvents: identity,
    events: identity,
    eventSources: identity
  };
  const COMPLEX_OPTION_COMPARATORS = {
    headerToolbar: isMaybeObjectsEqual,
    footerToolbar: isMaybeObjectsEqual,
    buttonText: isMaybeObjectsEqual,
    buttonHints: isMaybeObjectsEqual,
    buttonIcons: isMaybeObjectsEqual,
    dateIncrement: isMaybeObjectsEqual,
    plugins: isMaybeArraysEqual,
    events: isMaybeArraysEqual,
    eventSources: isMaybeArraysEqual,
    ["resources"]: isMaybeArraysEqual
  };
  function isMaybeObjectsEqual(a2, b2) {
    if (typeof a2 === "object" && typeof b2 === "object" && a2 && b2) {
      return isPropsEqual(a2, b2);
    }
    return a2 === b2;
  }
  function isMaybeArraysEqual(a2, b2) {
    if (Array.isArray(a2) && Array.isArray(b2)) {
      return isArraysEqual(a2, b2);
    }
    return a2 === b2;
  }
  const VIEW_OPTION_REFINERS = {
    type: String,
    component: identity,
    buttonText: String,
    buttonTextKey: String,
    dateProfileGeneratorClass: identity,
    usesMinMaxTime: Boolean,
    classNames: identity,
    content: identity,
    didMount: identity,
    willUnmount: identity
  };
  function mergeRawOptions(optionSets) {
    return mergeProps(optionSets, COMPLEX_OPTION_COMPARATORS);
  }
  function refineProps(input, refiners) {
    let refined = {};
    let extra = {};
    for (let propName in refiners) {
      if (propName in input) {
        refined[propName] = refiners[propName](input[propName]);
      }
    }
    for (let propName in input) {
      if (!(propName in refiners)) {
        extra[propName] = input[propName];
      }
    }
    return {
      refined,
      extra
    };
  }
  function identity(raw) {
    return raw;
  }
  const { hasOwnProperty } = Object.prototype;
  function mergeProps(propObjs, complexPropsMap) {
    let dest = {};
    if (complexPropsMap) {
      for (let name in complexPropsMap) {
        if (complexPropsMap[name] === isMaybeObjectsEqual) {
          let complexObjs = [];
          for (let i2 = propObjs.length - 1; i2 >= 0; i2 -= 1) {
            let val = propObjs[i2][name];
            if (typeof val === "object" && val) {
              complexObjs.unshift(val);
            } else if (val !== void 0) {
              dest[name] = val;
              break;
            }
          }
          if (complexObjs.length) {
            dest[name] = mergeProps(complexObjs);
          }
        }
      }
    }
    for (let i2 = propObjs.length - 1; i2 >= 0; i2 -= 1) {
      let props = propObjs[i2];
      for (let name in props) {
        if (!(name in dest)) {
          dest[name] = props[name];
        }
      }
    }
    return dest;
  }
  function filterHash(hash, func) {
    let filtered = {};
    for (let key in hash) {
      if (func(hash[key], key)) {
        filtered[key] = hash[key];
      }
    }
    return filtered;
  }
  function mapHash(hash, func) {
    let newHash = {};
    for (let key in hash) {
      newHash[key] = func(hash[key], key);
    }
    return newHash;
  }
  function arrayToHash(a2) {
    let hash = {};
    for (let item of a2) {
      hash[item] = true;
    }
    return hash;
  }
  function hashValuesToArray(obj) {
    let a2 = [];
    for (let key in obj) {
      a2.push(obj[key]);
    }
    return a2;
  }
  function isPropsEqual(obj0, obj1) {
    if (obj0 === obj1) {
      return true;
    }
    for (let key in obj0) {
      if (hasOwnProperty.call(obj0, key)) {
        if (!(key in obj1)) {
          return false;
        }
      }
    }
    for (let key in obj1) {
      if (hasOwnProperty.call(obj1, key)) {
        if (obj0[key] !== obj1[key]) {
          return false;
        }
      }
    }
    return true;
  }
  const HANDLER_RE = /^on[A-Z]/;
  function isNonHandlerPropsEqual(obj0, obj1) {
    const keys = getUnequalProps(obj0, obj1);
    for (let key of keys) {
      if (!HANDLER_RE.test(key)) {
        return false;
      }
    }
    return true;
  }
  function getUnequalProps(obj0, obj1) {
    let keys = [];
    for (let key in obj0) {
      if (hasOwnProperty.call(obj0, key)) {
        if (!(key in obj1)) {
          keys.push(key);
        }
      }
    }
    for (let key in obj1) {
      if (hasOwnProperty.call(obj1, key)) {
        if (obj0[key] !== obj1[key]) {
          keys.push(key);
        }
      }
    }
    return keys;
  }
  function compareObjs(oldProps, newProps, equalityFuncs = {}) {
    if (oldProps === newProps) {
      return true;
    }
    for (let key in newProps) {
      if (key in oldProps && isObjValsEqual(oldProps[key], newProps[key], equalityFuncs[key])) ;
      else {
        return false;
      }
    }
    for (let key in oldProps) {
      if (!(key in newProps)) {
        return false;
      }
    }
    return true;
  }
  function isObjValsEqual(val0, val1, comparator) {
    if (val0 === val1 || comparator === true) {
      return true;
    }
    if (comparator) {
      return comparator(val0, val1);
    }
    return false;
  }
  let calendarSystemClassMap = {};
  function registerCalendarSystem(name, theClass) {
    calendarSystemClassMap[name] = theClass;
  }
  function createCalendarSystem(name) {
    return new calendarSystemClassMap[name]();
  }
  class GregorianCalendarSystem {
    getMarkerYear(d2) {
      return d2.getUTCFullYear();
    }
    getMarkerMonth(d2) {
      return d2.getUTCMonth();
    }
    getMarkerDay(d2) {
      return d2.getUTCDate();
    }
    arrayToMarker(arr) {
      return arrayToUtcDate(arr);
    }
    markerToArray(marker) {
      return dateToUtcArray(marker);
    }
  }
  registerCalendarSystem("gregory", GregorianCalendarSystem);
  const ISO_RE = /^\s*(\d{4})(-?(\d{2})(-?(\d{2})([T ](\d{2}):?(\d{2})(:?(\d{2})(\.(\d+))?)?(Z|(([-+])(\d{2})(:?(\d{2}))?))?)?)?)?$/;
  function parse(str) {
    let m2 = ISO_RE.exec(str);
    if (m2) {
      let marker = new Date(Date.UTC(Number(m2[1]), m2[3] ? Number(m2[3]) - 1 : 0, Number(m2[5] || 1), Number(m2[7] || 0), Number(m2[8] || 0), Number(m2[10] || 0), m2[12] ? Number(`0.${m2[12]}`) * 1e3 : 0));
      if (isValidDate(marker)) {
        let timeZoneOffset = null;
        if (m2[13]) {
          timeZoneOffset = (m2[15] === "-" ? -1 : 1) * (Number(m2[16] || 0) * 60 + Number(m2[18] || 0));
        }
        return {
          marker,
          isTimeUnspecified: !m2[6],
          timeZoneOffset
        };
      }
    }
    return null;
  }
  class DateEnv {
    constructor(settings) {
      let timeZone = this.timeZone = settings.timeZone;
      let isNamedTimeZone = timeZone !== "local" && timeZone !== "UTC";
      if (settings.namedTimeZoneImpl && isNamedTimeZone) {
        this.namedTimeZoneImpl = new settings.namedTimeZoneImpl(timeZone);
      }
      this.canComputeOffset = Boolean(!isNamedTimeZone || this.namedTimeZoneImpl);
      this.calendarSystem = createCalendarSystem(settings.calendarSystem);
      this.locale = settings.locale;
      this.weekDow = settings.locale.week.dow;
      this.weekDoy = settings.locale.week.doy;
      if (settings.weekNumberCalculation === "ISO") {
        this.weekDow = 1;
        this.weekDoy = 4;
      }
      if (typeof settings.firstDay === "number") {
        this.weekDow = settings.firstDay;
      }
      if (typeof settings.weekNumberCalculation === "function") {
        this.weekNumberFunc = settings.weekNumberCalculation;
      }
      this.weekText = settings.weekText != null ? settings.weekText : settings.locale.options.weekText;
      this.weekTextLong = (settings.weekTextLong != null ? settings.weekTextLong : settings.locale.options.weekTextLong) || this.weekText;
      this.cmdFormatter = settings.cmdFormatter;
      this.defaultSeparator = settings.defaultSeparator;
    }
    createMarker(input) {
      let meta = this.createMarkerMeta(input);
      if (meta === null) {
        return null;
      }
      return meta.marker;
    }
    createNowMarker() {
      if (this.canComputeOffset) {
        return this.timestampToMarker((/* @__PURE__ */ new Date()).valueOf());
      }
      return arrayToUtcDate(dateToLocalArray(/* @__PURE__ */ new Date()));
    }
    createMarkerMeta(input) {
      if (typeof input === "string") {
        return this.parse(input);
      }
      let marker = null;
      if (typeof input === "number") {
        marker = this.timestampToMarker(input);
      } else if (input instanceof Date) {
        input = input.valueOf();
        if (!isNaN(input)) {
          marker = this.timestampToMarker(input);
        }
      } else if (Array.isArray(input)) {
        marker = arrayToUtcDate(input);
      }
      if (marker === null || !isValidDate(marker)) {
        return null;
      }
      return {
        marker,
        isTimeUnspecified: false,
        forcedTzo: null
      };
    }
    parse(s2) {
      let parts = parse(s2);
      if (parts === null) {
        return null;
      }
      let { marker } = parts;
      let forcedTzo = null;
      if (parts.timeZoneOffset !== null) {
        if (this.canComputeOffset) {
          marker = this.timestampToMarker(marker.valueOf() - parts.timeZoneOffset * 60 * 1e3);
        } else {
          forcedTzo = parts.timeZoneOffset;
        }
      }
      return {
        marker,
        isTimeUnspecified: parts.isTimeUnspecified,
        forcedTzo
      };
    }
    getYear(marker) {
      return this.calendarSystem.getMarkerYear(marker);
    }
    getMonth(marker) {
      return this.calendarSystem.getMarkerMonth(marker);
    }
    getDay(marker) {
      return this.calendarSystem.getMarkerDay(marker);
    }
    add(marker, dur) {
      let a2 = this.calendarSystem.markerToArray(marker);
      a2[0] += dur.years;
      a2[1] += dur.months;
      a2[2] += dur.days;
      a2[6] += dur.milliseconds;
      return this.calendarSystem.arrayToMarker(a2);
    }
    subtract(marker, dur) {
      let a2 = this.calendarSystem.markerToArray(marker);
      a2[0] -= dur.years;
      a2[1] -= dur.months;
      a2[2] -= dur.days;
      a2[6] -= dur.milliseconds;
      return this.calendarSystem.arrayToMarker(a2);
    }
    addYears(marker, n2) {
      let a2 = this.calendarSystem.markerToArray(marker);
      a2[0] += n2;
      return this.calendarSystem.arrayToMarker(a2);
    }
    addMonths(marker, n2) {
      let a2 = this.calendarSystem.markerToArray(marker);
      a2[1] += n2;
      return this.calendarSystem.arrayToMarker(a2);
    }
    diffWholeYears(m0, m1) {
      let { calendarSystem } = this;
      if (timeAsMs(m0) === timeAsMs(m1) && calendarSystem.getMarkerDay(m0) === calendarSystem.getMarkerDay(m1) && calendarSystem.getMarkerMonth(m0) === calendarSystem.getMarkerMonth(m1)) {
        return calendarSystem.getMarkerYear(m1) - calendarSystem.getMarkerYear(m0);
      }
      return null;
    }
    diffWholeMonths(m0, m1) {
      let { calendarSystem } = this;
      if (timeAsMs(m0) === timeAsMs(m1) && calendarSystem.getMarkerDay(m0) === calendarSystem.getMarkerDay(m1)) {
        return calendarSystem.getMarkerMonth(m1) - calendarSystem.getMarkerMonth(m0) + (calendarSystem.getMarkerYear(m1) - calendarSystem.getMarkerYear(m0)) * 12;
      }
      return null;
    }
    greatestWholeUnit(m0, m1) {
      let n2 = this.diffWholeYears(m0, m1);
      if (n2 !== null) {
        return {
          unit: "year",
          value: n2
        };
      }
      n2 = this.diffWholeMonths(m0, m1);
      if (n2 !== null) {
        return {
          unit: "month",
          value: n2
        };
      }
      n2 = diffWholeWeeks(m0, m1);
      if (n2 !== null) {
        return {
          unit: "week",
          value: n2
        };
      }
      n2 = diffWholeDays(m0, m1);
      if (n2 !== null) {
        return {
          unit: "day",
          value: n2
        };
      }
      n2 = diffHours(m0, m1);
      if (isInt(n2)) {
        return {
          unit: "hour",
          value: n2
        };
      }
      n2 = diffMinutes(m0, m1);
      if (isInt(n2)) {
        return {
          unit: "minute",
          value: n2
        };
      }
      n2 = diffSeconds(m0, m1);
      if (isInt(n2)) {
        return {
          unit: "second",
          value: n2
        };
      }
      return {
        unit: "millisecond",
        value: m1.valueOf() - m0.valueOf()
      };
    }
    countDurationsBetween(m0, m1, d2) {
      let diff;
      if (d2.years) {
        diff = this.diffWholeYears(m0, m1);
        if (diff !== null) {
          return diff / asRoughYears(d2);
        }
      }
      if (d2.months) {
        diff = this.diffWholeMonths(m0, m1);
        if (diff !== null) {
          return diff / asRoughMonths(d2);
        }
      }
      if (d2.days) {
        diff = diffWholeDays(m0, m1);
        if (diff !== null) {
          return diff / asRoughDays(d2);
        }
      }
      return (m1.valueOf() - m0.valueOf()) / asRoughMs(d2);
    }
    startOf(m2, unit) {
      if (unit === "year") {
        return this.startOfYear(m2);
      }
      if (unit === "month") {
        return this.startOfMonth(m2);
      }
      if (unit === "week") {
        return this.startOfWeek(m2);
      }
      if (unit === "day") {
        return startOfDay(m2);
      }
      if (unit === "hour") {
        return startOfHour(m2);
      }
      if (unit === "minute") {
        return startOfMinute(m2);
      }
      if (unit === "second") {
        return startOfSecond(m2);
      }
      return null;
    }
    startOfYear(m2) {
      return this.calendarSystem.arrayToMarker([
        this.calendarSystem.getMarkerYear(m2)
      ]);
    }
    startOfMonth(m2) {
      return this.calendarSystem.arrayToMarker([
        this.calendarSystem.getMarkerYear(m2),
        this.calendarSystem.getMarkerMonth(m2)
      ]);
    }
    startOfWeek(m2) {
      return this.calendarSystem.arrayToMarker([
        this.calendarSystem.getMarkerYear(m2),
        this.calendarSystem.getMarkerMonth(m2),
        m2.getUTCDate() - (m2.getUTCDay() - this.weekDow + 7) % 7
      ]);
    }
    computeWeekNumber(marker) {
      if (this.weekNumberFunc) {
        return this.weekNumberFunc(this.toDate(marker));
      }
      return weekOfYear(marker, this.weekDow, this.weekDoy);
    }
    format(marker, formatter, dateOptions = {}) {
      return formatter.format({
        marker,
        timeZoneOffset: dateOptions.forcedTzo != null ? dateOptions.forcedTzo : this.offsetForMarker(marker)
      }, this);
    }
    formatRange(start, end, formatter, dateOptions = {}) {
      if (dateOptions.isEndExclusive) {
        end = addMs(end, -1);
      }
      return formatter.formatRange({
        marker: start,
        timeZoneOffset: dateOptions.forcedStartTzo != null ? dateOptions.forcedStartTzo : this.offsetForMarker(start)
      }, {
        marker: end,
        timeZoneOffset: dateOptions.forcedEndTzo != null ? dateOptions.forcedEndTzo : this.offsetForMarker(end)
      }, this, dateOptions.defaultSeparator);
    }
    formatIso(marker, extraOptions = {}) {
      let timeZoneOffset = null;
      if (!extraOptions.omitTimeZoneOffset) {
        if (extraOptions.forcedTzo != null) {
          timeZoneOffset = extraOptions.forcedTzo;
        } else {
          timeZoneOffset = this.offsetForMarker(marker);
        }
      }
      return buildIsoString(marker, timeZoneOffset, extraOptions.omitTime);
    }
    timestampToMarker(ms) {
      if (this.timeZone === "local") {
        return arrayToUtcDate(dateToLocalArray(new Date(ms)));
      }
      if (this.timeZone === "UTC" || !this.namedTimeZoneImpl) {
        return new Date(ms);
      }
      return arrayToUtcDate(this.namedTimeZoneImpl.timestampToArray(ms));
    }
    offsetForMarker(m2) {
      if (this.timeZone === "local") {
        return -arrayToLocalDate(dateToUtcArray(m2)).getTimezoneOffset();
      }
      if (this.timeZone === "UTC") {
        return 0;
      }
      if (this.namedTimeZoneImpl) {
        return this.namedTimeZoneImpl.offsetForArray(dateToUtcArray(m2));
      }
      return null;
    }
    toDate(m2, forcedTzo) {
      if (this.timeZone === "local") {
        return arrayToLocalDate(dateToUtcArray(m2));
      }
      if (this.timeZone === "UTC") {
        return new Date(m2.valueOf());
      }
      if (!this.namedTimeZoneImpl) {
        return new Date(m2.valueOf() - (forcedTzo || 0));
      }
      return new Date(m2.valueOf() - this.namedTimeZoneImpl.offsetForArray(dateToUtcArray(m2)) * 1e3 * 60);
    }
  }
  class Theme {
    constructor(calendarOptions) {
      if (this.iconOverrideOption) {
        this.setIconOverride(calendarOptions[this.iconOverrideOption]);
      }
    }
    setIconOverride(iconOverrideHash) {
      let iconClassesCopy;
      let buttonName;
      if (typeof iconOverrideHash === "object" && iconOverrideHash) {
        iconClassesCopy = Object.assign({}, this.iconClasses);
        for (buttonName in iconOverrideHash) {
          iconClassesCopy[buttonName] = this.applyIconOverridePrefix(iconOverrideHash[buttonName]);
        }
        this.iconClasses = iconClassesCopy;
      } else if (iconOverrideHash === false) {
        this.iconClasses = {};
      }
    }
    applyIconOverridePrefix(className) {
      let prefix = this.iconOverridePrefix;
      if (prefix && className.indexOf(prefix) !== 0) {
        className = prefix + className;
      }
      return className;
    }
    getClassName(key) {
      return this.classes[key] || "";
    }
    getIconClass(buttonName, isRtl) {
      let className;
      if (isRtl && this.rtlIconClasses) {
        className = this.rtlIconClasses[buttonName] || this.iconClasses[buttonName];
      } else {
        className = this.iconClasses[buttonName];
      }
      if (className) {
        return `${this.baseIconClass} ${className}`;
      }
      return "";
    }
    getCustomButtonIconClass(customButtonProps) {
      let className;
      if (this.iconOverrideCustomButtonOption) {
        className = customButtonProps[this.iconOverrideCustomButtonOption];
        if (className) {
          return `${this.baseIconClass} ${this.applyIconOverridePrefix(className)}`;
        }
      }
      return "";
    }
  }
  Theme.prototype.classes = {};
  Theme.prototype.iconClasses = {};
  Theme.prototype.baseIconClass = "";
  Theme.prototype.iconOverridePrefix = "";
  function flushUpdates() {
    let oldDebounceRendering = l$1.debounceRendering;
    let callbackQ = [];
    function execCallbackSync(callback) {
      callbackQ.push(callback);
    }
    l$1.debounceRendering = execCallbackSync;
    B$2(_(FakeComponent, {}), document.createElement("div"));
    while (callbackQ.length) {
      callbackQ.shift()();
    }
    l$1.debounceRendering = oldDebounceRendering;
  }
  function flushSync(f2) {
    f2();
    flushUpdates();
  }
  class FakeComponent extends b {
    render() {
      return _("div", {});
    }
    componentDidMount() {
      this.setState({});
    }
  }
  const createContext = G;
  const preactOptions = l$1;
  const ViewContextType = createContext({});
  function buildViewContext(viewSpec, viewApi, viewOptions, dateProfileGenerator, dateEnv, theme, pluginHooks, dispatch, getCurrentData, emitter, calendarApi, registerInteractiveComponent, unregisterInteractiveComponent) {
    return {
      dateEnv,
      options: viewOptions,
      pluginHooks,
      emitter,
      dispatch,
      getCurrentData,
      calendarApi,
      viewSpec,
      viewApi,
      dateProfileGenerator,
      theme,
      isRtl: viewOptions.direction === "rtl",
      registerInteractiveComponent,
      unregisterInteractiveComponent
    };
  }
  class PureComponent extends b {
    shouldComponentUpdate(nextProps, nextState) {
      if (this.debug) {
        console.log(getUnequalProps(nextProps, this.props), getUnequalProps(nextState, this.state));
      }
      return !compareObjs(this.props, nextProps, this.propEquality) || !compareObjs(this.state, nextState, this.stateEquality);
    }
  }
  PureComponent.addPropsEquality = addPropsEquality;
  PureComponent.addStateEquality = addStateEquality;
  PureComponent.contextType = ViewContextType;
  PureComponent.prototype.propEquality = {};
  PureComponent.prototype.stateEquality = {};
  class BaseComponent extends PureComponent {
  }
  BaseComponent.contextType = ViewContextType;
  function addPropsEquality(propEquality) {
    let hash = Object.create(this.prototype.propEquality);
    Object.assign(hash, propEquality);
    this.prototype.propEquality = hash;
  }
  function addStateEquality(stateEquality) {
    let hash = Object.create(this.prototype.stateEquality);
    Object.assign(hash, stateEquality);
    this.prototype.stateEquality = hash;
  }
  function setRef(ref2, current) {
    if (typeof ref2 === "function") {
      ref2(current);
    } else if (ref2) {
      ref2.current = current;
    }
  }
  function joinClassNames(...args) {
    return args.filter(Boolean).join(" ");
  }
  function parseClassNames(raw) {
    if (Array.isArray(raw)) {
      return raw;
    }
    if (typeof raw === "string") {
      return raw.split(/\s+/);
    }
    return [];
  }
  function fracToCssDim(frac) {
    return frac * 100 + "%";
  }
  class ContentInjector extends BaseComponent {
    constructor() {
      super(...arguments);
      this.id = guid$1();
      this.queuedDomNodes = [];
      this.currentDomNodes = [];
      this.handleEl = (el) => {
        const { options } = this.context;
        const { generatorName } = this.props;
        if (!options.customRenderingReplaces || !hasCustomRenderingHandler(generatorName, options)) {
          this.updateElRef(el);
        }
      };
      this.updateElRef = (el) => {
        if (this.props.elRef) {
          setRef(this.props.elRef, el);
        }
      };
    }
    render() {
      const { props, context } = this;
      const { options } = context;
      const { customGenerator, defaultGenerator, renderProps } = props;
      const attrs = buildElAttrs(props, "", this.handleEl);
      let useDefault = false;
      let innerContent;
      let queuedDomNodes = [];
      let currentGeneratorMeta;
      if (customGenerator != null) {
        const customGeneratorRes = typeof customGenerator === "function" ? customGenerator(renderProps, _) : customGenerator;
        if (customGeneratorRes === true) {
          useDefault = true;
        } else {
          const isObject = customGeneratorRes && typeof customGeneratorRes === "object";
          if (isObject && "html" in customGeneratorRes) {
            attrs.dangerouslySetInnerHTML = {
              __html: customGeneratorRes.html
            };
          } else if (isObject && "domNodes" in customGeneratorRes) {
            queuedDomNodes = Array.prototype.slice.call(customGeneratorRes.domNodes);
          } else if (isObject ? t(customGeneratorRes) : typeof customGeneratorRes !== "function") {
            innerContent = customGeneratorRes;
          } else {
            currentGeneratorMeta = customGeneratorRes;
          }
        }
      } else {
        useDefault = !hasCustomRenderingHandler(props.generatorName, options);
      }
      if (useDefault && defaultGenerator) {
        innerContent = defaultGenerator(renderProps);
      }
      this.queuedDomNodes = queuedDomNodes;
      this.currentGeneratorMeta = currentGeneratorMeta;
      return _(props.tag, attrs, innerContent);
    }
    componentDidMount() {
      this.applyQueueudDomNodes();
      this.triggerCustomRendering(true);
    }
    componentDidUpdate() {
      this.applyQueueudDomNodes();
      this.triggerCustomRendering(true);
    }
    componentWillUnmount() {
      this.triggerCustomRendering(false);
    }
    triggerCustomRendering(isActive) {
      var _a2;
      const { props, context } = this;
      const { handleCustomRendering, customRenderingMetaMap } = context.options;
      if (handleCustomRendering) {
        const generatorMeta = (_a2 = this.currentGeneratorMeta) !== null && _a2 !== void 0 ? _a2 : customRenderingMetaMap === null || customRenderingMetaMap === void 0 ? void 0 : customRenderingMetaMap[props.generatorName];
        if (generatorMeta) {
          handleCustomRendering(Object.assign({
            id: this.id,
            isActive,
            containerEl: this.base,
            reportNewContainerEl: this.updateElRef,
            generatorMeta
          }, props));
        }
      }
    }
    applyQueueudDomNodes() {
      const { queuedDomNodes, currentDomNodes } = this;
      const el = this.base;
      if (!isArraysEqual(queuedDomNodes, currentDomNodes)) {
        for (const domNode of currentDomNodes) {
          domNode.remove();
        }
        for (let newNode of queuedDomNodes) {
          el.appendChild(newNode);
        }
        this.currentDomNodes = queuedDomNodes;
      }
    }
  }
  ContentInjector.addPropsEquality({
    renderProps: isPropsEqual,
    attrs: isNonHandlerPropsEqual,
    style: isPropsEqual
  });
  function hasCustomRenderingHandler(generatorName, options) {
    var _a2;
    return Boolean(options.handleCustomRendering && generatorName && ((_a2 = options.customRenderingMetaMap) === null || _a2 === void 0 ? void 0 : _a2[generatorName]));
  }
  function buildElAttrs(props, className, elRef) {
    const attrs = Object.assign(Object.assign({}, props.attrs), {
      ref: elRef
    });
    if (props.className || className) {
      attrs.className = joinClassNames(className, props.className, attrs.className);
    }
    if (props.style) {
      attrs.style = props.style;
    }
    return attrs;
  }
  const RenderId = createContext(0);
  class ContentContainer extends b {
    constructor() {
      super(...arguments);
      this.InnerContent = InnerContentInjector.bind(void 0, this);
      this.handleEl = (el) => {
        this.el = el;
        if (this.props.elRef) {
          setRef(this.props.elRef, el);
          if (el && this.didMountMisfire) {
            this.componentDidMount();
          }
        }
      };
    }
    render() {
      const { props } = this;
      const generatedClassName = generateClassName(props.classNameGenerator, props.renderProps);
      if (props.children) {
        const attrs = buildElAttrs(props, generatedClassName, this.handleEl);
        const children = props.children(this.InnerContent, props.renderProps, attrs);
        if (props.tag) {
          return _(props.tag, attrs, children);
        } else {
          return children;
        }
      } else {
        return _(ContentInjector, Object.assign(Object.assign({}, props), {
          elRef: this.handleEl,
          tag: props.tag || "div",
          className: joinClassNames(props.className, generatedClassName),
          renderId: this.context
        }));
      }
    }
    componentDidMount() {
      var _a2, _b2;
      if (this.el) {
        (_b2 = (_a2 = this.props).didMount) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, Object.assign(Object.assign({}, this.props.renderProps), {
          el: this.el
        }));
      } else {
        this.didMountMisfire = true;
      }
    }
    componentWillUnmount() {
      var _a2, _b2;
      (_b2 = (_a2 = this.props).willUnmount) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, Object.assign(Object.assign({}, this.props.renderProps), {
        el: this.el
      }));
    }
  }
  ContentContainer.contextType = RenderId;
  function InnerContentInjector(containerComponent, props) {
    const parentProps = containerComponent.props;
    return _(ContentInjector, Object.assign({
      renderProps: parentProps.renderProps,
      generatorName: parentProps.generatorName,
      customGenerator: parentProps.customGenerator,
      defaultGenerator: parentProps.defaultGenerator,
      renderId: containerComponent.context
    }, props));
  }
  function generateClassName(classNameGenerator, renderProps) {
    const classNames = typeof classNameGenerator === "function" ? classNameGenerator(renderProps) : classNameGenerator || [];
    return typeof classNames === "string" ? classNames : classNames.join(" ");
  }
  function renderText(renderProps) {
    return renderProps.text;
  }
  class ViewContainer extends BaseComponent {
    render() {
      let { props, context } = this;
      let { options } = context;
      let renderProps = {
        view: context.viewApi
      };
      return _(ContentContainer, Object.assign({}, props, {
        tag: props.tag || "div",
        attrs: props.attrs,
        className: joinClassNames(props.className, buildViewClassName(props.viewSpec)),
        renderProps,
        classNameGenerator: options.viewClassNames,
        generatorName: void 0,
        didMount: options.viewDidMount,
        willUnmount: options.viewWillUnmount
      }), () => props.children);
    }
  }
  function buildViewClassName(viewSpec) {
    return `fc-${viewSpec.type}-view fc-view`;
  }
  function parseRange(input, dateEnv) {
    let start = null;
    let end = null;
    if (input.start) {
      start = dateEnv.createMarker(input.start);
    }
    if (input.end) {
      end = dateEnv.createMarker(input.end);
    }
    if (!start && !end) {
      return null;
    }
    if (start && end && end < start) {
      return null;
    }
    return {
      start,
      end
    };
  }
  function invertRanges(ranges, constraintRange) {
    let invertedRanges = [];
    let { start } = constraintRange;
    let i2;
    let dateRange;
    ranges.sort(compareRanges);
    for (i2 = 0; i2 < ranges.length; i2 += 1) {
      dateRange = ranges[i2];
      if (dateRange.start > start) {
        invertedRanges.push({
          start,
          end: dateRange.start
        });
      }
      if (dateRange.end > start) {
        start = dateRange.end;
      }
    }
    if (start < constraintRange.end) {
      invertedRanges.push({
        start,
        end: constraintRange.end
      });
    }
    return invertedRanges;
  }
  function compareRanges(range0, range1) {
    return range0.start.valueOf() - range1.start.valueOf();
  }
  function intersectRanges(range0, range1) {
    let { start, end } = range0;
    let newRange = null;
    if (range1.start !== null) {
      if (start === null) {
        start = range1.start;
      } else {
        start = new Date(Math.max(start.valueOf(), range1.start.valueOf()));
      }
    }
    if (range1.end != null) {
      if (end === null) {
        end = range1.end;
      } else {
        end = new Date(Math.min(end.valueOf(), range1.end.valueOf()));
      }
    }
    if (start === null || end === null || start < end) {
      newRange = {
        start,
        end
      };
    }
    return newRange;
  }
  function rangesEqual(range0, range1) {
    return (range0.start === null ? null : range0.start.valueOf()) === (range1.start === null ? null : range1.start.valueOf()) && (range0.end === null ? null : range0.end.valueOf()) === (range1.end === null ? null : range1.end.valueOf());
  }
  function rangesIntersect(range0, range1) {
    return (range0.end === null || range1.start === null || range0.end > range1.start) && (range0.start === null || range1.end === null || range0.start < range1.end);
  }
  function rangeContainsRange(outerRange, innerRange) {
    return (outerRange.start === null || innerRange.start !== null && innerRange.start >= outerRange.start) && (outerRange.end === null || innerRange.end !== null && innerRange.end <= outerRange.end);
  }
  function rangeContainsMarker(range, date) {
    return (range.start === null || date >= range.start) && (range.end === null || date < range.end);
  }
  function constrainMarkerToRange(date, range) {
    if (range.start != null && date < range.start) {
      return range.start;
    }
    if (range.end != null && date >= range.end) {
      return new Date(range.end.valueOf() - 1);
    }
    return date;
  }
  function computeAlignedDayRange(timedRange) {
    let dayCnt = Math.floor(diffDays(timedRange.start, timedRange.end)) || 1;
    let start = startOfDay(timedRange.start);
    let end = addDays(start, dayCnt);
    return {
      start,
      end
    };
  }
  function computeVisibleDayRange(timedRange, nextDayThreshold = createDuration(0)) {
    let startDay = null;
    let endDay = null;
    if (timedRange.end) {
      endDay = startOfDay(timedRange.end);
      let endTimeMS = timedRange.end.valueOf() - endDay.valueOf();
      if (endTimeMS && endTimeMS >= asRoughMs(nextDayThreshold)) {
        endDay = addDays(endDay, 1);
      }
    }
    if (timedRange.start) {
      startDay = startOfDay(timedRange.start);
      if (endDay && endDay <= startDay) {
        endDay = addDays(startDay, 1);
      }
    }
    return {
      start: startDay,
      end: endDay
    };
  }
  function diffDates(date0, date1, dateEnv, largeUnit) {
    if (largeUnit === "year") {
      return createDuration(dateEnv.diffWholeYears(date0, date1), "year");
    }
    if (largeUnit === "month") {
      return createDuration(dateEnv.diffWholeMonths(date0, date1), "month");
    }
    return diffDayAndTime(date0, date1);
  }
  function reduceCurrentDate(currentDate, action) {
    switch (action.type) {
      case "CHANGE_DATE":
        return action.dateMarker;
      default:
        return currentDate;
    }
  }
  function getInitialDate(options, dateEnv) {
    let initialDateInput = options.initialDate;
    if (initialDateInput != null) {
      return dateEnv.createMarker(initialDateInput);
    }
    return getNow(options.now, dateEnv);
  }
  function getNow(nowInput, dateEnv) {
    if (typeof nowInput === "function") {
      nowInput = nowInput();
    }
    if (nowInput == null) {
      return dateEnv.createNowMarker();
    }
    return dateEnv.createMarker(nowInput);
  }
  class DateProfileGenerator {
    constructor(props) {
      this.props = props;
      this.nowDate = getNow(props.nowInput, props.dateEnv);
      this.initHiddenDays();
    }
    buildPrev(currentDateProfile, currentDate, forceToValid) {
      let { dateEnv } = this.props;
      let prevDate = dateEnv.subtract(dateEnv.startOf(currentDate, currentDateProfile.currentRangeUnit), currentDateProfile.dateIncrement);
      return this.build(prevDate, -1, forceToValid);
    }
    buildNext(currentDateProfile, currentDate, forceToValid) {
      let { dateEnv } = this.props;
      let nextDate = dateEnv.add(dateEnv.startOf(currentDate, currentDateProfile.currentRangeUnit), currentDateProfile.dateIncrement);
      return this.build(nextDate, 1, forceToValid);
    }
    build(currentDate, direction, forceToValid = true) {
      let { props } = this;
      let validRange;
      let currentInfo;
      let isRangeAllDay;
      let renderRange;
      let activeRange;
      let isValid;
      validRange = this.buildValidRange();
      validRange = this.trimHiddenDays(validRange);
      if (forceToValid) {
        currentDate = constrainMarkerToRange(currentDate, validRange);
      }
      currentInfo = this.buildCurrentRangeInfo(currentDate, direction);
      isRangeAllDay = /^(year|month|week|day)$/.test(currentInfo.unit);
      renderRange = this.buildRenderRange(this.trimHiddenDays(currentInfo.range), currentInfo.unit, isRangeAllDay);
      renderRange = this.trimHiddenDays(renderRange);
      activeRange = renderRange;
      if (!props.showNonCurrentDates) {
        activeRange = intersectRanges(activeRange, currentInfo.range);
      }
      activeRange = this.adjustActiveRange(activeRange);
      activeRange = intersectRanges(activeRange, validRange);
      isValid = rangesIntersect(currentInfo.range, validRange);
      if (!rangeContainsMarker(renderRange, currentDate)) {
        currentDate = renderRange.start;
      }
      return {
        currentDate,
        validRange,
        currentRange: currentInfo.range,
        currentRangeUnit: currentInfo.unit,
        isRangeAllDay,
        activeRange,
        renderRange,
        slotMinTime: props.slotMinTime,
        slotMaxTime: props.slotMaxTime,
        isValid,
        dateIncrement: this.buildDateIncrement(currentInfo.duration)
      };
    }
    buildValidRange() {
      let input = this.props.validRangeInput;
      let simpleInput = typeof input === "function" ? input.call(this.props.calendarApi, this.nowDate) : input;
      return this.refineRange(simpleInput) || {
        start: null,
        end: null
      };
    }
    buildCurrentRangeInfo(date, direction) {
      let { props } = this;
      let duration = null;
      let unit = null;
      let range = null;
      let dayCount;
      if (props.duration) {
        duration = props.duration;
        unit = props.durationUnit;
        range = this.buildRangeFromDuration(date, direction, duration, unit);
      } else if (dayCount = this.props.dayCount) {
        unit = "day";
        range = this.buildRangeFromDayCount(date, direction, dayCount);
      } else if (range = this.buildCustomVisibleRange(date)) {
        unit = props.dateEnv.greatestWholeUnit(range.start, range.end).unit;
      } else {
        duration = this.getFallbackDuration();
        unit = greatestDurationDenominator(duration).unit;
        range = this.buildRangeFromDuration(date, direction, duration, unit);
      }
      return {
        duration,
        unit,
        range
      };
    }
    getFallbackDuration() {
      return createDuration({
        day: 1
      });
    }
    adjustActiveRange(range) {
      let { dateEnv, usesMinMaxTime, slotMinTime, slotMaxTime } = this.props;
      let { start, end } = range;
      if (usesMinMaxTime) {
        if (asRoughDays(slotMinTime) < 0) {
          start = startOfDay(start);
          start = dateEnv.add(start, slotMinTime);
        }
        if (asRoughDays(slotMaxTime) > 1) {
          end = startOfDay(end);
          end = addDays(end, -1);
          end = dateEnv.add(end, slotMaxTime);
        }
      }
      return {
        start,
        end
      };
    }
    buildRangeFromDuration(date, direction, duration, unit) {
      let { dateEnv, dateAlignment } = this.props;
      let start;
      let end;
      let res;
      if (!dateAlignment) {
        let { dateIncrement } = this.props;
        if (dateIncrement) {
          if (asRoughMs(dateIncrement) < asRoughMs(duration)) {
            dateAlignment = greatestDurationDenominator(dateIncrement).unit;
          } else {
            dateAlignment = unit;
          }
        } else {
          dateAlignment = unit;
        }
      }
      if (asRoughDays(duration) <= 1) {
        if (this.isHiddenDay(start)) {
          start = this.skipHiddenDays(start, direction);
          start = startOfDay(start);
        }
      }
      function computeRes() {
        start = dateEnv.startOf(date, dateAlignment);
        end = dateEnv.add(start, duration);
        res = {
          start,
          end
        };
      }
      computeRes();
      if (!this.trimHiddenDays(res)) {
        date = this.skipHiddenDays(date, direction);
        computeRes();
      }
      return res;
    }
    buildRangeFromDayCount(date, direction, dayCount) {
      let { dateEnv, dateAlignment } = this.props;
      let runningCount = 0;
      let start = date;
      let end;
      if (dateAlignment) {
        start = dateEnv.startOf(start, dateAlignment);
      }
      start = startOfDay(start);
      start = this.skipHiddenDays(start, direction);
      end = start;
      do {
        end = addDays(end, 1);
        if (!this.isHiddenDay(end)) {
          runningCount += 1;
        }
      } while (runningCount < dayCount);
      return {
        start,
        end
      };
    }
    buildCustomVisibleRange(date) {
      let { props } = this;
      let input = props.visibleRangeInput;
      let simpleInput = typeof input === "function" ? input.call(props.calendarApi, props.dateEnv.toDate(date)) : input;
      let range = this.refineRange(simpleInput);
      if (range && (range.start == null || range.end == null)) {
        return null;
      }
      return range;
    }
    buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay) {
      return currentRange;
    }
    buildDateIncrement(fallback) {
      let { dateIncrement } = this.props;
      let customAlignment;
      if (dateIncrement) {
        return dateIncrement;
      }
      if (customAlignment = this.props.dateAlignment) {
        return createDuration(1, customAlignment);
      }
      if (fallback) {
        return fallback;
      }
      return createDuration({
        days: 1
      });
    }
    refineRange(rangeInput) {
      if (rangeInput) {
        let range = parseRange(rangeInput, this.props.dateEnv);
        if (range) {
          range = computeVisibleDayRange(range);
        }
        return range;
      }
      return null;
    }
    initHiddenDays() {
      let hiddenDays = this.props.hiddenDays || [];
      let isHiddenDayHash = [];
      let dayCnt = 0;
      let i2;
      if (this.props.weekends === false) {
        hiddenDays.push(0, 6);
      }
      for (i2 = 0; i2 < 7; i2 += 1) {
        if (!(isHiddenDayHash[i2] = hiddenDays.indexOf(i2) !== -1)) {
          dayCnt += 1;
        }
      }
      if (!dayCnt) {
        throw new Error("invalid hiddenDays");
      }
      this.isHiddenDayHash = isHiddenDayHash;
    }
    trimHiddenDays(range) {
      let { start, end } = range;
      if (start) {
        start = this.skipHiddenDays(start);
      }
      if (end) {
        end = this.skipHiddenDays(end, -1, true);
      }
      if (start == null || end == null || start < end) {
        return {
          start,
          end
        };
      }
      return null;
    }
    isHiddenDay(day) {
      if (day instanceof Date) {
        day = day.getUTCDay();
      }
      return this.isHiddenDayHash[day];
    }
    skipHiddenDays(date, inc = 1, isExclusive = false) {
      while (this.isHiddenDayHash[(date.getUTCDay() + (isExclusive ? inc : 0) + 7) % 7]) {
        date = addDays(date, inc);
      }
      return date;
    }
  }
  function createEventInstance(defId, range, forcedStartTzo, forcedEndTzo) {
    return {
      instanceId: guid$1(),
      defId,
      range,
      forcedStartTzo: forcedStartTzo == null ? null : forcedStartTzo,
      forcedEndTzo: forcedEndTzo == null ? null : forcedEndTzo
    };
  }
  function parseRecurring(refined, defaultAllDay, dateEnv, recurringTypes) {
    for (let i2 = 0; i2 < recurringTypes.length; i2 += 1) {
      let parsed = recurringTypes[i2].parse(refined, dateEnv);
      if (parsed) {
        let { allDay } = refined;
        if (allDay == null) {
          allDay = defaultAllDay;
          if (allDay == null) {
            allDay = parsed.allDayGuess;
            if (allDay == null) {
              allDay = false;
            }
          }
        }
        return {
          allDay,
          duration: parsed.duration,
          typeData: parsed.typeData,
          typeId: i2
        };
      }
    }
    return null;
  }
  function expandRecurring(eventStore, framingRange, context) {
    let { dateEnv, pluginHooks, options } = context;
    let { defs, instances } = eventStore;
    instances = filterHash(instances, (instance) => !defs[instance.defId].recurringDef);
    for (let defId in defs) {
      let def = defs[defId];
      if (def.recurringDef) {
        let { duration } = def.recurringDef;
        if (!duration) {
          duration = def.allDay ? options.defaultAllDayEventDuration : options.defaultTimedEventDuration;
        }
        let starts = expandRecurringRanges(def, duration, framingRange, dateEnv, pluginHooks.recurringTypes);
        for (let start of starts) {
          let instance = createEventInstance(defId, {
            start,
            end: dateEnv.add(start, duration)
          });
          instances[instance.instanceId] = instance;
        }
      }
    }
    return {
      defs,
      instances
    };
  }
  function expandRecurringRanges(eventDef, duration, framingRange, dateEnv, recurringTypes) {
    let typeDef = recurringTypes[eventDef.recurringDef.typeId];
    let markers = typeDef.expand(eventDef.recurringDef.typeData, {
      start: dateEnv.subtract(framingRange.start, duration),
      end: framingRange.end
    }, dateEnv);
    if (eventDef.allDay) {
      markers = markers.map(startOfDay);
    }
    return markers;
  }
  const EVENT_NON_DATE_REFINERS = {
    id: String,
    groupId: String,
    title: String,
    url: String,
    interactive: Boolean
  };
  const EVENT_DATE_REFINERS = {
    start: identity,
    end: identity,
    date: identity,
    allDay: Boolean
  };
  const EVENT_REFINERS = Object.assign(Object.assign(Object.assign({}, EVENT_NON_DATE_REFINERS), EVENT_DATE_REFINERS), {
    extendedProps: identity
  });
  function parseEvent(raw, eventSource, context, allowOpenRange, refiners = buildEventRefiners(context), defIdMap, instanceIdMap) {
    let { refined, extra } = refineEventDef(raw, context, refiners);
    let defaultAllDay = computeIsDefaultAllDay(eventSource, context);
    let recurringRes = parseRecurring(refined, defaultAllDay, context.dateEnv, context.pluginHooks.recurringTypes);
    if (recurringRes) {
      let def = parseEventDef(refined, extra, eventSource ? eventSource.sourceId : "", recurringRes.allDay, Boolean(recurringRes.duration), context, defIdMap);
      def.recurringDef = {
        typeId: recurringRes.typeId,
        typeData: recurringRes.typeData,
        duration: recurringRes.duration
      };
      return {
        def,
        instance: null
      };
    }
    let singleRes = parseSingle(refined, defaultAllDay, context, allowOpenRange);
    if (singleRes) {
      let def = parseEventDef(refined, extra, eventSource ? eventSource.sourceId : "", singleRes.allDay, singleRes.hasEnd, context, defIdMap);
      let instance = createEventInstance(def.defId, singleRes.range, singleRes.forcedStartTzo, singleRes.forcedEndTzo);
      if (instanceIdMap && def.publicId && instanceIdMap[def.publicId]) {
        instance.instanceId = instanceIdMap[def.publicId];
      }
      return {
        def,
        instance
      };
    }
    return null;
  }
  function refineEventDef(raw, context, refiners = buildEventRefiners(context)) {
    return refineProps(raw, refiners);
  }
  function buildEventRefiners(context) {
    return Object.assign(Object.assign(Object.assign({}, EVENT_UI_REFINERS), EVENT_REFINERS), context.pluginHooks.eventRefiners);
  }
  function parseEventDef(refined, extra, sourceId, allDay, hasEnd, context, defIdMap) {
    let def = {
      title: refined.title || "",
      groupId: refined.groupId || "",
      publicId: refined.id || "",
      url: refined.url || "",
      recurringDef: null,
      defId: (defIdMap && refined.id ? defIdMap[refined.id] : "") || guid$1(),
      sourceId,
      allDay,
      hasEnd,
      interactive: refined.interactive,
      ui: createEventUi(refined, context),
      extendedProps: Object.assign(Object.assign({}, refined.extendedProps || {}), extra)
    };
    for (let memberAdder of context.pluginHooks.eventDefMemberAdders) {
      Object.assign(def, memberAdder(refined));
    }
    Object.freeze(def.ui.classNames);
    Object.freeze(def.extendedProps);
    return def;
  }
  function parseSingle(refined, defaultAllDay, context, allowOpenRange) {
    let { allDay } = refined;
    let startMeta;
    let startMarker = null;
    let hasEnd = false;
    let endMeta;
    let endMarker = null;
    let startInput = refined.start != null ? refined.start : refined.date;
    startMeta = context.dateEnv.createMarkerMeta(startInput);
    if (startMeta) {
      startMarker = startMeta.marker;
    } else if (!allowOpenRange) {
      return null;
    }
    if (refined.end != null) {
      endMeta = context.dateEnv.createMarkerMeta(refined.end);
    }
    if (allDay == null) {
      if (defaultAllDay != null) {
        allDay = defaultAllDay;
      } else {
        allDay = (!startMeta || startMeta.isTimeUnspecified) && (!endMeta || endMeta.isTimeUnspecified);
      }
    }
    if (allDay && startMarker) {
      startMarker = startOfDay(startMarker);
    }
    if (endMeta) {
      endMarker = endMeta.marker;
      if (allDay) {
        endMarker = startOfDay(endMarker);
      }
      if (startMarker && endMarker <= startMarker) {
        endMarker = null;
      }
    }
    if (endMarker) {
      hasEnd = true;
    } else if (!allowOpenRange) {
      hasEnd = context.options.forceEventDuration || false;
      endMarker = context.dateEnv.add(startMarker, allDay ? context.options.defaultAllDayEventDuration : context.options.defaultTimedEventDuration);
    }
    return {
      allDay,
      hasEnd,
      range: {
        start: startMarker,
        end: endMarker
      },
      forcedStartTzo: startMeta ? startMeta.forcedTzo : null,
      forcedEndTzo: endMeta ? endMeta.forcedTzo : null
    };
  }
  function computeIsDefaultAllDay(eventSource, context) {
    let res = null;
    if (eventSource) {
      res = eventSource.defaultAllDay;
    }
    if (res == null) {
      res = context.options.defaultAllDay;
    }
    return res;
  }
  function parseEvents(rawEvents, eventSource, context, allowOpenRange, defIdMap, instanceIdMap) {
    let eventStore = createEmptyEventStore();
    let eventRefiners = buildEventRefiners(context);
    for (let rawEvent of rawEvents) {
      let tuple = parseEvent(rawEvent, eventSource, context, allowOpenRange, eventRefiners, defIdMap, instanceIdMap);
      if (tuple) {
        eventTupleToStore(tuple, eventStore);
      }
    }
    return eventStore;
  }
  function eventTupleToStore(tuple, eventStore = createEmptyEventStore()) {
    eventStore.defs[tuple.def.defId] = tuple.def;
    if (tuple.instance) {
      eventStore.instances[tuple.instance.instanceId] = tuple.instance;
    }
    return eventStore;
  }
  function getRelevantEvents(eventStore, instanceId) {
    let instance = eventStore.instances[instanceId];
    if (instance) {
      let def = eventStore.defs[instance.defId];
      let newStore = filterEventStoreDefs(eventStore, (lookDef) => isEventDefsGrouped(def, lookDef));
      newStore.defs[def.defId] = def;
      newStore.instances[instance.instanceId] = instance;
      return newStore;
    }
    return createEmptyEventStore();
  }
  function isEventDefsGrouped(def0, def1) {
    return Boolean(def0.groupId && def0.groupId === def1.groupId);
  }
  function createEmptyEventStore() {
    return {
      defs: {},
      instances: {}
    };
  }
  function mergeEventStores(store0, store1) {
    return {
      defs: Object.assign(Object.assign({}, store0.defs), store1.defs),
      instances: Object.assign(Object.assign({}, store0.instances), store1.instances)
    };
  }
  function filterEventStoreDefs(eventStore, filterFunc) {
    let defs = filterHash(eventStore.defs, filterFunc);
    let instances = filterHash(eventStore.instances, (instance) => defs[instance.defId]);
    return {
      defs,
      instances
    };
  }
  function excludeSubEventStore(master, sub) {
    let { defs, instances } = master;
    let filteredDefs = {};
    let filteredInstances = {};
    for (let defId in defs) {
      if (!sub.defs[defId]) {
        filteredDefs[defId] = defs[defId];
      }
    }
    for (let instanceId in instances) {
      if (!sub.instances[instanceId] && filteredDefs[instances[instanceId].defId]) {
        filteredInstances[instanceId] = instances[instanceId];
      }
    }
    return {
      defs: filteredDefs,
      instances: filteredInstances
    };
  }
  function normalizeConstraint(input, context) {
    if (Array.isArray(input)) {
      return parseEvents(input, null, context, true);
    }
    if (typeof input === "object" && input) {
      return parseEvents([
        input
      ], null, context, true);
    }
    if (input != null) {
      return String(input);
    }
    return null;
  }
  const EVENT_UI_REFINERS = {
    display: String,
    editable: Boolean,
    startEditable: Boolean,
    durationEditable: Boolean,
    constraint: identity,
    overlap: identity,
    allow: identity,
    className: parseClassNames,
    classNames: parseClassNames,
    color: String,
    backgroundColor: String,
    borderColor: String,
    textColor: String
  };
  const EMPTY_EVENT_UI = {
    display: null,
    startEditable: null,
    durationEditable: null,
    constraints: [],
    overlap: null,
    allows: [],
    backgroundColor: "",
    borderColor: "",
    textColor: "",
    classNames: []
  };
  function createEventUi(refined, context) {
    let constraint = normalizeConstraint(refined.constraint, context);
    return {
      display: refined.display || null,
      startEditable: refined.startEditable != null ? refined.startEditable : refined.editable,
      durationEditable: refined.durationEditable != null ? refined.durationEditable : refined.editable,
      constraints: constraint != null ? [
        constraint
      ] : [],
      overlap: refined.overlap != null ? refined.overlap : null,
      allows: refined.allow != null ? [
        refined.allow
      ] : [],
      backgroundColor: refined.backgroundColor || refined.color || "",
      borderColor: refined.borderColor || refined.color || "",
      textColor: refined.textColor || "",
      classNames: (refined.className || []).concat(refined.classNames || [])
    };
  }
  function combineEventUis(uis) {
    return uis.reduce(combineTwoEventUis, EMPTY_EVENT_UI);
  }
  function combineTwoEventUis(item0, item1) {
    return {
      display: item1.display != null ? item1.display : item0.display,
      startEditable: item1.startEditable != null ? item1.startEditable : item0.startEditable,
      durationEditable: item1.durationEditable != null ? item1.durationEditable : item0.durationEditable,
      constraints: item0.constraints.concat(item1.constraints),
      overlap: typeof item1.overlap === "boolean" ? item1.overlap : item0.overlap,
      allows: item0.allows.concat(item1.allows),
      backgroundColor: item1.backgroundColor || item0.backgroundColor,
      borderColor: item1.borderColor || item0.borderColor,
      textColor: item1.textColor || item0.textColor,
      classNames: item0.classNames.concat(item1.classNames)
    };
  }
  const EVENT_SOURCE_REFINERS = {
    id: String,
    defaultAllDay: Boolean,
    url: String,
    format: String,
    events: identity,
    eventDataTransform: identity,
    success: identity,
    failure: identity
  };
  function parseEventSource(raw, context, refiners = buildEventSourceRefiners(context)) {
    let rawObj;
    if (typeof raw === "string") {
      rawObj = {
        url: raw
      };
    } else if (typeof raw === "function" || Array.isArray(raw)) {
      rawObj = {
        events: raw
      };
    } else if (typeof raw === "object" && raw) {
      rawObj = raw;
    }
    if (rawObj) {
      let { refined, extra } = refineProps(rawObj, refiners);
      let metaRes = buildEventSourceMeta(refined, context);
      if (metaRes) {
        return {
          _raw: raw,
          isFetching: false,
          latestFetchId: "",
          fetchRange: null,
          defaultAllDay: refined.defaultAllDay,
          eventDataTransform: refined.eventDataTransform,
          success: refined.success,
          failure: refined.failure,
          publicId: refined.id || "",
          sourceId: guid$1(),
          sourceDefId: metaRes.sourceDefId,
          meta: metaRes.meta,
          ui: createEventUi(refined, context),
          extendedProps: extra
        };
      }
    }
    return null;
  }
  function buildEventSourceRefiners(context) {
    return Object.assign(Object.assign(Object.assign({}, EVENT_UI_REFINERS), EVENT_SOURCE_REFINERS), context.pluginHooks.eventSourceRefiners);
  }
  function buildEventSourceMeta(raw, context) {
    let defs = context.pluginHooks.eventSourceDefs;
    for (let i2 = defs.length - 1; i2 >= 0; i2 -= 1) {
      let def = defs[i2];
      let meta = def.parseMeta(raw);
      if (meta) {
        return {
          sourceDefId: i2,
          meta
        };
      }
    }
    return null;
  }
  function reduceEventStore(eventStore, action, eventSources, dateProfile, context) {
    switch (action.type) {
      case "RECEIVE_EVENTS":
        return receiveRawEvents(eventStore, eventSources[action.sourceId], action.fetchId, action.fetchRange, action.rawEvents, context);
      case "RESET_RAW_EVENTS":
        return resetRawEvents(eventStore, eventSources[action.sourceId], action.rawEvents, dateProfile.activeRange, context);
      case "ADD_EVENTS":
        return addEvent(eventStore, action.eventStore, dateProfile ? dateProfile.activeRange : null, context);
      case "RESET_EVENTS":
        return action.eventStore;
      case "MERGE_EVENTS":
        return mergeEventStores(eventStore, action.eventStore);
      case "PREV":
      case "NEXT":
      case "CHANGE_DATE":
      case "CHANGE_VIEW_TYPE":
        if (dateProfile) {
          return expandRecurring(eventStore, dateProfile.activeRange, context);
        }
        return eventStore;
      case "REMOVE_EVENTS":
        return excludeSubEventStore(eventStore, action.eventStore);
      case "REMOVE_EVENT_SOURCE":
        return excludeEventsBySourceId(eventStore, action.sourceId);
      case "REMOVE_ALL_EVENT_SOURCES":
        return filterEventStoreDefs(eventStore, (eventDef) => !eventDef.sourceId);
      case "REMOVE_ALL_EVENTS":
        return createEmptyEventStore();
      default:
        return eventStore;
    }
  }
  function receiveRawEvents(eventStore, eventSource, fetchId, fetchRange, rawEvents, context) {
    if (eventSource && fetchId === eventSource.latestFetchId) {
      let subset = parseEvents(transformRawEvents(rawEvents, eventSource, context), eventSource, context);
      if (fetchRange) {
        subset = expandRecurring(subset, fetchRange, context);
      }
      return mergeEventStores(excludeEventsBySourceId(eventStore, eventSource.sourceId), subset);
    }
    return eventStore;
  }
  function resetRawEvents(existingEventStore, eventSource, rawEvents, activeRange, context) {
    const { defIdMap, instanceIdMap } = buildPublicIdMaps(existingEventStore);
    let newEventStore = parseEvents(transformRawEvents(rawEvents, eventSource, context), eventSource, context, false, defIdMap, instanceIdMap);
    return expandRecurring(newEventStore, activeRange, context);
  }
  function transformRawEvents(rawEvents, eventSource, context) {
    let calEachTransform = context.options.eventDataTransform;
    let sourceEachTransform = eventSource ? eventSource.eventDataTransform : null;
    if (sourceEachTransform) {
      rawEvents = transformEachRawEvent(rawEvents, sourceEachTransform);
    }
    if (calEachTransform) {
      rawEvents = transformEachRawEvent(rawEvents, calEachTransform);
    }
    return rawEvents;
  }
  function transformEachRawEvent(rawEvents, func) {
    let refinedEvents;
    if (!func) {
      refinedEvents = rawEvents;
    } else {
      refinedEvents = [];
      for (let rawEvent of rawEvents) {
        let refinedEvent = func(rawEvent);
        if (refinedEvent) {
          refinedEvents.push(refinedEvent);
        } else if (refinedEvent == null) {
          refinedEvents.push(rawEvent);
        }
      }
    }
    return refinedEvents;
  }
  function addEvent(eventStore, subset, expandRange, context) {
    if (expandRange) {
      subset = expandRecurring(subset, expandRange, context);
    }
    return mergeEventStores(eventStore, subset);
  }
  function rezoneEventStoreDates(eventStore, oldDateEnv, newDateEnv) {
    let { defs } = eventStore;
    let instances = mapHash(eventStore.instances, (instance) => {
      let def = defs[instance.defId];
      if (def.allDay) {
        return instance;
      }
      return Object.assign(Object.assign({}, instance), {
        range: {
          start: newDateEnv.createMarker(oldDateEnv.toDate(instance.range.start, instance.forcedStartTzo)),
          end: newDateEnv.createMarker(oldDateEnv.toDate(instance.range.end, instance.forcedEndTzo))
        },
        forcedStartTzo: newDateEnv.canComputeOffset ? null : instance.forcedStartTzo,
        forcedEndTzo: newDateEnv.canComputeOffset ? null : instance.forcedEndTzo
      });
    });
    return {
      defs,
      instances
    };
  }
  function excludeEventsBySourceId(eventStore, sourceId) {
    return filterEventStoreDefs(eventStore, (eventDef) => eventDef.sourceId !== sourceId);
  }
  function excludeInstances(eventStore, removals) {
    return {
      defs: eventStore.defs,
      instances: filterHash(eventStore.instances, (instance) => !removals[instance.instanceId])
    };
  }
  function buildPublicIdMaps(eventStore) {
    const { defs, instances } = eventStore;
    const defIdMap = {};
    const instanceIdMap = {};
    for (let defId in defs) {
      const def = defs[defId];
      const { publicId } = def;
      if (publicId) {
        defIdMap[publicId] = defId;
      }
    }
    for (let instanceId in instances) {
      const instance = instances[instanceId];
      const def = defs[instance.defId];
      const { publicId } = def;
      if (publicId) {
        instanceIdMap[publicId] = instanceId;
      }
    }
    return {
      defIdMap,
      instanceIdMap
    };
  }
  class Emitter {
    constructor() {
      this.handlers = {};
      this.thisContext = null;
    }
    setThisContext(thisContext) {
      this.thisContext = thisContext;
    }
    setOptions(options) {
      this.options = options;
    }
    on(type, handler) {
      addToHash(this.handlers, type, handler);
    }
    off(type, handler) {
      removeFromHash(this.handlers, type, handler);
    }
    trigger(type, ...args) {
      let attachedHandlers = this.handlers[type] || [];
      let optionHandler = this.options && this.options[type];
      let handlers = [].concat(optionHandler || [], attachedHandlers);
      for (let handler of handlers) {
        handler.apply(this.thisContext, args);
      }
    }
    hasHandlers(type) {
      return Boolean(this.handlers[type] && this.handlers[type].length || this.options && this.options[type]);
    }
  }
  function addToHash(hash, type, handler) {
    (hash[type] || (hash[type] = [])).push(handler);
  }
  function removeFromHash(hash, type, handler) {
    if (handler) {
      if (hash[type]) {
        hash[type] = hash[type].filter((func) => func !== handler);
      }
    } else {
      delete hash[type];
    }
  }
  const DEF_DEFAULTS = {
    startTime: "09:00",
    endTime: "17:00",
    daysOfWeek: [
      1,
      2,
      3,
      4,
      5
    ],
    display: "inverse-background",
    classNames: "fc-non-business",
    groupId: "_businessHours"
  };
  function parseBusinessHours(input, context) {
    return parseEvents(refineInputs(input), null, context);
  }
  function refineInputs(input) {
    let rawDefs;
    if (input === true) {
      rawDefs = [
        {}
      ];
    } else if (Array.isArray(input)) {
      rawDefs = input.filter((rawDef) => rawDef.daysOfWeek);
    } else if (typeof input === "object" && input) {
      rawDefs = [
        input
      ];
    } else {
      rawDefs = [];
    }
    rawDefs = rawDefs.map((rawDef) => Object.assign(Object.assign({}, DEF_DEFAULTS), rawDef));
    return rawDefs;
  }
  function triggerDateSelect(selection, pev, context) {
    context.emitter.trigger("select", Object.assign(Object.assign({}, buildDateSpanApiWithContext(selection, context)), {
      jsEvent: pev ? pev.origEvent : null,
      view: context.viewApi || context.calendarApi.view
    }));
  }
  function triggerDateUnselect(pev, context) {
    context.emitter.trigger("unselect", {
      jsEvent: pev ? pev.origEvent : null,
      view: context.viewApi || context.calendarApi.view
    });
  }
  function buildDateSpanApiWithContext(dateSpan, context) {
    let props = {};
    for (let transform of context.pluginHooks.dateSpanTransforms) {
      Object.assign(props, transform(dateSpan, context));
    }
    Object.assign(props, buildDateSpanApi(dateSpan, context.dateEnv));
    return props;
  }
  function getDefaultEventEnd(allDay, marker, context) {
    let { dateEnv, options } = context;
    let end = marker;
    if (allDay) {
      end = startOfDay(end);
      end = dateEnv.add(end, options.defaultAllDayEventDuration);
    } else {
      end = dateEnv.add(end, options.defaultTimedEventDuration);
    }
    return end;
  }
  function applyMutationToEventStore(eventStore, eventConfigBase, mutation, context) {
    let eventConfigs = compileEventUis(eventStore.defs, eventConfigBase);
    let dest = createEmptyEventStore();
    for (let defId in eventStore.defs) {
      let def = eventStore.defs[defId];
      dest.defs[defId] = applyMutationToEventDef(def, eventConfigs[defId], mutation, context);
    }
    for (let instanceId in eventStore.instances) {
      let instance = eventStore.instances[instanceId];
      let def = dest.defs[instance.defId];
      dest.instances[instanceId] = applyMutationToEventInstance(instance, def, eventConfigs[instance.defId], mutation, context);
    }
    return dest;
  }
  function applyMutationToEventDef(eventDef, eventConfig, mutation, context) {
    let standardProps = mutation.standardProps || {};
    if (standardProps.hasEnd == null && eventConfig.durationEditable && (mutation.startDelta || mutation.endDelta)) {
      standardProps.hasEnd = true;
    }
    let copy = Object.assign(Object.assign(Object.assign({}, eventDef), standardProps), {
      ui: Object.assign(Object.assign({}, eventDef.ui), standardProps.ui)
    });
    if (mutation.extendedProps) {
      copy.extendedProps = Object.assign(Object.assign({}, copy.extendedProps), mutation.extendedProps);
    }
    for (let applier of context.pluginHooks.eventDefMutationAppliers) {
      applier(copy, mutation, context);
    }
    if (!copy.hasEnd && context.options.forceEventDuration) {
      copy.hasEnd = true;
    }
    return copy;
  }
  function applyMutationToEventInstance(eventInstance, eventDef, eventConfig, mutation, context) {
    let { dateEnv } = context;
    let forceAllDay = mutation.standardProps && mutation.standardProps.allDay === true;
    let clearEnd = mutation.standardProps && mutation.standardProps.hasEnd === false;
    let copy = Object.assign({}, eventInstance);
    if (forceAllDay) {
      copy.range = computeAlignedDayRange(copy.range);
    }
    if (mutation.datesDelta && eventConfig.startEditable) {
      copy.range = {
        start: dateEnv.add(copy.range.start, mutation.datesDelta),
        end: dateEnv.add(copy.range.end, mutation.datesDelta)
      };
    }
    if (mutation.startDelta && eventConfig.durationEditable) {
      copy.range = {
        start: dateEnv.add(copy.range.start, mutation.startDelta),
        end: copy.range.end
      };
    }
    if (mutation.endDelta && eventConfig.durationEditable) {
      copy.range = {
        start: copy.range.start,
        end: dateEnv.add(copy.range.end, mutation.endDelta)
      };
    }
    if (clearEnd) {
      copy.range = {
        start: copy.range.start,
        end: getDefaultEventEnd(eventDef.allDay, copy.range.start, context)
      };
    }
    if (eventDef.allDay) {
      copy.range = {
        start: startOfDay(copy.range.start),
        end: startOfDay(copy.range.end)
      };
    }
    if (copy.range.end < copy.range.start) {
      copy.range.end = getDefaultEventEnd(eventDef.allDay, copy.range.start, context);
    }
    return copy;
  }
  class EventSourceImpl {
    constructor(context, internalEventSource) {
      this.context = context;
      this.internalEventSource = internalEventSource;
    }
    remove() {
      this.context.dispatch({
        type: "REMOVE_EVENT_SOURCE",
        sourceId: this.internalEventSource.sourceId
      });
    }
    refetch() {
      this.context.dispatch({
        type: "FETCH_EVENT_SOURCES",
        sourceIds: [
          this.internalEventSource.sourceId
        ],
        isRefetch: true
      });
    }
    get id() {
      return this.internalEventSource.publicId;
    }
    get url() {
      return this.internalEventSource.meta.url;
    }
    get format() {
      return this.internalEventSource.meta.format;
    }
  }
  class EventImpl {
    constructor(context, def, instance) {
      this._context = context;
      this._def = def;
      this._instance = instance || null;
    }
    setProp(name, val) {
      if (name in EVENT_DATE_REFINERS) {
        console.warn("Could not set date-related prop 'name'. Use one of the date-related methods instead.");
      } else if (name === "id") {
        val = EVENT_NON_DATE_REFINERS[name](val);
        this.mutate({
          standardProps: {
            publicId: val
          }
        });
      } else if (name in EVENT_NON_DATE_REFINERS) {
        val = EVENT_NON_DATE_REFINERS[name](val);
        this.mutate({
          standardProps: {
            [name]: val
          }
        });
      } else if (name in EVENT_UI_REFINERS) {
        let ui = EVENT_UI_REFINERS[name](val);
        if (name === "color") {
          ui = {
            backgroundColor: val,
            borderColor: val
          };
        } else if (name === "editable") {
          ui = {
            startEditable: val,
            durationEditable: val
          };
        } else {
          ui = {
            [name]: val
          };
        }
        this.mutate({
          standardProps: {
            ui
          }
        });
      } else {
        console.warn(`Could not set prop '${name}'. Use setExtendedProp instead.`);
      }
    }
    setExtendedProp(name, val) {
      this.mutate({
        extendedProps: {
          [name]: val
        }
      });
    }
    setStart(startInput, options = {}) {
      let { dateEnv } = this._context;
      let start = dateEnv.createMarker(startInput);
      if (start && this._instance) {
        let instanceRange = this._instance.range;
        let startDelta = diffDates(instanceRange.start, start, dateEnv, options.granularity);
        if (options.maintainDuration) {
          this.mutate({
            datesDelta: startDelta
          });
        } else {
          this.mutate({
            startDelta
          });
        }
      }
    }
    setEnd(endInput, options = {}) {
      let { dateEnv } = this._context;
      let end;
      if (endInput != null) {
        end = dateEnv.createMarker(endInput);
        if (!end) {
          return;
        }
      }
      if (this._instance) {
        if (end) {
          let endDelta = diffDates(this._instance.range.end, end, dateEnv, options.granularity);
          this.mutate({
            endDelta
          });
        } else {
          this.mutate({
            standardProps: {
              hasEnd: false
            }
          });
        }
      }
    }
    setDates(startInput, endInput, options = {}) {
      let { dateEnv } = this._context;
      let standardProps = {
        allDay: options.allDay
      };
      let start = dateEnv.createMarker(startInput);
      let end;
      if (!start) {
        return;
      }
      if (endInput != null) {
        end = dateEnv.createMarker(endInput);
        if (!end) {
          return;
        }
      }
      if (this._instance) {
        let instanceRange = this._instance.range;
        if (options.allDay === true) {
          instanceRange = computeAlignedDayRange(instanceRange);
        }
        let startDelta = diffDates(instanceRange.start, start, dateEnv, options.granularity);
        if (end) {
          let endDelta = diffDates(instanceRange.end, end, dateEnv, options.granularity);
          if (durationsEqual(startDelta, endDelta)) {
            this.mutate({
              datesDelta: startDelta,
              standardProps
            });
          } else {
            this.mutate({
              startDelta,
              endDelta,
              standardProps
            });
          }
        } else {
          standardProps.hasEnd = false;
          this.mutate({
            datesDelta: startDelta,
            standardProps
          });
        }
      }
    }
    moveStart(deltaInput) {
      let delta = createDuration(deltaInput);
      if (delta) {
        this.mutate({
          startDelta: delta
        });
      }
    }
    moveEnd(deltaInput) {
      let delta = createDuration(deltaInput);
      if (delta) {
        this.mutate({
          endDelta: delta
        });
      }
    }
    moveDates(deltaInput) {
      let delta = createDuration(deltaInput);
      if (delta) {
        this.mutate({
          datesDelta: delta
        });
      }
    }
    setAllDay(allDay, options = {}) {
      let standardProps = {
        allDay
      };
      let { maintainDuration } = options;
      if (maintainDuration == null) {
        maintainDuration = this._context.options.allDayMaintainDuration;
      }
      if (this._def.allDay !== allDay) {
        standardProps.hasEnd = maintainDuration;
      }
      this.mutate({
        standardProps
      });
    }
    formatRange(formatInput) {
      let { dateEnv } = this._context;
      let instance = this._instance;
      let formatter = createFormatter(formatInput);
      if (this._def.hasEnd) {
        return dateEnv.formatRange(instance.range.start, instance.range.end, formatter, {
          forcedStartTzo: instance.forcedStartTzo,
          forcedEndTzo: instance.forcedEndTzo
        });
      }
      return dateEnv.format(instance.range.start, formatter, {
        forcedTzo: instance.forcedStartTzo
      });
    }
    mutate(mutation) {
      let instance = this._instance;
      if (instance) {
        let def = this._def;
        let context = this._context;
        let { eventStore } = context.getCurrentData();
        let relevantEvents = getRelevantEvents(eventStore, instance.instanceId);
        let eventConfigBase = {
          "": {
            display: "",
            startEditable: true,
            durationEditable: true,
            constraints: [],
            overlap: null,
            allows: [],
            backgroundColor: "",
            borderColor: "",
            textColor: "",
            classNames: []
          }
        };
        relevantEvents = applyMutationToEventStore(relevantEvents, eventConfigBase, mutation, context);
        let oldEvent = new EventImpl(context, def, instance);
        this._def = relevantEvents.defs[def.defId];
        this._instance = relevantEvents.instances[instance.instanceId];
        context.dispatch({
          type: "MERGE_EVENTS",
          eventStore: relevantEvents
        });
        context.emitter.trigger("eventChange", {
          oldEvent,
          event: this,
          relatedEvents: buildEventApis(relevantEvents, context, instance),
          revert() {
            context.dispatch({
              type: "RESET_EVENTS",
              eventStore
            });
          }
        });
      }
    }
    remove() {
      let context = this._context;
      let asStore = eventApiToStore(this);
      context.dispatch({
        type: "REMOVE_EVENTS",
        eventStore: asStore
      });
      context.emitter.trigger("eventRemove", {
        event: this,
        relatedEvents: [],
        revert() {
          context.dispatch({
            type: "MERGE_EVENTS",
            eventStore: asStore
          });
        }
      });
    }
    get source() {
      let { sourceId } = this._def;
      if (sourceId) {
        return new EventSourceImpl(this._context, this._context.getCurrentData().eventSources[sourceId]);
      }
      return null;
    }
    get start() {
      return this._instance ? this._context.dateEnv.toDate(this._instance.range.start) : null;
    }
    get end() {
      return this._instance && this._def.hasEnd ? this._context.dateEnv.toDate(this._instance.range.end) : null;
    }
    get startStr() {
      let instance = this._instance;
      if (instance) {
        return this._context.dateEnv.formatIso(instance.range.start, {
          omitTime: this._def.allDay,
          forcedTzo: instance.forcedStartTzo
        });
      }
      return "";
    }
    get endStr() {
      let instance = this._instance;
      if (instance && this._def.hasEnd) {
        return this._context.dateEnv.formatIso(instance.range.end, {
          omitTime: this._def.allDay,
          forcedTzo: instance.forcedEndTzo
        });
      }
      return "";
    }
    get id() {
      return this._def.publicId;
    }
    get groupId() {
      return this._def.groupId;
    }
    get allDay() {
      return this._def.allDay;
    }
    get title() {
      return this._def.title;
    }
    get url() {
      return this._def.url;
    }
    get display() {
      return this._def.ui.display || "auto";
    }
    get startEditable() {
      return this._def.ui.startEditable;
    }
    get durationEditable() {
      return this._def.ui.durationEditable;
    }
    get constraint() {
      return this._def.ui.constraints[0] || null;
    }
    get overlap() {
      return this._def.ui.overlap;
    }
    get allow() {
      return this._def.ui.allows[0] || null;
    }
    get backgroundColor() {
      return this._def.ui.backgroundColor;
    }
    get borderColor() {
      return this._def.ui.borderColor;
    }
    get textColor() {
      return this._def.ui.textColor;
    }
    get classNames() {
      return this._def.ui.classNames;
    }
    get extendedProps() {
      return this._def.extendedProps;
    }
    toPlainObject(settings = {}) {
      let def = this._def;
      let { ui } = def;
      let { startStr, endStr } = this;
      let res = {
        allDay: def.allDay
      };
      if (def.title) {
        res.title = def.title;
      }
      if (startStr) {
        res.start = startStr;
      }
      if (endStr) {
        res.end = endStr;
      }
      if (def.publicId) {
        res.id = def.publicId;
      }
      if (def.groupId) {
        res.groupId = def.groupId;
      }
      if (def.url) {
        res.url = def.url;
      }
      if (ui.display && ui.display !== "auto") {
        res.display = ui.display;
      }
      if (settings.collapseColor && ui.backgroundColor && ui.backgroundColor === ui.borderColor) {
        res.color = ui.backgroundColor;
      } else {
        if (ui.backgroundColor) {
          res.backgroundColor = ui.backgroundColor;
        }
        if (ui.borderColor) {
          res.borderColor = ui.borderColor;
        }
      }
      if (ui.textColor) {
        res.textColor = ui.textColor;
      }
      if (ui.classNames.length) {
        res.classNames = ui.classNames;
      }
      if (Object.keys(def.extendedProps).length) {
        if (settings.collapseExtendedProps) {
          Object.assign(res, def.extendedProps);
        } else {
          res.extendedProps = def.extendedProps;
        }
      }
      return res;
    }
    toJSON() {
      return this.toPlainObject();
    }
  }
  function eventApiToStore(eventApi) {
    let def = eventApi._def;
    let instance = eventApi._instance;
    return {
      defs: {
        [def.defId]: def
      },
      instances: instance ? {
        [instance.instanceId]: instance
      } : {}
    };
  }
  function buildEventApis(eventStore, context, excludeInstance) {
    let { defs, instances } = eventStore;
    let eventApis = [];
    let excludeInstanceId = excludeInstance ? excludeInstance.instanceId : "";
    for (let id in instances) {
      let instance = instances[id];
      let def = defs[instance.defId];
      if (instance.instanceId !== excludeInstanceId) {
        eventApis.push(new EventImpl(context, def, instance));
      }
    }
    return eventApis;
  }
  function getEventKey(seg) {
    return seg.eventRange.instance.instanceId;
  }
  function sliceEventStore(eventStore, eventUiBases, framingRange, nextDayThreshold) {
    let inverseBgByGroupId = {};
    let inverseBgByDefId = {};
    let defByGroupId = {};
    let bgRanges = [];
    let fgRanges = [];
    let eventUis = compileEventUis(eventStore.defs, eventUiBases);
    for (let defId in eventStore.defs) {
      let def = eventStore.defs[defId];
      let ui = eventUis[def.defId];
      if (ui.display === "inverse-background") {
        if (def.groupId) {
          inverseBgByGroupId[def.groupId] = [];
          if (!defByGroupId[def.groupId]) {
            defByGroupId[def.groupId] = def;
          }
        } else {
          inverseBgByDefId[defId] = [];
        }
      }
    }
    for (let instanceId in eventStore.instances) {
      let instance = eventStore.instances[instanceId];
      let def = eventStore.defs[instance.defId];
      let ui = eventUis[def.defId];
      let origRange = instance.range;
      let normalRange = !def.allDay && nextDayThreshold ? computeVisibleDayRange(origRange, nextDayThreshold) : origRange;
      let slicedRange = intersectRanges(normalRange, framingRange);
      if (slicedRange) {
        if (ui.display === "inverse-background") {
          if (def.groupId) {
            inverseBgByGroupId[def.groupId].push(slicedRange);
          } else {
            inverseBgByDefId[instance.defId].push(slicedRange);
          }
        } else if (ui.display !== "none") {
          (ui.display === "background" ? bgRanges : fgRanges).push({
            def,
            ui,
            instance,
            range: slicedRange,
            isStart: normalRange.start && normalRange.start.valueOf() === slicedRange.start.valueOf(),
            isEnd: normalRange.end && normalRange.end.valueOf() === slicedRange.end.valueOf()
          });
        }
      }
    }
    for (let groupId in inverseBgByGroupId) {
      let ranges = inverseBgByGroupId[groupId];
      let invertedRanges = invertRanges(ranges, framingRange);
      for (let invertedRange of invertedRanges) {
        let def = defByGroupId[groupId];
        let ui = eventUis[def.defId];
        bgRanges.push({
          def,
          ui,
          instance: null,
          range: invertedRange,
          isStart: false,
          isEnd: false
        });
      }
    }
    for (let defId in inverseBgByDefId) {
      let ranges = inverseBgByDefId[defId];
      let invertedRanges = invertRanges(ranges, framingRange);
      for (let invertedRange of invertedRanges) {
        bgRanges.push({
          def: eventStore.defs[defId],
          ui: eventUis[defId],
          instance: null,
          range: invertedRange,
          isStart: false,
          isEnd: false
        });
      }
    }
    return {
      bg: bgRanges,
      fg: fgRanges
    };
  }
  function setElEventRange(el, eventRange) {
    el.fcEventRange = eventRange;
  }
  function getElEventRange(el) {
    return el.fcEventRange || el.parentNode.fcEventRange || null;
  }
  function compileEventUis(eventDefs, eventUiBases) {
    return mapHash(eventDefs, (eventDef) => compileEventUi(eventDef, eventUiBases));
  }
  function compileEventUi(eventDef, eventUiBases) {
    let uis = [];
    if (eventUiBases[""]) {
      uis.push(eventUiBases[""]);
    }
    if (eventUiBases[eventDef.defId]) {
      uis.push(eventUiBases[eventDef.defId]);
    }
    uis.push(eventDef.ui);
    return combineEventUis(uis);
  }
  function sortEventSegs(segs, eventOrderSpecs) {
    let objs = segs.map(buildSegCompareObj);
    objs.sort((obj0, obj1) => compareByFieldSpecs(obj0, obj1, eventOrderSpecs));
    return objs.map((c2) => c2._seg);
  }
  function buildSegCompareObj(seg) {
    let { eventRange } = seg;
    let eventDef = eventRange.def;
    let range = eventRange.instance ? eventRange.instance.range : eventRange.range;
    let start = range.start ? range.start.valueOf() : 0;
    let end = range.end ? range.end.valueOf() : 0;
    return Object.assign(Object.assign(Object.assign({}, eventDef.extendedProps), eventDef), {
      id: eventDef.publicId,
      start,
      end,
      duration: end - start,
      allDay: Number(eventDef.allDay),
      _seg: seg
    });
  }
  function computeEventRangeDraggable(eventRange, context) {
    let { pluginHooks } = context;
    let transformers = pluginHooks.isDraggableTransformers;
    let { def, ui } = eventRange;
    let val = ui.startEditable;
    for (let transformer of transformers) {
      val = transformer(val, def, ui, context);
    }
    return val;
  }
  function buildEventRangeTimeText(timeFormat, eventRange, slicedStart, slicedEnd, isStart, isEnd, context, defaultDisplayEventTime = true, defaultDisplayEventEnd = true) {
    const { dateEnv, options } = context;
    const { def, instance } = eventRange;
    let { displayEventTime, displayEventEnd } = options;
    if (displayEventTime == null) {
      displayEventTime = defaultDisplayEventTime !== false;
    }
    if (displayEventEnd == null) {
      displayEventEnd = defaultDisplayEventEnd !== false;
    }
    const startDate = !isStart && slicedStart && startOfDay(slicedStart).valueOf() !== startOfDay(eventRange.instance.range.start).valueOf() ? slicedStart : eventRange.instance.range.start;
    const endDate = !isEnd && slicedEnd && startOfDay(addMs(slicedEnd, -1)).valueOf() !== startOfDay(addMs(eventRange.instance.range.end, -1)).valueOf() ? slicedEnd : eventRange.instance.range.end;
    if (displayEventTime && !def.allDay) {
      if (displayEventEnd && (isStart || isEnd) && def.hasEnd) {
        return dateEnv.formatRange(startDate, endDate, timeFormat, {
          forcedStartTzo: isStart ? instance.forcedStartTzo : null,
          forcedEndTzo: isEnd ? instance.forcedEndTzo : null
        });
      }
      if (isStart) {
        return dateEnv.format(startDate, timeFormat, {
          forcedTzo: instance.forcedStartTzo
        });
      }
    }
    return "";
  }
  function getEventRangeMeta(eventRange, todayRange, nowDate) {
    let segRange = eventRange.range;
    return {
      isPast: segRange.end <= todayRange.start,
      isFuture: segRange.start >= todayRange.end,
      isToday: todayRange && rangeContainsMarker(todayRange, segRange.start)
    };
  }
  function getEventClassNames(props) {
    let classNames = [
      "fc-event"
    ];
    if (props.isMirror) {
      classNames.push("fc-event-mirror");
    }
    if (props.isDraggable) {
      classNames.push("fc-event-draggable");
    }
    if (props.isStartResizable || props.isEndResizable) {
      classNames.push("fc-event-resizable");
    }
    if (props.isDragging) {
      classNames.push("fc-event-dragging");
    }
    if (props.isResizing) {
      classNames.push("fc-event-resizing");
    }
    if (props.isSelected) {
      classNames.push("fc-event-selected");
    }
    if (props.isStart) {
      classNames.push("fc-event-start");
    }
    if (props.isEnd) {
      classNames.push("fc-event-end");
    }
    if (props.isPast) {
      classNames.push("fc-event-past");
    }
    if (props.isToday) {
      classNames.push("fc-event-today");
    }
    if (props.isFuture) {
      classNames.push("fc-event-future");
    }
    return classNames;
  }
  function buildEventRangeKey(eventRange) {
    return eventRange.instance ? eventRange.instance.instanceId : `${eventRange.def.defId}:${eventRange.range.start.toISOString()}`;
  }
  function getEventTagAndAttrs(eventRange, context) {
    let { def, instance } = eventRange;
    let { url } = def;
    if (url) {
      return [
        "a",
        {
          href: url
        }
      ];
    }
    let { emitter, options } = context;
    let { eventInteractive } = options;
    if (eventInteractive == null) {
      eventInteractive = def.interactive;
      if (eventInteractive == null) {
        eventInteractive = Boolean(emitter.hasHandlers("eventClick"));
      }
    }
    let attrs;
    if (eventInteractive) {
      attrs = createAriaKeyboardAttrs((ev) => {
        emitter.trigger("eventClick", {
          el: ev.target,
          event: new EventImpl(context, def, instance),
          jsEvent: ev,
          view: context.viewApi
        });
      });
      attrs = Object.assign({
        role: "button"
      }, attrs);
    }
    return [
      "div",
      attrs
    ];
  }
  const STANDARD_PROPS = {
    start: identity,
    end: identity,
    allDay: Boolean
  };
  function parseDateSpan(raw, dateEnv, defaultDuration) {
    let span = parseOpenDateSpan(raw, dateEnv);
    let { range } = span;
    if (!range.start) {
      return null;
    }
    if (!range.end) {
      if (defaultDuration == null) {
        return null;
      }
      range.end = dateEnv.add(range.start, defaultDuration);
    }
    return span;
  }
  function parseOpenDateSpan(raw, dateEnv) {
    let { refined: standardProps, extra } = refineProps(raw, STANDARD_PROPS);
    let startMeta = standardProps.start ? dateEnv.createMarkerMeta(standardProps.start) : null;
    let endMeta = standardProps.end ? dateEnv.createMarkerMeta(standardProps.end) : null;
    let { allDay } = standardProps;
    if (allDay == null) {
      allDay = startMeta && startMeta.isTimeUnspecified && (!endMeta || endMeta.isTimeUnspecified);
    }
    return Object.assign({
      range: {
        start: startMeta ? startMeta.marker : null,
        end: endMeta ? endMeta.marker : null
      },
      allDay
    }, extra);
  }
  function isDateSpansEqual(span0, span1) {
    return rangesEqual(span0.range, span1.range) && span0.allDay === span1.allDay && isSpanPropsEqual(span0, span1);
  }
  function isSpanPropsEqual(span0, span1) {
    for (let propName in span1) {
      if (propName !== "range" && propName !== "allDay") {
        if (span0[propName] !== span1[propName]) {
          return false;
        }
      }
    }
    for (let propName in span0) {
      if (!(propName in span1)) {
        return false;
      }
    }
    return true;
  }
  function buildDateSpanApi(span, dateEnv) {
    return Object.assign(Object.assign({}, buildRangeApi(span.range, dateEnv, span.allDay)), {
      allDay: span.allDay
    });
  }
  function buildRangeApiWithTimeZone(range, dateEnv, omitTime) {
    return Object.assign(Object.assign({}, buildRangeApi(range, dateEnv, omitTime)), {
      timeZone: dateEnv.timeZone
    });
  }
  function buildRangeApi(range, dateEnv, omitTime) {
    return {
      start: dateEnv.toDate(range.start),
      end: dateEnv.toDate(range.end),
      startStr: dateEnv.formatIso(range.start, {
        omitTime
      }),
      endStr: dateEnv.formatIso(range.end, {
        omitTime
      })
    };
  }
  function fabricateEventRange(dateSpan, eventUiBases, context) {
    let res = refineEventDef({
      editable: false
    }, context);
    let def = parseEventDef(res.refined, res.extra, "", dateSpan.allDay, true, context);
    return {
      def,
      ui: compileEventUi(def, eventUiBases),
      instance: createEventInstance(def.defId, dateSpan.range),
      range: dateSpan.range,
      isStart: true,
      isEnd: true
    };
  }
  function unpromisify(func, normalizedSuccessCallback, normalizedFailureCallback) {
    let isResolved = false;
    let wrappedSuccess = function(res2) {
      if (!isResolved) {
        isResolved = true;
        normalizedSuccessCallback(res2);
      }
    };
    let wrappedFailure = function(error) {
      if (!isResolved) {
        isResolved = true;
        normalizedFailureCallback(error);
      }
    };
    let res = func(wrappedSuccess, wrappedFailure);
    if (res && typeof res.then === "function") {
      res.then(wrappedSuccess, wrappedFailure);
    }
  }
  class JsonRequestError extends Error {
    constructor(message2, response) {
      super(message2);
      this.response = response;
    }
  }
  function requestJson(method, url, params) {
    method = method.toUpperCase();
    const fetchOptions = {
      method
    };
    if (method === "GET") {
      url += (url.indexOf("?") === -1 ? "?" : "&") + new URLSearchParams(params);
    } else {
      fetchOptions.body = new URLSearchParams(params);
      fetchOptions.headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
    }
    return fetch(url, fetchOptions).then((fetchRes) => {
      if (fetchRes.ok) {
        return fetchRes.json().then((parsedResponse) => {
          return [
            parsedResponse,
            fetchRes
          ];
        }, () => {
          throw new JsonRequestError("Failure parsing JSON", fetchRes);
        });
      } else {
        throw new JsonRequestError("Request failed", fetchRes);
      }
    });
  }
  function isDimsEqual(v0, v1) {
    return v0 != null && (v0 === v1 || Math.abs(v0 - v1) < 0.01);
  }
  const nativeBorderBoxEnabled = true;
  const fallbackTimeout = 100;
  const configMap = /* @__PURE__ */ new Map();
  const afterSizeCallbacks = /* @__PURE__ */ new Set();
  let isHandling = false;
  function afterSize(callback) {
    if (isHandling) {
      afterSizeCallbacks.add(callback);
    } else {
      callback();
    }
  }
  function flushAfterSize() {
    for (const flushedCallback of afterSizeCallbacks.values()) {
      flushedCallback();
      afterSizeCallbacks.delete(flushedCallback);
    }
  }
  function checkConfigMap() {
    let anyDirty = true;
    if (!isHandling) {
      isHandling = true;
      const dirtyConfigs = [];
      for (const [el, config2] of configMap.entries()) {
        const { width, height } = el.getBoundingClientRect();
        if (storeConfigDims(config2, width, height)) {
          dirtyConfigs.push(config2);
          anyDirty = true;
        }
      }
      for (const dirtyConfig of dirtyConfigs) {
        dirtyConfig.callback(dirtyConfig.width, dirtyConfig.height);
      }
      flushAfterSize();
      isHandling = false;
    }
    return anyDirty;
  }
  function storeConfigDims(config2, width, height) {
    let shouldFire = false;
    if (!isDimsEqual(config2.width, width)) {
      config2.width = width;
      shouldFire = config2.watchWidth;
    }
    if (!isDimsEqual(config2.height, height)) {
      config2.height = height;
      shouldFire || (shouldFire = config2.watchHeight);
    }
    return shouldFire;
  }
  function initNative() {
    const globalResizeObserver = new ResizeObserver((entries) => {
      isHandling = true;
      for (let entry of entries) {
        const el = entry.target;
        const config2 = configMap.get(el);
        let width;
        let height;
        if (entry.borderBoxSize && nativeBorderBoxEnabled) {
          const borderBoxSize = entry.borderBoxSize[0] || entry.borderBoxSize;
          width = borderBoxSize.inlineSize;
          height = borderBoxSize.blockSize;
        } else {
          ({ width, height } = el.getBoundingClientRect());
        }
        if (storeConfigDims(config2, width, height)) {
          config2.callback(width, height);
        }
      }
      flushAfterSize();
      isHandling = false;
    });
    function watchSize2(el, callback, watchWidth2 = true, watchHeight2 = true) {
      configMap.set(el, {
        callback,
        watchWidth: watchWidth2,
        watchHeight: watchHeight2
      });
      globalResizeObserver.observe(el, {
        box: "border-box"
      });
      return () => {
        configMap.delete(el);
        globalResizeObserver.unobserve(el);
      };
    }
    return [
      watchSize2,
      checkConfigMap
    ];
  }
  const globalEventNames = [
    "resize",
    "load",
    "transitionend",
    "animationend",
    "animationstart",
    "animationiteration",
    "keyup",
    "keydown",
    "mouseup",
    "mousedown",
    "mouseover",
    "mouseout",
    "blur",
    "focus"
  ];
  const eventListenerConfig = {
    capture: true,
    passive: true
  };
  function initFallback() {
    let globalMutationObserver;
    let globalMutationObserverPaused = false;
    const [requestCheckSizes, cancelCheckSizes] = debounce(checkConfigMap, fallbackTimeout);
    function requestCheckSizesSync() {
      cancelCheckSizes();
      return checkConfigMap();
    }
    function watchSize2(el, callback, watchWidth2 = true, watchHeight2 = true) {
      if (!configMap.size) {
        addGlobalHandlers();
      }
      configMap.set(el, {
        callback,
        watchWidth: watchWidth2,
        watchHeight: watchHeight2
      });
      requestCheckSizes();
      return () => {
        configMap.delete(el);
        if (!configMap.size) {
          removeGlobalHandlers();
        }
      };
    }
    function addGlobalHandlers() {
      globalMutationObserver = new MutationObserver(requestCheckSizes);
      if (!globalMutationObserverPaused) {
        startGlobalMutationObserver();
      }
      for (const eventName of globalEventNames) {
        window.addEventListener(eventName, requestCheckSizes, eventListenerConfig);
      }
    }
    function removeGlobalHandlers() {
      if (!globalMutationObserverPaused) {
        stopGlobalMutationObserver();
      }
      for (const eventName of globalEventNames) {
        window.removeEventListener(eventName, requestCheckSizes, eventListenerConfig);
      }
    }
    function startGlobalMutationObserver() {
      globalMutationObserver.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
    }
    function stopGlobalMutationObserver() {
      globalMutationObserver.disconnect();
    }
    function pauseGlobalMutationObserver() {
      if (!globalMutationObserverPaused) {
        globalMutationObserverPaused = true;
        if (configMap.size) {
          stopGlobalMutationObserver();
        }
      }
    }
    function resumeGlobalMutationObserver() {
      if (globalMutationObserverPaused) {
        globalMutationObserverPaused = false;
        if (configMap.size) {
          startGlobalMutationObserver();
        }
      }
    }
    const __rOld = preactOptions.__r || noop;
    const __cOld = preactOptions.__c || noop;
    let requested = false;
    preactOptions.__r = function() {
      pauseGlobalMutationObserver();
      __rOld.apply(this, arguments);
    };
    preactOptions.__c = function() {
      if (!requested) {
        requested = true;
        requestAnimationFrame(() => {
          requestCheckSizesSync();
          resumeGlobalMutationObserver();
          requested = false;
        });
      }
      __cOld.apply(this, arguments);
    };
    return [
      watchSize2,
      requestCheckSizesSync
    ];
  }
  const noop = () => {
  };
  function debounce(fn, ms) {
    let timeoutStarted;
    let timeoutAdded;
    let timeoutId;
    function runWithTimeout(timeout) {
      timeoutStarted = Date.now();
      timeoutAdded = 0;
      timeoutId = setTimeout(() => {
        if (timeoutAdded) {
          runWithTimeout(timeoutAdded);
        } else {
          timeoutId = void 0;
          fn();
        }
      }, timeout);
    }
    function request() {
      if (timeoutId) {
        timeoutAdded = Date.now() - timeoutStarted;
      } else {
        runWithTimeout(ms);
      }
    }
    function cancel() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = void 0;
      }
    }
    return [
      request,
      cancel
    ];
  }
  const [watchSize, updateSizeSync] = typeof ResizeObserver !== "undefined" ? initNative() : initFallback();
  function watchWidth(el, callback) {
    return watchSize(el, callback, true);
  }
  function watchHeight(el, callback) {
    return watchSize(el, (_width, height) => callback(height), false, true);
  }
  class CalendarRoot extends BaseComponent {
    constructor() {
      super(...arguments);
      this.state = {
        forPrint: false
      };
      this.handleBeforePrint = () => {
        this.setState({
          forPrint: true
        });
        flushUpdates();
        updateSizeSync();
        flushUpdates();
      };
      this.handleAfterPrint = () => {
        this.setState({
          forPrint: false
        });
        flushUpdates();
      };
    }
    render() {
      let { props, state } = this;
      let { options } = props;
      let { forPrint } = state;
      let classNames = [
        "fc",
        forPrint ? "fc-media-print" : "fc-media-screen",
        `fc-direction-${options.direction}`,
        props.theme.getClassName("root")
      ];
      return props.children(classNames, options.height, forPrint);
    }
    componentDidMount() {
      let { emitter } = this.props;
      emitter.on("_beforeprint", this.handleBeforePrint);
      emitter.on("_afterprint", this.handleAfterPrint);
    }
    componentWillUnmount() {
      let { emitter } = this.props;
      emitter.off("_beforeprint", this.handleBeforePrint);
      emitter.off("_afterprint", this.handleAfterPrint);
    }
  }
  class Interaction {
    constructor(settings) {
      this.component = settings.component;
      this.isHitComboAllowed = settings.isHitComboAllowed || null;
    }
    destroy() {
    }
  }
  function parseInteractionSettings(component, input) {
    return {
      component,
      el: input.el,
      useEventCenter: input.useEventCenter != null ? input.useEventCenter : true,
      isHitComboAllowed: input.isHitComboAllowed || null
    };
  }
  function interactionSettingsToStore(settings) {
    return {
      [settings.component.uid]: settings
    };
  }
  const interactionSettingsStore = {};
  const PIXEL_PROP_RE = /(top|left|right|bottom|width|height)$/i;
  function applyStyle(el, props) {
    for (let propName in props) {
      applyStyleProp(el, propName, props[propName]);
    }
  }
  function applyStyleProp(el, name, val) {
    if (val == null) {
      el.style[name] = "";
    } else if (typeof val === "number" && PIXEL_PROP_RE.test(name)) {
      el.style[name] = `${val}px`;
    } else {
      el.style[name] = val;
    }
  }
  function getEventTargetViaRoot(ev) {
    var _a2, _b2;
    return (_b2 = (_a2 = ev.composedPath) === null || _a2 === void 0 ? void 0 : _a2.call(ev)[0]) !== null && _b2 !== void 0 ? _b2 : ev.target;
  }
  let guid = 0;
  function getUniqueDomId() {
    guid += 1;
    return "fc-dom-" + guid;
  }
  function getIsHeightAuto(options) {
    return options.height === "auto" || options.contentHeight === "auto";
  }
  function getStickyHeaderDates(options) {
    let { stickyHeaderDates } = options;
    if (stickyHeaderDates == null || stickyHeaderDates === "auto") {
      stickyHeaderDates = getIsHeightAuto(options);
    }
    return stickyHeaderDates;
  }
  function getStickyFooterScrollbar(options) {
    let { stickyFooterScrollbar } = options;
    if (stickyFooterScrollbar == null || stickyFooterScrollbar === "auto") {
      stickyFooterScrollbar = getIsHeightAuto(options);
    }
    return stickyFooterScrollbar;
  }
  function getScrollerSyncerClass(pluginHooks) {
    const ScrollerSyncer = pluginHooks.scrollerSyncerClass;
    if (!ScrollerSyncer) {
      throw new RangeError("Must import @fullcalendar/scrollgrid");
    }
    return ScrollerSyncer;
  }
  class CalendarImpl {
    getCurrentData() {
      return this.currentDataManager.getCurrentData();
    }
    dispatch(action) {
      this.currentDataManager.dispatch(action);
    }
    get view() {
      return this.getCurrentData().viewApi;
    }
    batchRendering(callback) {
      callback();
    }
    updateSize() {
      let cycleCount = 0;
      while (cycleCount++ < 3 && updateSizeSync()) {
        flushUpdates();
      }
    }
    setOption(name, val) {
      this.dispatch({
        type: "SET_OPTION",
        optionName: name,
        rawOptionValue: val
      });
    }
    getOption(name) {
      return this.currentDataManager.currentCalendarOptionsInput[name];
    }
    getAvailableLocaleCodes() {
      return Object.keys(this.getCurrentData().availableRawLocales);
    }
    on(handlerName, handler) {
      let { currentDataManager } = this;
      if (currentDataManager.currentCalendarOptionsRefiners[handlerName]) {
        currentDataManager.emitter.on(handlerName, handler);
      } else {
        console.warn(`Unknown listener name '${handlerName}'`);
      }
    }
    off(handlerName, handler) {
      this.currentDataManager.emitter.off(handlerName, handler);
    }
    trigger(handlerName, ...args) {
      this.currentDataManager.emitter.trigger(handlerName, ...args);
    }
    changeView(viewType, dateOrRange) {
      this.batchRendering(() => {
        this.unselect();
        if (dateOrRange) {
          if (dateOrRange.start && dateOrRange.end) {
            this.dispatch({
              type: "CHANGE_VIEW_TYPE",
              viewType
            });
            this.dispatch({
              type: "SET_OPTION",
              optionName: "visibleRange",
              rawOptionValue: dateOrRange
            });
          } else {
            let { dateEnv } = this.getCurrentData();
            this.dispatch({
              type: "CHANGE_VIEW_TYPE",
              viewType,
              dateMarker: dateEnv.createMarker(dateOrRange)
            });
          }
        } else {
          this.dispatch({
            type: "CHANGE_VIEW_TYPE",
            viewType
          });
        }
      });
    }
    zoomTo(dateMarker, viewType) {
      let state = this.getCurrentData();
      let spec;
      viewType = viewType || "day";
      spec = state.viewSpecs[viewType] || this.getUnitViewSpec(viewType);
      this.unselect();
      if (spec) {
        this.dispatch({
          type: "CHANGE_VIEW_TYPE",
          viewType: spec.type,
          dateMarker
        });
      } else {
        this.dispatch({
          type: "CHANGE_DATE",
          dateMarker
        });
      }
    }
    getUnitViewSpec(unit) {
      let { viewSpecs, toolbarConfig } = this.getCurrentData();
      let viewTypes = [].concat(toolbarConfig.header ? toolbarConfig.header.viewsWithButtons : [], toolbarConfig.footer ? toolbarConfig.footer.viewsWithButtons : []);
      let i2;
      let spec;
      for (let viewType in viewSpecs) {
        viewTypes.push(viewType);
      }
      for (i2 = 0; i2 < viewTypes.length; i2 += 1) {
        spec = viewSpecs[viewTypes[i2]];
        if (spec) {
          if (spec.singleUnit === unit) {
            return spec;
          }
        }
      }
      return null;
    }
    prev() {
      this.unselect();
      this.dispatch({
        type: "PREV"
      });
    }
    next() {
      this.unselect();
      this.dispatch({
        type: "NEXT"
      });
    }
    prevYear() {
      let state = this.getCurrentData();
      this.unselect();
      this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: state.dateEnv.addYears(state.currentDate, -1)
      });
    }
    nextYear() {
      let state = this.getCurrentData();
      this.unselect();
      this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: state.dateEnv.addYears(state.currentDate, 1)
      });
    }
    today() {
      let state = this.getCurrentData();
      this.unselect();
      this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: getNow(state.calendarOptions.now, state.dateEnv)
      });
    }
    gotoDate(zonedDateInput) {
      let state = this.getCurrentData();
      this.unselect();
      this.dispatch({
        type: "CHANGE_DATE",
        dateMarker: state.dateEnv.createMarker(zonedDateInput)
      });
    }
    incrementDate(deltaInput) {
      let state = this.getCurrentData();
      let delta = createDuration(deltaInput);
      if (delta) {
        this.unselect();
        this.dispatch({
          type: "CHANGE_DATE",
          dateMarker: state.dateEnv.add(state.currentDate, delta)
        });
      }
    }
    getDate() {
      let state = this.getCurrentData();
      return state.dateEnv.toDate(state.currentDate);
    }
    formatDate(d2, formatter) {
      let { dateEnv } = this.getCurrentData();
      return dateEnv.format(dateEnv.createMarker(d2), createFormatter(formatter));
    }
    formatRange(d0, d1, settings) {
      let { dateEnv } = this.getCurrentData();
      return dateEnv.formatRange(dateEnv.createMarker(d0), dateEnv.createMarker(d1), createFormatter(settings), settings);
    }
    formatIso(d2, omitTime) {
      let { dateEnv } = this.getCurrentData();
      return dateEnv.formatIso(dateEnv.createMarker(d2), {
        omitTime
      });
    }
    select(dateOrObj, endDate) {
      let selectionInput;
      if (endDate == null) {
        if (dateOrObj.start != null) {
          selectionInput = dateOrObj;
        } else {
          selectionInput = {
            start: dateOrObj,
            end: null
          };
        }
      } else {
        selectionInput = {
          start: dateOrObj,
          end: endDate
        };
      }
      let state = this.getCurrentData();
      let selection = parseDateSpan(selectionInput, state.dateEnv, createDuration({
        days: 1
      }));
      if (selection) {
        this.dispatch({
          type: "SELECT_DATES",
          selection
        });
        triggerDateSelect(selection, null, state);
      }
    }
    unselect(pev) {
      let state = this.getCurrentData();
      if (state.dateSelection) {
        this.dispatch({
          type: "UNSELECT_DATES"
        });
        triggerDateUnselect(pev, state);
      }
    }
    addEvent(eventInput, sourceInput) {
      if (eventInput instanceof EventImpl) {
        let def = eventInput._def;
        let instance = eventInput._instance;
        let currentData = this.getCurrentData();
        if (!currentData.eventStore.defs[def.defId]) {
          this.dispatch({
            type: "ADD_EVENTS",
            eventStore: eventTupleToStore({
              def,
              instance
            })
          });
          this.triggerEventAdd(eventInput);
        }
        return eventInput;
      }
      let state = this.getCurrentData();
      let eventSource;
      if (sourceInput instanceof EventSourceImpl) {
        eventSource = sourceInput.internalEventSource;
      } else if (typeof sourceInput === "boolean") {
        if (sourceInput) {
          [eventSource] = hashValuesToArray(state.eventSources);
        }
      } else if (sourceInput != null) {
        let sourceApi = this.getEventSourceById(sourceInput);
        if (!sourceApi) {
          console.warn(`Could not find an event source with ID "${sourceInput}"`);
          return null;
        }
        eventSource = sourceApi.internalEventSource;
      }
      let tuple = parseEvent(eventInput, eventSource, state, false);
      if (tuple) {
        let newEventApi = new EventImpl(state, tuple.def, tuple.def.recurringDef ? null : tuple.instance);
        this.dispatch({
          type: "ADD_EVENTS",
          eventStore: eventTupleToStore(tuple)
        });
        this.triggerEventAdd(newEventApi);
        return newEventApi;
      }
      return null;
    }
    triggerEventAdd(eventApi) {
      let { emitter } = this.getCurrentData();
      emitter.trigger("eventAdd", {
        event: eventApi,
        relatedEvents: [],
        revert: () => {
          this.dispatch({
            type: "REMOVE_EVENTS",
            eventStore: eventApiToStore(eventApi)
          });
        }
      });
    }
    getEventById(id) {
      let state = this.getCurrentData();
      let { defs, instances } = state.eventStore;
      id = String(id);
      for (let defId in defs) {
        let def = defs[defId];
        if (def.publicId === id) {
          if (def.recurringDef) {
            return new EventImpl(state, def, null);
          }
          for (let instanceId in instances) {
            let instance = instances[instanceId];
            if (instance.defId === def.defId) {
              return new EventImpl(state, def, instance);
            }
          }
        }
      }
      return null;
    }
    getEvents() {
      let currentData = this.getCurrentData();
      return buildEventApis(currentData.eventStore, currentData);
    }
    removeAllEvents() {
      this.dispatch({
        type: "REMOVE_ALL_EVENTS"
      });
    }
    getEventSources() {
      let state = this.getCurrentData();
      let sourceHash = state.eventSources;
      let sourceApis = [];
      for (let internalId in sourceHash) {
        sourceApis.push(new EventSourceImpl(state, sourceHash[internalId]));
      }
      return sourceApis;
    }
    getEventSourceById(id) {
      let state = this.getCurrentData();
      let sourceHash = state.eventSources;
      id = String(id);
      for (let sourceId in sourceHash) {
        if (sourceHash[sourceId].publicId === id) {
          return new EventSourceImpl(state, sourceHash[sourceId]);
        }
      }
      return null;
    }
    addEventSource(sourceInput) {
      let state = this.getCurrentData();
      if (sourceInput instanceof EventSourceImpl) {
        if (!state.eventSources[sourceInput.internalEventSource.sourceId]) {
          this.dispatch({
            type: "ADD_EVENT_SOURCES",
            sources: [
              sourceInput.internalEventSource
            ]
          });
        }
        return sourceInput;
      }
      let eventSource = parseEventSource(sourceInput, state);
      if (eventSource) {
        this.dispatch({
          type: "ADD_EVENT_SOURCES",
          sources: [
            eventSource
          ]
        });
        return new EventSourceImpl(state, eventSource);
      }
      return null;
    }
    removeAllEventSources() {
      this.dispatch({
        type: "REMOVE_ALL_EVENT_SOURCES"
      });
    }
    refetchEvents() {
      this.dispatch({
        type: "FETCH_EVENT_SOURCES",
        isRefetch: true
      });
    }
    scrollToTime(timeInput) {
      let time = createDuration(timeInput);
      if (time) {
        this.trigger("_timeScrollRequest", time);
      }
    }
  }
  function pointInsideRect(point, rect) {
    return point.left >= rect.left && point.left < rect.right && point.top >= rect.top && point.top < rect.bottom;
  }
  function intersectRects(rect1, rect2) {
    let res = {
      left: Math.max(rect1.left, rect2.left),
      right: Math.min(rect1.right, rect2.right),
      top: Math.max(rect1.top, rect2.top),
      bottom: Math.min(rect1.bottom, rect2.bottom)
    };
    if (res.left < res.right && res.top < res.bottom) {
      return res;
    }
    return false;
  }
  function constrainPoint(point, rect) {
    return {
      left: Math.min(Math.max(point.left, rect.left), rect.right),
      top: Math.min(Math.max(point.top, rect.top), rect.bottom)
    };
  }
  function getRectCenter(rect) {
    return {
      left: (rect.left + rect.right) / 2,
      top: (rect.top + rect.bottom) / 2
    };
  }
  function diffPoints(point1, point2) {
    return {
      left: point1.left - point2.left,
      top: point1.top - point2.top
    };
  }
  function getDateMeta(date, todayRange, nowDate, dateProfile) {
    return {
      dow: date.getUTCDay(),
      isDisabled: Boolean(dateProfile && !rangeContainsMarker(dateProfile.activeRange, date)),
      isOther: Boolean(dateProfile && !rangeContainsMarker(dateProfile.currentRange, date)),
      isToday: Boolean(todayRange && rangeContainsMarker(todayRange, date)),
      isPast: Boolean(nowDate ? date < nowDate : todayRange ? date < todayRange.start : false),
      isFuture: Boolean(nowDate ? date > nowDate : todayRange ? date >= todayRange.end : false)
    };
  }
  function getDayClassName(meta) {
    return joinClassNames("fc-day", meta.isDisabled ? "fc-day-disabled" : joinClassNames(`fc-day-${DAY_IDS[meta.dow]}`, meta.isToday && "fc-day-today", meta.isPast && "fc-day-past", meta.isFuture && "fc-day-future", meta.isOther && "fc-day-other"));
  }
  const DAY_FORMAT = createFormatter({
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const WEEK_FORMAT = createFormatter({
    week: "long"
  });
  function buildDateStr(context, dateMarker, viewType = "day") {
    return context.dateEnv.format(dateMarker, viewType === "week" ? WEEK_FORMAT : DAY_FORMAT);
  }
  function buildNavLinkAttrs(context, dateMarker, viewType = "day", dateStr = buildDateStr(context, dateMarker, viewType), isTabbable = true) {
    const { dateEnv, options, calendarApi } = context;
    const zonedDate = dateEnv.toDate(dateMarker);
    const handleInteraction = (ev) => {
      let customAction = viewType === "day" ? options.navLinkDayClick : viewType === "week" ? options.navLinkWeekClick : null;
      if (typeof customAction === "function") {
        customAction.call(calendarApi, dateEnv.toDate(dateMarker), ev);
      } else {
        if (typeof customAction === "string") {
          viewType = customAction;
        }
        calendarApi.zoomTo(dateMarker, viewType);
      }
    };
    return Object.assign({
      "role": "link",
      "aria-label": formatWithOrdinals(options.navLinkHint, [
        dateStr,
        zonedDate
      ], dateStr),
      "className": "fc-navlink"
    }, isTabbable ? createAriaClickAttrs(handleInteraction) : {
      onClick: handleInteraction
    });
  }
  function computeEdges(el, getPadding = false) {
    let computedStyle = window.getComputedStyle(el);
    let borderLeft = parseInt(computedStyle.borderLeftWidth, 10) || 0;
    let borderRight = parseInt(computedStyle.borderRightWidth, 10) || 0;
    let borderTop = parseInt(computedStyle.borderTopWidth, 10) || 0;
    let borderBottom = parseInt(computedStyle.borderBottomWidth, 10) || 0;
    let badScrollbarWidths = computeScrollbarWidthsForEl(el);
    let scrollbarLeftRight = badScrollbarWidths.y - borderLeft - borderRight;
    let scrollbarBottom = badScrollbarWidths.x - borderTop - borderBottom;
    let res = {
      borderLeft,
      borderRight,
      borderTop,
      borderBottom,
      scrollbarBottom,
      scrollbarLeft: 0,
      scrollbarRight: 0
    };
    if (computedStyle.direction === "rtl") {
      res.scrollbarLeft = scrollbarLeftRight;
    } else {
      res.scrollbarRight = scrollbarLeftRight;
    }
    if (getPadding) {
      res.paddingLeft = parseInt(computedStyle.paddingLeft, 10) || 0;
      res.paddingRight = parseInt(computedStyle.paddingRight, 10) || 0;
      res.paddingTop = parseInt(computedStyle.paddingTop, 10) || 0;
      res.paddingBottom = parseInt(computedStyle.paddingBottom, 10) || 0;
    }
    return res;
  }
  function computeInnerRect(el, goWithinPadding = false, doFromWindowViewport) {
    let outerRect = computeRect(el);
    let edges = computeEdges(el, goWithinPadding);
    let res = {
      left: outerRect.left + edges.borderLeft + edges.scrollbarLeft,
      right: outerRect.right - edges.borderRight - edges.scrollbarRight,
      top: outerRect.top + edges.borderTop,
      bottom: outerRect.bottom - edges.borderBottom - edges.scrollbarBottom
    };
    if (goWithinPadding) {
      res.left += edges.paddingLeft;
      res.right -= edges.paddingRight;
      res.top += edges.paddingTop;
      res.bottom -= edges.paddingBottom;
    }
    return res;
  }
  function computeRect(el) {
    let rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      right: rect.right + window.scrollX,
      bottom: rect.bottom + window.scrollY
    };
  }
  function computeClippedClientRect(el) {
    let clippingParents = getClippingParents(el);
    let rect = el.getBoundingClientRect();
    for (let clippingParent of clippingParents) {
      let intersection = intersectRects(rect, clippingParent.getBoundingClientRect());
      if (intersection) {
        rect = intersection;
      } else {
        return null;
      }
    }
    return rect;
  }
  function getClippingParents(el) {
    let parents = [];
    while (el instanceof HTMLElement) {
      let computedStyle = window.getComputedStyle(el);
      if (computedStyle.position === "fixed") {
        break;
      }
      if (/(auto|scroll)/.test(computedStyle.overflow + computedStyle.overflowY + computedStyle.overflowX)) {
        parents.push(el);
      }
      el = el.parentNode;
    }
    return parents;
  }
  function computeScrollbarWidthsForEl(el) {
    return {
      x: el.offsetHeight - el.clientHeight,
      y: el.offsetWidth - el.clientWidth
    };
  }
  class ScrollController {
    getMaxScrollTop() {
      return this.getScrollHeight() - this.getClientHeight();
    }
    getMaxScrollLeft() {
      return this.getScrollWidth() - this.getClientWidth();
    }
    canScrollVertically() {
      return this.getMaxScrollTop() > 0;
    }
    canScrollHorizontally() {
      return this.getMaxScrollLeft() > 0;
    }
    canScrollUp() {
      return this.getScrollTop() > 0;
    }
    canScrollDown() {
      return this.getScrollTop() < this.getMaxScrollTop();
    }
    canScrollLeft() {
      return this.getScrollLeft() > 0;
    }
    canScrollRight() {
      return this.getScrollLeft() < this.getMaxScrollLeft();
    }
  }
  class ElementScrollController extends ScrollController {
    constructor(el) {
      super();
      this.el = el;
    }
    getScrollTop() {
      return this.el.scrollTop;
    }
    getScrollLeft() {
      return this.el.scrollLeft;
    }
    setScrollTop(top) {
      this.el.scrollTop = top;
    }
    setScrollLeft(left) {
      this.el.scrollLeft = left;
    }
    getScrollWidth() {
      return this.el.scrollWidth;
    }
    getScrollHeight() {
      return this.el.scrollHeight;
    }
    getClientHeight() {
      return this.el.clientHeight;
    }
    getClientWidth() {
      return this.el.clientWidth;
    }
  }
  class WindowScrollController extends ScrollController {
    getScrollTop() {
      return window.scrollY;
    }
    getScrollLeft() {
      return window.scrollX;
    }
    setScrollTop(n2) {
      window.scroll(window.scrollX, n2);
    }
    setScrollLeft(n2) {
      window.scroll(n2, window.scrollY);
    }
    getScrollWidth() {
      return document.documentElement.scrollWidth;
    }
    getScrollHeight() {
      return document.documentElement.scrollHeight;
    }
    getClientHeight() {
      return document.documentElement.clientHeight;
    }
    getClientWidth() {
      return document.documentElement.clientWidth;
    }
  }
  class DateComponent extends BaseComponent {
    constructor() {
      super(...arguments);
      this.uid = guid$1();
    }
    prepareHits() {
    }
    queryHit(positionLeft, positionTop, elWidth, elHeight) {
      return null;
    }
    isValidSegDownEl(el) {
      return !this.props.eventDrag && !this.props.eventResize && !el.closest(".fc-event-mirror");
    }
    isValidDateDownEl(el) {
      return !el.closest(".fc-event:not(.fc-bg-event)") && !el.closest(".fc-more-link") && !el.closest(".fc-navlink") && !el.closest(".fc-popover");
    }
  }
  function intersectCoordRanges(r0, r1) {
    const start = Math.max(r0.start, r1.start);
    const end = Math.min(r0.end, r1.end);
    if (start < end) {
      return {
        start,
        end,
        isStart: r0.isStart && start === r0.start,
        isEnd: r0.isEnd && end === r0.end
      };
    }
  }
  function getCoordRangeEnd(r2) {
    return r2.end;
  }
  function computeEarliestStart(segs) {
    return segs.reduce(pickEarliestStart).eventRange.range.start;
  }
  function computeLatestEnd(segs) {
    return segs.reduce(pickLatestEnd).eventRange.range.end;
  }
  function pickEarliestStart(r0, r1) {
    return r0.eventRange.range.start < r1.eventRange.range.start ? r0 : r1;
  }
  function pickLatestEnd(r0, r1) {
    return r0.eventRange.range.end > r1.eventRange.range.end ? r0 : r1;
  }
  class SegHierarchy {
    constructor(segs, getSegThickness = (seg) => {
      return 1;
    }, strictOrder = false, maxCoord, maxDepth, hiddenConsumes = false, allowSlicing = false) {
      this.getSegThickness = getSegThickness;
      this.strictOrder = strictOrder;
      this.maxCoord = maxCoord;
      this.maxDepth = maxDepth;
      this.hiddenConsumes = hiddenConsumes;
      this.allowSlicing = allowSlicing;
      this.placementsByLevel = [];
      this.levelCoords = [];
      this.hiddenSegs = [];
      for (const seg of segs) {
        this.insertSeg(seg, this.getSegThickness(seg));
      }
    }
    insertSeg(seg, segThickness, isSlice) {
      if (segThickness != null) {
        const insertion = this.findInsertion(seg, segThickness);
        if (this.isInsertionValid(insertion, segThickness)) {
          this.insertSegAt(seg, insertion, segThickness, isSlice);
        } else {
          const { touchingPlacement } = insertion;
          if (touchingPlacement) {
            if (this.hiddenConsumes && !touchingPlacement.isZombie) {
              touchingPlacement.isZombie = true;
              this.hiddenSegs.push(touchingPlacement);
              if (this.allowSlicing) {
                const newSeg = Object.assign({}, touchingPlacement);
                Object.assign(touchingPlacement, intersectCoordRanges(touchingPlacement, seg));
                touchingPlacement.isSlice = true;
                this.splitSeg(newSeg, touchingPlacement.thickness, touchingPlacement);
              }
            }
            if (this.allowSlicing) {
              this.hiddenSegs.push(Object.assign(Object.assign({}, seg), intersectCoordRanges(seg, touchingPlacement)));
              this.splitSeg(seg, segThickness, touchingPlacement);
            } else {
              this.hiddenSegs.push(seg);
            }
          } else {
            this.hiddenSegs.push(seg);
          }
        }
      }
    }
    isInsertionValid(insertion, thickness) {
      return (this.maxCoord == null || insertion.levelCoord + thickness <= this.maxCoord) && (this.maxDepth == null || insertion.depth < this.maxDepth);
    }
    splitSeg(seg, segThickness, barrier) {
      if (seg.start < barrier.start) {
        this.insertSeg(Object.assign(Object.assign({}, seg), {
          end: barrier.start,
          isEnd: false
        }), segThickness, true);
      }
      if (seg.end > barrier.end) {
        this.insertSeg(Object.assign(Object.assign({}, seg), {
          start: barrier.end,
          isStart: false
        }), segThickness, true);
      }
    }
    insertSegAt(seg, insertion, segThickness, isSlice) {
      const placement = Object.assign(Object.assign({}, seg), {
        thickness: segThickness,
        depth: insertion.depth,
        isSlice: isSlice || seg.isSlice || false,
        isZombie: false
      });
      if (insertion.lateralIndex === -1) {
        insertAt(this.placementsByLevel, insertion.levelIndex, [
          placement
        ]);
        insertAt(this.levelCoords, insertion.levelIndex, insertion.levelCoord);
      } else {
        insertAt(this.placementsByLevel[insertion.levelIndex], insertion.lateralIndex, placement);
      }
    }
    findInsertion(seg, segThickness) {
      let { placementsByLevel, levelCoords } = this;
      let levelCnt = placementsByLevel.length;
      let candidateCoord = 0;
      let touchingPlacement;
      let touchingLevelIndex;
      let depth = 0;
      for (let currentLevelIndex = 0; currentLevelIndex < levelCnt; currentLevelIndex += 1) {
        const currentLevelCoord = levelCoords[currentLevelIndex];
        if (!this.strictOrder && currentLevelCoord >= candidateCoord + segThickness) {
          break;
        }
        let currentLevelSegs = placementsByLevel[currentLevelIndex];
        let currentSeg;
        let [searchIndex, isExact] = binarySearch(currentLevelSegs, seg.start, getCoordRangeEnd);
        let lateralIndex = searchIndex + isExact;
        while ((currentSeg = currentLevelSegs[lateralIndex]) && currentSeg.start < seg.end) {
          let currentEntryBottom = currentLevelCoord + currentSeg.thickness;
          if (currentEntryBottom > candidateCoord) {
            candidateCoord = currentEntryBottom;
            touchingPlacement = currentSeg;
            touchingLevelIndex = currentLevelIndex;
          }
          if (currentEntryBottom === candidateCoord) {
            depth = Math.max(depth, currentSeg.depth + 1);
          }
          lateralIndex += 1;
        }
      }
      let destLevelIndex = 0;
      if (touchingPlacement) {
        destLevelIndex = touchingLevelIndex + 1;
        while (destLevelIndex < levelCnt && levelCoords[destLevelIndex] < candidateCoord) {
          destLevelIndex += 1;
        }
      }
      let destLateralIndex = -1;
      if (destLevelIndex < levelCnt && levelCoords[destLevelIndex] === candidateCoord) {
        [destLateralIndex] = binarySearch(placementsByLevel[destLevelIndex], seg.end, getCoordRangeEnd);
      }
      return {
        touchingPlacement,
        levelCoord: candidateCoord,
        levelIndex: destLevelIndex,
        lateralIndex: destLateralIndex,
        depth
      };
    }
    traverseSegs(handler) {
      const { placementsByLevel, levelCoords } = this;
      for (let i2 = 0; i2 < placementsByLevel.length; i2++) {
        const placements = placementsByLevel[i2];
        const levelCoord = levelCoords[i2];
        for (const placement of placements) {
          if (!placement.isZombie) {
            handler(placement, levelCoord);
          }
        }
      }
    }
  }
  function insertAt(arr, index2, item) {
    arr.splice(index2, 0, item);
  }
  function binarySearch(a2, searchVal, getItemVal) {
    let startIndex = 0;
    let endIndex = a2.length;
    if (!endIndex || searchVal < getItemVal(a2[startIndex])) {
      return [
        0,
        0
      ];
    }
    if (searchVal > getItemVal(a2[endIndex - 1])) {
      return [
        endIndex,
        0
      ];
    }
    while (startIndex < endIndex) {
      let middleIndex = Math.floor(startIndex + (endIndex - startIndex) / 2);
      let middleVal = getItemVal(a2[middleIndex]);
      if (searchVal < middleVal) {
        endIndex = middleIndex;
      } else if (searchVal > middleVal) {
        startIndex = middleIndex + 1;
      } else {
        return [
          middleIndex,
          1
        ];
      }
    }
    return [
      startIndex,
      0
    ];
  }
  class ElementDragging {
    constructor(el, selector) {
      this.emitter = new Emitter();
    }
    destroy() {
    }
    setMirrorIsVisible(bool) {
    }
    setMirrorNeedsRevert(bool) {
    }
    setAutoScrollEnabled(bool) {
    }
  }
  const config = {};
  class DaySeriesModel {
    constructor(range, dateProfileGenerator) {
      let date = range.start;
      let { end } = range;
      let indices = [];
      let dates = [];
      let dayIndex = -1;
      while (date < end) {
        if (dateProfileGenerator.isHiddenDay(date)) {
          indices.push(dayIndex + 0.5);
        } else {
          dayIndex += 1;
          indices.push(dayIndex);
          dates.push(date);
        }
        date = addDays(date, 1);
      }
      this.dates = dates;
      this.indices = indices;
      this.cnt = dates.length;
    }
    sliceRange(range) {
      let firstIndex = this.getDateDayIndex(range.start);
      let lastIndex = this.getDateDayIndex(addDays(range.end, -1));
      let clippedFirstIndex = Math.max(0, firstIndex);
      let clippedLastIndex = Math.min(this.cnt - 1, lastIndex);
      clippedFirstIndex = Math.ceil(clippedFirstIndex);
      clippedLastIndex = Math.floor(clippedLastIndex);
      if (clippedFirstIndex <= clippedLastIndex) {
        return {
          start: clippedFirstIndex,
          end: clippedLastIndex + 1,
          isStart: firstIndex === clippedFirstIndex,
          isEnd: lastIndex === clippedLastIndex
        };
      }
      return null;
    }
    getDateDayIndex(date) {
      let { indices } = this;
      let dayOffset = Math.floor(diffDays(this.dates[0], date));
      if (dayOffset < 0) {
        return indices[0] - 1;
      }
      if (dayOffset >= indices.length) {
        return indices[indices.length - 1] + 1;
      }
      return indices[dayOffset];
    }
  }
  class DayTableModel {
    constructor(daySeries, breakOnWeeks) {
      let { dates } = daySeries;
      let daysPerRow;
      let firstDay;
      let rowCnt;
      if (breakOnWeeks) {
        firstDay = dates[0].getUTCDay();
        for (daysPerRow = 1; daysPerRow < dates.length; daysPerRow += 1) {
          if (dates[daysPerRow].getUTCDay() === firstDay) {
            break;
          }
        }
        rowCnt = Math.ceil(dates.length / daysPerRow);
      } else {
        rowCnt = 1;
        daysPerRow = dates.length;
      }
      this.rowCnt = rowCnt;
      this.colCnt = daysPerRow;
      this.daySeries = daySeries;
      this.cellRows = this.buildCells();
      this.headerDates = this.buildHeaderDates();
    }
    buildCells() {
      let rows = [];
      for (let row = 0; row < this.rowCnt; row += 1) {
        let cells = [];
        for (let col = 0; col < this.colCnt; col += 1) {
          cells.push(this.buildCell(row, col));
        }
        rows.push(cells);
      }
      return rows;
    }
    buildCell(row, col) {
      let date = this.daySeries.dates[row * this.colCnt + col];
      return {
        key: date.toISOString(),
        date
      };
    }
    buildHeaderDates() {
      let dates = [];
      for (let col = 0; col < this.colCnt; col += 1) {
        dates.push(this.cellRows[0][col].date);
      }
      return dates;
    }
    sliceRange(range) {
      let { colCnt } = this;
      let seriesSeg = this.daySeries.sliceRange(range);
      let segs = [];
      if (seriesSeg) {
        const { start, end } = seriesSeg;
        let index2 = start;
        while (index2 < end) {
          let row = Math.floor(index2 / colCnt);
          let nextIndex = Math.min((row + 1) * colCnt, end);
          segs.push({
            row,
            start: index2 % colCnt,
            end: (nextIndex - 1) % colCnt + 1,
            isStart: seriesSeg.isStart && index2 === start,
            isEnd: seriesSeg.isEnd && nextIndex === end
          });
          index2 = nextIndex;
        }
      }
      return segs;
    }
  }
  class ScrollListener {
    constructor(el) {
      this.el = el;
      this.emitter = new Emitter();
      this.isScroll = false;
      this.isScrollRecent = false;
      this.isWheelRecent = false;
      this.isMouseDown = false;
      this.isTouchDown = false;
      this.isMouse = false;
      this.isTouch = false;
      this.isWheel = false;
      this.handleScroll = () => {
        this.startScroll();
        this.emitter.trigger("scroll", this.getIsUser());
        this.isScrollRecent = true;
        if (this.isMouseDown) {
          this.isMouse = true;
        }
        if (this.isTouchDown) {
          this.isTouch = true;
        }
        if (this.isWheelRecent) {
          this.isWheel = true;
        }
        this.scrollWaiter.request(500);
      };
      this.handleScrollWait = () => {
        this.isScrollRecent = false;
        if (!this.isTouchDown) {
          this.endScroll();
        }
      };
      this.handleWheel = () => {
        this.isWheelRecent = true;
        this.wheelWaiter.request(500);
      };
      this.handleWheelWait = () => {
        this.isWheelRecent = false;
      };
      this.handleMouseDown = () => {
        this.isMouseDown = true;
      };
      this.handleMouseUp = () => {
        this.isMouseDown = false;
      };
      this.handleTouchStart = () => {
        this.isTouchDown = true;
      };
      this.handleTouchEnd = () => {
        this.isTouchDown = false;
        if (!this.isScrollRecent) {
          this.endScroll();
        }
      };
      this.wheelWaiter = new DelayedRunner(this.handleWheelWait);
      this.scrollWaiter = new DelayedRunner(this.handleScrollWait);
      el.addEventListener("scroll", this.handleScroll);
      el.addEventListener("wheel", this.handleWheel, {
        passive: true
      });
      el.addEventListener("mousedown", this.handleMouseDown);
      el.addEventListener("mouseup", this.handleMouseUp);
      el.addEventListener("touchstart", this.handleTouchStart, {
        passive: true
      });
      el.addEventListener("touchend", this.handleTouchEnd);
    }
    destroy() {
      let { el } = this;
      el.removeEventListener("scroll", this.handleScroll);
      el.removeEventListener("wheel", this.handleWheel, {
        passive: true
      });
      el.removeEventListener("mousedown", this.handleMouseDown);
      el.removeEventListener("mouseup", this.handleMouseUp);
      el.removeEventListener("touchstart", this.handleTouchStart, {
        passive: true
      });
      el.removeEventListener("touchend", this.handleTouchEnd);
    }
    startScroll() {
      if (!this.isScroll) {
        this.isScroll = true;
        this.emitter.trigger("scrollStart", this.getIsUser());
      }
    }
    endScroll() {
      if (this.isScroll) {
        this.scrollWaiter.clear();
        this.wheelWaiter.clear();
        this.isScroll = false;
        this.isWheelRecent = false;
        this.emitter.trigger("scrollEnd", this.getIsUser());
        this.isMouse = false;
        this.isTouch = false;
        this.isWheel = false;
      }
    }
    getIsUser() {
      return this.isWheel || this.isMouse || this.isTouch;
    }
  }
  class Scroller extends DateComponent {
    constructor() {
      super(...arguments);
      this.handleEl = (el) => {
        if (this.el) {
          this.el = null;
          this.listener.destroy();
        }
        if (el) {
          this.el = el;
          this.listener = new ScrollListener(el);
        }
      };
      this.handleHRuler = (el) => {
        if (this.disconnectHRuler) {
          this.disconnectHRuler();
          this.disconnectHRuler = void 0;
          if (this.clientWidth !== void 0) {
            this.clientWidth = void 0;
            setRef(this.props.clientWidthRef, null);
          }
        }
        if (el) {
          this.disconnectHRuler = watchWidth(el, (clientWidth) => {
            if (clientWidth !== this.clientWidth) {
              this.clientWidth = clientWidth;
              setRef(this.props.clientWidthRef, clientWidth);
            }
          });
        }
      };
      this.handleVRuler = (el) => {
        if (this.disconnectVRuler) {
          this.disconnectVRuler();
          this.disconnectVRuler = void 0;
          if (this.clientHeight !== void 0) {
            this.clientHeight = void 0;
            setRef(this.props.clientHeightRef, null);
          }
        }
        if (el) {
          this.disconnectVRuler = watchHeight(el, (clientHeight) => {
            if (clientHeight !== this.clientHeight) {
              this.clientHeight = clientHeight;
              setRef(this.props.clientHeightRef, clientHeight);
            }
            const bottomScrollbarWidth = Math.round(this.el.getBoundingClientRect().height - clientHeight);
            if (bottomScrollbarWidth !== this.bottomScrollbarWidth) {
              this.bottomScrollbarWidth = bottomScrollbarWidth;
              setRef(this.props.bottomScrollbarWidthRef, bottomScrollbarWidth);
            }
          });
        }
      };
    }
    render() {
      const { props } = this;
      const fallbackOverflow = props.horizontal || props.vertical ? "hidden" : "";
      return _("div", {
        ref: this.handleEl,
        className: joinClassNames(props.className, "fc-scroller fc-rel", props.hideScrollbars && "fc-scroller-no-bars"),
        style: Object.assign(Object.assign({}, props.style), {
          overflowX: props.horizontal ? "auto" : fallbackOverflow,
          overflowY: props.vertical ? "auto" : fallbackOverflow
        })
      }, props.children, Boolean(props.clientWidthRef) && _("div", {
        ref: this.handleHRuler,
        className: "fc-fill-top"
      }), Boolean(props.clientHeightRef || props.bottomScrollbarWidthRef) && _("div", {
        ref: this.handleVRuler,
        className: "fc-fill-start"
      }));
    }
    endScroll() {
      this.listener.endScroll();
    }
    get x() {
      const { isRtl } = this.context;
      const { el } = this;
      return el ? getNormalizedScrollX(el, isRtl) : 0;
    }
    get y() {
      const { el } = this;
      return el ? el.scrollTop : 0;
    }
    scrollTo({ x: x2, y: y2 }) {
      const { isRtl } = this.context;
      const { el } = this;
      if (el) {
        if (y2 != null) {
          el.scrollTop = y2;
        }
        if (x2 != null) {
          setNormalizedScrollX(el, isRtl, x2);
        }
      }
    }
    addScrollEndListener(handler) {
      this.listener.emitter.on("scrollEnd", handler);
    }
    removeScrollEndListener(handler) {
      this.listener.emitter.off("scrollEnd", handler);
    }
  }
  function getNormalizedScrollX(el, isRtl) {
    const { scrollLeft } = el;
    return isRtl ? getNormalizedRtlScrollX(scrollLeft, el) : scrollLeft;
  }
  function setNormalizedScrollX(el, isRtl, x2) {
    el.scrollLeft = isRtl ? getNormalizedRtlScrollLeft(x2, el) : x2;
  }
  function getNormalizedRtlScrollX(scrollLeft, el) {
    switch (getRtlScrollerSystem()) {
      case "positive":
        return el.scrollWidth - el.clientWidth - scrollLeft;
      case "negative":
        return -scrollLeft;
    }
    return scrollLeft;
  }
  function getNormalizedRtlScrollLeft(x2, el) {
    switch (getRtlScrollerSystem()) {
      case "positive":
        return el.scrollWidth - el.clientWidth - x2;
      case "negative":
        return -x2;
    }
    return x2;
  }
  let _rtlScrollerSystem;
  function getRtlScrollerSystem() {
    return _rtlScrollerSystem || (_rtlScrollerSystem = detectRtlScrollerSystem());
  }
  function detectRtlScrollerSystem() {
    let el = document.createElement("div");
    el.style.position = "absolute";
    el.style.top = "-1000px";
    el.style.width = "100px";
    el.style.height = "100px";
    el.style.overflow = "scroll";
    el.style.direction = "rtl";
    let innerEl = document.createElement("div");
    innerEl.style.width = "200px";
    innerEl.style.height = "200px";
    el.appendChild(innerEl);
    document.body.appendChild(el);
    let system;
    if (el.scrollLeft > 0) {
      system = "positive";
    } else {
      el.scrollLeft = 50;
      if (el.scrollLeft > 0) {
        system = "reverse";
      } else {
        system = "negative";
      }
    }
    el.remove();
    return system;
  }
  class Slicer {
    constructor() {
      this.sliceBusinessHours = memoize(this._sliceBusinessHours);
      this.sliceDateSelection = memoize(this._sliceDateSpan);
      this.sliceEventStore = memoize(this._sliceEventStore);
      this.sliceEventDrag = memoize(this._sliceInteraction);
      this.sliceEventResize = memoize(this._sliceInteraction);
      this.forceDayIfListItem = false;
    }
    sliceProps(props, dateProfile, nextDayThreshold, context, ...extraArgs) {
      let { eventUiBases } = props;
      let eventSegs = this.sliceEventStore(props.eventStore, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs);
      return {
        dateSelectionSegs: this.sliceDateSelection(props.dateSelection, dateProfile, nextDayThreshold, eventUiBases, context, ...extraArgs),
        businessHourSegs: this.sliceBusinessHours(props.businessHours, dateProfile, nextDayThreshold, context, ...extraArgs),
        fgEventSegs: eventSegs.fg,
        bgEventSegs: eventSegs.bg,
        eventDrag: this.sliceEventDrag(props.eventDrag, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs),
        eventResize: this.sliceEventResize(props.eventResize, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs),
        eventSelection: props.eventSelection
      };
    }
    sliceNowDate(date, dateProfile, nextDayThreshold, context, ...extraArgs) {
      return this._sliceDateSpan({
        range: {
          start: date,
          end: addMs(date, 1)
        },
        allDay: false
      }, dateProfile, nextDayThreshold, {}, context, ...extraArgs);
    }
    _sliceBusinessHours(businessHours, dateProfile, nextDayThreshold, context, ...extraArgs) {
      if (!businessHours) {
        return [];
      }
      return this._sliceEventStore(expandRecurring(businessHours, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), context), {}, dateProfile, nextDayThreshold, ...extraArgs).bg;
    }
    _sliceEventStore(eventStore, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs) {
      if (eventStore) {
        let rangeRes = sliceEventStore(eventStore, eventUiBases, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), nextDayThreshold);
        return {
          bg: this.sliceEventRanges(rangeRes.bg, extraArgs),
          fg: this.sliceEventRanges(rangeRes.fg, extraArgs)
        };
      }
      return {
        bg: [],
        fg: []
      };
    }
    _sliceInteraction(interaction, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs) {
      if (!interaction) {
        return null;
      }
      let rangeRes = sliceEventStore(interaction.mutatedEvents, eventUiBases, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), nextDayThreshold);
      return {
        segs: this.sliceEventRanges(rangeRes.fg, extraArgs),
        affectedInstances: interaction.affectedEvents.instances,
        isEvent: interaction.isEvent
      };
    }
    _sliceDateSpan(dateSpan, dateProfile, nextDayThreshold, eventUiBases, context, ...extraArgs) {
      if (!dateSpan) {
        return [];
      }
      let activeRange = computeActiveRange(dateProfile, Boolean(nextDayThreshold));
      let activeDateSpanRange = intersectRanges(dateSpan.range, activeRange);
      if (activeDateSpanRange) {
        dateSpan = Object.assign(Object.assign({}, dateSpan), {
          range: activeDateSpanRange
        });
        let eventRange = fabricateEventRange(dateSpan, eventUiBases, context);
        let segs = this.sliceRange(dateSpan.range, ...extraArgs);
        for (let seg of segs) {
          seg.eventRange = eventRange;
        }
        return segs;
      }
      return [];
    }
    sliceEventRanges(eventRanges, extraArgs) {
      let segs = [];
      for (let eventRange of eventRanges) {
        segs.push(...this.sliceEventRange(eventRange, extraArgs));
      }
      return segs;
    }
    sliceEventRange(eventRange, extraArgs) {
      let dateRange = eventRange.range;
      if (this.forceDayIfListItem && eventRange.ui.display === "list-item") {
        dateRange = {
          start: dateRange.start,
          end: addDays(dateRange.start, 1)
        };
      }
      let segs = this.sliceRange(dateRange, ...extraArgs);
      for (let seg of segs) {
        seg.eventRange = eventRange;
        seg.isStart = eventRange.isStart && seg.isStart;
        seg.isEnd = eventRange.isEnd && seg.isEnd;
      }
      return segs;
    }
  }
  function computeActiveRange(dateProfile, isComponentAllDay) {
    let range = dateProfile.activeRange;
    if (isComponentAllDay) {
      return range;
    }
    return {
      start: addMs(range.start, dateProfile.slotMinTime.milliseconds),
      end: addMs(range.end, dateProfile.slotMaxTime.milliseconds - 864e5)
    };
  }
  function isInteractionValid(interaction, dateProfile, context) {
    let { instances } = interaction.mutatedEvents;
    for (let instanceId in instances) {
      if (!rangeContainsRange(dateProfile.validRange, instances[instanceId].range)) {
        return false;
      }
    }
    return isNewPropsValid({
      eventDrag: interaction
    }, context);
  }
  function isDateSelectionValid(dateSelection, dateProfile, context) {
    if (!rangeContainsRange(dateProfile.validRange, dateSelection.range)) {
      return false;
    }
    return isNewPropsValid({
      dateSelection
    }, context);
  }
  function isNewPropsValid(newProps, context) {
    let calendarState = context.getCurrentData();
    let props = Object.assign({
      businessHours: calendarState.businessHours,
      dateSelection: "",
      eventStore: calendarState.eventStore,
      eventUiBases: calendarState.eventUiBases,
      eventSelection: "",
      eventDrag: null,
      eventResize: null
    }, newProps);
    return (context.pluginHooks.isPropsValid || isPropsValid)(props, context);
  }
  function isPropsValid(state, context, dateSpanMeta = {}, filterConfig) {
    if (state.eventDrag && !isInteractionPropsValid(state, context, dateSpanMeta, filterConfig)) {
      return false;
    }
    if (state.dateSelection && !isDateSelectionPropsValid(state, context, dateSpanMeta, filterConfig)) {
      return false;
    }
    return true;
  }
  function isInteractionPropsValid(state, context, dateSpanMeta, filterConfig) {
    let currentState = context.getCurrentData();
    let interaction = state.eventDrag;
    let subjectEventStore = interaction.mutatedEvents;
    let subjectDefs = subjectEventStore.defs;
    let subjectInstances = subjectEventStore.instances;
    let subjectConfigs = compileEventUis(subjectDefs, interaction.isEvent ? state.eventUiBases : {
      "": currentState.selectionConfig
    });
    if (filterConfig) {
      subjectConfigs = mapHash(subjectConfigs, filterConfig);
    }
    let otherEventStore = excludeInstances(state.eventStore, interaction.affectedEvents.instances);
    let otherDefs = otherEventStore.defs;
    let otherInstances = otherEventStore.instances;
    let otherConfigs = compileEventUis(otherDefs, state.eventUiBases);
    for (let subjectInstanceId in subjectInstances) {
      let subjectInstance = subjectInstances[subjectInstanceId];
      let subjectRange = subjectInstance.range;
      let subjectConfig = subjectConfigs[subjectInstance.defId];
      let subjectDef = subjectDefs[subjectInstance.defId];
      if (!allConstraintsPass(subjectConfig.constraints, subjectRange, otherEventStore, state.businessHours, context)) {
        return false;
      }
      let { eventOverlap } = context.options;
      let eventOverlapFunc = typeof eventOverlap === "function" ? eventOverlap : null;
      for (let otherInstanceId in otherInstances) {
        let otherInstance = otherInstances[otherInstanceId];
        if (rangesIntersect(subjectRange, otherInstance.range)) {
          let otherOverlap = otherConfigs[otherInstance.defId].overlap;
          if (otherOverlap === false && interaction.isEvent) {
            return false;
          }
          if (subjectConfig.overlap === false) {
            return false;
          }
          if (eventOverlapFunc && !eventOverlapFunc(new EventImpl(context, otherDefs[otherInstance.defId], otherInstance), new EventImpl(context, subjectDef, subjectInstance))) {
            return false;
          }
        }
      }
      let calendarEventStore = currentState.eventStore;
      for (let subjectAllow of subjectConfig.allows) {
        let subjectDateSpan = Object.assign(Object.assign({}, dateSpanMeta), {
          range: subjectInstance.range,
          allDay: subjectDef.allDay
        });
        let origDef = calendarEventStore.defs[subjectDef.defId];
        let origInstance = calendarEventStore.instances[subjectInstanceId];
        let eventApi;
        if (origDef) {
          eventApi = new EventImpl(context, origDef, origInstance);
        } else {
          eventApi = new EventImpl(context, subjectDef);
        }
        if (!subjectAllow(buildDateSpanApiWithContext(subjectDateSpan, context), eventApi)) {
          return false;
        }
      }
    }
    return true;
  }
  function isDateSelectionPropsValid(state, context, dateSpanMeta, filterConfig) {
    let relevantEventStore = state.eventStore;
    let relevantDefs = relevantEventStore.defs;
    let relevantInstances = relevantEventStore.instances;
    let selection = state.dateSelection;
    let selectionRange = selection.range;
    let { selectionConfig } = context.getCurrentData();
    if (filterConfig) {
      selectionConfig = filterConfig(selectionConfig);
    }
    if (!allConstraintsPass(selectionConfig.constraints, selectionRange, relevantEventStore, state.businessHours, context)) {
      return false;
    }
    let { selectOverlap } = context.options;
    let selectOverlapFunc = typeof selectOverlap === "function" ? selectOverlap : null;
    for (let relevantInstanceId in relevantInstances) {
      let relevantInstance = relevantInstances[relevantInstanceId];
      if (rangesIntersect(selectionRange, relevantInstance.range)) {
        if (selectionConfig.overlap === false) {
          return false;
        }
        if (selectOverlapFunc && !selectOverlapFunc(new EventImpl(context, relevantDefs[relevantInstance.defId], relevantInstance), null)) {
          return false;
        }
      }
    }
    for (let selectionAllow of selectionConfig.allows) {
      let fullDateSpan = Object.assign(Object.assign({}, dateSpanMeta), selection);
      if (!selectionAllow(buildDateSpanApiWithContext(fullDateSpan, context), null)) {
        return false;
      }
    }
    return true;
  }
  function allConstraintsPass(constraints, subjectRange, otherEventStore, businessHoursUnexpanded, context) {
    for (let constraint of constraints) {
      if (!anyRangesContainRange(constraintToRanges(constraint, subjectRange, otherEventStore, businessHoursUnexpanded, context), subjectRange)) {
        return false;
      }
    }
    return true;
  }
  function constraintToRanges(constraint, subjectRange, otherEventStore, businessHoursUnexpanded, context) {
    if (constraint === "businessHours") {
      return eventStoreToRanges(expandRecurring(businessHoursUnexpanded, subjectRange, context));
    }
    if (typeof constraint === "string") {
      return eventStoreToRanges(filterEventStoreDefs(otherEventStore, (eventDef) => eventDef.groupId === constraint));
    }
    if (typeof constraint === "object" && constraint) {
      return eventStoreToRanges(expandRecurring(constraint, subjectRange, context));
    }
    return [];
  }
  function eventStoreToRanges(eventStore) {
    let { instances } = eventStore;
    let ranges = [];
    for (let instanceId in instances) {
      ranges.push(instances[instanceId].range);
    }
    return ranges;
  }
  function anyRangesContainRange(outerRanges, innerRange) {
    for (let outerRange of outerRanges) {
      if (rangeContainsRange(outerRange, innerRange)) {
        return true;
      }
    }
    return false;
  }
  class Ruler extends BaseComponent {
    constructor() {
      super(...arguments);
      this.elRef = m$1();
    }
    render() {
      return _("div", {
        ref: this.elRef
      });
    }
    componentDidMount() {
      const { props } = this;
      const el = this.elRef.current;
      this.disconnectWidth = watchWidth(el, (width) => {
        setRef(props.widthRef, width);
      });
    }
    componentWillUnmount() {
      this.disconnectWidth();
      const { props } = this;
      if (props.widthRef) {
        setRef(props.widthRef, null);
      }
    }
  }
  class RefMap {
    constructor(masterCallback) {
      this.masterCallback = masterCallback;
      this.rev = "";
      this.current = /* @__PURE__ */ new Map();
      this.callbacks = /* @__PURE__ */ new Map();
      this.handleValue = (val, key) => {
        let { current, callbacks } = this;
        if (val === null) {
          current.delete(key);
          callbacks.delete(key);
        } else {
          current.set(key, val);
        }
        this.rev = guid$1();
        if (this.masterCallback) {
          this.masterCallback(val, key);
        }
      };
    }
    createRef(key) {
      let refCallback = this.callbacks.get(key);
      if (!refCallback) {
        refCallback = (val) => {
          this.handleValue(val, key);
        };
        this.callbacks.set(key, refCallback);
      }
      return refCallback;
    }
  }
  class NowTimer extends b {
    constructor(props, context) {
      super(props, context);
      this.initialNowDate = getNow(context.options.now, context.dateEnv);
      this.initialNowQueriedMs = (/* @__PURE__ */ new Date()).valueOf();
      this.state = this.computeTiming().currentState;
    }
    render() {
      let { props, state } = this;
      return props.children(state.nowDate, state.todayRange);
    }
    componentDidMount() {
      this.setTimeout();
    }
    componentDidUpdate(prevProps) {
      if (prevProps.unit !== this.props.unit) {
        this.clearTimeout();
        this.setTimeout();
      }
    }
    componentWillUnmount() {
      this.clearTimeout();
    }
    computeTiming() {
      let { props, context } = this;
      let unroundedNow = addMs(this.initialNowDate, (/* @__PURE__ */ new Date()).valueOf() - this.initialNowQueriedMs);
      let currentUnitStart = context.dateEnv.startOf(unroundedNow, props.unit);
      let nextUnitStart = context.dateEnv.add(currentUnitStart, createDuration(1, props.unit));
      let waitMs = nextUnitStart.valueOf() - unroundedNow.valueOf();
      waitMs = Math.min(1e3 * 60 * 60 * 24, waitMs);
      return {
        currentState: {
          nowDate: currentUnitStart,
          todayRange: buildDayRange(currentUnitStart)
        },
        nextState: {
          nowDate: nextUnitStart,
          todayRange: buildDayRange(nextUnitStart)
        },
        waitMs
      };
    }
    setTimeout() {
      let { nextState, waitMs } = this.computeTiming();
      this.timeoutId = setTimeout(() => {
        this.setState(nextState, () => {
          this.setTimeout();
        });
      }, waitMs);
    }
    clearTimeout() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    }
  }
  NowTimer.contextType = ViewContextType;
  function buildDayRange(date) {
    let start = startOfDay(date);
    let end = addDays(start, 1);
    return {
      start,
      end
    };
  }
  class EventContainer extends BaseComponent {
    constructor() {
      super(...arguments);
      this.buildPublicEvent = memoize((context, eventDef, eventInstance) => new EventImpl(context, eventDef, eventInstance));
      this.handleEl = (el) => {
        this.el = el;
        if (el) {
          setElEventRange(el, this.props.eventRange);
        }
      };
    }
    render() {
      const { props, context } = this;
      const { options } = context;
      const { eventRange } = props;
      const { ui } = eventRange;
      const renderProps = {
        event: this.buildPublicEvent(context, eventRange.def, eventRange.instance),
        view: context.viewApi,
        timeText: props.timeText,
        textColor: ui.textColor,
        backgroundColor: ui.backgroundColor,
        borderColor: ui.borderColor,
        isDraggable: !props.disableDragging && computeEventRangeDraggable(eventRange, context),
        isStartResizable: !props.disableResizing && props.isStart && eventRange.ui.durationEditable && options.eventResizableFromStart,
        isEndResizable: !props.disableResizing && props.isEnd && eventRange.ui.durationEditable,
        isMirror: Boolean(props.isDragging || props.isResizing || props.isDateSelecting),
        isStart: Boolean(props.isStart),
        isEnd: Boolean(props.isEnd),
        isPast: Boolean(props.isPast),
        isFuture: Boolean(props.isFuture),
        isToday: Boolean(props.isToday),
        isSelected: Boolean(props.isSelected),
        isDragging: Boolean(props.isDragging),
        isResizing: Boolean(props.isResizing)
      };
      return _(ContentContainer, {
        attrs: props.attrs,
        className: joinClassNames(props.className, ...getEventClassNames(renderProps), ...eventRange.ui.classNames),
        style: props.style,
        elRef: this.handleEl,
        renderProps,
        generatorName: "eventContent",
        customGenerator: options.eventContent,
        defaultGenerator: props.defaultGenerator,
        tag: props.tag,
        classNameGenerator: options.eventClassNames,
        didMount: options.eventDidMount,
        willUnmount: options.eventWillUnmount
      }, props.children);
    }
    componentDidUpdate(prevProps) {
      if (this.el && this.props.eventRange !== prevProps.eventRange) {
        setElEventRange(this.el, this.props.eventRange);
      }
    }
  }
  class StandardEvent extends BaseComponent {
    render() {
      const { props, context } = this;
      const { eventRange } = props;
      const { options } = context;
      const timeFormat = options.eventTimeFormat || props.defaultTimeFormat;
      const timeText = buildEventRangeTimeText(timeFormat, eventRange, props.slicedStart, props.slicedEnd, props.isStart, props.isEnd, context, props.defaultDisplayEventTime, props.defaultDisplayEventEnd);
      const [tag, attrs] = getEventTagAndAttrs(eventRange, context);
      return _(EventContainer, Object.assign({}, props, {
        tag,
        style: {
          borderColor: eventRange.ui.borderColor,
          backgroundColor: eventRange.ui.backgroundColor
        },
        attrs,
        defaultGenerator: renderInnerContent$1,
        timeText
      }), (InnerContent, eventContentArg) => _(k$1, null, _(InnerContent, {
        tag: "div",
        className: "fc-event-inner",
        style: {
          color: eventContentArg.textColor
        }
      }), Boolean(eventContentArg.isStartResizable) && _("div", {
        className: "fc-event-resizer fc-event-resizer-start"
      }), Boolean(eventContentArg.isEndResizable) && _("div", {
        className: "fc-event-resizer fc-event-resizer-end"
      })));
    }
  }
  function renderInnerContent$1(innerProps) {
    return _(k$1, null, innerProps.timeText && _("div", {
      className: "fc-event-time"
    }, innerProps.timeText), _("div", {
      className: "fc-event-title-outer"
    }, _("div", {
      className: "fc-event-title"
    }, innerProps.event.title || _(k$1, null, "\xA0"))));
  }
  const DAY_NUM_FORMAT = createFormatter({
    day: "numeric"
  });
  class DayCellContainer extends BaseComponent {
    constructor() {
      super(...arguments);
      this.refineRenderProps = memoizeObjArg(refineRenderProps);
    }
    render() {
      let { props, context } = this;
      let { options } = context;
      let renderProps = this.refineRenderProps({
        date: props.date,
        dateMeta: props.dateMeta,
        isMonthStart: props.isMonthStart || false,
        showDayNumber: props.showDayNumber,
        renderProps: props.renderProps,
        viewApi: context.viewApi,
        dateEnv: context.dateEnv,
        monthStartFormat: options.monthStartFormat
      });
      return _(ContentContainer, Object.assign({}, props, {
        className: joinClassNames(props.className, getDayClassName(renderProps)),
        attrs: Object.assign(Object.assign(Object.assign({}, props.attrs), {
          "data-date": formatDayString(props.date)
        }), renderProps.isToday ? {
          "aria-current": "date"
        } : {}),
        renderProps,
        generatorName: "dayCellContent",
        customGenerator: options.dayCellContent,
        defaultGenerator: props.defaultGenerator,
        classNameGenerator: options.dayCellClassNames,
        didMount: options.dayCellDidMount,
        willUnmount: options.dayCellWillUnmount
      }));
    }
  }
  function hasCustomDayCellContent(options) {
    return Boolean(options.dayCellContent || hasCustomRenderingHandler("dayCellContent", options));
  }
  function refineRenderProps(raw) {
    let { date, dateEnv, isMonthStart } = raw;
    let dayNumberText = raw.showDayNumber ? dateEnv.format(date, isMonthStart ? raw.monthStartFormat : DAY_NUM_FORMAT) : "";
    return Object.assign(Object.assign(Object.assign({
      date: dateEnv.toDate(date),
      view: raw.viewApi
    }, raw.dateMeta), {
      isMonthStart,
      dayNumberText
    }), raw.renderProps);
  }
  class BgEvent extends BaseComponent {
    render() {
      let { props } = this;
      let { eventRange } = props;
      return _(EventContainer, {
        tag: "div",
        className: "fc-bg-event",
        style: {
          backgroundColor: eventRange.ui.backgroundColor
        },
        defaultGenerator: renderInnerContent$2,
        eventRange,
        isStart: props.isStart,
        isEnd: props.isEnd,
        timeText: "",
        isDragging: false,
        isResizing: false,
        isDateSelecting: false,
        isSelected: false,
        isPast: props.isPast,
        isFuture: props.isFuture,
        isToday: props.isToday,
        disableDragging: true,
        disableResizing: true
      });
    }
  }
  function renderInnerContent$2(props) {
    let { title } = props.event;
    return title && _("div", {
      className: "fc-event-title"
    }, props.event.title);
  }
  function renderFill(fillType) {
    return _("div", {
      className: `fc-${fillType}`
    });
  }
  const WeekNumberContainer = (props) => _(ViewContextType.Consumer, null, (context) => {
    let { dateEnv, options } = context;
    let { date } = props;
    let format = options.weekNumberFormat || props.defaultFormat;
    let num = dateEnv.computeWeekNumber(date);
    let text = dateEnv.format(date, format);
    let renderProps = {
      num,
      text,
      date
    };
    return _(ContentContainer, Object.assign({}, props, {
      renderProps,
      generatorName: "weekNumberContent",
      customGenerator: options.weekNumberContent,
      defaultGenerator: renderText,
      classNameGenerator: options.weekNumberClassNames,
      didMount: options.weekNumberDidMount,
      willUnmount: options.weekNumberWillUnmount
    }));
  });
  const PADDING_FROM_VIEWPORT = 10;
  const ROW_BORDER_WIDTH = 1;
  class Popover extends BaseComponent {
    constructor() {
      super(...arguments);
      this.closeRef = m$1();
      this.focusStartRef = m$1();
      this.focusEndRef = m$1();
      this.titleId = getUniqueDomId();
      this.handleRootEl = (el) => {
        this.rootEl = el;
        if (this.props.elRef) {
          setRef(this.props.elRef, el);
        }
      };
      this.handleDocumentMouseDown = (ev) => {
        const target = getEventTargetViaRoot(ev);
        if (!this.rootEl.contains(target)) {
          this.handleClose();
        }
      };
      this.handleDocumentKeyDown = (ev) => {
        if (ev.key === "Escape") {
          this.handleClose();
        }
      };
      this.handleClose = () => {
        let { onClose } = this.props;
        if (onClose) {
          onClose();
        }
      };
    }
    render() {
      let { theme, options } = this.context;
      let { props } = this;
      return j(_("div", Object.assign({}, props.attrs, {
        id: props.id,
        role: "dialog",
        "aria-labelledby": this.titleId,
        className: joinClassNames(props.className, "fc-popover", theme.getClassName("popover")),
        ref: this.handleRootEl
      }), _("div", {
        tabIndex: 0,
        style: {
          outline: "none"
        },
        ref: this.focusStartRef
      }), _("div", {
        className: "fc-popover-header " + theme.getClassName("popoverHeader")
      }, _("div", {
        className: "fc-popover-title",
        id: this.titleId
      }, props.title), _("div", Object.assign({
        role: "button",
        "aria-label": options.closeHint,
        className: "fc-popover-close " + theme.getIconClass("close")
      }, createAriaClickAttrs(this.handleClose), {
        ref: this.closeRef
      }))), _("div", {
        className: "fc-popover-body " + theme.getClassName("popoverContent")
      }, props.children), _("div", {
        tabIndex: 0,
        style: {
          outline: "none"
        },
        ref: this.focusEndRef
      })), props.parentEl);
    }
    componentDidMount() {
      document.addEventListener("mousedown", this.handleDocumentMouseDown);
      document.addEventListener("keydown", this.handleDocumentKeyDown);
      this.focusStartRef.current.addEventListener("focus", this.handleClose);
      this.focusEndRef.current.addEventListener("focus", this.handleClose);
      this.closeRef.current.focus({
        preventScroll: true
      });
      this.updateSize();
    }
    componentWillUnmount() {
      document.removeEventListener("mousedown", this.handleDocumentMouseDown);
      document.removeEventListener("keydown", this.handleDocumentKeyDown);
      this.focusStartRef.current.removeEventListener("focus", this.handleClose);
      this.focusEndRef.current.removeEventListener("focus", this.handleClose);
    }
    updateSize() {
      let { isRtl } = this.context;
      let { alignEl, alignParentTop } = this.props;
      let { rootEl } = this;
      let alignmentRect = computeClippedClientRect(alignEl);
      if (alignmentRect) {
        let popoverDims = rootEl.getBoundingClientRect();
        let popoverTop = alignParentTop ? alignEl.closest(alignParentTop).getBoundingClientRect().top - ROW_BORDER_WIDTH : alignmentRect.top;
        let popoverLeft = isRtl ? alignmentRect.right - popoverDims.width : alignmentRect.left;
        popoverTop = Math.max(popoverTop, PADDING_FROM_VIEWPORT);
        popoverLeft = Math.min(popoverLeft, document.documentElement.clientWidth - PADDING_FROM_VIEWPORT - popoverDims.width);
        popoverLeft = Math.max(popoverLeft, PADDING_FROM_VIEWPORT);
        let origin = rootEl.offsetParent.getBoundingClientRect();
        applyStyle(rootEl, {
          top: popoverTop - origin.top,
          left: popoverLeft - origin.left
        });
      }
    }
  }
  class MorePopover extends DateComponent {
    constructor() {
      super(...arguments);
      this.handleRootEl = (rootEl) => {
        this.rootEl = rootEl;
        if (rootEl) {
          this.context.registerInteractiveComponent(this, {
            el: rootEl,
            useEventCenter: false
          });
        } else {
          this.context.unregisterInteractiveComponent(this);
        }
      };
    }
    render() {
      let { options, dateEnv } = this.context;
      let { props } = this;
      let { startDate, todayRange, dateProfile } = props;
      let detaMeta = getDateMeta(startDate, todayRange, null, dateProfile);
      let title = dateEnv.format(startDate, options.dayPopoverFormat);
      return _(DayCellContainer, {
        elRef: this.handleRootEl,
        date: startDate,
        dateMeta: detaMeta
      }, (InnerContent, renderProps, attrs) => _(Popover, {
        elRef: attrs.ref,
        id: props.id,
        title,
        attrs,
        className: joinClassNames(attrs.className, "fc-more-popover"),
        parentEl: props.parentEl,
        alignEl: props.alignEl,
        alignParentTop: props.alignParentTop,
        onClose: props.onClose
      }, hasCustomDayCellContent(options) && _(InnerContent, {
        tag: "div",
        className: "fc-more-popover-misc"
      }), props.children));
    }
    queryHit(positionLeft, positionTop, elWidth, elHeight) {
      let { rootEl, props } = this;
      if (positionLeft >= 0 && positionLeft < elWidth && positionTop >= 0 && positionTop < elHeight) {
        return {
          dateProfile: props.dateProfile,
          dateSpan: Object.assign({
            allDay: !props.forceTimed,
            range: {
              start: props.startDate,
              end: props.endDate
            }
          }, props.dateSpanProps),
          getDayEl: () => rootEl,
          rect: {
            left: 0,
            top: 0,
            right: elWidth,
            bottom: elHeight
          },
          layer: 1
        };
      }
      return null;
    }
  }
  class MoreLinkContainer extends BaseComponent {
    constructor() {
      super(...arguments);
      this.state = {
        isPopoverOpen: false,
        popoverId: getUniqueDomId()
      };
      this.handleLinkEl = (linkEl) => {
        this.linkEl = linkEl;
        if (this.props.elRef) {
          setRef(this.props.elRef, linkEl);
        }
      };
      this.handleClick = (ev) => {
        let { props, context } = this;
        let { dateEnv, options } = context;
        let { moreLinkClick } = options;
        let date = computeRange(props).start;
        function buildPublicSeg(seg) {
          let { def, instance, range } = seg.eventRange;
          return {
            event: new EventImpl(context, def, instance),
            start: dateEnv.toDate(range.start),
            end: dateEnv.toDate(range.end),
            isStart: seg.isStart,
            isEnd: seg.isEnd
          };
        }
        if (typeof moreLinkClick === "function") {
          moreLinkClick = moreLinkClick({
            date: dateEnv.toDate(date),
            allDay: Boolean(props.allDayDate),
            allSegs: props.segs.map(buildPublicSeg),
            hiddenSegs: props.hiddenSegs.map(buildPublicSeg),
            jsEvent: ev,
            view: context.viewApi
          });
        }
        if (!moreLinkClick || moreLinkClick === "popover") {
          this.setState({
            isPopoverOpen: true
          });
        } else if (typeof moreLinkClick === "string") {
          context.calendarApi.zoomTo(date, moreLinkClick);
        }
      };
      this.handlePopoverClose = () => {
        if (this.linkEl) {
          this.linkEl.focus();
        }
        this.setState({
          isPopoverOpen: false
        });
      };
    }
    render() {
      let { props, state } = this;
      return _(ViewContextType.Consumer, null, (context) => {
        let { viewApi, options, calendarApi } = context;
        let { moreLinkText } = options;
        let moreCnt = props.hiddenSegs.length;
        let range = computeRange(props);
        let text = typeof moreLinkText === "function" ? moreLinkText.call(calendarApi, moreCnt) : `+${moreCnt} ${moreLinkText}`;
        let hint = formatWithOrdinals(options.moreLinkHint, [
          moreCnt
        ], text);
        let renderProps = {
          num: moreCnt,
          shortText: `+${moreCnt}`,
          text,
          view: viewApi
        };
        return _(k$1, null, Boolean(moreCnt) && _(ContentContainer, {
          tag: "div",
          elRef: this.handleLinkEl,
          className: joinClassNames(props.className, "fc-more-link"),
          style: props.style,
          attrs: Object.assign(Object.assign(Object.assign({}, props.attrs), createAriaClickAttrs(this.handleClick)), {
            title: hint,
            "role": "button",
            "aria-haspopup": "dialog",
            "aria-expanded": state.isPopoverOpen,
            "aria-controls": state.isPopoverOpen ? state.popoverId : void 0
          }),
          renderProps,
          generatorName: "moreLinkContent",
          customGenerator: options.moreLinkContent,
          defaultGenerator: props.defaultGenerator || renderMoreLinkInner,
          classNameGenerator: options.moreLinkClassNames,
          didMount: options.moreLinkDidMount,
          willUnmount: options.moreLinkWillUnmount
        }, props.children), state.isPopoverOpen && _(MorePopover, {
          id: state.popoverId,
          startDate: range.start,
          endDate: range.end,
          dateProfile: props.dateProfile,
          todayRange: props.todayRange,
          dateSpanProps: props.dateSpanProps,
          parentEl: this.parentEl,
          alignEl: props.alignElRef ? props.alignElRef.current : this.linkEl,
          alignParentTop: props.alignParentTop,
          forceTimed: props.forceTimed,
          onClose: this.handlePopoverClose
        }, props.popoverContent()));
      });
    }
    componentDidMount() {
      this.updateParentEl();
    }
    componentDidUpdate() {
      this.updateParentEl();
    }
    updateParentEl() {
      if (this.linkEl) {
        this.parentEl = this.linkEl.closest(".fc-view-outer");
      }
    }
  }
  function renderMoreLinkInner(props) {
    return props.text;
  }
  function computeRange(props) {
    if (props.allDayDate) {
      return {
        start: props.allDayDate,
        end: addDays(props.allDayDate, 1)
      };
    }
    return {
      start: computeEarliestStart(props.hiddenSegs),
      end: computeLatestEnd(props.hiddenSegs)
    };
  }
  class Store {
    constructor() {
      this.handlers = [];
    }
    set(value) {
      this.currentValue = value;
      for (let handler of this.handlers) {
        handler(value);
      }
    }
    subscribe(handler) {
      this.handlers.push(handler);
      if (this.currentValue !== void 0) {
        handler(this.currentValue);
      }
    }
  }
  class CustomRenderingStore extends Store {
    constructor() {
      super(...arguments);
      this.map = /* @__PURE__ */ new Map();
    }
    handle(customRendering) {
      const { map } = this;
      let updated = false;
      if (customRendering.isActive) {
        map.set(customRendering.id, customRendering);
        updated = true;
      } else if (map.has(customRendering.id)) {
        map.delete(customRendering.id);
        updated = true;
      }
      if (updated) {
        this.set(map);
      }
    }
  }
  class FooterScrollbar extends BaseComponent {
    constructor() {
      super(...arguments);
      this.rootElRef = m$1();
    }
    render() {
      const { props } = this;
      return _("div", {
        ref: this.rootElRef,
        className: joinClassNames("fc-footer-scrollbar", props.isSticky && "fc-footer-scrollbar-sticky")
      }, _(Scroller, {
        horizontal: true,
        ref: props.scrollerRef
      }, _("div", {
        style: {
          minWidth: props.canvasWidth
        }
      })));
    }
    componentDidMount() {
      this.disconnectHeight = watchHeight(this.rootElRef.current, (height) => {
        setRef(this.props.scrollbarWidthRef, height);
      });
    }
    componentWillUnmount() {
      this.disconnectHeight();
      setRef(this.props.scrollbarWidthRef, null);
    }
  }
  const globalLocales = [];
  const MINIMAL_RAW_EN_LOCALE = {
    code: "en",
    week: {
      dow: 0,
      doy: 4
    },
    direction: "ltr",
    buttonText: {
      prev: "prev",
      next: "next",
      prevYear: "prev year",
      nextYear: "next year",
      year: "year",
      today: "today",
      month: "month",
      week: "week",
      day: "day",
      list: "list"
    },
    weekText: "W",
    weekTextLong: "Week",
    closeHint: "Close",
    eventsHint: "Events",
    allDayText: "all-day",
    timedText: "timed",
    moreLinkText: "more",
    noEventsText: "No events to display"
  };
  const RAW_EN_LOCALE = Object.assign(Object.assign({}, MINIMAL_RAW_EN_LOCALE), {
    buttonHints: {
      prev: "Previous $0",
      next: "Next $0",
      today(buttonText, unit) {
        return unit === "day" ? "Today" : `This ${buttonText}`;
      }
    },
    viewHint: "$0 view",
    viewChangeHint: "Change view",
    navLinkHint: "Go to $0",
    moreLinkHint(eventCnt) {
      return `Show ${eventCnt} more event${eventCnt === 1 ? "" : "s"}`;
    }
  });
  function organizeRawLocales(explicitRawLocales) {
    let defaultCode = explicitRawLocales.length > 0 ? explicitRawLocales[0].code : "en";
    let allRawLocales = globalLocales.concat(explicitRawLocales);
    let rawLocaleMap = {
      en: RAW_EN_LOCALE
    };
    for (let rawLocale of allRawLocales) {
      rawLocaleMap[rawLocale.code] = rawLocale;
    }
    return {
      map: rawLocaleMap,
      defaultCode
    };
  }
  function buildLocale(inputSingular, available) {
    if (typeof inputSingular === "object" && !Array.isArray(inputSingular)) {
      return parseLocale(inputSingular.code, [
        inputSingular.code
      ], inputSingular);
    }
    return queryLocale(inputSingular, available);
  }
  function queryLocale(codeArg, available) {
    let codes = [].concat(codeArg || []);
    let raw = queryRawLocale(codes, available) || RAW_EN_LOCALE;
    return parseLocale(codeArg, codes, raw);
  }
  function queryRawLocale(codes, available) {
    for (let i2 = 0; i2 < codes.length; i2 += 1) {
      let parts = codes[i2].toLocaleLowerCase().split("-");
      for (let j2 = parts.length; j2 > 0; j2 -= 1) {
        let simpleId = parts.slice(0, j2).join("-");
        if (available[simpleId]) {
          return available[simpleId];
        }
      }
    }
    return null;
  }
  function parseLocale(codeArg, codes, raw) {
    let merged = mergeProps([
      MINIMAL_RAW_EN_LOCALE,
      raw
    ], [
      "buttonText"
    ]);
    delete merged.code;
    let { week } = merged;
    delete merged.week;
    return {
      codeArg,
      codes,
      week,
      simpleNumberFormat: new Intl.NumberFormat(codeArg),
      options: merged
    };
  }
  function createPlugin(input) {
    return {
      id: guid$1(),
      name: input.name,
      premiumReleaseDate: input.premiumReleaseDate ? new Date(input.premiumReleaseDate) : void 0,
      deps: input.deps || [],
      reducers: input.reducers || [],
      isLoadingFuncs: input.isLoadingFuncs || [],
      contextInit: [].concat(input.contextInit || []),
      eventRefiners: input.eventRefiners || {},
      eventDefMemberAdders: input.eventDefMemberAdders || [],
      eventSourceRefiners: input.eventSourceRefiners || {},
      isDraggableTransformers: input.isDraggableTransformers || [],
      eventDragMutationMassagers: input.eventDragMutationMassagers || [],
      eventDefMutationAppliers: input.eventDefMutationAppliers || [],
      dateSelectionTransformers: input.dateSelectionTransformers || [],
      datePointTransforms: input.datePointTransforms || [],
      dateSpanTransforms: input.dateSpanTransforms || [],
      views: input.views || {},
      viewPropsTransformers: input.viewPropsTransformers || [],
      isPropsValid: input.isPropsValid || null,
      externalDefTransforms: input.externalDefTransforms || [],
      viewContainerAppends: input.viewContainerAppends || [],
      eventDropTransformers: input.eventDropTransformers || [],
      componentInteractions: input.componentInteractions || [],
      calendarInteractions: input.calendarInteractions || [],
      themeClasses: input.themeClasses || {},
      eventSourceDefs: input.eventSourceDefs || [],
      cmdFormatter: input.cmdFormatter,
      recurringTypes: input.recurringTypes || [],
      namedTimeZonedImpl: input.namedTimeZonedImpl,
      initialView: input.initialView || "",
      elementDraggingImpl: input.elementDraggingImpl,
      optionChangeHandlers: input.optionChangeHandlers || {},
      scrollerSyncerClass: input.scrollerSyncerClass || null,
      listenerRefiners: input.listenerRefiners || {},
      optionRefiners: input.optionRefiners || {},
      propSetHandlers: input.propSetHandlers || {}
    };
  }
  function buildPluginHooks(pluginDefs, globalDefs) {
    let currentPluginIds = {};
    let hooks = {
      premiumReleaseDate: void 0,
      reducers: [],
      isLoadingFuncs: [],
      contextInit: [],
      eventRefiners: {},
      eventDefMemberAdders: [],
      eventSourceRefiners: {},
      isDraggableTransformers: [],
      eventDragMutationMassagers: [],
      eventDefMutationAppliers: [],
      dateSelectionTransformers: [],
      datePointTransforms: [],
      dateSpanTransforms: [],
      views: {},
      viewPropsTransformers: [],
      isPropsValid: null,
      externalDefTransforms: [],
      viewContainerAppends: [],
      eventDropTransformers: [],
      componentInteractions: [],
      calendarInteractions: [],
      themeClasses: {},
      eventSourceDefs: [],
      cmdFormatter: null,
      recurringTypes: [],
      namedTimeZonedImpl: null,
      initialView: "",
      elementDraggingImpl: null,
      optionChangeHandlers: {},
      scrollerSyncerClass: null,
      listenerRefiners: {},
      optionRefiners: {},
      propSetHandlers: {}
    };
    function addDefs(defs) {
      for (let def of defs) {
        const pluginName = def.name;
        const currentId = currentPluginIds[pluginName];
        if (currentId === void 0) {
          currentPluginIds[pluginName] = def.id;
          addDefs(def.deps);
          hooks = combineHooks(hooks, def);
        } else if (currentId !== def.id) {
          console.warn(`Duplicate plugin '${pluginName}'`);
        }
      }
    }
    if (pluginDefs) {
      addDefs(pluginDefs);
    }
    addDefs(globalDefs);
    return hooks;
  }
  function buildBuildPluginHooks() {
    let currentOverrideDefs = [];
    let currentGlobalDefs = [];
    let currentHooks;
    return (overrideDefs, globalDefs) => {
      if (!currentHooks || !isArraysEqual(overrideDefs, currentOverrideDefs) || !isArraysEqual(globalDefs, currentGlobalDefs)) {
        currentHooks = buildPluginHooks(overrideDefs, globalDefs);
      }
      currentOverrideDefs = overrideDefs;
      currentGlobalDefs = globalDefs;
      return currentHooks;
    };
  }
  function combineHooks(hooks0, hooks1) {
    return {
      premiumReleaseDate: compareOptionalDates(hooks0.premiumReleaseDate, hooks1.premiumReleaseDate),
      reducers: hooks0.reducers.concat(hooks1.reducers),
      isLoadingFuncs: hooks0.isLoadingFuncs.concat(hooks1.isLoadingFuncs),
      contextInit: hooks0.contextInit.concat(hooks1.contextInit),
      eventRefiners: Object.assign(Object.assign({}, hooks0.eventRefiners), hooks1.eventRefiners),
      eventDefMemberAdders: hooks0.eventDefMemberAdders.concat(hooks1.eventDefMemberAdders),
      eventSourceRefiners: Object.assign(Object.assign({}, hooks0.eventSourceRefiners), hooks1.eventSourceRefiners),
      isDraggableTransformers: hooks0.isDraggableTransformers.concat(hooks1.isDraggableTransformers),
      eventDragMutationMassagers: hooks0.eventDragMutationMassagers.concat(hooks1.eventDragMutationMassagers),
      eventDefMutationAppliers: hooks0.eventDefMutationAppliers.concat(hooks1.eventDefMutationAppliers),
      dateSelectionTransformers: hooks0.dateSelectionTransformers.concat(hooks1.dateSelectionTransformers),
      datePointTransforms: hooks0.datePointTransforms.concat(hooks1.datePointTransforms),
      dateSpanTransforms: hooks0.dateSpanTransforms.concat(hooks1.dateSpanTransforms),
      views: Object.assign(Object.assign({}, hooks0.views), hooks1.views),
      viewPropsTransformers: hooks0.viewPropsTransformers.concat(hooks1.viewPropsTransformers),
      isPropsValid: hooks1.isPropsValid || hooks0.isPropsValid,
      externalDefTransforms: hooks0.externalDefTransforms.concat(hooks1.externalDefTransforms),
      viewContainerAppends: hooks0.viewContainerAppends.concat(hooks1.viewContainerAppends),
      eventDropTransformers: hooks0.eventDropTransformers.concat(hooks1.eventDropTransformers),
      calendarInteractions: hooks0.calendarInteractions.concat(hooks1.calendarInteractions),
      componentInteractions: hooks0.componentInteractions.concat(hooks1.componentInteractions),
      themeClasses: Object.assign(Object.assign({}, hooks0.themeClasses), hooks1.themeClasses),
      eventSourceDefs: hooks0.eventSourceDefs.concat(hooks1.eventSourceDefs),
      cmdFormatter: hooks1.cmdFormatter || hooks0.cmdFormatter,
      recurringTypes: hooks0.recurringTypes.concat(hooks1.recurringTypes),
      namedTimeZonedImpl: hooks1.namedTimeZonedImpl || hooks0.namedTimeZonedImpl,
      initialView: hooks0.initialView || hooks1.initialView,
      elementDraggingImpl: hooks0.elementDraggingImpl || hooks1.elementDraggingImpl,
      optionChangeHandlers: Object.assign(Object.assign({}, hooks0.optionChangeHandlers), hooks1.optionChangeHandlers),
      scrollerSyncerClass: hooks0.scrollerSyncerClass || hooks1.scrollerSyncerClass,
      listenerRefiners: Object.assign(Object.assign({}, hooks0.listenerRefiners), hooks1.listenerRefiners),
      optionRefiners: Object.assign(Object.assign({}, hooks0.optionRefiners), hooks1.optionRefiners),
      propSetHandlers: Object.assign(Object.assign({}, hooks0.propSetHandlers), hooks1.propSetHandlers)
    };
  }
  function compareOptionalDates(date0, date1) {
    if (date0 === void 0) {
      return date1;
    }
    if (date1 === void 0) {
      return date0;
    }
    return new Date(Math.max(date0.valueOf(), date1.valueOf()));
  }
  class StandardTheme extends Theme {
  }
  StandardTheme.prototype.classes = {
    root: "fc-theme-standard",
    buttonGroup: "fc-button-group",
    button: "fc-button fc-button-primary",
    buttonActive: "fc-button-active"
  };
  StandardTheme.prototype.baseIconClass = "fc-icon";
  StandardTheme.prototype.iconClasses = {
    close: "fc-icon-x",
    prev: "fc-icon-chevron-left",
    next: "fc-icon-chevron-right",
    prevYear: "fc-icon-chevrons-left",
    nextYear: "fc-icon-chevrons-right"
  };
  StandardTheme.prototype.rtlIconClasses = {
    prev: "fc-icon-chevron-right",
    next: "fc-icon-chevron-left",
    prevYear: "fc-icon-chevrons-right",
    nextYear: "fc-icon-chevrons-left"
  };
  StandardTheme.prototype.iconOverrideOption = "buttonIcons";
  StandardTheme.prototype.iconOverrideCustomButtonOption = "icon";
  StandardTheme.prototype.iconOverridePrefix = "fc-icon-";
  function compileViewDefs(defaultConfigs, overrideConfigs) {
    let hash = {};
    let viewType;
    for (viewType in defaultConfigs) {
      ensureViewDef(viewType, hash, defaultConfigs, overrideConfigs);
    }
    for (viewType in overrideConfigs) {
      ensureViewDef(viewType, hash, defaultConfigs, overrideConfigs);
    }
    return hash;
  }
  function ensureViewDef(viewType, hash, defaultConfigs, overrideConfigs) {
    if (hash[viewType]) {
      return hash[viewType];
    }
    let viewDef = buildViewDef(viewType, hash, defaultConfigs, overrideConfigs);
    if (viewDef) {
      hash[viewType] = viewDef;
    }
    return viewDef;
  }
  function buildViewDef(viewType, hash, defaultConfigs, overrideConfigs) {
    let defaultConfig = defaultConfigs[viewType];
    let overrideConfig = overrideConfigs[viewType];
    let queryProp = (name) => defaultConfig && defaultConfig[name] !== null ? defaultConfig[name] : overrideConfig && overrideConfig[name] !== null ? overrideConfig[name] : null;
    let theComponent = queryProp("component");
    let superType = queryProp("superType");
    let superDef = null;
    if (superType) {
      if (superType === viewType) {
        throw new Error("Can't have a custom view type that references itself");
      }
      superDef = ensureViewDef(superType, hash, defaultConfigs, overrideConfigs);
    }
    if (!theComponent && superDef) {
      theComponent = superDef.component;
    }
    if (!theComponent) {
      return null;
    }
    return {
      type: viewType,
      component: theComponent,
      defaults: Object.assign(Object.assign({}, superDef ? superDef.defaults : {}), defaultConfig ? defaultConfig.rawOptions : {}),
      overrides: Object.assign(Object.assign({}, superDef ? superDef.overrides : {}), overrideConfig ? overrideConfig.rawOptions : {})
    };
  }
  function parseViewConfigs(inputs) {
    return mapHash(inputs, parseViewConfig);
  }
  function parseViewConfig(input) {
    let rawOptions = typeof input === "function" ? {
      component: input
    } : input;
    let { component } = rawOptions;
    if (rawOptions.content) {
      component = createViewHookComponent(rawOptions);
    } else if (component && !(component.prototype instanceof BaseComponent)) {
      component = createViewHookComponent(Object.assign(Object.assign({}, rawOptions), {
        content: component
      }));
    }
    return {
      superType: rawOptions.type,
      component,
      rawOptions
    };
  }
  function createViewHookComponent(options) {
    return (viewProps) => _(ViewContextType.Consumer, null, (context) => _(ContentContainer, {
      tag: "div",
      className: buildViewClassName(context.viewSpec),
      renderProps: Object.assign(Object.assign({}, viewProps), {
        nextDayThreshold: context.options.nextDayThreshold
      }),
      generatorName: void 0,
      customGenerator: options.content,
      classNameGenerator: options.classNames,
      didMount: options.didMount,
      willUnmount: options.willUnmount
    }));
  }
  function buildViewSpecs(defaultInputs, optionOverrides, dynamicOptionOverrides, localeDefaults) {
    let defaultConfigs = parseViewConfigs(defaultInputs);
    let overrideConfigs = parseViewConfigs(optionOverrides.views);
    let viewDefs = compileViewDefs(defaultConfigs, overrideConfigs);
    return mapHash(viewDefs, (viewDef) => buildViewSpec(viewDef, overrideConfigs, optionOverrides, dynamicOptionOverrides, localeDefaults));
  }
  function buildViewSpec(viewDef, overrideConfigs, optionOverrides, dynamicOptionOverrides, localeDefaults) {
    let durationInput = viewDef.overrides.duration || viewDef.defaults.duration || dynamicOptionOverrides.duration || optionOverrides.duration;
    let duration = null;
    let durationUnit = "";
    let singleUnit = "";
    let singleUnitOverrides = {};
    if (durationInput) {
      duration = createDurationCached(durationInput);
      if (duration) {
        let denom = greatestDurationDenominator(duration);
        durationUnit = denom.unit;
        if (denom.value === 1) {
          singleUnit = durationUnit;
          singleUnitOverrides = overrideConfigs[durationUnit] ? overrideConfigs[durationUnit].rawOptions : {};
        }
      }
    }
    let queryButtonText = (optionsSubset) => {
      let buttonTextMap = optionsSubset.buttonText || {};
      let buttonTextKey = viewDef.defaults.buttonTextKey;
      if (buttonTextKey != null && buttonTextMap[buttonTextKey] != null) {
        return buttonTextMap[buttonTextKey];
      }
      if (buttonTextMap[viewDef.type] != null) {
        return buttonTextMap[viewDef.type];
      }
      if (buttonTextMap[singleUnit] != null) {
        return buttonTextMap[singleUnit];
      }
      return null;
    };
    let queryButtonTitle = (optionsSubset) => {
      let buttonHints = optionsSubset.buttonHints || {};
      let buttonKey = viewDef.defaults.buttonTextKey;
      if (buttonKey != null && buttonHints[buttonKey] != null) {
        return buttonHints[buttonKey];
      }
      if (buttonHints[viewDef.type] != null) {
        return buttonHints[viewDef.type];
      }
      if (buttonHints[singleUnit] != null) {
        return buttonHints[singleUnit];
      }
      return null;
    };
    return {
      type: viewDef.type,
      component: viewDef.component,
      duration,
      durationUnit,
      singleUnit,
      optionDefaults: viewDef.defaults,
      optionOverrides: Object.assign(Object.assign({}, singleUnitOverrides), viewDef.overrides),
      buttonTextOverride: queryButtonText(dynamicOptionOverrides) || queryButtonText(optionOverrides) || viewDef.overrides.buttonText,
      buttonTextDefault: queryButtonText(localeDefaults) || viewDef.defaults.buttonText || queryButtonText(BASE_OPTION_DEFAULTS) || viewDef.type,
      buttonTitleOverride: queryButtonTitle(dynamicOptionOverrides) || queryButtonTitle(optionOverrides) || viewDef.overrides.buttonHint,
      buttonTitleDefault: queryButtonTitle(localeDefaults) || viewDef.defaults.buttonHint || queryButtonTitle(BASE_OPTION_DEFAULTS)
    };
  }
  let durationInputMap = {};
  function createDurationCached(durationInput) {
    let json = JSON.stringify(durationInput);
    let res = durationInputMap[json];
    if (res === void 0) {
      res = createDuration(durationInput);
      durationInputMap[json] = res;
    }
    return res;
  }
  function reduceViewType(viewType, action) {
    switch (action.type) {
      case "CHANGE_VIEW_TYPE":
        viewType = action.viewType;
    }
    return viewType;
  }
  function reduceDynamicOptionOverrides(dynamicOptionOverrides, action) {
    switch (action.type) {
      case "SET_OPTION":
        return Object.assign(Object.assign({}, dynamicOptionOverrides), {
          [action.optionName]: action.rawOptionValue
        });
      default:
        return dynamicOptionOverrides;
    }
  }
  function reduceDateProfile(currentDateProfile, action, currentDate, dateProfileGenerator) {
    let dp;
    switch (action.type) {
      case "CHANGE_VIEW_TYPE":
        return dateProfileGenerator.build(action.dateMarker || currentDate);
      case "CHANGE_DATE":
        return dateProfileGenerator.build(action.dateMarker);
      case "PREV":
        dp = dateProfileGenerator.buildPrev(currentDateProfile, currentDate);
        if (dp.isValid) {
          return dp;
        }
        break;
      case "NEXT":
        dp = dateProfileGenerator.buildNext(currentDateProfile, currentDate);
        if (dp.isValid) {
          return dp;
        }
        break;
    }
    return currentDateProfile;
  }
  function initEventSources(calendarOptions, dateProfile, context) {
    let activeRange = dateProfile ? dateProfile.activeRange : null;
    return addSources({}, parseInitialSources(calendarOptions, context), activeRange, context);
  }
  function reduceEventSources(eventSources, action, dateProfile, context) {
    let activeRange = dateProfile ? dateProfile.activeRange : null;
    switch (action.type) {
      case "ADD_EVENT_SOURCES":
        return addSources(eventSources, action.sources, activeRange, context);
      case "REMOVE_EVENT_SOURCE":
        return removeSource(eventSources, action.sourceId);
      case "PREV":
      case "NEXT":
      case "CHANGE_DATE":
      case "CHANGE_VIEW_TYPE":
        if (dateProfile) {
          return fetchDirtySources(eventSources, activeRange, context);
        }
        return eventSources;
      case "FETCH_EVENT_SOURCES":
        return fetchSourcesByIds(eventSources, action.sourceIds ? arrayToHash(action.sourceIds) : excludeStaticSources(eventSources, context), activeRange, action.isRefetch || false, context);
      case "RECEIVE_EVENTS":
      case "RECEIVE_EVENT_ERROR":
        return receiveResponse(eventSources, action.sourceId, action.fetchId, action.fetchRange);
      case "REMOVE_ALL_EVENT_SOURCES":
        return {};
      default:
        return eventSources;
    }
  }
  function reduceEventSourcesNewTimeZone(eventSources, dateProfile, context) {
    let activeRange = dateProfile ? dateProfile.activeRange : null;
    return fetchSourcesByIds(eventSources, excludeStaticSources(eventSources, context), activeRange, true, context);
  }
  function computeEventSourcesLoading(eventSources) {
    for (let sourceId in eventSources) {
      if (eventSources[sourceId].isFetching) {
        return true;
      }
    }
    return false;
  }
  function addSources(eventSourceHash, sources, fetchRange, context) {
    let hash = {};
    for (let source of sources) {
      hash[source.sourceId] = source;
    }
    if (fetchRange) {
      hash = fetchDirtySources(hash, fetchRange, context);
    }
    return Object.assign(Object.assign({}, eventSourceHash), hash);
  }
  function removeSource(eventSourceHash, sourceId) {
    return filterHash(eventSourceHash, (eventSource) => eventSource.sourceId !== sourceId);
  }
  function fetchDirtySources(sourceHash, fetchRange, context) {
    return fetchSourcesByIds(sourceHash, filterHash(sourceHash, (eventSource) => isSourceDirty(eventSource, fetchRange, context)), fetchRange, false, context);
  }
  function isSourceDirty(eventSource, fetchRange, context) {
    if (!doesSourceNeedRange(eventSource, context)) {
      return !eventSource.latestFetchId;
    }
    return !context.options.lazyFetching || !eventSource.fetchRange || eventSource.isFetching || fetchRange.start < eventSource.fetchRange.start || fetchRange.end > eventSource.fetchRange.end;
  }
  function fetchSourcesByIds(prevSources, sourceIdHash, fetchRange, isRefetch, context) {
    let nextSources = {};
    for (let sourceId in prevSources) {
      let source = prevSources[sourceId];
      if (sourceIdHash[sourceId]) {
        nextSources[sourceId] = fetchSource(source, fetchRange, isRefetch, context);
      } else {
        nextSources[sourceId] = source;
      }
    }
    return nextSources;
  }
  function fetchSource(eventSource, fetchRange, isRefetch, context) {
    let { options, calendarApi } = context;
    let sourceDef = context.pluginHooks.eventSourceDefs[eventSource.sourceDefId];
    let fetchId = guid$1();
    sourceDef.fetch({
      eventSource,
      range: fetchRange,
      isRefetch,
      context
    }, (res) => {
      let { rawEvents } = res;
      if (options.eventSourceSuccess) {
        rawEvents = options.eventSourceSuccess.call(calendarApi, rawEvents, res.response) || rawEvents;
      }
      if (eventSource.success) {
        rawEvents = eventSource.success.call(calendarApi, rawEvents, res.response) || rawEvents;
      }
      context.dispatch({
        type: "RECEIVE_EVENTS",
        sourceId: eventSource.sourceId,
        fetchId,
        fetchRange,
        rawEvents
      });
    }, (error) => {
      let errorHandled = false;
      if (options.eventSourceFailure) {
        options.eventSourceFailure.call(calendarApi, error);
        errorHandled = true;
      }
      if (eventSource.failure) {
        eventSource.failure(error);
        errorHandled = true;
      }
      if (!errorHandled) {
        console.warn(error.message, error);
      }
      context.dispatch({
        type: "RECEIVE_EVENT_ERROR",
        sourceId: eventSource.sourceId,
        fetchId,
        fetchRange,
        error
      });
    });
    return Object.assign(Object.assign({}, eventSource), {
      isFetching: true,
      latestFetchId: fetchId
    });
  }
  function receiveResponse(sourceHash, sourceId, fetchId, fetchRange) {
    let eventSource = sourceHash[sourceId];
    if (eventSource && fetchId === eventSource.latestFetchId) {
      return Object.assign(Object.assign({}, sourceHash), {
        [sourceId]: Object.assign(Object.assign({}, eventSource), {
          isFetching: false,
          fetchRange
        })
      });
    }
    return sourceHash;
  }
  function excludeStaticSources(eventSources, context) {
    return filterHash(eventSources, (eventSource) => doesSourceNeedRange(eventSource, context));
  }
  function parseInitialSources(rawOptions, context) {
    let refiners = buildEventSourceRefiners(context);
    let rawSources = [].concat(rawOptions.eventSources || []);
    let sources = [];
    if (rawOptions.initialEvents) {
      rawSources.unshift(rawOptions.initialEvents);
    }
    if (rawOptions.events) {
      rawSources.unshift(rawOptions.events);
    }
    for (let rawSource of rawSources) {
      let source = parseEventSource(rawSource, context, refiners);
      if (source) {
        sources.push(source);
      }
    }
    return sources;
  }
  function doesSourceNeedRange(eventSource, context) {
    let defs = context.pluginHooks.eventSourceDefs;
    return !defs[eventSource.sourceDefId].ignoreRange;
  }
  function reduceDateSelection(currentSelection, action) {
    switch (action.type) {
      case "UNSELECT_DATES":
        return null;
      case "SELECT_DATES":
        return action.selection;
      default:
        return currentSelection;
    }
  }
  function reduceSelectedEvent(currentInstanceId, action) {
    switch (action.type) {
      case "UNSELECT_EVENT":
        return "";
      case "SELECT_EVENT":
        return action.eventInstanceId;
      default:
        return currentInstanceId;
    }
  }
  function reduceEventDrag(currentDrag, action) {
    let newDrag;
    switch (action.type) {
      case "UNSET_EVENT_DRAG":
        return null;
      case "SET_EVENT_DRAG":
        newDrag = action.state;
        return {
          affectedEvents: newDrag.affectedEvents,
          mutatedEvents: newDrag.mutatedEvents,
          isEvent: newDrag.isEvent
        };
      default:
        return currentDrag;
    }
  }
  function reduceEventResize(currentResize, action) {
    let newResize;
    switch (action.type) {
      case "UNSET_EVENT_RESIZE":
        return null;
      case "SET_EVENT_RESIZE":
        newResize = action.state;
        return {
          affectedEvents: newResize.affectedEvents,
          mutatedEvents: newResize.mutatedEvents,
          isEvent: newResize.isEvent
        };
      default:
        return currentResize;
    }
  }
  function parseToolbars(calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) {
    let header = calendarOptions.headerToolbar ? parseToolbar(calendarOptions.headerToolbar, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) : null;
    let footer = calendarOptions.footerToolbar ? parseToolbar(calendarOptions.footerToolbar, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) : null;
    return {
      header,
      footer
    };
  }
  function parseToolbar(sectionStrHash, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) {
    let isRtl = calendarOptions.direction === "rtl";
    let viewsWithButtons = [];
    let hasTitle = false;
    function processSectionStr(sectionStr) {
      let sectionRes = parseSection(sectionStr, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi);
      viewsWithButtons.push(...sectionRes.viewsWithButtons);
      hasTitle = hasTitle || sectionRes.hasTitle;
      return sectionRes.widgets;
    }
    const sectionWidgets = {
      start: processSectionStr(sectionStrHash[isRtl ? "right" : "left"] || sectionStrHash.start || ""),
      center: processSectionStr(sectionStrHash.center || ""),
      end: processSectionStr(sectionStrHash[isRtl ? "left" : "right"] || sectionStrHash.end || "")
    };
    return {
      sectionWidgets,
      viewsWithButtons,
      hasTitle
    };
  }
  function parseSection(sectionStr, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) {
    let isRtl = calendarOptions.direction === "rtl";
    let calendarCustomButtons = calendarOptions.customButtons || {};
    let calendarButtonTextOverrides = calendarOptionOverrides.buttonText || {};
    let calendarButtonText = calendarOptions.buttonText || {};
    let calendarButtonHintOverrides = calendarOptionOverrides.buttonHints || {};
    let calendarButtonHints = calendarOptions.buttonHints || {};
    let sectionSubstrs = sectionStr ? sectionStr.split(" ") : [];
    let viewsWithButtons = [];
    let hasTitle = false;
    let widgets = sectionSubstrs.map((buttonGroupStr) => buttonGroupStr.split(",").map((buttonName) => {
      if (buttonName === "title") {
        hasTitle = true;
        return {
          buttonName
        };
      }
      let customButtonProps;
      let viewSpec;
      let buttonClick;
      let buttonIcon;
      let buttonText;
      let buttonHint;
      let isView = false;
      if (customButtonProps = calendarCustomButtons[buttonName]) {
        buttonClick = (ev) => {
          if (customButtonProps.click) {
            customButtonProps.click.call(ev.target, ev, ev.target);
          }
        };
        (buttonIcon = theme.getCustomButtonIconClass(customButtonProps)) || (buttonIcon = theme.getIconClass(buttonName, isRtl)) || (buttonText = customButtonProps.text);
        buttonHint = customButtonProps.hint || customButtonProps.text;
      } else if (viewSpec = viewSpecs[buttonName]) {
        isView = true;
        viewsWithButtons.push(buttonName);
        buttonClick = () => {
          calendarApi.changeView(buttonName);
        };
        (buttonText = viewSpec.buttonTextOverride) || (buttonIcon = theme.getIconClass(buttonName, isRtl)) || (buttonText = viewSpec.buttonTextDefault);
        let textFallback = viewSpec.buttonTextOverride || viewSpec.buttonTextDefault;
        buttonHint = formatWithOrdinals(viewSpec.buttonTitleOverride || viewSpec.buttonTitleDefault || calendarOptions.viewHint, [
          textFallback,
          buttonName
        ], textFallback);
      } else if (calendarApi[buttonName]) {
        buttonClick = () => {
          calendarApi[buttonName]();
        };
        (buttonText = calendarButtonTextOverrides[buttonName]) || (buttonIcon = theme.getIconClass(buttonName, isRtl)) || (buttonText = calendarButtonText[buttonName]);
        if (buttonName === "prevYear" || buttonName === "nextYear") {
          let prevOrNext = buttonName === "prevYear" ? "prev" : "next";
          buttonHint = formatWithOrdinals(calendarButtonHintOverrides[prevOrNext] || calendarButtonHints[prevOrNext], [
            calendarButtonText.year || "year",
            "year"
          ], calendarButtonText[buttonName]);
        } else {
          buttonHint = (navUnit) => formatWithOrdinals(calendarButtonHintOverrides[buttonName] || calendarButtonHints[buttonName], [
            calendarButtonText[navUnit] || navUnit,
            navUnit
          ], calendarButtonText[buttonName]);
        }
      }
      return {
        buttonName,
        buttonClick,
        buttonIcon,
        buttonText,
        buttonHint,
        isView
      };
    }));
    return {
      widgets,
      viewsWithButtons,
      hasTitle
    };
  }
  class ViewImpl {
    constructor(type, getCurrentData, dateEnv) {
      this.type = type;
      this.getCurrentData = getCurrentData;
      this.dateEnv = dateEnv;
    }
    get calendar() {
      return this.getCurrentData().calendarApi;
    }
    get title() {
      return this.getCurrentData().viewTitle;
    }
    get activeStart() {
      return this.dateEnv.toDate(this.getCurrentData().dateProfile.activeRange.start);
    }
    get activeEnd() {
      return this.dateEnv.toDate(this.getCurrentData().dateProfile.activeRange.end);
    }
    get currentStart() {
      return this.dateEnv.toDate(this.getCurrentData().dateProfile.currentRange.start);
    }
    get currentEnd() {
      return this.dateEnv.toDate(this.getCurrentData().dateProfile.currentRange.end);
    }
    getOption(name) {
      return this.getCurrentData().options[name];
    }
  }
  let eventSourceDef$2 = {
    ignoreRange: true,
    parseMeta(refined) {
      if (Array.isArray(refined.events)) {
        return refined.events;
      }
      return null;
    },
    fetch(arg, successCallback) {
      successCallback({
        rawEvents: arg.eventSource.meta
      });
    }
  };
  const arrayEventSourcePlugin = createPlugin({
    name: "array-event-source",
    eventSourceDefs: [
      eventSourceDef$2
    ]
  });
  let eventSourceDef$1 = {
    parseMeta(refined) {
      if (typeof refined.events === "function") {
        return refined.events;
      }
      return null;
    },
    fetch(arg, successCallback, errorCallback) {
      const { dateEnv } = arg.context;
      const func = arg.eventSource.meta;
      unpromisify(func.bind(null, buildRangeApiWithTimeZone(arg.range, dateEnv)), (rawEvents) => successCallback({
        rawEvents
      }), errorCallback);
    }
  };
  const funcEventSourcePlugin = createPlugin({
    name: "func-event-source",
    eventSourceDefs: [
      eventSourceDef$1
    ]
  });
  const JSON_FEED_EVENT_SOURCE_REFINERS = {
    method: String,
    extraParams: identity,
    startParam: String,
    endParam: String,
    timeZoneParam: String
  };
  let eventSourceDef = {
    parseMeta(refined) {
      if (refined.url && (refined.format === "json" || !refined.format)) {
        return {
          url: refined.url,
          format: "json",
          method: (refined.method || "GET").toUpperCase(),
          extraParams: refined.extraParams,
          startParam: refined.startParam,
          endParam: refined.endParam,
          timeZoneParam: refined.timeZoneParam
        };
      }
      return null;
    },
    fetch(arg, successCallback, errorCallback) {
      const { meta } = arg.eventSource;
      const requestParams = buildRequestParams(meta, arg.range, arg.context);
      requestJson(meta.method, meta.url, requestParams).then(([rawEvents, response]) => {
        successCallback({
          rawEvents,
          response
        });
      }, errorCallback);
    }
  };
  const jsonFeedEventSourcePlugin = createPlugin({
    name: "json-event-source",
    eventSourceRefiners: JSON_FEED_EVENT_SOURCE_REFINERS,
    eventSourceDefs: [
      eventSourceDef
    ]
  });
  function buildRequestParams(meta, range, context) {
    let { dateEnv, options } = context;
    let startParam;
    let endParam;
    let timeZoneParam;
    let customRequestParams;
    let params = {};
    startParam = meta.startParam;
    if (startParam == null) {
      startParam = options.startParam;
    }
    endParam = meta.endParam;
    if (endParam == null) {
      endParam = options.endParam;
    }
    timeZoneParam = meta.timeZoneParam;
    if (timeZoneParam == null) {
      timeZoneParam = options.timeZoneParam;
    }
    if (typeof meta.extraParams === "function") {
      customRequestParams = meta.extraParams();
    } else {
      customRequestParams = meta.extraParams || {};
    }
    Object.assign(params, customRequestParams);
    params[startParam] = dateEnv.formatIso(range.start);
    params[endParam] = dateEnv.formatIso(range.end);
    if (dateEnv.timeZone !== "local") {
      params[timeZoneParam] = dateEnv.timeZone;
    }
    return params;
  }
  const SIMPLE_RECURRING_REFINERS = {
    daysOfWeek: identity,
    startTime: createDuration,
    endTime: createDuration,
    duration: createDuration,
    startRecur: identity,
    endRecur: identity
  };
  let recurring = {
    parse(refined, dateEnv) {
      if (refined.daysOfWeek || refined.startTime || refined.endTime || refined.startRecur || refined.endRecur) {
        let recurringData = {
          daysOfWeek: refined.daysOfWeek || null,
          startTime: refined.startTime || null,
          endTime: refined.endTime || null,
          startRecur: refined.startRecur ? dateEnv.createMarker(refined.startRecur) : null,
          endRecur: refined.endRecur ? dateEnv.createMarker(refined.endRecur) : null
        };
        let duration;
        if (refined.duration) {
          duration = refined.duration;
        }
        if (!duration && refined.startTime && refined.endTime) {
          duration = subtractDurations(refined.endTime, refined.startTime);
        }
        return {
          allDayGuess: Boolean(!refined.startTime && !refined.endTime),
          duration,
          typeData: recurringData
        };
      }
      return null;
    },
    expand(typeData, framingRange, dateEnv) {
      let clippedFramingRange = intersectRanges(framingRange, {
        start: typeData.startRecur,
        end: typeData.endRecur
      });
      if (clippedFramingRange) {
        return expandRanges(typeData.daysOfWeek, typeData.startTime, clippedFramingRange, dateEnv);
      }
      return [];
    }
  };
  const simpleRecurringEventsPlugin = createPlugin({
    name: "simple-recurring-event",
    recurringTypes: [
      recurring
    ],
    eventRefiners: SIMPLE_RECURRING_REFINERS
  });
  function expandRanges(daysOfWeek, startTime, framingRange, dateEnv) {
    let dowHash = daysOfWeek ? arrayToHash(daysOfWeek) : null;
    let dayMarker = startOfDay(framingRange.start);
    let endMarker = framingRange.end;
    let instanceStarts = [];
    while (dayMarker < endMarker) {
      let instanceStart;
      if (!dowHash || dowHash[dayMarker.getUTCDay()]) {
        if (startTime) {
          instanceStart = dateEnv.add(dayMarker, startTime);
        } else {
          instanceStart = dayMarker;
        }
        instanceStarts.push(instanceStart);
      }
      dayMarker = addDays(dayMarker, 1);
    }
    return instanceStarts;
  }
  const changeHandlerPlugin = createPlugin({
    name: "change-handler",
    optionChangeHandlers: {
      events(events, context) {
        handleEventSources([
          events
        ], context);
      },
      eventSources: handleEventSources
    }
  });
  function handleEventSources(inputs, context) {
    let unfoundSources = hashValuesToArray(context.getCurrentData().eventSources);
    if (unfoundSources.length === 1 && inputs.length === 1 && Array.isArray(unfoundSources[0]._raw) && Array.isArray(inputs[0])) {
      context.dispatch({
        type: "RESET_RAW_EVENTS",
        sourceId: unfoundSources[0].sourceId,
        rawEvents: inputs[0]
      });
      return;
    }
    let newInputs = [];
    for (let input of inputs) {
      let inputFound = false;
      for (let i2 = 0; i2 < unfoundSources.length; i2 += 1) {
        if (unfoundSources[i2]._raw === input) {
          unfoundSources.splice(i2, 1);
          inputFound = true;
          break;
        }
      }
      if (!inputFound) {
        newInputs.push(input);
      }
    }
    for (let unfoundSource of unfoundSources) {
      context.dispatch({
        type: "REMOVE_EVENT_SOURCE",
        sourceId: unfoundSource.sourceId
      });
    }
    for (let newInput of newInputs) {
      context.calendarApi.addEventSource(newInput);
    }
  }
  function handleDateProfile(dateProfile, context) {
    context.emitter.trigger("datesSet", Object.assign(Object.assign({}, buildRangeApiWithTimeZone(dateProfile.activeRange, context.dateEnv)), {
      view: context.viewApi
    }));
  }
  function handleEventStore(eventStore, context) {
    let { emitter } = context;
    if (emitter.hasHandlers("eventsSet")) {
      emitter.trigger("eventsSet", buildEventApis(eventStore, context));
    }
  }
  const globalPlugins = [
    arrayEventSourcePlugin,
    funcEventSourcePlugin,
    jsonFeedEventSourcePlugin,
    simpleRecurringEventsPlugin,
    changeHandlerPlugin,
    createPlugin({
      name: "misc",
      isLoadingFuncs: [
        (state) => computeEventSourcesLoading(state.eventSources)
      ],
      propSetHandlers: {
        dateProfile: handleDateProfile,
        eventStore: handleEventStore
      }
    })
  ];
  class TaskRunner {
    constructor(runTaskOption, drainedOption) {
      this.runTaskOption = runTaskOption;
      this.drainedOption = drainedOption;
      this.queue = [];
      this.delayedRunner = new DelayedRunner(this.drain.bind(this));
    }
    request(task, delay) {
      this.queue.push(task);
      this.delayedRunner.request(delay);
    }
    pause(scope) {
      this.delayedRunner.pause(scope);
    }
    resume(scope, force) {
      this.delayedRunner.resume(scope, force);
    }
    drain() {
      let { queue } = this;
      while (queue.length) {
        let completedTasks = [];
        let task;
        while (task = queue.shift()) {
          this.runTask(task);
          completedTasks.push(task);
        }
        this.drained(completedTasks);
      }
    }
    runTask(task) {
      if (this.runTaskOption) {
        this.runTaskOption(task);
      }
    }
    drained(completedTasks) {
      if (this.drainedOption) {
        this.drainedOption(completedTasks);
      }
    }
  }
  function buildTitle(dateProfile, viewOptions, dateEnv) {
    let range;
    if (/^(year|month)$/.test(dateProfile.currentRangeUnit)) {
      range = dateProfile.currentRange;
    } else {
      range = dateProfile.activeRange;
    }
    return dateEnv.formatRange(range.start, range.end, createFormatter(viewOptions.titleFormat || buildTitleFormat(dateProfile)), {
      isEndExclusive: dateProfile.isRangeAllDay,
      defaultSeparator: viewOptions.titleRangeSeparator
    });
  }
  function buildTitleFormat(dateProfile) {
    let { currentRangeUnit } = dateProfile;
    if (currentRangeUnit === "year") {
      return {
        year: "numeric"
      };
    }
    if (currentRangeUnit === "month") {
      return {
        year: "numeric",
        month: "long"
      };
    }
    let days = diffWholeDays(dateProfile.currentRange.start, dateProfile.currentRange.end);
    if (days !== null && days > 1) {
      return {
        year: "numeric",
        month: "short",
        day: "numeric"
      };
    }
    return {
      year: "numeric",
      month: "long",
      day: "numeric"
    };
  }
  class CalendarDataManager {
    constructor(props) {
      this.computeCurrentViewData = memoize(this._computeCurrentViewData);
      this.organizeRawLocales = memoize(organizeRawLocales);
      this.buildLocale = memoize(buildLocale);
      this.buildPluginHooks = buildBuildPluginHooks();
      this.buildDateEnv = memoize(buildDateEnv$1);
      this.buildTheme = memoize(buildTheme);
      this.parseToolbars = memoize(parseToolbars);
      this.buildViewSpecs = memoize(buildViewSpecs);
      this.buildDateProfileGenerator = memoizeObjArg(buildDateProfileGenerator);
      this.buildViewApi = memoize(buildViewApi);
      this.buildViewUiProps = memoizeObjArg(buildViewUiProps);
      this.buildEventUiBySource = memoize(buildEventUiBySource, isPropsEqual);
      this.buildEventUiBases = memoize(buildEventUiBases);
      this.parseContextBusinessHours = memoizeObjArg(parseContextBusinessHours);
      this.buildTitle = memoize(buildTitle);
      this.emitter = new Emitter();
      this.actionRunner = new TaskRunner(this._handleAction.bind(this), this.updateData.bind(this));
      this.currentCalendarOptionsInput = {};
      this.currentCalendarOptionsRefined = {};
      this.currentViewOptionsInput = {};
      this.currentViewOptionsRefined = {};
      this.currentCalendarOptionsRefiners = {};
      this.optionsForRefining = [];
      this.optionsForHandling = [];
      this.getCurrentData = () => this.data;
      this.dispatch = (action) => {
        this.actionRunner.request(action);
      };
      this.props = props;
      this.actionRunner.pause();
      let dynamicOptionOverrides = {};
      let optionsData = this.computeOptionsData(props.optionOverrides, dynamicOptionOverrides, props.calendarApi);
      let currentViewType = optionsData.calendarOptions.initialView || optionsData.pluginHooks.initialView;
      let currentViewData = this.computeCurrentViewData(currentViewType, optionsData, props.optionOverrides, dynamicOptionOverrides);
      props.calendarApi.currentDataManager = this;
      this.emitter.setThisContext(props.calendarApi);
      this.emitter.setOptions(currentViewData.options);
      let currentDate = getInitialDate(optionsData.calendarOptions, optionsData.dateEnv);
      let dateProfile = currentViewData.dateProfileGenerator.build(currentDate);
      if (!rangeContainsMarker(dateProfile.activeRange, currentDate)) {
        currentDate = dateProfile.currentRange.start;
      }
      let calendarContext = {
        dateEnv: optionsData.dateEnv,
        options: optionsData.calendarOptions,
        pluginHooks: optionsData.pluginHooks,
        calendarApi: props.calendarApi,
        dispatch: this.dispatch,
        emitter: this.emitter,
        getCurrentData: this.getCurrentData
      };
      for (let callback of optionsData.pluginHooks.contextInit) {
        callback(calendarContext);
      }
      let eventSources = initEventSources(optionsData.calendarOptions, dateProfile, calendarContext);
      let initialState = {
        dynamicOptionOverrides,
        currentViewType,
        currentDate,
        dateProfile,
        businessHours: this.parseContextBusinessHours(calendarContext),
        eventSources,
        eventUiBases: {},
        eventStore: createEmptyEventStore(),
        renderableEventStore: createEmptyEventStore(),
        dateSelection: null,
        eventSelection: "",
        eventDrag: null,
        eventResize: null,
        selectionConfig: this.buildViewUiProps(calendarContext).selectionConfig
      };
      let contextAndState = Object.assign(Object.assign({}, calendarContext), initialState);
      for (let reducer of optionsData.pluginHooks.reducers) {
        Object.assign(initialState, reducer(null, null, contextAndState));
      }
      if (computeIsLoading(initialState, calendarContext)) {
        this.emitter.trigger("loading", true);
      }
      this.state = initialState;
      this.updateData();
      this.actionRunner.resume();
    }
    resetOptions(optionOverrides, changedOptionNames) {
      let { props } = this;
      if (changedOptionNames === void 0) {
        props.optionOverrides = optionOverrides;
      } else {
        props.optionOverrides = Object.assign(Object.assign({}, props.optionOverrides || {}), optionOverrides);
        this.optionsForRefining.push(...changedOptionNames);
      }
      if (changedOptionNames === void 0 || changedOptionNames.length) {
        this.actionRunner.request({
          type: "NOTHING"
        });
      }
    }
    _handleAction(action) {
      let { props, state, emitter } = this;
      let dynamicOptionOverrides = reduceDynamicOptionOverrides(state.dynamicOptionOverrides, action);
      let optionsData = this.computeOptionsData(props.optionOverrides, dynamicOptionOverrides, props.calendarApi);
      let currentViewType = reduceViewType(state.currentViewType, action);
      let currentViewData = this.computeCurrentViewData(currentViewType, optionsData, props.optionOverrides, dynamicOptionOverrides);
      props.calendarApi.currentDataManager = this;
      emitter.setThisContext(props.calendarApi);
      emitter.setOptions(currentViewData.options);
      let calendarContext = {
        dateEnv: optionsData.dateEnv,
        options: optionsData.calendarOptions,
        pluginHooks: optionsData.pluginHooks,
        calendarApi: props.calendarApi,
        dispatch: this.dispatch,
        emitter,
        getCurrentData: this.getCurrentData
      };
      let { currentDate, dateProfile } = state;
      if (this.data && this.data.dateProfileGenerator !== currentViewData.dateProfileGenerator) {
        dateProfile = currentViewData.dateProfileGenerator.build(currentDate);
      }
      currentDate = reduceCurrentDate(currentDate, action);
      dateProfile = reduceDateProfile(dateProfile, action, currentDate, currentViewData.dateProfileGenerator);
      if (action.type === "PREV" || action.type === "NEXT" || !rangeContainsMarker(dateProfile.currentRange, currentDate)) {
        currentDate = dateProfile.currentRange.start;
      }
      let eventSources = reduceEventSources(state.eventSources, action, dateProfile, calendarContext);
      let eventStore = reduceEventStore(state.eventStore, action, eventSources, dateProfile, calendarContext);
      let isEventsLoading = computeEventSourcesLoading(eventSources);
      let renderableEventStore = isEventsLoading && !currentViewData.options.progressiveEventRendering ? state.renderableEventStore || eventStore : eventStore;
      let { eventUiSingleBase, selectionConfig } = this.buildViewUiProps(calendarContext);
      let eventUiBySource = this.buildEventUiBySource(eventSources);
      let eventUiBases = this.buildEventUiBases(renderableEventStore.defs, eventUiSingleBase, eventUiBySource);
      let newState = {
        dynamicOptionOverrides,
        currentViewType,
        currentDate,
        dateProfile,
        eventSources,
        eventStore,
        renderableEventStore,
        selectionConfig,
        eventUiBases,
        businessHours: this.parseContextBusinessHours(calendarContext),
        dateSelection: reduceDateSelection(state.dateSelection, action),
        eventSelection: reduceSelectedEvent(state.eventSelection, action),
        eventDrag: reduceEventDrag(state.eventDrag, action),
        eventResize: reduceEventResize(state.eventResize, action)
      };
      let contextAndState = Object.assign(Object.assign({}, calendarContext), newState);
      for (let reducer of optionsData.pluginHooks.reducers) {
        Object.assign(newState, reducer(state, action, contextAndState));
      }
      let wasLoading = computeIsLoading(state, calendarContext);
      let isLoading = computeIsLoading(newState, calendarContext);
      if (!wasLoading && isLoading) {
        emitter.trigger("loading", true);
      } else if (wasLoading && !isLoading) {
        emitter.trigger("loading", false);
      }
      this.state = newState;
      if (props.onAction) {
        props.onAction(action);
      }
    }
    updateData() {
      let { props, state } = this;
      let oldData = this.data;
      let optionsData = this.computeOptionsData(props.optionOverrides, state.dynamicOptionOverrides, props.calendarApi);
      let currentViewData = this.computeCurrentViewData(state.currentViewType, optionsData, props.optionOverrides, state.dynamicOptionOverrides);
      let data = this.data = Object.assign(Object.assign(Object.assign({
        viewTitle: this.buildTitle(state.dateProfile, currentViewData.options, optionsData.dateEnv),
        calendarApi: props.calendarApi,
        dispatch: this.dispatch,
        emitter: this.emitter,
        getCurrentData: this.getCurrentData
      }, optionsData), currentViewData), state);
      let changeHandlers = optionsData.pluginHooks.optionChangeHandlers;
      let oldCalendarOptions = oldData && oldData.calendarOptions;
      let newCalendarOptions = optionsData.calendarOptions;
      if (oldCalendarOptions && oldCalendarOptions !== newCalendarOptions) {
        if (oldCalendarOptions.timeZone !== newCalendarOptions.timeZone) {
          state.eventSources = data.eventSources = reduceEventSourcesNewTimeZone(data.eventSources, state.dateProfile, data);
          state.eventStore = data.eventStore = rezoneEventStoreDates(data.eventStore, oldData.dateEnv, data.dateEnv);
          state.renderableEventStore = data.renderableEventStore = rezoneEventStoreDates(data.renderableEventStore, oldData.dateEnv, data.dateEnv);
        }
        for (let optionName in changeHandlers) {
          if (this.optionsForHandling.indexOf(optionName) !== -1 || oldCalendarOptions[optionName] !== newCalendarOptions[optionName]) {
            changeHandlers[optionName](newCalendarOptions[optionName], data);
          }
        }
      }
      this.optionsForHandling = [];
      if (props.onData) {
        props.onData(data);
      }
    }
    computeOptionsData(optionOverrides, dynamicOptionOverrides, calendarApi) {
      if (!this.optionsForRefining.length && optionOverrides === this.stableOptionOverrides && dynamicOptionOverrides === this.stableDynamicOptionOverrides) {
        return this.stableCalendarOptionsData;
      }
      let { refinedOptions, pluginHooks, localeDefaults, availableLocaleData, extra } = this.processRawCalendarOptions(optionOverrides, dynamicOptionOverrides);
      warnUnknownOptions(extra);
      let dateEnv = this.buildDateEnv(refinedOptions.timeZone, refinedOptions.locale, refinedOptions.weekNumberCalculation, refinedOptions.firstDay, refinedOptions.weekText, pluginHooks, availableLocaleData, refinedOptions.defaultRangeSeparator);
      let viewSpecs = this.buildViewSpecs(pluginHooks.views, this.stableOptionOverrides, this.stableDynamicOptionOverrides, localeDefaults);
      let theme = this.buildTheme(refinedOptions, pluginHooks);
      let toolbarConfig = this.parseToolbars(refinedOptions, this.stableOptionOverrides, theme, viewSpecs, calendarApi);
      return this.stableCalendarOptionsData = {
        calendarOptions: refinedOptions,
        pluginHooks,
        dateEnv,
        viewSpecs,
        theme,
        toolbarConfig,
        localeDefaults,
        availableRawLocales: availableLocaleData.map
      };
    }
    processRawCalendarOptions(optionOverrides, dynamicOptionOverrides) {
      let { locales, locale } = mergeRawOptions([
        BASE_OPTION_DEFAULTS,
        optionOverrides,
        dynamicOptionOverrides
      ]);
      let availableLocaleData = this.organizeRawLocales(locales);
      let availableRawLocales = availableLocaleData.map;
      let localeDefaults = this.buildLocale(locale || availableLocaleData.defaultCode, availableRawLocales).options;
      let pluginHooks = this.buildPluginHooks(optionOverrides.plugins || [], globalPlugins);
      let refiners = this.currentCalendarOptionsRefiners = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, BASE_OPTION_REFINERS), CALENDAR_LISTENER_REFINERS), CALENDAR_OPTION_REFINERS), pluginHooks.listenerRefiners), pluginHooks.optionRefiners);
      let extra = {};
      let raw = mergeRawOptions([
        BASE_OPTION_DEFAULTS,
        localeDefaults,
        optionOverrides,
        dynamicOptionOverrides
      ]);
      let refined = {};
      let currentRaw = this.currentCalendarOptionsInput;
      let currentRefined = this.currentCalendarOptionsRefined;
      let anyChanges = false;
      for (let optionName in raw) {
        if (this.optionsForRefining.indexOf(optionName) === -1 && (raw[optionName] === currentRaw[optionName] || COMPLEX_OPTION_COMPARATORS[optionName] && optionName in currentRaw && COMPLEX_OPTION_COMPARATORS[optionName](currentRaw[optionName], raw[optionName]))) {
          refined[optionName] = currentRefined[optionName];
        } else if (refiners[optionName]) {
          refined[optionName] = refiners[optionName](raw[optionName]);
          anyChanges = true;
        } else {
          extra[optionName] = currentRaw[optionName];
        }
      }
      if (anyChanges) {
        this.currentCalendarOptionsInput = raw;
        this.currentCalendarOptionsRefined = refined;
        this.stableOptionOverrides = optionOverrides;
        this.stableDynamicOptionOverrides = dynamicOptionOverrides;
      }
      this.optionsForHandling.push(...this.optionsForRefining);
      this.optionsForRefining = [];
      return {
        rawOptions: this.currentCalendarOptionsInput,
        refinedOptions: this.currentCalendarOptionsRefined,
        pluginHooks,
        availableLocaleData,
        localeDefaults,
        extra
      };
    }
    _computeCurrentViewData(viewType, optionsData, optionOverrides, dynamicOptionOverrides) {
      let viewSpec = optionsData.viewSpecs[viewType];
      if (!viewSpec) {
        throw new Error(`viewType "${viewType}" is not available. Please make sure you've loaded all neccessary plugins`);
      }
      let { refinedOptions, extra } = this.processRawViewOptions(viewSpec, optionsData.pluginHooks, optionsData.localeDefaults, optionOverrides, dynamicOptionOverrides);
      warnUnknownOptions(extra);
      let dateProfileGenerator = this.buildDateProfileGenerator({
        dateProfileGeneratorClass: viewSpec.optionDefaults.dateProfileGeneratorClass,
        duration: viewSpec.duration,
        durationUnit: viewSpec.durationUnit,
        usesMinMaxTime: viewSpec.optionDefaults.usesMinMaxTime,
        dateEnv: optionsData.dateEnv,
        calendarApi: this.props.calendarApi,
        slotMinTime: refinedOptions.slotMinTime,
        slotMaxTime: refinedOptions.slotMaxTime,
        showNonCurrentDates: refinedOptions.showNonCurrentDates,
        dayCount: refinedOptions.dayCount,
        dateAlignment: refinedOptions.dateAlignment,
        dateIncrement: refinedOptions.dateIncrement,
        hiddenDays: refinedOptions.hiddenDays,
        weekends: refinedOptions.weekends,
        nowInput: refinedOptions.now,
        validRangeInput: refinedOptions.validRange,
        visibleRangeInput: refinedOptions.visibleRange,
        fixedWeekCount: refinedOptions.fixedWeekCount
      });
      let viewApi = this.buildViewApi(viewType, this.getCurrentData, optionsData.dateEnv);
      return {
        viewSpec,
        options: refinedOptions,
        dateProfileGenerator,
        viewApi
      };
    }
    processRawViewOptions(viewSpec, pluginHooks, localeDefaults, optionOverrides, dynamicOptionOverrides) {
      let raw = mergeRawOptions([
        BASE_OPTION_DEFAULTS,
        viewSpec.optionDefaults,
        localeDefaults,
        optionOverrides,
        viewSpec.optionOverrides,
        dynamicOptionOverrides
      ]);
      let refiners = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, BASE_OPTION_REFINERS), CALENDAR_LISTENER_REFINERS), CALENDAR_OPTION_REFINERS), VIEW_OPTION_REFINERS), pluginHooks.listenerRefiners), pluginHooks.optionRefiners);
      let refined = {};
      let currentRaw = this.currentViewOptionsInput;
      let currentRefined = this.currentViewOptionsRefined;
      let anyChanges = false;
      let extra = {};
      for (let optionName in raw) {
        if (raw[optionName] === currentRaw[optionName] || COMPLEX_OPTION_COMPARATORS[optionName] && COMPLEX_OPTION_COMPARATORS[optionName](raw[optionName], currentRaw[optionName])) {
          refined[optionName] = currentRefined[optionName];
        } else {
          if (raw[optionName] === this.currentCalendarOptionsInput[optionName] || COMPLEX_OPTION_COMPARATORS[optionName] && COMPLEX_OPTION_COMPARATORS[optionName](raw[optionName], this.currentCalendarOptionsInput[optionName])) {
            if (optionName in this.currentCalendarOptionsRefined) {
              refined[optionName] = this.currentCalendarOptionsRefined[optionName];
            }
          } else if (refiners[optionName]) {
            refined[optionName] = refiners[optionName](raw[optionName]);
          } else {
            extra[optionName] = raw[optionName];
          }
          anyChanges = true;
        }
      }
      if (anyChanges) {
        this.currentViewOptionsInput = raw;
        this.currentViewOptionsRefined = refined;
      }
      return {
        rawOptions: this.currentViewOptionsInput,
        refinedOptions: this.currentViewOptionsRefined,
        extra
      };
    }
  }
  function buildDateEnv$1(timeZone, explicitLocale, weekNumberCalculation, firstDay, weekText, pluginHooks, availableLocaleData, defaultSeparator) {
    let locale = buildLocale(explicitLocale || availableLocaleData.defaultCode, availableLocaleData.map);
    return new DateEnv({
      calendarSystem: "gregory",
      timeZone,
      namedTimeZoneImpl: pluginHooks.namedTimeZonedImpl,
      locale,
      weekNumberCalculation,
      firstDay,
      weekText,
      cmdFormatter: pluginHooks.cmdFormatter,
      defaultSeparator
    });
  }
  function buildTheme(options, pluginHooks) {
    let ThemeClass = pluginHooks.themeClasses[options.themeSystem] || StandardTheme;
    return new ThemeClass(options);
  }
  function buildDateProfileGenerator(props) {
    let DateProfileGeneratorClass = props.dateProfileGeneratorClass || DateProfileGenerator;
    return new DateProfileGeneratorClass(props);
  }
  function buildViewApi(type, getCurrentData, dateEnv) {
    return new ViewImpl(type, getCurrentData, dateEnv);
  }
  function buildEventUiBySource(eventSources) {
    return mapHash(eventSources, (eventSource) => eventSource.ui);
  }
  function buildEventUiBases(eventDefs, eventUiSingleBase, eventUiBySource) {
    let eventUiBases = {
      "": eventUiSingleBase
    };
    for (let defId in eventDefs) {
      let def = eventDefs[defId];
      if (def.sourceId && eventUiBySource[def.sourceId]) {
        eventUiBases[defId] = eventUiBySource[def.sourceId];
      }
    }
    return eventUiBases;
  }
  function buildViewUiProps(calendarContext) {
    let { options } = calendarContext;
    return {
      eventUiSingleBase: createEventUi({
        display: options.eventDisplay,
        editable: options.editable,
        startEditable: options.eventStartEditable,
        durationEditable: options.eventDurationEditable,
        constraint: options.eventConstraint,
        overlap: typeof options.eventOverlap === "boolean" ? options.eventOverlap : void 0,
        allow: options.eventAllow,
        backgroundColor: options.eventBackgroundColor,
        borderColor: options.eventBorderColor,
        textColor: options.eventTextColor,
        color: options.eventColor
      }, calendarContext),
      selectionConfig: createEventUi({
        constraint: options.selectConstraint,
        overlap: typeof options.selectOverlap === "boolean" ? options.selectOverlap : void 0,
        allow: options.selectAllow
      }, calendarContext)
    };
  }
  function computeIsLoading(state, context) {
    for (let isLoadingFunc of context.pluginHooks.isLoadingFuncs) {
      if (isLoadingFunc(state)) {
        return true;
      }
    }
    return false;
  }
  function parseContextBusinessHours(calendarContext) {
    return parseBusinessHours(calendarContext.options.businessHours, calendarContext);
  }
  function warnUnknownOptions(options, viewName) {
    for (let optionName in options) {
      console.warn(`Unknown option '${optionName}'`);
    }
  }
  class ToolbarSection extends BaseComponent {
    render() {
      let children = this.props.widgetGroups.map((widgetGroup) => this.renderWidgetGroup(widgetGroup));
      return _("div", {
        className: "fc-toolbar-section fc-toolbar-" + this.props.name
      }, ...children);
    }
    renderWidgetGroup(widgetGroup) {
      let { props, context } = this;
      let { options, theme } = context;
      let children = [];
      let isOnlyButtons = true;
      let isOnlyView = true;
      for (const widget of widgetGroup) {
        const { buttonName, isView } = widget;
        if (buttonName === "title") {
          isOnlyButtons = false;
        } else if (!isView) {
          isOnlyView = false;
        }
      }
      for (let widget of widgetGroup) {
        let { buttonName, buttonClick, buttonText, buttonIcon, buttonHint } = widget;
        if (buttonName === "title") {
          children.push(_("div", {
            role: "heading",
            "aria-level": options.headingLevel,
            id: props.titleId,
            className: "fc-toolbar-title"
          }, props.title));
        } else {
          let isPressed = buttonName === props.activeButton;
          let isDisabled = !props.isTodayEnabled && buttonName === "today" || !props.isPrevEnabled && buttonName === "prev" || !props.isNextEnabled && buttonName === "next";
          children.push(_("button", Object.assign({
            type: "button",
            disabled: isDisabled
          }, isOnlyButtons && isOnlyView ? {
            "role": "tab",
            "aria-selected": isPressed
          } : {
            "aria-pressed": isPressed
          }, {
            "aria-label": typeof buttonHint === "function" ? buttonHint(props.navUnit) : buttonHint,
            className: joinClassNames(`fc-${buttonName}-button`, theme.getClassName("button"), isPressed && theme.getClassName("buttonActive")),
            onClick: buttonClick
          }), buttonText || (buttonIcon ? _("span", {
            className: buttonIcon,
            "aria-hidden": true
          }) : "")));
        }
      }
      if (children.length > 1) {
        return _("div", {
          role: isOnlyButtons && isOnlyView ? "tablist" : void 0,
          "aria-label": isOnlyButtons && isOnlyView ? options.viewChangeHint : void 0,
          className: isOnlyButtons ? theme.getClassName("buttonGroup") : void 0
        }, ...children);
      }
      return children[0];
    }
  }
  class Toolbar extends BaseComponent {
    render() {
      let { model, className } = this.props;
      let { sectionWidgets } = model;
      return _("div", {
        className: joinClassNames(className, "fc-toolbar")
      }, this.renderSection("start", sectionWidgets.start), this.renderSection("center", sectionWidgets.center), this.renderSection("end", sectionWidgets.end));
    }
    renderSection(key, widgetGroups) {
      let { props } = this;
      return _(ToolbarSection, {
        key,
        name: key,
        widgetGroups,
        title: props.title,
        titleId: props.titleId,
        navUnit: props.navUnit,
        activeButton: props.activeButton,
        isTodayEnabled: props.isTodayEnabled,
        isPrevEnabled: props.isPrevEnabled,
        isNextEnabled: props.isNextEnabled
      });
    }
  }
  class EventClicking extends Interaction {
    constructor(settings) {
      super(settings);
      this.handleSegClick = (ev, segEl) => {
        let { component } = this;
        let { context } = component;
        let eventRange = getElEventRange(segEl);
        if (eventRange && component.isValidSegDownEl(ev.target)) {
          context.emitter.trigger("eventClick", {
            el: segEl,
            event: new EventImpl(component.context, eventRange.def, eventRange.instance),
            jsEvent: ev,
            view: context.viewApi
          });
        }
      };
      this.destroy = listenBySelector(settings.el, "click", ".fc-event", this.handleSegClick);
    }
  }
  class EventHovering extends Interaction {
    constructor(settings) {
      super(settings);
      this.handleEventElRemove = (el) => {
        if (el === this.currentSegEl) {
          this.handleSegLeave(null, this.currentSegEl);
        }
      };
      this.handleSegEnter = (ev, segEl) => {
        if (getElEventRange(segEl)) {
          this.currentSegEl = segEl;
          this.triggerEvent("eventMouseEnter", ev, segEl);
        }
      };
      this.handleSegLeave = (ev, segEl) => {
        if (this.currentSegEl) {
          this.currentSegEl = null;
          this.triggerEvent("eventMouseLeave", ev, segEl);
        }
      };
      this.removeHoverListeners = listenToHoverBySelector(settings.el, ".fc-event", this.handleSegEnter, this.handleSegLeave);
    }
    destroy() {
      this.removeHoverListeners();
    }
    triggerEvent(publicEvName, ev, segEl) {
      let { component } = this;
      let { context } = component;
      let eventRange = getElEventRange(segEl);
      if (!ev || component.isValidSegDownEl(ev.target)) {
        context.emitter.trigger(publicEvName, {
          el: segEl,
          event: new EventImpl(context, eventRange.def, eventRange.instance),
          jsEvent: ev,
          view: context.viewApi
        });
      }
    }
  }
  class ViewHarness extends b {
    render() {
      const { props } = this;
      return _("div", {
        className: joinClassNames("fc-view-outer", props.height != null ? "fc-view-outer-static" : props.heightLiquid ? "fc-view-outer-liquid" : props.aspectRatio != null && "fc-view-outer-aspect-ratio"),
        style: {
          height: props.height,
          paddingBottom: props.aspectRatio != null ? `${1 / props.aspectRatio * 100}%` : void 0
        }
      }, props.children);
    }
  }
  class CalendarContent extends PureComponent {
    constructor() {
      super(...arguments);
      this.buildViewContext = memoize(buildViewContext);
      this.buildViewPropTransformers = memoize(buildViewPropTransformers);
      this.buildToolbarProps = memoize(buildToolbarProps);
      this.interactionsStore = {};
      this.viewTitleId = getUniqueDomId();
      this.registerInteractiveComponent = (component, settingsInput) => {
        let settings = parseInteractionSettings(component, settingsInput);
        let DEFAULT_INTERACTIONS = [
          EventClicking,
          EventHovering
        ];
        let interactionClasses = DEFAULT_INTERACTIONS;
        if (!settingsInput.disableHits) {
          interactionClasses = interactionClasses.concat(this.props.pluginHooks.componentInteractions);
        }
        let interactions = interactionClasses.map((TheInteractionClass) => new TheInteractionClass(settings));
        this.interactionsStore[component.uid] = interactions;
        interactionSettingsStore[component.uid] = settings;
      };
      this.unregisterInteractiveComponent = (component) => {
        let listeners = this.interactionsStore[component.uid];
        if (listeners) {
          for (let listener of listeners) {
            listener.destroy();
          }
          delete this.interactionsStore[component.uid];
        }
        delete interactionSettingsStore[component.uid];
      };
    }
    render() {
      let { props } = this;
      let { toolbarConfig, options } = props;
      let toolbarProps = this.buildToolbarProps(props.viewSpec, props.dateProfile, props.dateProfileGenerator, props.currentDate, getNow(props.options.now, props.dateEnv), props.viewTitle);
      let viewHeight;
      let viewHeightLiquid = false;
      let viewAspectRatio;
      if (props.forPrint || getIsHeightAuto(options)) ;
      else if (options.height != null) {
        viewHeightLiquid = true;
      } else if (options.contentHeight != null) {
        viewHeight = options.contentHeight;
      } else {
        viewAspectRatio = Math.max(options.aspectRatio, 0.5);
      }
      let viewContext = this.buildViewContext(props.viewSpec, props.viewApi, props.options, props.dateProfileGenerator, props.dateEnv, props.theme, props.pluginHooks, props.dispatch, props.getCurrentData, props.emitter, props.calendarApi, this.registerInteractiveComponent, this.unregisterInteractiveComponent);
      return _(ViewContextType.Provider, {
        value: viewContext
      }, toolbarConfig.header && _(Toolbar, Object.assign({
        className: "fc-header-toolbar",
        model: toolbarConfig.header,
        titleId: this.viewTitleId
      }, toolbarProps)), _(ViewHarness, {
        height: viewHeight,
        heightLiquid: viewHeightLiquid,
        aspectRatio: viewAspectRatio
      }, this.renderView(props, toolbarProps.title), this.buildAppendContent()), toolbarConfig.footer && _(Toolbar, Object.assign({
        className: "fc-footer-toolbar",
        model: toolbarConfig.footer
      }, toolbarProps)));
    }
    componentDidMount() {
      let { props } = this;
      this.calendarInteractions = props.pluginHooks.calendarInteractions.map((CalendarInteractionClass) => new CalendarInteractionClass(props));
      let { propSetHandlers } = props.pluginHooks;
      for (let propName in propSetHandlers) {
        propSetHandlers[propName](props[propName], props);
      }
    }
    componentDidUpdate(prevProps) {
      let { props } = this;
      let { propSetHandlers } = props.pluginHooks;
      for (let propName in propSetHandlers) {
        if (props[propName] !== prevProps[propName]) {
          propSetHandlers[propName](props[propName], props);
        }
      }
    }
    componentWillUnmount() {
      for (let interaction of this.calendarInteractions) {
        interaction.destroy();
      }
      this.props.emitter.trigger("_unmount");
    }
    buildAppendContent() {
      let { props } = this;
      let children = props.pluginHooks.viewContainerAppends.map((buildAppendContent) => buildAppendContent(props));
      return _(k$1, {}, ...children);
    }
    renderView(props, title) {
      let { pluginHooks } = props;
      let { viewSpec, toolbarConfig } = props;
      let viewProps = {
        dateProfile: props.dateProfile,
        businessHours: props.businessHours,
        eventStore: props.renderableEventStore,
        eventUiBases: props.eventUiBases,
        dateSelection: props.dateSelection,
        eventSelection: props.eventSelection,
        eventDrag: props.eventDrag,
        eventResize: props.eventResize,
        forPrint: props.forPrint,
        labelId: toolbarConfig.header && toolbarConfig.header.hasTitle ? this.viewTitleId : void 0,
        labelStr: toolbarConfig.header && toolbarConfig.header.hasTitle ? void 0 : title
      };
      let transformers = this.buildViewPropTransformers(pluginHooks.viewPropsTransformers);
      for (let transformer of transformers) {
        Object.assign(viewProps, transformer.transform(viewProps, props));
      }
      let ViewComponent = viewSpec.component;
      return _(ViewComponent, Object.assign({}, viewProps));
    }
  }
  function buildToolbarProps(viewSpec, dateProfile, dateProfileGenerator, currentDate, now, title) {
    let todayInfo = dateProfileGenerator.build(now, void 0, false);
    let prevInfo = dateProfileGenerator.buildPrev(dateProfile, currentDate, false);
    let nextInfo = dateProfileGenerator.buildNext(dateProfile, currentDate, false);
    return {
      title,
      activeButton: viewSpec.type,
      navUnit: viewSpec.singleUnit,
      isTodayEnabled: todayInfo.isValid && !rangeContainsMarker(dateProfile.currentRange, now),
      isPrevEnabled: prevInfo.isValid,
      isNextEnabled: nextInfo.isValid
    };
  }
  function buildViewPropTransformers(theClasses) {
    return theClasses.map((TheClass) => new TheClass());
  }
  class Calendar extends CalendarImpl {
    constructor(el, optionOverrides = {}) {
      super();
      this.isRendering = false;
      this.isRendered = false;
      this.currentClassNames = [];
      this.customContentRenderId = 0;
      this.handleAction = (action) => {
        switch (action.type) {
          case "SET_EVENT_DRAG":
          case "SET_EVENT_RESIZE":
            this.renderRunner.tryDrain();
        }
      };
      this.handleData = (data) => {
        this.currentData = data;
        this.renderRunner.request(data.calendarOptions.rerenderDelay);
      };
      this.handleRenderRequest = () => {
        if (this.isRendering) {
          this.isRendered = true;
          let { currentData } = this;
          flushSync(() => {
            B$2(_(CalendarRoot, {
              options: currentData.calendarOptions,
              theme: currentData.theme,
              emitter: currentData.emitter
            }, (classNames, height, forPrint) => {
              this.setClassNames(classNames);
              this.setHeight(height);
              return _(RenderId.Provider, {
                value: this.customContentRenderId
              }, _(CalendarContent, Object.assign({
                forPrint
              }, currentData)));
            }), this.el);
          });
        } else if (this.isRendered) {
          this.isRendered = false;
          B$2(null, this.el);
          this.setClassNames([]);
          this.setHeight("");
        }
      };
      ensureElHasStyles(el);
      this.el = el;
      this.renderRunner = new DelayedRunner(this.handleRenderRequest);
      new CalendarDataManager({
        optionOverrides,
        calendarApi: this,
        onAction: this.handleAction,
        onData: this.handleData
      });
    }
    render() {
      let wasRendering = this.isRendering;
      if (!wasRendering) {
        this.isRendering = true;
      } else {
        this.customContentRenderId += 1;
      }
      this.renderRunner.request();
      if (wasRendering) {
        this.updateSize();
      }
    }
    destroy() {
      if (this.isRendering) {
        this.isRendering = false;
        this.renderRunner.request();
      }
    }
    batchRendering(func) {
      this.renderRunner.pause("batchRendering");
      func();
      this.renderRunner.resume("batchRendering");
    }
    pauseRendering() {
      this.renderRunner.pause("pauseRendering");
    }
    resumeRendering() {
      this.renderRunner.resume("pauseRendering", true);
    }
    resetOptions(optionOverrides, changedOptionNames) {
      this.currentDataManager.resetOptions(optionOverrides, changedOptionNames);
    }
    setClassNames(classNames) {
      if (!isArraysEqual(classNames, this.currentClassNames)) {
        let { classList } = this.el;
        for (let className of this.currentClassNames) {
          classList.remove(className);
        }
        for (let className of classNames) {
          classList.add(className);
        }
        this.currentClassNames = classNames;
      }
    }
    setHeight(height) {
      applyStyleProp(this.el, "height", height);
    }
  }
  const OPTION_IS_COMPLEX = {
    headerToolbar: true,
    footerToolbar: true,
    events: true,
    eventSources: true,
    resources: true
  };
  const FullCalendar = defineComponent({
    props: {
      options: Object
    },
    data() {
      return {
        renderId: 0,
        customRenderingMap: /* @__PURE__ */ new Map()
      };
    },
    methods: {
      getApi() {
        return getSecret(this).calendar;
      },
      buildOptions(suppliedOptions) {
        return __spreadProps(__spreadValues({}, suppliedOptions), {
          customRenderingMetaMap: kebabToCamelKeys(this.$slots),
          handleCustomRendering: getSecret(this).handleCustomRendering
        });
      }
    },
    render() {
      const customRenderingNodes = [];
      for (const customRendering of this.customRenderingMap.values()) {
        customRenderingNodes.push(h$1(CustomRenderingComponent, {
          key: customRendering.id,
          customRendering
        }));
      }
      return h$1("div", {
        attrs: {
          "data-fc-render-id": this.renderId
        }
      }, h$1(Fragment, customRenderingNodes));
    },
    mounted() {
      const customRenderingStore = new CustomRenderingStore();
      getSecret(this).handleCustomRendering = customRenderingStore.handle.bind(customRenderingStore);
      const calendarOptions = this.buildOptions(this.options);
      const calendar = new Calendar(this.$el, calendarOptions);
      getSecret(this).calendar = calendar;
      calendar.render();
      customRenderingStore.subscribe((customRenderingMap) => {
        this.customRenderingMap = customRenderingMap;
        this.renderId++;
      });
    },
    beforeUpdate() {
      this.getApi().resumeRendering();
    },
    beforeUnmount() {
      this.getApi().destroy();
    },
    watch: buildWatchers()
  });
  const CustomRenderingComponent = defineComponent({
    props: {
      customRendering: Object
    },
    render() {
      const customRendering = this.customRendering;
      const innerContent = typeof customRendering.generatorMeta === "function" ? customRendering.generatorMeta(customRendering.renderProps) : customRendering.generatorMeta;
      return h$1(Teleport, {
        to: customRendering.containerEl
      }, innerContent);
    }
  });
  function getSecret(inst) {
    return inst;
  }
  function buildWatchers() {
    let watchers = {
      options: {
        deep: true,
        handler(options) {
          let calendar = this.getApi();
          calendar.pauseRendering();
          let calendarOptions = this.buildOptions(options);
          calendar.resetOptions(calendarOptions);
          this.renderId++;
        }
      }
    };
    for (let complexOptionName in OPTION_IS_COMPLEX) {
      watchers[`options.${complexOptionName}`] = {
        deep: true,
        handler(val) {
          if (val !== void 0) {
            let calendar = this.getApi();
            calendar.pauseRendering();
            calendar.resetOptions({
              [complexOptionName]: val
            }, [
              complexOptionName
            ]);
            this.renderId++;
          }
        }
      };
    }
    return watchers;
  }
  function kebabToCamelKeys(map) {
    const newMap = {};
    for (const key in map) {
      newMap[kebabToCamel(key)] = map[key];
    }
    return newMap;
  }
  function kebabToCamel(s2) {
    return s2.split("-").map((word, index2) => index2 ? capitalize(word) : word).join("");
  }
  function capitalize(s2) {
    return s2.charAt(0).toUpperCase() + s2.slice(1);
  }
  class DayTableSlicer extends Slicer {
    constructor() {
      super(...arguments);
      this.forceDayIfListItem = true;
    }
    sliceRange(dateRange, dayTableModel) {
      return dayTableModel.sliceRange(dateRange);
    }
  }
  const WEEKDAY_FORMAT = createFormatter({
    weekday: "long"
  });
  const firstSunday = /* @__PURE__ */ new Date(2592e5);
  function buildDateRowConfigs(...args) {
    return [
      buildDateRowConfig(...args)
    ];
  }
  function buildDateRowConfig(dates, datesRepDistinctDays, dateProfile, todayRange, dayHeaderFormat, context, colSpan) {
    return {
      isDateRow: true,
      renderConfig: buildDateRenderConfig(context),
      dataConfigs: buildDateDataConfigs(dates, datesRepDistinctDays, dateProfile, todayRange, dayHeaderFormat, context, colSpan)
    };
  }
  function buildDateRenderConfig(context) {
    const { options } = context;
    return {
      generatorName: "dayHeaderContent",
      customGenerator: options.dayHeaderContent,
      classNameGenerator: options.dayHeaderClassNames,
      didMount: options.dayHeaderDidMount,
      willUnmount: options.dayHeaderWillUnmount
    };
  }
  const dowDates = [];
  for (let dow = 0; dow < 7; dow++) {
    dowDates.push(addDays(/* @__PURE__ */ new Date(2592e5), dow));
  }
  function buildDateDataConfigs(dates, datesRepDistinctDays, dateProfile, todayRange, dayHeaderFormat, context, colSpan = 1, keyPrefix = "", extraRenderProps = {}, extraAttrs = {}, className = "") {
    const { dateEnv, viewApi, options } = context;
    return datesRepDistinctDays ? dates.map((date) => {
      const dateMeta = getDateMeta(date, todayRange, null, dateProfile);
      const text = dateEnv.format(date, dayHeaderFormat);
      const renderProps = Object.assign(Object.assign(Object.assign({}, dateMeta), {
        date: dateEnv.toDate(date),
        view: viewApi,
        text
      }), extraRenderProps);
      const isNavLink = options.navLinks && !dateMeta.isDisabled && dates.length > 1;
      const fullDateStr = buildDateStr(context, date);
      return {
        key: keyPrefix + date.toUTCString(),
        renderProps,
        attrs: Object.assign(Object.assign(Object.assign({
          "aria-label": fullDateStr
        }, dateMeta.isToday ? {
          "aria-current": "date"
        } : {}), {
          "data-date": formatDayString(date)
        }), extraAttrs),
        innerAttrs: isNavLink ? buildNavLinkAttrs(context, date, void 0, fullDateStr) : {
          "aria-hidden": true
        },
        colSpan,
        isNavLink,
        className: joinClassNames(className, getDayClassName(dateMeta))
      };
    }) : dates.map((date) => {
      const dow = date.getUTCDay();
      const normDate = addDays(firstSunday, dow);
      const dayMeta = {
        dow,
        isDisabled: false,
        isFuture: false,
        isPast: false,
        isToday: false,
        isOther: false
      };
      const text = dateEnv.format(normDate, dayHeaderFormat);
      const renderProps = Object.assign(Object.assign(Object.assign({}, dayMeta), {
        date: dowDates[dow],
        view: viewApi,
        text
      }), extraRenderProps);
      const fullWeekDayStr = dateEnv.format(normDate, WEEKDAY_FORMAT);
      return {
        key: keyPrefix + String(dow),
        renderProps,
        attrs: Object.assign({
          "aria-label": fullWeekDayStr
        }, extraAttrs),
        innerAttrs: {
          "aria-hidden": true
        },
        colSpan,
        className: joinClassNames(className, getDayClassName(dayMeta))
      };
    });
  }
  function getEventPartKey(seg) {
    return getEventKey(seg) + ":" + seg.start + (seg.standinFor ? ":standin" : seg.isSlice ? ":slice" : "");
  }
  function splitSegsByRow(segs, rowCnt) {
    const byRow = [];
    for (let row = 0; row < rowCnt; row++) {
      byRow[row] = [];
    }
    for (const seg of segs) {
      byRow[seg.row].push(seg);
    }
    return byRow;
  }
  function splitInteractionByRow(ui, rowCnt) {
    const byRow = [];
    if (!ui) {
      for (let row = 0; row < rowCnt; row++) {
        byRow[row] = null;
      }
    } else {
      for (let row = 0; row < rowCnt; row++) {
        byRow[row] = {
          affectedInstances: ui.affectedInstances,
          isEvent: ui.isEvent,
          segs: []
        };
      }
      for (const seg of ui.segs) {
        byRow[seg.row].segs.push(seg);
      }
    }
    return byRow;
  }
  function sliceSegForCol(seg, col) {
    return Object.assign(Object.assign({}, seg), {
      start: col,
      end: col + 1,
      isStart: seg.isStart && seg.start === col,
      isEnd: seg.isEnd && seg.end - 1 === col,
      standinFor: seg
    });
  }
  const DEFAULT_TABLE_EVENT_TIME_FORMAT = createFormatter({
    hour: "numeric",
    minute: "2-digit",
    omitZeroMinute: true,
    meridiem: "narrow"
  });
  function hasListItemDisplay(seg) {
    let { display } = seg.eventRange.ui;
    return display === "list-item" || display === "auto" && !seg.eventRange.def.allDay && seg.end - seg.start === 1 && seg.isStart && seg.isEnd;
  }
  class DayGridBlockEvent extends BaseComponent {
    render() {
      let { props } = this;
      return _(StandardEvent, Object.assign({}, props, {
        className: "fc-daygrid-block-event fc-daygrid-event fc-h-event",
        defaultTimeFormat: DEFAULT_TABLE_EVENT_TIME_FORMAT,
        defaultDisplayEventEnd: props.defaultDisplayEventEnd,
        disableResizing: !props.eventRange.def.allDay
      }));
    }
  }
  class DayGridListEvent extends BaseComponent {
    render() {
      let { props, context } = this;
      let { options } = context;
      let { eventRange } = props;
      let timeFormat = options.eventTimeFormat || DEFAULT_TABLE_EVENT_TIME_FORMAT;
      let timeText = buildEventRangeTimeText(timeFormat, eventRange, void 0, void 0, props.isStart, props.isEnd, context, true, props.defaultDisplayEventEnd);
      let [tag, attrs] = getEventTagAndAttrs(eventRange, context);
      return _(EventContainer, Object.assign({}, props, {
        tag,
        attrs,
        className: "fc-daygrid-dot-event fc-daygrid-event",
        defaultGenerator: renderInnerContent,
        timeText,
        isResizing: false,
        isDateSelecting: false
      }));
    }
  }
  function renderInnerContent(renderProps) {
    return _(k$1, null, _("div", {
      className: "fc-daygrid-event-dot",
      style: {
        borderColor: renderProps.borderColor || renderProps.backgroundColor
      }
    }), renderProps.timeText && _("div", {
      className: "fc-event-time"
    }, renderProps.timeText), _("div", {
      className: "fc-event-title"
    }, renderProps.event.title || _(k$1, null, "\xA0")));
  }
  class DayGridMoreLink extends BaseComponent {
    render() {
      let { props } = this;
      return _(MoreLinkContainer, {
        className: joinClassNames("fc-daygrid-more-link", props.isBlock ? "fc-daygrid-more-link-block" : "fc-daygrid-more-link-button"),
        dateProfile: props.dateProfile,
        todayRange: props.todayRange,
        allDayDate: props.allDayDate,
        segs: props.segs,
        hiddenSegs: props.hiddenSegs,
        alignElRef: props.alignElRef,
        alignParentTop: props.alignParentTop,
        dateSpanProps: props.dateSpanProps,
        popoverContent: () => {
          let forcedInvisibleMap = (props.eventDrag ? props.eventDrag.affectedInstances : null) || (props.eventResize ? props.eventResize.affectedInstances : null) || {};
          return _(k$1, null, props.segs.map((seg) => {
            let { eventRange } = seg;
            let { instanceId } = eventRange.instance;
            return _("div", {
              key: instanceId,
              style: {
                visibility: forcedInvisibleMap[instanceId] ? "hidden" : ""
              }
            }, hasListItemDisplay(seg) ? _(DayGridListEvent, Object.assign({
              eventRange,
              isStart: seg.isStart,
              isEnd: seg.isEnd,
              isDragging: false,
              isSelected: instanceId === props.eventSelection,
              defaultDisplayEventEnd: false
            }, getEventRangeMeta(eventRange, props.todayRange))) : _(DayGridBlockEvent, Object.assign({
              eventRange,
              isStart: seg.isStart,
              isEnd: seg.isEnd,
              isDragging: false,
              isResizing: false,
              isDateSelecting: false,
              isSelected: instanceId === props.eventSelection,
              defaultDisplayEventEnd: false
            }, getEventRangeMeta(eventRange, props.todayRange))));
          }));
        }
      });
    }
  }
  class DayGridCell extends DateComponent {
    constructor() {
      super(...arguments);
      this.getDateMeta = memoize(getDateMeta);
      this.rootElRef = m$1();
      this.handleBodyEl = (bodyEl) => {
        if (this.disconnectBodyHeight) {
          this.disconnectBodyHeight();
          this.disconnectBodyHeight = void 0;
          setRef(this.props.headerHeightRef, null);
          setRef(this.props.mainHeightRef, null);
        }
        if (bodyEl) {
          this.disconnectBodyHeight = watchSize(bodyEl, (_bodyWidth, bodyHeight) => {
            const { props } = this;
            const mainRect = bodyEl.getBoundingClientRect();
            const rootRect = this.rootElRef.current.getBoundingClientRect();
            const headerHeight = mainRect.top - rootRect.top;
            if (!isDimsEqual(this.headerHeight, headerHeight)) {
              this.headerHeight = headerHeight;
              setRef(props.headerHeightRef, headerHeight);
            }
            if (props.fgLiquidHeight) {
              setRef(props.mainHeightRef, bodyHeight);
            }
          });
        }
      };
    }
    render() {
      let { props, context } = this;
      let { options, dateEnv } = context;
      const isMonthStart = props.showDayNumber && shouldDisplayMonthStart(props.date, props.dateProfile.currentRange, dateEnv);
      const dateMeta = this.getDateMeta(props.date, props.todayRange, null, props.dateProfile);
      const baseClassName = joinClassNames("fc-daygrid-day", props.borderStart && "fc-border-s", props.width != null ? "" : "fc-liquid", "fc-flex-col");
      if (dateMeta.isDisabled) {
        return _("div", {
          role: "gridcell",
          "aria-disabled": true,
          className: joinClassNames(baseClassName, "fc-day-disabled"),
          style: {
            width: props.width
          }
        });
      }
      const hasDayNumber = props.showDayNumber || hasCustomDayCellContent(options);
      const isNavLink = options.navLinks;
      const fullDateStr = buildDateStr(context, props.date);
      return _(DayCellContainer, {
        tag: "div",
        className: joinClassNames(baseClassName, props.className),
        attrs: Object.assign(Object.assign({}, props.attrs), {
          role: "gridcell",
          "aria-label": fullDateStr
        }),
        style: {
          width: props.width
        },
        elRef: this.rootElRef,
        renderProps: props.renderProps,
        defaultGenerator: renderTopInner,
        date: props.date,
        dateMeta,
        showDayNumber: props.showDayNumber,
        isMonthStart
      }, (InnerContent) => _(k$1, null, hasDayNumber && _("div", {
        className: "fc-daygrid-day-header"
      }, _(InnerContent, {
        tag: "div",
        attrs: isNavLink ? buildNavLinkAttrs(context, props.date, void 0, fullDateStr) : {
          "aria-hidden": true
        },
        className: joinClassNames("fc-daygrid-day-number", isMonthStart && "fc-daygrid-month-start")
      })), _("div", {
        className: joinClassNames("fc-daygrid-day-body", props.isTall && "fc-daygrid-day-body-tall", props.fgLiquidHeight ? "fc-liquid" : "fc-grow"),
        ref: this.handleBodyEl
      }, _("div", {
        className: "fc-daygrid-day-events",
        style: {
          height: props.fgHeight
        }
      }, props.fg), _(DayGridMoreLink, {
        isBlock: props.isCompact,
        allDayDate: props.date,
        segs: props.segs,
        hiddenSegs: props.hiddenSegs,
        alignElRef: this.rootElRef,
        alignParentTop: props.showDayNumber ? "[role=row]" : ".fc-view",
        dateSpanProps: props.dateSpanProps,
        dateProfile: props.dateProfile,
        eventSelection: props.eventSelection,
        eventDrag: props.eventDrag,
        eventResize: props.eventResize,
        todayRange: props.todayRange
      }))));
    }
  }
  function renderTopInner(props) {
    return props.dayNumberText || _(k$1, null, "\xA0");
  }
  function shouldDisplayMonthStart(date, currentRange, dateEnv) {
    const { start: currentStart, end: currentEnd } = currentRange;
    const currentEndIncl = addMs(currentEnd, -1);
    const currentFirstYear = dateEnv.getYear(currentStart);
    const currentFirstMonth = dateEnv.getMonth(currentStart);
    const currentLastYear = dateEnv.getYear(currentEndIncl);
    const currentLastMonth = dateEnv.getMonth(currentEndIncl);
    return !(currentFirstYear === currentLastYear && currentFirstMonth === currentLastMonth) && Boolean(date.valueOf() === currentStart.valueOf() || dateEnv.getDay(date) === 1 && date.valueOf() < currentEnd.valueOf());
  }
  function computeFgSegVerticals(segs, segHeightMap, cells, maxHeight, strictOrder, allowSlicing = true, dayMaxEvents, dayMaxEventRows) {
    let maxCoord;
    let maxDepth;
    let hiddenConsumes;
    if (dayMaxEvents === true || dayMaxEventRows === true) {
      maxCoord = maxHeight;
      hiddenConsumes = true;
    } else if (typeof dayMaxEvents === "number") {
      maxDepth = dayMaxEvents;
      hiddenConsumes = false;
    } else if (typeof dayMaxEventRows === "number") {
      maxDepth = dayMaxEventRows;
      hiddenConsumes = true;
    }
    const visibleSegMap = /* @__PURE__ */ new Map();
    const hiddenSegMap = /* @__PURE__ */ new Map();
    const segTops = /* @__PURE__ */ new Map();
    const isSlicedMap = /* @__PURE__ */ new Map();
    let hierarchy = new SegHierarchy(segs, (seg) => segHeightMap.get(getEventPartKey(seg)), strictOrder, maxCoord, maxDepth, hiddenConsumes, allowSlicing);
    hierarchy.traverseSegs((seg, segTop) => {
      addToSegMap(visibleSegMap, seg);
      segTops.set(getEventPartKey(seg), segTop);
      if (seg.isSlice) {
        isSlicedMap.set(seg.eventRange, true);
      }
    });
    for (const hiddenSeg of hierarchy.hiddenSegs) {
      addToSegMap(hiddenSegMap, hiddenSeg);
    }
    if (isSlicedMap.size) {
      segTops.clear();
      hierarchy = new SegHierarchy(compileSegMap(segs, visibleSegMap), (seg) => segHeightMap.get(getEventPartKey(seg)), strictOrder, maxCoord, maxDepth, hiddenConsumes);
      hierarchy.traverseSegs((seg, segTop) => {
        segTops.set(getEventPartKey(seg), segTop);
      });
      for (const hiddenSeg of hierarchy.hiddenSegs) {
        addToSegMap(hiddenSegMap, hiddenSeg);
      }
    }
    const segsByCol = [];
    const hiddenSegsByCol = [];
    const renderableSegsByCol = [];
    const heightsByCol = [];
    for (let col = 0; col < cells.length; col++) {
      segsByCol.push([]);
      hiddenSegsByCol.push([]);
      renderableSegsByCol.push([]);
      heightsByCol.push(0);
    }
    for (const seg of segs) {
      const { eventRange } = seg;
      const visibleSegs = visibleSegMap.get(eventRange) || [];
      const hiddenSegs = hiddenSegMap.get(eventRange) || [];
      const isSliced = isSlicedMap.get(eventRange) || false;
      renderableSegsByCol[seg.start].push(seg);
      if (isSliced) {
        for (const visibleSeg of visibleSegs) {
          renderableSegsByCol[visibleSeg.start].push(visibleSeg);
        }
      }
      for (const visibleSeg of visibleSegs) {
        for (let col = visibleSeg.start; col < visibleSeg.end; col++) {
          const slice = sliceSegForCol(visibleSeg, col);
          segsByCol[col].push(slice);
        }
        const segKey = getEventPartKey(visibleSeg);
        const segTop = segTops.get(segKey);
        if (segTop != null) {
          const segHeight = segHeightMap.get(segKey);
          for (let col = visibleSeg.start; col < visibleSeg.end; col++) {
            heightsByCol[col] = Math.max(heightsByCol[col], segTop + segHeight);
          }
        }
      }
      for (const hiddenSeg of hiddenSegs) {
        for (let col = hiddenSeg.start; col < hiddenSeg.end; col++) {
          const slice = sliceSegForCol(hiddenSeg, col);
          segsByCol[col].push(slice);
          hiddenSegsByCol[col].push(slice);
        }
      }
    }
    return [
      segsByCol,
      hiddenSegsByCol,
      renderableSegsByCol,
      segTops,
      heightsByCol
    ];
  }
  function addToSegMap(map, seg) {
    let list = map.get(seg.eventRange);
    if (!list) {
      map.set(seg.eventRange, list = []);
    }
    list.push(seg);
  }
  function compileSegMap(segs, segMap) {
    const res = [];
    for (const seg of segs) {
      res.push(...segMap.get(seg.eventRange) || []);
    }
    return res;
  }
  function buildDayTableModel(dateProfile, dateProfileGenerator) {
    let daySeries = new DaySeriesModel(dateProfile.renderRange, dateProfileGenerator);
    return new DayTableModel(daySeries, /year|month|week/.test(dateProfile.currentRangeUnit));
  }
  function computeColWidth(colCnt, colMinWidth, viewportWidth) {
    if (viewportWidth == null) {
      return [
        void 0,
        void 0
      ];
    }
    const colTempWidth = viewportWidth / colCnt;
    if (colTempWidth < colMinWidth) {
      return [
        colMinWidth * colCnt,
        colMinWidth
      ];
    }
    return [
      viewportWidth,
      void 0
    ];
  }
  function computeTopFromDate(date, cellRows, rowHeightMap, adjust = 0) {
    let top = 0;
    for (const cells of cellRows) {
      const start = cells[0].date;
      const end = cells[cells.length - 1].date;
      const key = start.toISOString();
      if (date >= start && date <= end) {
        return top;
      }
      const rowHeight = rowHeightMap.get(key);
      if (rowHeight == null) {
        return;
      }
      top += rowHeight + adjust;
    }
    return top;
  }
  function computeHorizontalsFromSeg(seg, colWidth, colCnt, isRtl) {
    let fromStart;
    let fromEnd;
    if (colWidth != null) {
      fromStart = seg.start * colWidth;
      fromEnd = (colCnt - seg.end) * colWidth;
    } else {
      const colWidthFrac = 1 / colCnt;
      fromStart = fracToCssDim(seg.start * colWidthFrac);
      fromEnd = fracToCssDim(1 - seg.end * colWidthFrac);
    }
    if (isRtl) {
      return {
        right: fromStart,
        left: fromEnd
      };
    } else {
      return {
        left: fromStart,
        right: fromEnd
      };
    }
  }
  function computeColFromPosition(positionLeft, elWidth, colWidth, colCnt, isRtl) {
    const realColWidth = colWidth != null ? colWidth : elWidth / colCnt;
    const colFromLeft = Math.floor(positionLeft / realColWidth);
    const col = isRtl ? colCnt - colFromLeft - 1 : colFromLeft;
    const left = colFromLeft * realColWidth;
    const right = left + realColWidth;
    return {
      col,
      left,
      right
    };
  }
  function computeRowFromPosition(positionTop, cellRows, rowHeightMap) {
    let row = 0;
    let top = 0;
    let bottom = 0;
    for (const cells of cellRows) {
      const key = cells[0].key;
      top = bottom;
      bottom = top + rowHeightMap.get(key);
      if (positionTop < bottom) {
        break;
      }
      row++;
    }
    return {
      row,
      top,
      bottom
    };
  }
  function getRowEl(rootEl, row) {
    return rootEl.querySelectorAll("[role=row]")[row];
  }
  function getCellEl(rowEl, col) {
    return rowEl.querySelectorAll("[role=gridcell]")[col];
  }
  function createDayHeaderFormatter(explicitFormat, datesRepDistinctDays, dateCnt) {
    return explicitFormat || computeFallbackHeaderFormat(datesRepDistinctDays, dateCnt);
  }
  function computeFallbackHeaderFormat(datesRepDistinctDays, dayCnt) {
    if (!datesRepDistinctDays || dayCnt > 10) {
      return createFormatter({
        weekday: "short"
      });
    }
    if (dayCnt > 1) {
      return createFormatter({
        weekday: "short",
        month: "numeric",
        day: "numeric",
        omitCommas: true
      });
    }
    return createFormatter({
      weekday: "long"
    });
  }
  class DayGridEventHarness extends b {
    constructor() {
      super(...arguments);
      this.rootElRef = m$1();
    }
    render() {
      const { props } = this;
      return _("div", {
        className: joinClassNames(props.className, "fc-abs"),
        style: props.style,
        ref: this.rootElRef
      }, props.children);
    }
    componentDidMount() {
      const rootEl = this.rootElRef.current;
      this.disconnectHeight = watchHeight(rootEl, (height) => {
        setRef(this.props.heightRef, height);
      });
    }
    componentWillUnmount() {
      this.disconnectHeight();
      setRef(this.props.heightRef, null);
    }
  }
  const DEFAULT_WEEK_NUM_FORMAT = createFormatter({
    week: "narrow"
  });
  class DayGridRow extends BaseComponent {
    constructor() {
      super(...arguments);
      this.headerHeightRefMap = new RefMap(() => {
        afterSize(this.handleSegPositioning);
      });
      this.mainHeightRefMap = new RefMap(() => {
        const fgLiquidHeight = this.props.dayMaxEvents === true || this.props.dayMaxEventRows === true;
        if (fgLiquidHeight) {
          afterSize(this.handleSegPositioning);
        }
      });
      this.segHeightRefMap = new RefMap(() => {
        afterSize(this.handleSegPositioning);
      });
      this.handleRootEl = (rootEl) => {
        this.rootEl = rootEl;
        setRef(this.props.rootElRef, rootEl);
      };
      this.handleSegPositioning = () => {
        this.forceUpdate();
      };
    }
    render() {
      const { props, context, headerHeightRefMap, mainHeightRefMap } = this;
      const { cells } = props;
      const { options } = context;
      const weekDate = props.cells[0].date;
      const fgLiquidHeight = props.dayMaxEvents === true || props.dayMaxEventRows === true;
      const fgEventSegs = sortEventSegs(props.fgEventSegs, options.eventOrder);
      const [maxMainTop, minMainHeight] = this.computeFgDims();
      const [segsByCol, hiddenSegsByCol, renderableSegsByCol, segTops, simpleHeightsByCol] = computeFgSegVerticals(fgEventSegs, this.segHeightRefMap.current, cells, fgLiquidHeight ? minMainHeight : void 0, options.eventOrderStrict, options.eventSlicing, props.dayMaxEvents, props.dayMaxEventRows);
      const heightsByCol = [];
      if (maxMainTop != null) {
        let col = 0;
        for (const cell of cells) {
          const cellHeaderHeight = headerHeightRefMap.current.get(cell.key);
          const extraFgHeight = maxMainTop - cellHeaderHeight;
          heightsByCol.push(simpleHeightsByCol[col++] + extraFgHeight);
        }
      }
      const highlightSegs = this.getHighlightSegs();
      const mirrorSegs = this.getMirrorSegs();
      const forcedInvisibleMap = props.eventDrag && props.eventDrag.affectedInstances || props.eventResize && props.eventResize.affectedInstances || {};
      const isNavLink = options.navLinks;
      const fullWeekStr = buildDateStr(context, weekDate, "week");
      return _("div", {
        role: props.role,
        "aria-label": props.role === "row" ? fullWeekStr : void 0,
        className: joinClassNames("fc-daygrid-row", props.forPrint && "fc-daygrid-row-print", "fc-flex-row fc-rel", props.className),
        style: {
          "flex-basis": props.basis
        },
        ref: this.handleRootEl
      }, props.showWeekNumbers && _(WeekNumberContainer, {
        tag: "div",
        attrs: Object.assign(Object.assign({}, isNavLink ? buildNavLinkAttrs(context, weekDate, "week", fullWeekStr, false) : {}), {
          "role": void 0,
          "aria-hidden": true
        }),
        className: "fc-daygrid-week-number",
        date: weekDate,
        defaultFormat: DEFAULT_WEEK_NUM_FORMAT
      }), this.renderFillSegs(props.businessHourSegs, "non-business"), this.renderFillSegs(props.bgEventSegs, "bg-event"), this.renderFillSegs(highlightSegs, "highlight"), props.cells.map((cell, col) => {
        const normalFgNodes = this.renderFgSegs(maxMainTop, renderableSegsByCol[col], segTops, props.todayRange, forcedInvisibleMap);
        return _(DayGridCell, {
          key: cell.key,
          dateProfile: props.dateProfile,
          todayRange: props.todayRange,
          date: cell.date,
          showDayNumber: props.showDayNumbers,
          isCompact: props.isCompact,
          isTall: props.isTall,
          borderStart: Boolean(col),
          segs: segsByCol[col],
          hiddenSegs: hiddenSegsByCol[col],
          fgLiquidHeight,
          fg: _(k$1, null, normalFgNodes),
          eventDrag: props.eventDrag,
          eventResize: props.eventResize,
          eventSelection: props.eventSelection,
          renderProps: cell.renderProps,
          dateSpanProps: cell.dateSpanProps,
          attrs: cell.attrs,
          className: cell.className,
          fgHeight: heightsByCol[col],
          width: props.colWidth,
          headerHeightRef: headerHeightRefMap.createRef(cell.key),
          mainHeightRef: mainHeightRefMap.createRef(cell.key)
        });
      }), this.renderFgSegs(maxMainTop, mirrorSegs, segTops, props.todayRange, {}, Boolean(props.eventDrag), Boolean(props.eventResize), false));
    }
    renderFgSegs(headerHeight, segs, segTops, todayRange, forcedInvisibleMap, isDragging, isResizing, isDateSelecting) {
      var _a2;
      const { props, context, segHeightRefMap } = this;
      const { isRtl } = context;
      const { colWidth, eventSelection } = props;
      const colCnt = props.cells.length;
      const defaultDisplayEventEnd = props.cells.length === 1;
      const isMirror = isDragging || isResizing || isDateSelecting;
      const nodes = [];
      for (const seg of segs) {
        const key = getEventPartKey(seg);
        const { standinFor, eventRange } = seg;
        const { instanceId } = eventRange.instance;
        if (standinFor) {
          continue;
        }
        const { left, right } = computeHorizontalsFromSeg(seg, colWidth, colCnt, isRtl);
        const localTop = (_a2 = segTops.get(standinFor ? getEventPartKey(standinFor) : key)) !== null && _a2 !== void 0 ? _a2 : isMirror ? 0 : void 0;
        const top = headerHeight != null && localTop != null ? headerHeight + localTop : void 0;
        const isInvisible = standinFor || forcedInvisibleMap[instanceId] || top == null;
        nodes.push(_(DayGridEventHarness, {
          key,
          className: seg.start ? "fc-border-transparent fc-border-s" : "",
          style: {
            visibility: isInvisible ? "hidden" : "",
            top,
            left,
            right
          },
          heightRef: !standinFor && !isMirror ? segHeightRefMap.createRef(key) : null
        }, hasListItemDisplay(seg) ? _(DayGridListEvent, Object.assign({
          eventRange,
          isStart: seg.isStart,
          isEnd: seg.isEnd,
          isDragging,
          isSelected: instanceId === eventSelection,
          defaultDisplayEventEnd
        }, getEventRangeMeta(eventRange, todayRange))) : _(DayGridBlockEvent, Object.assign({
          eventRange,
          isStart: seg.isStart,
          isEnd: seg.isEnd,
          isDragging,
          isResizing,
          isDateSelecting,
          isSelected: instanceId === eventSelection,
          defaultDisplayEventEnd
        }, getEventRangeMeta(eventRange, todayRange)))));
      }
      return nodes;
    }
    renderFillSegs(segs, fillType) {
      const { props, context } = this;
      const { isRtl } = context;
      const { todayRange, colWidth } = props;
      const colCnt = props.cells.length;
      const nodes = [];
      for (const seg of segs) {
        const key = buildEventRangeKey(seg.eventRange);
        const { left, right } = computeHorizontalsFromSeg(seg, colWidth, colCnt, isRtl);
        const isVisible = !seg.standinFor;
        nodes.push(_("div", {
          key,
          className: "fc-fill-y",
          style: {
            visibility: isVisible ? "" : "hidden",
            left,
            right
          }
        }, fillType === "bg-event" ? _(BgEvent, Object.assign({
          eventRange: seg.eventRange,
          isStart: seg.isStart,
          isEnd: seg.isEnd
        }, getEventRangeMeta(seg.eventRange, todayRange))) : renderFill(fillType)));
      }
      return _(k$1, {}, ...nodes);
    }
    componentDidMount() {
      const { rootEl } = this;
      this.disconnectHeight = watchHeight(rootEl, (contentHeight) => {
        setRef(this.props.heightRef, contentHeight);
      });
    }
    componentWillUnmount() {
      this.disconnectHeight();
      setRef(this.props.heightRef, null);
    }
    computeFgDims() {
      const { cells } = this.props;
      const headerHeightMap = this.headerHeightRefMap.current;
      const mainHeightMap = this.mainHeightRefMap.current;
      let maxMainTop;
      let minMainBottom;
      for (const cell of cells) {
        const mainTop = headerHeightMap.get(cell.key);
        const mainHeight = mainHeightMap.get(cell.key);
        if (mainTop != null) {
          if (maxMainTop === void 0 || mainTop > maxMainTop) {
            maxMainTop = mainTop;
          }
          if (mainHeight != null) {
            const mainBottom = mainTop + mainHeight;
            if (minMainBottom === void 0 || mainBottom < minMainBottom) {
              minMainBottom = mainBottom;
            }
          }
        }
      }
      return [
        maxMainTop,
        minMainBottom != null && maxMainTop != null ? minMainBottom - maxMainTop : void 0
      ];
    }
    getMirrorSegs() {
      let { props } = this;
      if (props.eventResize && props.eventResize.segs.length) {
        return props.eventResize.segs;
      }
      return [];
    }
    getHighlightSegs() {
      let { props } = this;
      if (props.eventDrag && props.eventDrag.segs.length) {
        return props.eventDrag.segs;
      }
      if (props.eventResize && props.eventResize.segs.length) {
        return props.eventResize.segs;
      }
      return props.dateSelectionSegs;
    }
  }
  class DayGridRows extends DateComponent {
    constructor() {
      super(...arguments);
      this.splitBusinessHourSegs = memoize(splitSegsByRow);
      this.splitBgEventSegs = memoize(splitSegsByRow);
      this.splitFgEventSegs = memoize(splitSegsByRow);
      this.splitDateSelectionSegs = memoize(splitSegsByRow);
      this.splitEventDrag = memoize(splitInteractionByRow);
      this.splitEventResize = memoize(splitInteractionByRow);
      this.rowHeightRefMap = new RefMap((height, key) => {
        const { rowHeightRefMap } = this.props;
        if (rowHeightRefMap) {
          rowHeightRefMap.handleValue(height, key);
        }
      });
      this.handleRootEl = (rootEl) => {
        this.rootEl = rootEl;
        if (rootEl) {
          this.context.registerInteractiveComponent(this, {
            el: rootEl,
            isHitComboAllowed: this.props.isHitComboAllowed
          });
        } else {
          this.context.unregisterInteractiveComponent(this);
        }
      };
    }
    render() {
      let { props, context, rowHeightRefMap } = this;
      let { options } = context;
      let rowCnt = props.cellRows.length;
      let fgEventSegsByRow = this.splitFgEventSegs(props.fgEventSegs, rowCnt);
      let bgEventSegsByRow = this.splitBgEventSegs(props.bgEventSegs, rowCnt);
      let businessHourSegsByRow = this.splitBusinessHourSegs(props.businessHourSegs, rowCnt);
      let dateSelectionSegsByRow = this.splitDateSelectionSegs(props.dateSelectionSegs, rowCnt);
      let eventDragByRow = this.splitEventDrag(props.eventDrag, rowCnt);
      let eventResizeByRow = this.splitEventResize(props.eventResize, rowCnt);
      let isHeightAuto = getIsHeightAuto(options);
      let rowHeightsRedistribute = !props.forPrint && !isHeightAuto;
      let rowBasis = computeRowBasis(props.visibleWidth, rowCnt, isHeightAuto, options);
      let isCompact = computeRowIsCompact(props.visibleWidth, options);
      return _("div", {
        role: "rowgroup",
        className: joinClassNames(!props.forPrint && "fc-flex-col", props.className),
        style: {
          width: props.width
        },
        ref: this.handleRootEl
      }, props.cellRows.map((cells, row) => _(DayGridRow, {
        key: cells[0].key,
        role: "row",
        dateProfile: props.dateProfile,
        todayRange: props.todayRange,
        cells,
        showDayNumbers: rowCnt > 1,
        showWeekNumbers: rowCnt > 1 && options.weekNumbers,
        forPrint: props.forPrint,
        isCompact,
        className: joinClassNames(rowHeightsRedistribute && "fc-grow", rowCnt > 1 && "fc-break-inside-avoid", row < rowCnt - 1 && "fc-border-b"),
        fgEventSegs: fgEventSegsByRow[row],
        bgEventSegs: bgEventSegsByRow[row].filter(isSegAllDay),
        businessHourSegs: businessHourSegsByRow[row],
        dateSelectionSegs: dateSelectionSegsByRow[row],
        eventSelection: props.eventSelection,
        eventDrag: eventDragByRow[row],
        eventResize: eventResizeByRow[row],
        dayMaxEvents: props.dayMaxEvents,
        dayMaxEventRows: props.dayMaxEventRows,
        colWidth: props.colWidth,
        basis: rowBasis,
        heightRef: rowHeightRefMap.createRef(cells[0].key)
      })));
    }
    queryHit(positionLeft, positionTop, elWidth) {
      const { props, context } = this;
      const colCnt = props.cellRows[0].length;
      const { col, left, right } = computeColFromPosition(positionLeft, elWidth, props.colWidth, colCnt, context.isRtl);
      const { row, top, bottom } = computeRowFromPosition(positionTop, props.cellRows, this.rowHeightRefMap.current);
      const cell = props.cellRows[row][col];
      const cellStartDate = cell.date;
      const cellEndDate = addDays(cellStartDate, 1);
      return {
        dateProfile: props.dateProfile,
        dateSpan: Object.assign({
          range: {
            start: cellStartDate,
            end: cellEndDate
          },
          allDay: true
        }, cell.dateSpanProps),
        getDayEl: () => getCellEl(getRowEl(this.rootEl, row), col),
        rect: {
          left,
          right,
          top,
          bottom
        },
        layer: 0
      };
    }
  }
  function isSegAllDay(seg) {
    return seg.eventRange.def.allDay;
  }
  function computeRowBasis(visibleWidth, rowCnt, isHeightAuto, options) {
    if (visibleWidth != null) {
      const rowBasis = visibleWidth / options.aspectRatio / 6;
      return rowCnt > 6 || isHeightAuto ? rowBasis : 0;
    }
    return 0;
  }
  function computeRowIsCompact(visibleWidth, options) {
    if (visibleWidth != null) {
      const rowBasis = visibleWidth / options.aspectRatio / 6;
      return rowBasis < 70;
    }
    return false;
  }
  class DayGridHeaderCell extends BaseComponent {
    constructor() {
      super(...arguments);
      this.handleInnerEl = (innerEl) => {
        if (this.disconectInnerHeight) {
          this.disconectInnerHeight();
          this.disconectInnerHeight = void 0;
        }
        if (innerEl) {
          this.disconectInnerHeight = watchHeight(innerEl, (height) => {
            setRef(this.props.innerHeightRef, height);
          });
        } else {
          setRef(this.props.innerHeightRef, null);
        }
      };
    }
    render() {
      const { props } = this;
      const { renderConfig, dataConfig } = props;
      const isDisabled = dataConfig.renderProps.isDisabled;
      return _(ContentContainer, {
        tag: "div",
        attrs: Object.assign({
          role: "columnheader",
          "aria-colspan": dataConfig.colSpan
        }, dataConfig.attrs),
        className: joinClassNames("fc-header-cell fc-cell fc-flex-col fc-align-center", props.borderStart && "fc-border-s", !props.isSticky && "fc-crop", props.colWidth == null && "fc-liquid", dataConfig.className),
        style: {
          width: props.colWidth != null ? props.colWidth * (dataConfig.colSpan || 1) : void 0
        },
        renderProps: dataConfig.renderProps,
        generatorName: renderConfig.generatorName,
        customGenerator: renderConfig.customGenerator,
        defaultGenerator: renderText,
        classNameGenerator: isDisabled ? void 0 : renderConfig.classNameGenerator,
        didMount: renderConfig.didMount,
        willUnmount: renderConfig.willUnmount
      }, (InnerContainer) => _(InnerContainer, {
        tag: "div",
        attrs: dataConfig.innerAttrs,
        className: joinClassNames("fc-cell-inner fc-flex-col fc-padding-sm", props.isSticky && "fc-sticky-s"),
        elRef: this.handleInnerEl
      }));
    }
  }
  class DayGridHeaderRow extends BaseComponent {
    constructor() {
      super(...arguments);
      this.innerHeightRefMap = new RefMap(() => {
        afterSize(this.handleInnerHeights);
      });
      this.handleInnerHeights = () => {
        const innerHeightMap = this.innerHeightRefMap.current;
        let max = 0;
        for (const innerHeight of innerHeightMap.values()) {
          max = Math.max(max, innerHeight);
        }
        if (this.currentInnerHeight !== max) {
          this.currentInnerHeight = max;
          setRef(this.props.innerHeightRef, max);
        }
      };
    }
    render() {
      const { props } = this;
      return _("div", {
        role: props.role,
        "aria-rowindex": props.rowIndex != null ? 1 + props.rowIndex : void 0,
        className: joinClassNames("fc-flex-row fc-content-box", props.className),
        style: {
          height: props.height
        }
      }, props.dataConfigs.map((dataConfig, cellI) => _(DayGridHeaderCell, {
        key: dataConfig.key,
        renderConfig: props.renderConfig,
        dataConfig,
        isSticky: props.isSticky,
        borderStart: Boolean(cellI),
        colWidth: props.colWidth,
        innerHeightRef: props.innerHeightRef
      })));
    }
    componentWillUnmount() {
      setRef(this.props.innerHeightRef, null);
    }
  }
  class DayGridHeader extends BaseComponent {
    render() {
      const { props } = this;
      return _("div", {
        role: "rowgroup",
        className: joinClassNames(props.className, "fc-flex-col", props.width == null && "fc-liquid"),
        style: {
          width: props.width
        }
      }, props.headerTiers.map((rowConfig, tierNum) => _(DayGridHeaderRow, Object.assign({}, rowConfig, {
        key: tierNum,
        role: "row",
        className: tierNum ? "fc-border-t" : "",
        colWidth: props.colWidth
      }))));
    }
  }
  class DayGridLayoutNormal extends BaseComponent {
    constructor() {
      super(...arguments);
      this.handleScroller = (scroller) => {
        setRef(this.props.scrollerRef, scroller);
      };
      this.handleTotalWidth = (totalWidth) => {
        this.setState({
          totalWidth
        });
      };
      this.handleClientWidth = (clientWidth) => {
        this.setState({
          clientWidth
        });
      };
    }
    render() {
      const { props, state, context } = this;
      const { options } = context;
      const { totalWidth, clientWidth } = state;
      const endScrollbarWidth = totalWidth != null && clientWidth != null ? totalWidth - clientWidth : void 0;
      const verticalScrollbars = !props.forPrint && !getIsHeightAuto(options);
      const stickyHeaderDates = !props.forPrint && getStickyHeaderDates(options);
      return _(k$1, null, options.dayHeaders && _("div", {
        className: joinClassNames(props.forPrint ? "fc-print-header" : "fc-flex-row", stickyHeaderDates && "fc-table-header-sticky", "fc-border-b")
      }, _(DayGridHeader, {
        headerTiers: props.headerTiers,
        className: "fc-daygrid-header"
      }), Boolean(endScrollbarWidth) && _("div", {
        className: "fc-border-s fc-filler",
        style: {
          minWidth: endScrollbarWidth
        }
      })), _(Scroller, {
        vertical: verticalScrollbars,
        className: joinClassNames("fc-daygrid-body", !props.forPrint && "fc-flex-col", verticalScrollbars && "fc-liquid"),
        ref: this.handleScroller,
        clientWidthRef: this.handleClientWidth
      }, _(DayGridRows, {
        dateProfile: props.dateProfile,
        todayRange: props.todayRange,
        cellRows: props.cellRows,
        forPrint: props.forPrint,
        isHitComboAllowed: props.isHitComboAllowed,
        className: "fc-grow",
        dayMaxEvents: props.forPrint ? void 0 : options.dayMaxEvents,
        dayMaxEventRows: options.dayMaxEventRows,
        fgEventSegs: props.fgEventSegs,
        bgEventSegs: props.bgEventSegs,
        businessHourSegs: props.businessHourSegs,
        dateSelectionSegs: props.dateSelectionSegs,
        eventDrag: props.eventDrag,
        eventResize: props.eventResize,
        eventSelection: props.eventSelection,
        visibleWidth: totalWidth,
        rowHeightRefMap: props.rowHeightRefMap
      })), _(Ruler, {
        widthRef: this.handleTotalWidth
      }));
    }
  }
  class DayGridLayoutPannable extends BaseComponent {
    constructor() {
      super(...arguments);
      this.headerScrollerRef = m$1();
      this.bodyScrollerRef = m$1();
      this.footerScrollerRef = m$1();
      this.handleTotalWidth = (totalWidth) => {
        this.setState({
          totalWidth
        });
      };
      this.handleClientWidth = (clientWidth) => {
        this.setState({
          clientWidth
        });
      };
    }
    render() {
      const { props, state, context } = this;
      const { options } = context;
      const { totalWidth, clientWidth } = state;
      const endScrollbarWidth = totalWidth != null && clientWidth != null ? totalWidth - clientWidth : void 0;
      const verticalScrollbars = !props.forPrint && !getIsHeightAuto(options);
      const stickyHeaderDates = !props.forPrint && getStickyHeaderDates(options);
      const stickyFooterScrollbar = !props.forPrint && getStickyFooterScrollbar(options);
      const colCnt = props.cellRows[0].length;
      const [canvasWidth, colWidth] = computeColWidth(colCnt, props.dayMinWidth, clientWidth);
      return _(k$1, null, options.dayHeaders && _("div", {
        className: joinClassNames("fc-print-header", stickyHeaderDates && "fc-table-header-sticky")
      }, _(Scroller, {
        horizontal: true,
        hideScrollbars: true,
        className: "fc-daygrid-header fc-flex-row fc-border-b",
        ref: this.headerScrollerRef
      }, _(DayGridHeader, {
        headerTiers: props.headerTiers,
        colWidth,
        width: canvasWidth
      }), Boolean(endScrollbarWidth) && _("div", {
        className: "fc-border-s fc-filler",
        style: {
          minWidth: endScrollbarWidth
        }
      }))), _(Scroller, {
        vertical: verticalScrollbars,
        horizontal: true,
        hideScrollbars: stickyFooterScrollbar || props.forPrint,
        className: joinClassNames("fc-daygrid-body", !props.forPrint && "fc-flex-col", verticalScrollbars && "fc-liquid"),
        ref: this.bodyScrollerRef,
        clientWidthRef: this.handleClientWidth
      }, _(DayGridRows, {
        dateProfile: props.dateProfile,
        todayRange: props.todayRange,
        cellRows: props.cellRows,
        forPrint: props.forPrint,
        isHitComboAllowed: props.isHitComboAllowed,
        className: "fc-grow",
        dayMaxEvents: props.forPrint ? void 0 : options.dayMaxEvents,
        dayMaxEventRows: options.dayMaxEventRows,
        fgEventSegs: props.fgEventSegs,
        bgEventSegs: props.bgEventSegs,
        businessHourSegs: props.businessHourSegs,
        dateSelectionSegs: props.dateSelectionSegs,
        eventDrag: props.eventDrag,
        eventResize: props.eventResize,
        eventSelection: props.eventSelection,
        colWidth,
        width: canvasWidth,
        visibleWidth: totalWidth,
        rowHeightRefMap: props.rowHeightRefMap
      })), Boolean(stickyFooterScrollbar) && _(FooterScrollbar, {
        isSticky: true,
        canvasWidth,
        scrollerRef: this.footerScrollerRef
      }), _(Ruler, {
        widthRef: this.handleTotalWidth
      }));
    }
    componentDidMount() {
      const ScrollerSyncer = getScrollerSyncerClass(this.context.pluginHooks);
      this.syncedScroller = new ScrollerSyncer(true);
      setRef(this.props.scrollerRef, this.syncedScroller);
      this.updateSyncedScroller();
    }
    componentDidUpdate() {
      this.updateSyncedScroller();
    }
    componentWillUnmount() {
      this.syncedScroller.destroy();
    }
    updateSyncedScroller() {
      this.syncedScroller.handleChildren([
        this.headerScrollerRef.current,
        this.bodyScrollerRef.current,
        this.footerScrollerRef.current
      ]);
    }
  }
  class DayGridLayout extends BaseComponent {
    constructor() {
      super(...arguments);
      this.scrollerRef = m$1();
      this.rowHeightRefMap = new RefMap(() => {
        afterSize(this.updateScrollY);
      });
      this.scrollDate = null;
      this.updateScrollY = () => {
        const rowHeightMap = this.rowHeightRefMap.current;
        const scroller = this.scrollerRef.current;
        if (scroller && this.scrollDate) {
          let scrollTop = computeTopFromDate(this.scrollDate, this.props.cellRows, rowHeightMap, 1);
          if (scrollTop != null) {
            if (scrollTop) {
              scrollTop++;
            }
            scroller.scrollTo({
              y: scrollTop
            });
          }
        }
      };
      this.handleScrollEnd = (isUser) => {
        if (isUser) {
          this.scrollDate = null;
        }
      };
    }
    render() {
      const { props, context } = this;
      const { options } = context;
      const commonLayoutProps = Object.assign(Object.assign({}, props), {
        scrollerRef: this.scrollerRef,
        rowHeightRefMap: this.rowHeightRefMap
      });
      return _(ViewContainer, {
        viewSpec: context.viewSpec,
        attrs: {
          role: "grid",
          "aria-rowcount": props.headerTiers.length + props.cellRows.length,
          "aria-colcount": props.cellRows[0].length,
          "aria-labelledby": props.labelId,
          "aria-label": props.labelStr
        },
        className: joinClassNames(props.className, "fc-print-root fc-border")
      }, options.dayMinWidth ? _(DayGridLayoutPannable, Object.assign({}, commonLayoutProps, {
        dayMinWidth: options.dayMinWidth
      })) : _(DayGridLayoutNormal, Object.assign({}, commonLayoutProps)));
    }
    componentDidMount() {
      this.resetScroll();
      this.scrollerRef.current.addScrollEndListener(this.handleScrollEnd);
    }
    componentDidUpdate(prevProps) {
      if (prevProps.dateProfile !== this.props.dateProfile && this.context.options.scrollTimeReset) {
        this.resetScroll();
      }
    }
    componentWillUnmount() {
      this.scrollerRef.current.removeScrollEndListener(this.handleScrollEnd);
    }
    resetScroll() {
      this.scrollDate = this.props.dateProfile.currentDate;
      this.updateScrollY();
      const scroller = this.scrollerRef.current;
      scroller.scrollTo({
        x: 0
      });
    }
  }
  class DayGridView extends BaseComponent {
    constructor() {
      super(...arguments);
      this.buildDayTableModel = memoize(buildDayTableModel);
      this.buildDateRowConfigs = memoize(buildDateRowConfigs);
      this.createDayHeaderFormatter = memoize(createDayHeaderFormatter);
      this.slicer = new DayTableSlicer();
    }
    render() {
      const { props, context } = this;
      const { options } = context;
      const dayTableModel = this.buildDayTableModel(props.dateProfile, context.dateProfileGenerator);
      const datesRepDistinctDays = dayTableModel.rowCnt === 1;
      const dayHeaderFormat = this.createDayHeaderFormatter(context.options.dayHeaderFormat, datesRepDistinctDays, dayTableModel.colCnt);
      const slicedProps = this.slicer.sliceProps(props, props.dateProfile, options.nextDayThreshold, context, dayTableModel);
      return _(NowTimer, {
        unit: "day"
      }, (nowDate, todayRange) => {
        const headerTiers = this.buildDateRowConfigs(dayTableModel.headerDates, datesRepDistinctDays, props.dateProfile, todayRange, dayHeaderFormat, context);
        return _(DayGridLayout, {
          labelId: props.labelId,
          labelStr: props.labelStr,
          dateProfile: props.dateProfile,
          todayRange,
          cellRows: dayTableModel.cellRows,
          forPrint: props.forPrint,
          className: "fc-daygrid",
          headerTiers,
          fgEventSegs: slicedProps.fgEventSegs,
          bgEventSegs: slicedProps.bgEventSegs,
          businessHourSegs: slicedProps.businessHourSegs,
          dateSelectionSegs: slicedProps.dateSelectionSegs,
          eventDrag: slicedProps.eventDrag,
          eventResize: slicedProps.eventResize,
          eventSelection: slicedProps.eventSelection
        });
      });
    }
  }
  class TableDateProfileGenerator extends DateProfileGenerator {
    buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay) {
      let renderRange = super.buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay);
      let { props } = this;
      return buildDayTableRenderRange({
        currentRange: renderRange,
        snapToWeek: /^(year|month)$/.test(currentRangeUnit),
        fixedWeekCount: props.fixedWeekCount,
        dateEnv: props.dateEnv
      });
    }
  }
  function buildDayTableRenderRange(props) {
    let { dateEnv, currentRange } = props;
    let { start, end } = currentRange;
    let endOfWeek;
    if (props.snapToWeek) {
      start = dateEnv.startOfWeek(start);
      endOfWeek = dateEnv.startOfWeek(end);
      if (endOfWeek.valueOf() !== end.valueOf()) {
        end = addWeeks(endOfWeek, 1);
      }
    }
    if (props.fixedWeekCount) {
      let lastMonthRenderStart = dateEnv.startOfWeek(dateEnv.startOfMonth(addDays(currentRange.end, -1)));
      let rowCnt = Math.ceil(diffWeeks(lastMonthRenderStart, end));
      end = addWeeks(end, 6 - rowCnt);
    }
    return {
      start,
      end
    };
  }
  var css_248z = ":root{--fc-daygrid-event-dot-width:8px}.fc-daygrid-row-print{min-height:6em}.fc-daygrid-day.fc-day-today{background-color:var(--fc-today-bg-color)}.fc-daygrid-day-header{display:flex;flex-direction:row-reverse}.fc-day-other .fc-daygrid-day-header{opacity:.3}.fc-daygrid-day-number{padding:4px;position:relative}.fc-daygrid-month-start{font-size:1.1em;font-weight:700}.fc-daygrid-day-body{display:flex;flex-direction:column;margin-bottom:1px}.fc-daygrid-day-body-tall{margin-bottom:1em;min-height:2em}.fc-daygrid-day-body:only-child{margin-top:2px}.fc-daygrid-more-link{border-radius:3px;cursor:pointer;font-size:var(--fc-small-font-size);margin:0 2px 1px;max-width:100%;overflow:hidden;padding:2px;position:relative;white-space:nowrap}.fc-daygrid-more-link:hover{background-color:rgba(0,0,0,.1)}.fc-daygrid-more-link-button{align-self:flex-start}.fc-daygrid-more-link-block{border:1px solid var(--fc-event-border-color);padding:1px}.fc-daygrid-week-number{background-color:var(--fc-neutral-bg-color);color:var(--fc-neutral-text-color);min-width:1.5em;padding:2px;position:absolute;text-align:center;top:0;z-index:1}.fc-direction-ltr .fc-daygrid-week-number{border-radius:0 0 3px}.fc-direction-rtl .fc-daygrid-week-number{border-radius:0 0 0 3px}.fc-more-popover .fc-popover-body{min-width:220px;padding:10px}.fc-daygrid-event{border-radius:3px;font-size:var(--fc-small-font-size);margin-bottom:1px}.fc-direction-ltr .fc-daygrid-event.fc-event-start,.fc-direction-rtl .fc-daygrid-event.fc-event-end{margin-left:2px}.fc-direction-ltr .fc-daygrid-event.fc-event-end,.fc-direction-rtl .fc-daygrid-event.fc-event-start{margin-right:2px}.fc-direction-ltr .fc-daygrid-event .fc-event-time{margin-right:3px}.fc-direction-rtl .fc-daygrid-event .fc-event-time{margin-left:3px}.fc-direction-ltr .fc-daygrid-block-event:not(.fc-event-start),.fc-direction-rtl .fc-daygrid-block-event:not(.fc-event-end){border-bottom-left-radius:0;border-left-width:0;border-top-left-radius:0}.fc-direction-ltr .fc-daygrid-block-event:not(.fc-event-end),.fc-direction-rtl .fc-daygrid-block-event:not(.fc-event-start){border-bottom-right-radius:0;border-right-width:0;border-top-right-radius:0}.fc-daygrid-block-event .fc-event-time{font-weight:700}.fc-daygrid-block-event .fc-event-time,.fc-daygrid-block-event .fc-event-title{padding:1px}.fc-daygrid-dot-event{align-items:center;direction:row;display:flex;padding:2px 0;position:relative}.fc-daygrid-dot-event.fc-event-mirror,.fc-daygrid-dot-event:hover{background:rgba(0,0,0,.1)}.fc-daygrid-dot-event.fc-event-selected:before{bottom:-10px;top:-10px}.fc-daygrid-event-dot{border:calc(var(--fc-daygrid-event-dot-width)/2) solid var(--fc-event-border-color);border-radius:calc(var(--fc-daygrid-event-dot-width)/2);box-sizing:content-box;height:0;margin:0 4px;width:0}.fc-daygrid-dot-event .fc-event-time,.fc-daygrid-dot-event .fc-event-title{overflow:hidden;white-space:nowrap}.fc-media-print .fc-daygrid-dot-event .fc-event-time,.fc-media-print .fc-daygrid-dot-event .fc-event-title{overflow:hidden!important;white-space:nowrap!important}.fc-daygrid-dot-event .fc-event-title{flex-basis:0;flex-grow:1;font-weight:700;min-height:0;min-width:0}";
  injectStyles(css_248z);
  var index$c = createPlugin({
    name: "@fullcalendar/daygrid",
    initialView: "dayGridMonth",
    views: {
      dayGrid: {
        component: DayGridView,
        dateProfileGeneratorClass: TableDateProfileGenerator
      },
      dayGridDay: {
        type: "dayGrid",
        duration: {
          days: 1
        }
      },
      dayGridWeek: {
        type: "dayGrid",
        duration: {
          weeks: 1
        }
      },
      dayGridMonth: {
        type: "dayGrid",
        duration: {
          months: 1
        },
        fixedWeekCount: true
      },
      dayGridYear: {
        type: "dayGrid",
        duration: {
          years: 1
        }
      }
    }
  });
  var l77 = {
    code: "zh-cn",
    week: {
      dow: 1,
      doy: 4
    },
    buttonText: {
      prev: "\u4E0A\u6708",
      next: "\u4E0B\u6708",
      today: "\u4ECA\u5929",
      year: "\u5E74",
      month: "\u6708",
      week: "\u5468",
      day: "\u65E5",
      list: "\u65E5\u7A0B"
    },
    weekText: "\u5468",
    allDayText: "\u5168\u5929",
    moreLinkText(n2) {
      return "\u53E6\u5916 " + n2 + " \u4E2A";
    },
    noEventsText: "\u6CA1\u6709\u4E8B\u4EF6\u663E\u793A"
  };
  config.touchMouseIgnoreWait = 500;
  let ignoreMouseDepth = 0;
  let listenerCnt = 0;
  let isWindowTouchMoveCancelled = false;
  class PointerDragging {
    constructor(containerEl) {
      this.subjectEl = null;
      this.selector = "";
      this.handleSelector = "";
      this.shouldIgnoreMove = false;
      this.shouldWatchScroll = true;
      this.isDragging = false;
      this.isTouchDragging = false;
      this.wasTouchScroll = false;
      this.handleMouseDown = (ev) => {
        if (!this.shouldIgnoreMouse() && isPrimaryMouseButton(ev) && this.tryStart(ev)) {
          let pev = this.createEventFromMouse(ev, true);
          this.emitter.trigger("pointerdown", pev);
          this.initScrollWatch(pev);
          if (!this.shouldIgnoreMove) {
            document.addEventListener("mousemove", this.handleMouseMove);
          }
          document.addEventListener("mouseup", this.handleMouseUp);
        }
      };
      this.handleMouseMove = (ev) => {
        let pev = this.createEventFromMouse(ev);
        this.recordCoords(pev);
        this.emitter.trigger("pointermove", pev);
      };
      this.handleMouseUp = (ev) => {
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
        this.emitter.trigger("pointerup", this.createEventFromMouse(ev));
        this.cleanup();
      };
      this.handleTouchStart = (ev) => {
        if (this.tryStart(ev)) {
          this.isTouchDragging = true;
          let pev = this.createEventFromTouch(ev, true);
          this.emitter.trigger("pointerdown", pev);
          this.initScrollWatch(pev);
          let targetEl = ev.target;
          if (!this.shouldIgnoreMove) {
            targetEl.addEventListener("touchmove", this.handleTouchMove);
          }
          targetEl.addEventListener("touchend", this.handleTouchEnd);
          targetEl.addEventListener("touchcancel", this.handleTouchEnd);
          window.addEventListener("scroll", this.handleTouchScroll, true);
        }
      };
      this.handleTouchMove = (ev) => {
        if (this.isDragging) {
          let pev = this.createEventFromTouch(ev);
          this.recordCoords(pev);
          this.emitter.trigger("pointermove", pev);
        }
      };
      this.handleTouchEnd = (ev) => {
        if (this.isDragging) {
          let targetEl = ev.target;
          targetEl.removeEventListener("touchmove", this.handleTouchMove);
          targetEl.removeEventListener("touchend", this.handleTouchEnd);
          targetEl.removeEventListener("touchcancel", this.handleTouchEnd);
          window.removeEventListener("scroll", this.handleTouchScroll, true);
          this.emitter.trigger("pointerup", this.createEventFromTouch(ev));
          this.cleanup();
          this.isTouchDragging = false;
          startIgnoringMouse();
        }
      };
      this.handleTouchScroll = () => {
        this.wasTouchScroll = true;
      };
      this.handleScroll = (ev) => {
        if (!this.shouldIgnoreMove) {
          let pageX = window.scrollX - this.prevScrollX + this.prevPageX;
          let pageY = window.scrollY - this.prevScrollY + this.prevPageY;
          this.emitter.trigger("pointermove", {
            origEvent: ev,
            isTouch: this.isTouchDragging,
            subjectEl: this.subjectEl,
            pageX,
            pageY,
            deltaX: pageX - this.origPageX,
            deltaY: pageY - this.origPageY
          });
        }
      };
      this.containerEl = containerEl;
      this.emitter = new Emitter();
      containerEl.addEventListener("mousedown", this.handleMouseDown);
      containerEl.addEventListener("touchstart", this.handleTouchStart, {
        passive: true
      });
      listenerCreated();
    }
    destroy() {
      this.containerEl.removeEventListener("mousedown", this.handleMouseDown);
      this.containerEl.removeEventListener("touchstart", this.handleTouchStart, {
        passive: true
      });
      listenerDestroyed();
    }
    cancel() {
      if (this.isDragging) {
        this.cleanup();
      }
    }
    tryStart(ev) {
      let subjectEl = this.querySubjectEl(ev);
      let downEl = ev.target;
      if (subjectEl && (!this.handleSelector || downEl.closest(this.handleSelector))) {
        this.subjectEl = subjectEl;
        this.isDragging = true;
        this.wasTouchScroll = false;
        return true;
      }
      return false;
    }
    cleanup() {
      isWindowTouchMoveCancelled = false;
      this.isDragging = false;
      this.subjectEl = null;
      this.destroyScrollWatch();
    }
    querySubjectEl(ev) {
      if (this.selector) {
        return ev.target.closest(this.selector);
      }
      return this.containerEl;
    }
    shouldIgnoreMouse() {
      return ignoreMouseDepth || this.isTouchDragging;
    }
    cancelTouchScroll() {
      if (this.isDragging) {
        isWindowTouchMoveCancelled = true;
      }
    }
    initScrollWatch(ev) {
      if (this.shouldWatchScroll) {
        this.recordCoords(ev);
        window.addEventListener("scroll", this.handleScroll, true);
      }
    }
    recordCoords(ev) {
      if (this.shouldWatchScroll) {
        this.prevPageX = ev.pageX;
        this.prevPageY = ev.pageY;
        this.prevScrollX = window.scrollX;
        this.prevScrollY = window.scrollY;
      }
    }
    destroyScrollWatch() {
      if (this.shouldWatchScroll) {
        window.removeEventListener("scroll", this.handleScroll, true);
      }
    }
    createEventFromMouse(ev, isFirst) {
      let deltaX = 0;
      let deltaY = 0;
      if (isFirst) {
        this.origPageX = ev.pageX;
        this.origPageY = ev.pageY;
      } else {
        deltaX = ev.pageX - this.origPageX;
        deltaY = ev.pageY - this.origPageY;
      }
      return {
        origEvent: ev,
        isTouch: false,
        subjectEl: this.subjectEl,
        pageX: ev.pageX,
        pageY: ev.pageY,
        deltaX,
        deltaY
      };
    }
    createEventFromTouch(ev, isFirst) {
      let touches = ev.touches;
      let pageX;
      let pageY;
      let deltaX = 0;
      let deltaY = 0;
      if (touches && touches.length) {
        pageX = touches[0].pageX;
        pageY = touches[0].pageY;
      } else {
        pageX = ev.pageX;
        pageY = ev.pageY;
      }
      if (isFirst) {
        this.origPageX = pageX;
        this.origPageY = pageY;
      } else {
        deltaX = pageX - this.origPageX;
        deltaY = pageY - this.origPageY;
      }
      return {
        origEvent: ev,
        isTouch: true,
        subjectEl: this.subjectEl,
        pageX,
        pageY,
        deltaX,
        deltaY
      };
    }
  }
  function isPrimaryMouseButton(ev) {
    return ev.button === 0 && !ev.ctrlKey;
  }
  function startIgnoringMouse() {
    ignoreMouseDepth += 1;
    setTimeout(() => {
      ignoreMouseDepth -= 1;
    }, config.touchMouseIgnoreWait);
  }
  function listenerCreated() {
    listenerCnt += 1;
    if (listenerCnt === 1) {
      window.addEventListener("touchmove", onWindowTouchMove, {
        passive: false
      });
    }
  }
  function listenerDestroyed() {
    listenerCnt -= 1;
    if (!listenerCnt) {
      window.removeEventListener("touchmove", onWindowTouchMove, {
        passive: false
      });
    }
  }
  function onWindowTouchMove(ev) {
    if (isWindowTouchMoveCancelled) {
      ev.preventDefault();
    }
  }
  class ElementMirror {
    constructor() {
      this.isVisible = false;
      this.sourceEl = null;
      this.mirrorEl = null;
      this.sourceElRect = null;
      this.parentNode = document.body;
      this.zIndex = 9999;
      this.revertDuration = 0;
    }
    start(sourceEl, pageX, pageY) {
      this.sourceEl = sourceEl;
      this.sourceElRect = this.sourceEl.getBoundingClientRect();
      this.origScreenX = pageX - window.scrollX;
      this.origScreenY = pageY - window.scrollY;
      this.deltaX = 0;
      this.deltaY = 0;
      this.updateElPosition();
    }
    handleMove(pageX, pageY) {
      this.deltaX = pageX - window.scrollX - this.origScreenX;
      this.deltaY = pageY - window.scrollY - this.origScreenY;
      this.updateElPosition();
    }
    setIsVisible(bool) {
      if (bool) {
        if (!this.isVisible) {
          if (this.mirrorEl) {
            this.mirrorEl.style.display = "";
          }
          this.isVisible = bool;
          this.updateElPosition();
        }
      } else if (this.isVisible) {
        if (this.mirrorEl) {
          this.mirrorEl.style.display = "none";
        }
        this.isVisible = bool;
      }
    }
    stop(needsRevertAnimation, callback) {
      let done = () => {
        this.cleanup();
        callback();
      };
      if (needsRevertAnimation && this.mirrorEl && this.isVisible && this.revertDuration && (this.deltaX || this.deltaY)) {
        this.doRevertAnimation(done, this.revertDuration);
      } else {
        setTimeout(done, 0);
      }
    }
    doRevertAnimation(callback, revertDuration) {
      let mirrorEl = this.mirrorEl;
      let finalSourceElRect = this.sourceEl.getBoundingClientRect();
      mirrorEl.style.transition = "top " + revertDuration + "ms,left " + revertDuration + "ms";
      applyStyle(mirrorEl, {
        left: finalSourceElRect.left,
        top: finalSourceElRect.top
      });
      whenTransitionDone(mirrorEl, () => {
        mirrorEl.style.transition = "";
        callback();
      });
    }
    cleanup() {
      if (this.mirrorEl) {
        this.mirrorEl.remove();
        this.mirrorEl = null;
      }
      this.sourceEl = null;
    }
    updateElPosition() {
      if (this.sourceEl && this.isVisible) {
        applyStyle(this.getMirrorEl(), {
          left: this.sourceElRect.left + this.deltaX,
          top: this.sourceElRect.top + this.deltaY
        });
      }
    }
    getMirrorEl() {
      let sourceElRect = this.sourceElRect;
      let mirrorEl = this.mirrorEl;
      if (!mirrorEl) {
        mirrorEl = this.mirrorEl = this.sourceEl.cloneNode(true);
        mirrorEl.style.userSelect = "none";
        mirrorEl.style.webkitUserSelect = "none";
        mirrorEl.style.pointerEvents = "none";
        mirrorEl.classList.add("fc-event-dragging");
        applyStyle(mirrorEl, {
          position: "fixed",
          zIndex: this.zIndex,
          visibility: "",
          boxSizing: "border-box",
          width: sourceElRect.right - sourceElRect.left,
          height: sourceElRect.bottom - sourceElRect.top,
          right: "auto",
          bottom: "auto",
          margin: 0
        });
        this.parentNode.appendChild(mirrorEl);
      }
      return mirrorEl;
    }
  }
  class ScrollGeomCache extends ScrollController {
    constructor(scrollController, doesListening) {
      super();
      this.handleScroll = () => {
        this.scrollTop = this.scrollController.getScrollTop();
        this.scrollLeft = this.scrollController.getScrollLeft();
        this.handleScrollChange();
      };
      this.scrollController = scrollController;
      this.doesListening = doesListening;
      this.scrollTop = this.origScrollTop = scrollController.getScrollTop();
      this.scrollLeft = this.origScrollLeft = scrollController.getScrollLeft();
      this.scrollWidth = scrollController.getScrollWidth();
      this.scrollHeight = scrollController.getScrollHeight();
      this.clientWidth = scrollController.getClientWidth();
      this.clientHeight = scrollController.getClientHeight();
      this.clientRect = this.computeClientRect();
      if (this.doesListening) {
        this.getEventTarget().addEventListener("scroll", this.handleScroll);
      }
    }
    destroy() {
      if (this.doesListening) {
        this.getEventTarget().removeEventListener("scroll", this.handleScroll);
      }
    }
    getScrollTop() {
      return this.scrollTop;
    }
    getScrollLeft() {
      return this.scrollLeft;
    }
    setScrollTop(top) {
      this.scrollController.setScrollTop(top);
      if (!this.doesListening) {
        this.scrollTop = Math.max(Math.min(top, this.getMaxScrollTop()), 0);
        this.handleScrollChange();
      }
    }
    setScrollLeft(top) {
      this.scrollController.setScrollLeft(top);
      if (!this.doesListening) {
        this.scrollLeft = Math.max(Math.min(top, this.getMaxScrollLeft()), 0);
        this.handleScrollChange();
      }
    }
    getClientWidth() {
      return this.clientWidth;
    }
    getClientHeight() {
      return this.clientHeight;
    }
    getScrollWidth() {
      return this.scrollWidth;
    }
    getScrollHeight() {
      return this.scrollHeight;
    }
    handleScrollChange() {
    }
  }
  class ElementScrollGeomCache extends ScrollGeomCache {
    constructor(el, doesListening) {
      super(new ElementScrollController(el), doesListening);
    }
    getEventTarget() {
      return this.scrollController.el;
    }
    computeClientRect() {
      return computeInnerRect(this.scrollController.el);
    }
  }
  class WindowScrollGeomCache extends ScrollGeomCache {
    constructor(doesListening) {
      super(new WindowScrollController(), doesListening);
    }
    getEventTarget() {
      return window;
    }
    computeClientRect() {
      return {
        left: this.scrollLeft,
        right: this.scrollLeft + this.clientWidth,
        top: this.scrollTop,
        bottom: this.scrollTop + this.clientHeight
      };
    }
    handleScrollChange() {
      this.clientRect = this.computeClientRect();
    }
  }
  const getTime = typeof performance === "function" ? performance.now : Date.now;
  class AutoScroller {
    constructor() {
      this.isEnabled = true;
      this.scrollQuery = [
        window,
        ".fc-scroller"
      ];
      this.edgeThreshold = 50;
      this.maxVelocity = 300;
      this.pointerScreenX = null;
      this.pointerScreenY = null;
      this.isAnimating = false;
      this.scrollCaches = null;
      this.everMovedUp = false;
      this.everMovedDown = false;
      this.everMovedLeft = false;
      this.everMovedRight = false;
      this.animate = () => {
        if (this.isAnimating) {
          let edge = this.computeBestEdge(this.pointerScreenX + window.scrollX, this.pointerScreenY + window.scrollY);
          if (edge) {
            let now = getTime();
            this.handleSide(edge, (now - this.msSinceRequest) / 1e3);
            this.requestAnimation(now);
          } else {
            this.isAnimating = false;
          }
        }
      };
    }
    start(pageX, pageY, scrollStartEl) {
      if (this.isEnabled) {
        this.scrollCaches = this.buildCaches(scrollStartEl);
        this.pointerScreenX = null;
        this.pointerScreenY = null;
        this.everMovedUp = false;
        this.everMovedDown = false;
        this.everMovedLeft = false;
        this.everMovedRight = false;
        this.handleMove(pageX, pageY);
      }
    }
    handleMove(pageX, pageY) {
      if (this.isEnabled) {
        let pointerScreenX = pageX - window.scrollX;
        let pointerScreenY = pageY - window.scrollY;
        let yDelta = this.pointerScreenY === null ? 0 : pointerScreenY - this.pointerScreenY;
        let xDelta = this.pointerScreenX === null ? 0 : pointerScreenX - this.pointerScreenX;
        if (yDelta < 0) {
          this.everMovedUp = true;
        } else if (yDelta > 0) {
          this.everMovedDown = true;
        }
        if (xDelta < 0) {
          this.everMovedLeft = true;
        } else if (xDelta > 0) {
          this.everMovedRight = true;
        }
        this.pointerScreenX = pointerScreenX;
        this.pointerScreenY = pointerScreenY;
        if (!this.isAnimating) {
          this.isAnimating = true;
          this.requestAnimation(getTime());
        }
      }
    }
    stop() {
      if (this.isEnabled) {
        this.isAnimating = false;
        for (let scrollCache of this.scrollCaches) {
          scrollCache.destroy();
        }
        this.scrollCaches = null;
      }
    }
    requestAnimation(now) {
      this.msSinceRequest = now;
      requestAnimationFrame(this.animate);
    }
    handleSide(edge, seconds) {
      let { scrollCache } = edge;
      let { edgeThreshold } = this;
      let invDistance = edgeThreshold - edge.distance;
      let velocity = invDistance * invDistance / (edgeThreshold * edgeThreshold) * this.maxVelocity * seconds;
      let sign = 1;
      switch (edge.name) {
        case "left":
          sign = -1;
        case "right":
          scrollCache.setScrollLeft(scrollCache.getScrollLeft() + velocity * sign);
          break;
        case "top":
          sign = -1;
        case "bottom":
          scrollCache.setScrollTop(scrollCache.getScrollTop() + velocity * sign);
          break;
      }
    }
    computeBestEdge(left, top) {
      let { edgeThreshold } = this;
      let bestSide = null;
      let scrollCaches = this.scrollCaches || [];
      for (let scrollCache of scrollCaches) {
        let rect = scrollCache.clientRect;
        let leftDist = left - rect.left;
        let rightDist = rect.right - left;
        let topDist = top - rect.top;
        let bottomDist = rect.bottom - top;
        if (leftDist >= 0 && rightDist >= 0 && topDist >= 0 && bottomDist >= 0) {
          if (topDist <= edgeThreshold && this.everMovedUp && scrollCache.canScrollUp() && (!bestSide || bestSide.distance > topDist)) {
            bestSide = {
              scrollCache,
              name: "top",
              distance: topDist
            };
          }
          if (bottomDist <= edgeThreshold && this.everMovedDown && scrollCache.canScrollDown() && (!bestSide || bestSide.distance > bottomDist)) {
            bestSide = {
              scrollCache,
              name: "bottom",
              distance: bottomDist
            };
          }
          if (leftDist <= edgeThreshold && this.everMovedLeft && scrollCache.canScrollLeft() && (!bestSide || bestSide.distance > leftDist)) {
            bestSide = {
              scrollCache,
              name: "left",
              distance: leftDist
            };
          }
          if (rightDist <= edgeThreshold && this.everMovedRight && scrollCache.canScrollRight() && (!bestSide || bestSide.distance > rightDist)) {
            bestSide = {
              scrollCache,
              name: "right",
              distance: rightDist
            };
          }
        }
      }
      return bestSide;
    }
    buildCaches(scrollStartEl) {
      return this.queryScrollEls(scrollStartEl).map((el) => {
        if (el === window) {
          return new WindowScrollGeomCache(false);
        }
        return new ElementScrollGeomCache(el, false);
      });
    }
    queryScrollEls(scrollStartEl) {
      let els = [];
      for (let query of this.scrollQuery) {
        if (typeof query === "object") {
          els.push(query);
        } else {
          els.push(...Array.prototype.slice.call(scrollStartEl.getRootNode().querySelectorAll(query)));
        }
      }
      return els;
    }
  }
  class FeaturefulElementDragging extends ElementDragging {
    constructor(containerEl, selector) {
      super(containerEl);
      this.containerEl = containerEl;
      this.delay = null;
      this.minDistance = 0;
      this.touchScrollAllowed = true;
      this.mirrorNeedsRevert = false;
      this.isInteracting = false;
      this.isDragging = false;
      this.isDelayEnded = false;
      this.isDistanceSurpassed = false;
      this.delayTimeoutId = null;
      this.onPointerDown = (ev) => {
        if (!this.isDragging) {
          this.isInteracting = true;
          this.isDelayEnded = false;
          this.isDistanceSurpassed = false;
          this.emitter.trigger("pointerdown", ev);
          if (this.isInteracting) {
            preventSelection(document.body);
            preventContextMenu(document.body);
            if (!ev.isTouch) {
              ev.origEvent.preventDefault();
            }
            this.mirror.setIsVisible(false);
            this.mirror.start(ev.subjectEl, ev.pageX, ev.pageY);
            this.startDelay(ev);
            if (!this.minDistance) {
              this.handleDistanceSurpassed(ev);
            }
          }
        }
      };
      this.onPointerMove = (ev) => {
        if (this.isInteracting) {
          this.emitter.trigger("pointermove", ev);
          if (!this.isDistanceSurpassed) {
            let minDistance = this.minDistance;
            let distanceSq;
            let { deltaX, deltaY } = ev;
            distanceSq = deltaX * deltaX + deltaY * deltaY;
            if (distanceSq >= minDistance * minDistance) {
              this.handleDistanceSurpassed(ev);
            }
          }
          if (this.isDragging) {
            if (ev.origEvent.type !== "scroll") {
              this.mirror.handleMove(ev.pageX, ev.pageY);
              this.autoScroller.handleMove(ev.pageX, ev.pageY);
            }
            this.emitter.trigger("dragmove", ev);
          }
        }
      };
      this.onPointerUp = (ev) => {
        if (this.isInteracting) {
          this.isInteracting = false;
          allowSelection(document.body);
          allowContextMenu(document.body);
          this.emitter.trigger("pointerup", ev);
          if (this.isDragging) {
            this.autoScroller.stop();
            this.tryStopDrag(ev);
          }
          if (this.delayTimeoutId) {
            clearTimeout(this.delayTimeoutId);
            this.delayTimeoutId = null;
          }
        }
      };
      let pointer = this.pointer = new PointerDragging(containerEl);
      pointer.emitter.on("pointerdown", this.onPointerDown);
      pointer.emitter.on("pointermove", this.onPointerMove);
      pointer.emitter.on("pointerup", this.onPointerUp);
      if (selector) {
        pointer.selector = selector;
      }
      this.mirror = new ElementMirror();
      this.autoScroller = new AutoScroller();
    }
    destroy() {
      this.pointer.destroy();
      this.onPointerUp({});
    }
    startDelay(ev) {
      if (typeof this.delay === "number") {
        this.delayTimeoutId = setTimeout(() => {
          this.delayTimeoutId = null;
          this.handleDelayEnd(ev);
        }, this.delay);
      } else {
        this.handleDelayEnd(ev);
      }
    }
    handleDelayEnd(ev) {
      this.isDelayEnded = true;
      this.tryStartDrag(ev);
    }
    handleDistanceSurpassed(ev) {
      this.isDistanceSurpassed = true;
      this.tryStartDrag(ev);
    }
    tryStartDrag(ev) {
      if (this.isDelayEnded && this.isDistanceSurpassed) {
        if (!this.pointer.wasTouchScroll || this.touchScrollAllowed) {
          this.isDragging = true;
          this.mirrorNeedsRevert = false;
          this.autoScroller.start(ev.pageX, ev.pageY, this.containerEl);
          this.emitter.trigger("dragstart", ev);
          if (this.touchScrollAllowed === false) {
            this.pointer.cancelTouchScroll();
          }
        }
      }
    }
    tryStopDrag(ev) {
      this.mirror.stop(this.mirrorNeedsRevert, this.stopDrag.bind(this, ev));
    }
    stopDrag(ev) {
      this.isDragging = false;
      this.emitter.trigger("dragend", ev);
    }
    cancel() {
      if (this.isInteracting) {
        this.isInteracting = false;
        this.pointer.cancel();
      }
    }
    setMirrorIsVisible(bool) {
      this.mirror.setIsVisible(bool);
    }
    setMirrorNeedsRevert(bool) {
      this.mirrorNeedsRevert = bool;
    }
    setAutoScrollEnabled(bool) {
      this.autoScroller.isEnabled = bool;
    }
  }
  class OffsetTracker {
    constructor(el) {
      this.el = el;
      this.origRect = computeRect(el);
      this.scrollCaches = getClippingParents(el).map((scrollEl) => new ElementScrollGeomCache(scrollEl, true));
    }
    destroy() {
      for (let scrollCache of this.scrollCaches) {
        scrollCache.destroy();
      }
    }
    computeLeft() {
      let left = this.origRect.left;
      for (let scrollCache of this.scrollCaches) {
        left += scrollCache.origScrollLeft - scrollCache.getScrollLeft();
      }
      return left;
    }
    computeTop() {
      let top = this.origRect.top;
      for (let scrollCache of this.scrollCaches) {
        top += scrollCache.origScrollTop - scrollCache.getScrollTop();
      }
      return top;
    }
    isWithinClipping(pageX, pageY) {
      let point = {
        left: pageX,
        top: pageY
      };
      for (let scrollCache of this.scrollCaches) {
        if (!isIgnoredClipping(scrollCache.getEventTarget()) && !pointInsideRect(point, scrollCache.clientRect)) {
          return false;
        }
      }
      return true;
    }
  }
  function isIgnoredClipping(node) {
    let tagName = node.tagName;
    return tagName === "HTML" || tagName === "BODY";
  }
  class HitDragging {
    constructor(dragging, droppableStore) {
      this.useSubjectCenter = false;
      this.requireInitial = true;
      this.disablePointCheck = false;
      this.initialHit = null;
      this.movingHit = null;
      this.finalHit = null;
      this.handlePointerDown = (ev) => {
        let { dragging: dragging2 } = this;
        this.initialHit = null;
        this.movingHit = null;
        this.finalHit = null;
        this.prepareHits();
        this.processFirstCoord(ev);
        if (this.initialHit || !this.requireInitial) {
          this.emitter.trigger("pointerdown", ev);
        } else {
          dragging2.cancel();
        }
      };
      this.handleDragStart = (ev) => {
        this.emitter.trigger("dragstart", ev);
        this.handleMove(ev, true);
      };
      this.handleDragMove = (ev) => {
        this.emitter.trigger("dragmove", ev);
        this.handleMove(ev);
      };
      this.handlePointerUp = (ev) => {
        this.releaseHits();
        this.emitter.trigger("pointerup", ev);
      };
      this.handleDragEnd = (ev) => {
        if (this.movingHit) {
          this.emitter.trigger("hitupdate", null, true, ev);
        }
        this.finalHit = this.movingHit;
        this.movingHit = null;
        this.emitter.trigger("dragend", ev);
      };
      this.droppableStore = droppableStore;
      dragging.emitter.on("pointerdown", this.handlePointerDown);
      dragging.emitter.on("dragstart", this.handleDragStart);
      dragging.emitter.on("dragmove", this.handleDragMove);
      dragging.emitter.on("pointerup", this.handlePointerUp);
      dragging.emitter.on("dragend", this.handleDragEnd);
      this.dragging = dragging;
      this.emitter = new Emitter();
    }
    processFirstCoord(ev) {
      let origPoint = {
        left: ev.pageX,
        top: ev.pageY
      };
      let adjustedPoint = origPoint;
      let subjectEl = ev.subjectEl;
      let subjectRect;
      if (subjectEl instanceof HTMLElement) {
        subjectRect = computeRect(subjectEl);
        adjustedPoint = constrainPoint(adjustedPoint, subjectRect);
      }
      let initialHit = this.initialHit = this.queryHitForOffset(adjustedPoint.left, adjustedPoint.top);
      if (initialHit) {
        if (this.useSubjectCenter && subjectRect) {
          let slicedSubjectRect = intersectRects(subjectRect, initialHit.rect);
          if (slicedSubjectRect) {
            adjustedPoint = getRectCenter(slicedSubjectRect);
          }
        }
        this.coordAdjust = diffPoints(adjustedPoint, origPoint);
      } else {
        this.coordAdjust = {
          left: 0,
          top: 0
        };
      }
    }
    handleMove(ev, forceHandle) {
      let hit = this.queryHitForOffset(ev.pageX + this.coordAdjust.left, ev.pageY + this.coordAdjust.top);
      if (forceHandle || !isHitsEqual(this.movingHit, hit)) {
        this.movingHit = hit;
        this.emitter.trigger("hitupdate", hit, false, ev);
      }
    }
    prepareHits() {
      this.offsetTrackers = mapHash(this.droppableStore, (interactionSettings) => {
        interactionSettings.component.prepareHits();
        return new OffsetTracker(interactionSettings.el);
      });
    }
    releaseHits() {
      let { offsetTrackers } = this;
      for (let id in offsetTrackers) {
        offsetTrackers[id].destroy();
      }
      this.offsetTrackers = {};
    }
    queryHitForOffset(offsetLeft, offsetTop) {
      let { droppableStore, offsetTrackers } = this;
      let bestHit = null;
      for (let id in droppableStore) {
        let component = droppableStore[id].component;
        let offsetTracker = offsetTrackers[id];
        if (offsetTracker && offsetTracker.isWithinClipping(offsetLeft, offsetTop)) {
          let originLeft = offsetTracker.computeLeft();
          let originTop = offsetTracker.computeTop();
          let positionLeft = offsetLeft - originLeft;
          let positionTop = offsetTop - originTop;
          let { origRect } = offsetTracker;
          let width = origRect.right - origRect.left;
          let height = origRect.bottom - origRect.top;
          if (positionLeft >= 0 && positionLeft < width && positionTop >= 0 && positionTop < height) {
            let hit = component.queryHit(positionLeft, positionTop, width, height);
            if (hit && rangeContainsRange(hit.dateProfile.activeRange, hit.dateSpan.range) && (this.disablePointCheck || offsetTracker.el.contains(offsetTracker.el.getRootNode().elementFromPoint(positionLeft + originLeft - window.scrollX, positionTop + originTop - window.scrollY))) && (!bestHit || hit.layer > bestHit.layer)) {
              hit.componentId = id;
              hit.context = component.context;
              hit.rect.left += originLeft;
              hit.rect.right += originLeft;
              hit.rect.top += originTop;
              hit.rect.bottom += originTop;
              bestHit = hit;
            }
          }
        }
      }
      return bestHit;
    }
  }
  function isHitsEqual(hit0, hit1) {
    if (!hit0 && !hit1) {
      return true;
    }
    if (Boolean(hit0) !== Boolean(hit1)) {
      return false;
    }
    return isDateSpansEqual(hit0.dateSpan, hit1.dateSpan);
  }
  function buildDatePointApiWithContext(dateSpan, context) {
    let props = {};
    for (let transform of context.pluginHooks.datePointTransforms) {
      Object.assign(props, transform(dateSpan, context));
    }
    Object.assign(props, buildDatePointApi(dateSpan, context.dateEnv));
    return props;
  }
  function buildDatePointApi(span, dateEnv) {
    return {
      date: dateEnv.toDate(span.range.start),
      dateStr: dateEnv.formatIso(span.range.start, {
        omitTime: span.allDay
      }),
      allDay: span.allDay
    };
  }
  class DateClicking extends Interaction {
    constructor(settings) {
      super(settings);
      this.handlePointerDown = (pev) => {
        let { dragging } = this;
        let downEl = pev.origEvent.target;
        const canDateClick = this.component.context.emitter.hasHandlers("dateClick") && this.component.isValidDateDownEl(downEl);
        if (!canDateClick) {
          dragging.cancel();
        }
      };
      this.handleDragEnd = (ev) => {
        let { component } = this;
        let { pointer } = this.dragging;
        if (!pointer.wasTouchScroll) {
          let { initialHit, finalHit } = this.hitDragging;
          if (initialHit && finalHit && isHitsEqual(initialHit, finalHit)) {
            let { context } = component;
            let arg = Object.assign(Object.assign({}, buildDatePointApiWithContext(initialHit.dateSpan, context)), {
              dayEl: initialHit.getDayEl(),
              jsEvent: ev.origEvent,
              view: context.viewApi || context.calendarApi.view
            });
            context.emitter.trigger("dateClick", arg);
          }
        }
      };
      this.dragging = new FeaturefulElementDragging(settings.el);
      this.dragging.autoScroller.isEnabled = false;
      let hitDragging = this.hitDragging = new HitDragging(this.dragging, interactionSettingsToStore(settings));
      hitDragging.emitter.on("pointerdown", this.handlePointerDown);
      hitDragging.emitter.on("dragend", this.handleDragEnd);
    }
    destroy() {
      this.dragging.destroy();
    }
  }
  class DateSelecting extends Interaction {
    constructor(settings) {
      super(settings);
      this.dragSelection = null;
      this.handlePointerDown = (ev) => {
        let { component: component2, dragging: dragging2 } = this;
        let { options: options2 } = component2.context;
        let canDateSelect = options2.selectable && component2.isValidDateDownEl(ev.origEvent.target);
        if (!canDateSelect) {
          dragging2.cancel();
        } else {
          dragging2.delay = ev.isTouch ? getComponentTouchDelay$1(component2) : null;
        }
      };
      this.handleDragStart = (ev) => {
        this.component.context.calendarApi.unselect(ev);
      };
      this.handleHitUpdate = (hit, isFinal) => {
        let { context } = this.component;
        let dragSelection = null;
        let isInvalid = false;
        if (hit) {
          let initialHit = this.hitDragging.initialHit;
          let disallowed = hit.componentId === initialHit.componentId && this.isHitComboAllowed && !this.isHitComboAllowed(initialHit, hit);
          if (!disallowed) {
            dragSelection = joinHitsIntoSelection(initialHit, hit, context.pluginHooks.dateSelectionTransformers);
          }
          if (!dragSelection || !isDateSelectionValid(dragSelection, hit.dateProfile, context)) {
            isInvalid = true;
            dragSelection = null;
          }
        }
        if (dragSelection) {
          context.dispatch({
            type: "SELECT_DATES",
            selection: dragSelection
          });
        } else if (!isFinal) {
          context.dispatch({
            type: "UNSELECT_DATES"
          });
        }
        if (!isInvalid) {
          enableCursor();
        } else {
          disableCursor();
        }
        if (!isFinal) {
          this.dragSelection = dragSelection;
        }
      };
      this.handlePointerUp = (pev) => {
        if (this.dragSelection) {
          triggerDateSelect(this.dragSelection, pev, this.component.context);
          this.dragSelection = null;
        }
      };
      let { component } = settings;
      let { options } = component.context;
      let dragging = this.dragging = new FeaturefulElementDragging(settings.el);
      dragging.touchScrollAllowed = false;
      dragging.minDistance = options.selectMinDistance || 0;
      dragging.autoScroller.isEnabled = options.dragScroll;
      let hitDragging = this.hitDragging = new HitDragging(this.dragging, interactionSettingsToStore(settings));
      hitDragging.emitter.on("pointerdown", this.handlePointerDown);
      hitDragging.emitter.on("dragstart", this.handleDragStart);
      hitDragging.emitter.on("hitupdate", this.handleHitUpdate);
      hitDragging.emitter.on("pointerup", this.handlePointerUp);
    }
    destroy() {
      this.dragging.destroy();
    }
  }
  function getComponentTouchDelay$1(component) {
    let { options } = component.context;
    let delay = options.selectLongPressDelay;
    if (delay == null) {
      delay = options.longPressDelay;
    }
    return delay;
  }
  function joinHitsIntoSelection(hit0, hit1, dateSelectionTransformers) {
    let dateSpan0 = hit0.dateSpan;
    let dateSpan1 = hit1.dateSpan;
    let ms = [
      dateSpan0.range.start,
      dateSpan0.range.end,
      dateSpan1.range.start,
      dateSpan1.range.end
    ];
    ms.sort(compareNumbers);
    let props = {};
    for (let transformer of dateSelectionTransformers) {
      let res = transformer(hit0, hit1);
      if (res === false) {
        return null;
      }
      if (res) {
        Object.assign(props, res);
      }
    }
    props.range = {
      start: ms[0],
      end: ms[3]
    };
    props.allDay = dateSpan0.allDay;
    return props;
  }
  class EventDragging extends Interaction {
    constructor(settings) {
      super(settings);
      this.subjectEl = null;
      this.isDragging = false;
      this.eventRange = null;
      this.relevantEvents = null;
      this.receivingContext = null;
      this.validMutation = null;
      this.mutatedRelevantEvents = null;
      this.handlePointerDown = (ev) => {
        let origTarget = ev.origEvent.target;
        let { component: component2, dragging: dragging2 } = this;
        let { mirror } = dragging2;
        let { options: options2 } = component2.context;
        let initialContext = component2.context;
        this.subjectEl = ev.subjectEl;
        let eventRange = this.eventRange = getElEventRange(ev.subjectEl);
        let eventInstanceId = eventRange.instance.instanceId;
        this.relevantEvents = getRelevantEvents(initialContext.getCurrentData().eventStore, eventInstanceId);
        dragging2.minDistance = ev.isTouch ? 0 : options2.eventDragMinDistance;
        dragging2.delay = ev.isTouch && eventInstanceId !== component2.props.eventSelection ? getComponentTouchDelay(component2) : null;
        if (options2.fixedMirrorParent) {
          mirror.parentNode = options2.fixedMirrorParent;
        } else {
          mirror.parentNode = origTarget.closest(".fc");
        }
        mirror.revertDuration = options2.dragRevertDuration;
        let isValid = component2.isValidSegDownEl(origTarget) && !origTarget.closest(".fc-event-resizer");
        if (!isValid) {
          dragging2.cancel();
        } else {
          this.isDragging = ev.subjectEl.classList.contains("fc-event-draggable");
        }
      };
      this.handleDragStart = (ev) => {
        let initialContext = this.component.context;
        let eventRange = this.eventRange;
        let eventInstanceId = eventRange.instance.instanceId;
        if (ev.isTouch) {
          if (eventInstanceId !== this.component.props.eventSelection) {
            initialContext.dispatch({
              type: "SELECT_EVENT",
              eventInstanceId
            });
          }
        } else {
          initialContext.dispatch({
            type: "UNSELECT_EVENT"
          });
        }
        if (this.isDragging) {
          initialContext.calendarApi.unselect(ev);
          initialContext.emitter.trigger("eventDragStart", {
            el: this.subjectEl,
            event: new EventImpl(initialContext, eventRange.def, eventRange.instance),
            jsEvent: ev.origEvent,
            view: initialContext.viewApi
          });
        }
      };
      this.handleHitUpdate = (hit, isFinal) => {
        if (!this.isDragging) {
          return;
        }
        let relevantEvents = this.relevantEvents;
        let initialHit = this.hitDragging.initialHit;
        let initialContext = this.component.context;
        let receivingContext = null;
        let mutation = null;
        let mutatedRelevantEvents = null;
        let isInvalid = false;
        let interaction = {
          affectedEvents: relevantEvents,
          mutatedEvents: createEmptyEventStore(),
          isEvent: true
        };
        if (hit) {
          receivingContext = hit.context;
          let receivingOptions = receivingContext.options;
          if (initialContext === receivingContext || receivingOptions.editable && receivingOptions.droppable) {
            mutation = computeEventMutation(initialHit, hit, this.eventRange.instance.range.start, receivingContext.getCurrentData().pluginHooks.eventDragMutationMassagers);
            if (mutation) {
              mutatedRelevantEvents = applyMutationToEventStore(relevantEvents, receivingContext.getCurrentData().eventUiBases, mutation, receivingContext);
              interaction.mutatedEvents = mutatedRelevantEvents;
              if (!isInteractionValid(interaction, hit.dateProfile, receivingContext)) {
                isInvalid = true;
                mutation = null;
                mutatedRelevantEvents = null;
                interaction.mutatedEvents = createEmptyEventStore();
              }
            }
          } else {
            receivingContext = null;
          }
        }
        this.displayDrag(receivingContext, interaction);
        if (!isInvalid) {
          enableCursor();
        } else {
          disableCursor();
        }
        if (!isFinal) {
          if (initialContext === receivingContext && isHitsEqual(initialHit, hit)) {
            mutation = null;
          }
          this.dragging.setMirrorNeedsRevert(!mutation);
          this.dragging.setMirrorIsVisible(!hit || !this.subjectEl.getRootNode().querySelector(".fc-event-mirror"));
          this.receivingContext = receivingContext;
          this.validMutation = mutation;
          this.mutatedRelevantEvents = mutatedRelevantEvents;
        }
      };
      this.handlePointerUp = () => {
        if (!this.isDragging) {
          this.cleanup();
        }
      };
      this.handleDragEnd = (ev) => {
        if (this.isDragging) {
          let initialContext = this.component.context;
          let initialView = initialContext.viewApi;
          let { receivingContext, validMutation } = this;
          let eventDef = this.eventRange.def;
          let eventInstance = this.eventRange.instance;
          let eventApi = new EventImpl(initialContext, eventDef, eventInstance);
          let relevantEvents = this.relevantEvents;
          let mutatedRelevantEvents = this.mutatedRelevantEvents;
          let { finalHit } = this.hitDragging;
          this.clearDrag();
          initialContext.emitter.trigger("eventDragStop", {
            el: this.subjectEl,
            event: eventApi,
            jsEvent: ev.origEvent,
            view: initialView
          });
          if (validMutation) {
            if (receivingContext === initialContext) {
              let updatedEventApi = new EventImpl(initialContext, mutatedRelevantEvents.defs[eventDef.defId], eventInstance ? mutatedRelevantEvents.instances[eventInstance.instanceId] : null);
              initialContext.dispatch({
                type: "MERGE_EVENTS",
                eventStore: mutatedRelevantEvents
              });
              let eventChangeArg = {
                oldEvent: eventApi,
                event: updatedEventApi,
                relatedEvents: buildEventApis(mutatedRelevantEvents, initialContext, eventInstance),
                revert() {
                  initialContext.dispatch({
                    type: "MERGE_EVENTS",
                    eventStore: relevantEvents
                  });
                }
              };
              let transformed = {};
              for (let transformer of initialContext.getCurrentData().pluginHooks.eventDropTransformers) {
                Object.assign(transformed, transformer(validMutation, initialContext));
              }
              initialContext.emitter.trigger("eventDrop", Object.assign(Object.assign(Object.assign({}, eventChangeArg), transformed), {
                el: ev.subjectEl,
                delta: validMutation.datesDelta,
                jsEvent: ev.origEvent,
                view: initialView
              }));
              initialContext.emitter.trigger("eventChange", eventChangeArg);
            } else if (receivingContext) {
              let eventRemoveArg = {
                event: eventApi,
                relatedEvents: buildEventApis(relevantEvents, initialContext, eventInstance),
                revert() {
                  initialContext.dispatch({
                    type: "MERGE_EVENTS",
                    eventStore: relevantEvents
                  });
                }
              };
              initialContext.emitter.trigger("eventLeave", Object.assign(Object.assign({}, eventRemoveArg), {
                draggedEl: ev.subjectEl,
                view: initialView
              }));
              initialContext.dispatch({
                type: "REMOVE_EVENTS",
                eventStore: relevantEvents
              });
              initialContext.emitter.trigger("eventRemove", eventRemoveArg);
              let addedEventDef = mutatedRelevantEvents.defs[eventDef.defId];
              let addedEventInstance = mutatedRelevantEvents.instances[eventInstance.instanceId];
              let addedEventApi = new EventImpl(receivingContext, addedEventDef, addedEventInstance);
              receivingContext.dispatch({
                type: "MERGE_EVENTS",
                eventStore: mutatedRelevantEvents
              });
              let eventAddArg = {
                event: addedEventApi,
                relatedEvents: buildEventApis(mutatedRelevantEvents, receivingContext, addedEventInstance),
                revert() {
                  receivingContext.dispatch({
                    type: "REMOVE_EVENTS",
                    eventStore: mutatedRelevantEvents
                  });
                }
              };
              receivingContext.emitter.trigger("eventAdd", eventAddArg);
              if (ev.isTouch) {
                receivingContext.dispatch({
                  type: "SELECT_EVENT",
                  eventInstanceId: eventInstance.instanceId
                });
              }
              receivingContext.emitter.trigger("drop", Object.assign(Object.assign({}, buildDatePointApiWithContext(finalHit.dateSpan, receivingContext)), {
                draggedEl: ev.subjectEl,
                jsEvent: ev.origEvent,
                view: finalHit.context.viewApi
              }));
              receivingContext.emitter.trigger("eventReceive", Object.assign(Object.assign({}, eventAddArg), {
                draggedEl: ev.subjectEl,
                view: finalHit.context.viewApi
              }));
            }
          } else {
            initialContext.emitter.trigger("_noEventDrop");
          }
        }
        this.cleanup();
      };
      let { component } = this;
      let { options } = component.context;
      let dragging = this.dragging = new FeaturefulElementDragging(settings.el);
      dragging.pointer.selector = EventDragging.SELECTOR;
      dragging.touchScrollAllowed = false;
      dragging.autoScroller.isEnabled = options.dragScroll;
      let hitDragging = this.hitDragging = new HitDragging(this.dragging, interactionSettingsStore);
      hitDragging.useSubjectCenter = settings.useEventCenter;
      hitDragging.emitter.on("pointerdown", this.handlePointerDown);
      hitDragging.emitter.on("dragstart", this.handleDragStart);
      hitDragging.emitter.on("hitupdate", this.handleHitUpdate);
      hitDragging.emitter.on("pointerup", this.handlePointerUp);
      hitDragging.emitter.on("dragend", this.handleDragEnd);
    }
    destroy() {
      this.dragging.destroy();
    }
    displayDrag(nextContext, state) {
      let initialContext = this.component.context;
      let prevContext = this.receivingContext;
      if (prevContext && prevContext !== nextContext) {
        if (prevContext === initialContext) {
          prevContext.dispatch({
            type: "SET_EVENT_DRAG",
            state: {
              affectedEvents: state.affectedEvents,
              mutatedEvents: createEmptyEventStore(),
              isEvent: true
            }
          });
        } else {
          prevContext.dispatch({
            type: "UNSET_EVENT_DRAG"
          });
        }
      }
      if (nextContext) {
        nextContext.dispatch({
          type: "SET_EVENT_DRAG",
          state
        });
      }
    }
    clearDrag() {
      let initialCalendar = this.component.context;
      let { receivingContext } = this;
      if (receivingContext) {
        receivingContext.dispatch({
          type: "UNSET_EVENT_DRAG"
        });
      }
      if (initialCalendar !== receivingContext) {
        initialCalendar.dispatch({
          type: "UNSET_EVENT_DRAG"
        });
      }
    }
    cleanup() {
      this.isDragging = false;
      this.eventRange = null;
      this.relevantEvents = null;
      this.receivingContext = null;
      this.validMutation = null;
      this.mutatedRelevantEvents = null;
    }
  }
  EventDragging.SELECTOR = ".fc-event-draggable, .fc-event-resizable";
  function computeEventMutation(hit0, hit1, eventInstanceStart, massagers) {
    let dateSpan0 = hit0.dateSpan;
    let dateSpan1 = hit1.dateSpan;
    let date0 = dateSpan0.range.start;
    let date1 = dateSpan1.range.start;
    let standardProps = {};
    if (dateSpan0.allDay !== dateSpan1.allDay) {
      standardProps.allDay = dateSpan1.allDay;
      standardProps.hasEnd = hit1.context.options.allDayMaintainDuration;
      if (dateSpan1.allDay) {
        date0 = startOfDay(eventInstanceStart);
      } else {
        date0 = eventInstanceStart;
      }
    }
    let delta = diffDates(date0, date1, hit0.context.dateEnv, hit0.componentId === hit1.componentId ? hit0.largeUnit : null);
    if (delta.milliseconds) {
      standardProps.allDay = false;
    }
    let mutation = {
      datesDelta: delta,
      standardProps
    };
    for (let massager of massagers) {
      massager(mutation, hit0, hit1);
    }
    return mutation;
  }
  function getComponentTouchDelay(component) {
    let { options } = component.context;
    let delay = options.eventLongPressDelay;
    if (delay == null) {
      delay = options.longPressDelay;
    }
    return delay;
  }
  class EventResizing extends Interaction {
    constructor(settings) {
      super(settings);
      this.draggingSegEl = null;
      this.draggingEventRange = null;
      this.eventRange = null;
      this.relevantEvents = null;
      this.validMutation = null;
      this.mutatedRelevantEvents = null;
      this.handlePointerDown = (ev) => {
        let { component: component2 } = this;
        let segEl = this.querySegEl(ev);
        let eventRange = this.eventRange = getElEventRange(segEl);
        this.dragging.minDistance = component2.context.options.eventDragMinDistance;
        const isValid = this.component.isValidSegDownEl(ev.origEvent.target) && !(ev.isTouch && this.component.props.eventSelection !== eventRange.instance.instanceId);
        if (!isValid) {
          this.dragging.cancel();
        }
      };
      this.handleDragStart = (ev) => {
        let { context } = this.component;
        let eventRange = this.eventRange;
        this.relevantEvents = getRelevantEvents(context.getCurrentData().eventStore, this.eventRange.instance.instanceId);
        let segEl = this.querySegEl(ev);
        this.draggingSegEl = segEl;
        this.draggingEventRange = getElEventRange(segEl);
        context.calendarApi.unselect();
        context.emitter.trigger("eventResizeStart", {
          el: segEl,
          event: new EventImpl(context, eventRange.def, eventRange.instance),
          jsEvent: ev.origEvent,
          view: context.viewApi
        });
      };
      this.handleHitUpdate = (hit, isFinal, ev) => {
        let { context } = this.component;
        let relevantEvents = this.relevantEvents;
        let initialHit = this.hitDragging.initialHit;
        let eventInstance = this.eventRange.instance;
        let mutation = null;
        let mutatedRelevantEvents = null;
        let isInvalid = false;
        let interaction = {
          affectedEvents: relevantEvents,
          mutatedEvents: createEmptyEventStore(),
          isEvent: true
        };
        if (hit) {
          let disallowed = hit.componentId === initialHit.componentId && this.isHitComboAllowed && !this.isHitComboAllowed(initialHit, hit);
          if (!disallowed) {
            mutation = computeMutation(initialHit, hit, ev.subjectEl.classList.contains("fc-event-resizer-start"), eventInstance.range);
          }
        }
        if (mutation) {
          mutatedRelevantEvents = applyMutationToEventStore(relevantEvents, context.getCurrentData().eventUiBases, mutation, context);
          interaction.mutatedEvents = mutatedRelevantEvents;
          if (!isInteractionValid(interaction, hit.dateProfile, context)) {
            isInvalid = true;
            mutation = null;
            mutatedRelevantEvents = null;
            interaction.mutatedEvents = null;
          }
        }
        if (mutatedRelevantEvents) {
          context.dispatch({
            type: "SET_EVENT_RESIZE",
            state: interaction
          });
        } else {
          context.dispatch({
            type: "UNSET_EVENT_RESIZE"
          });
        }
        if (!isInvalid) {
          enableCursor();
        } else {
          disableCursor();
        }
        if (!isFinal) {
          if (mutation && isHitsEqual(initialHit, hit)) {
            mutation = null;
          }
          this.validMutation = mutation;
          this.mutatedRelevantEvents = mutatedRelevantEvents;
        }
      };
      this.handleDragEnd = (ev) => {
        let { context } = this.component;
        let eventDef = this.eventRange.def;
        let eventInstance = this.eventRange.instance;
        let eventApi = new EventImpl(context, eventDef, eventInstance);
        let relevantEvents = this.relevantEvents;
        let mutatedRelevantEvents = this.mutatedRelevantEvents;
        context.emitter.trigger("eventResizeStop", {
          el: this.draggingSegEl,
          event: eventApi,
          jsEvent: ev.origEvent,
          view: context.viewApi
        });
        if (this.validMutation) {
          let updatedEventApi = new EventImpl(context, mutatedRelevantEvents.defs[eventDef.defId], eventInstance ? mutatedRelevantEvents.instances[eventInstance.instanceId] : null);
          context.dispatch({
            type: "MERGE_EVENTS",
            eventStore: mutatedRelevantEvents
          });
          let eventChangeArg = {
            oldEvent: eventApi,
            event: updatedEventApi,
            relatedEvents: buildEventApis(mutatedRelevantEvents, context, eventInstance),
            revert() {
              context.dispatch({
                type: "MERGE_EVENTS",
                eventStore: relevantEvents
              });
            }
          };
          context.emitter.trigger("eventResize", Object.assign(Object.assign({}, eventChangeArg), {
            el: this.draggingSegEl,
            startDelta: this.validMutation.startDelta || createDuration(0),
            endDelta: this.validMutation.endDelta || createDuration(0),
            jsEvent: ev.origEvent,
            view: context.viewApi
          }));
          context.emitter.trigger("eventChange", eventChangeArg);
        } else {
          context.emitter.trigger("_noEventResize");
        }
        this.draggingEventRange = null;
        this.relevantEvents = null;
        this.validMutation = null;
      };
      let { component } = settings;
      let dragging = this.dragging = new FeaturefulElementDragging(settings.el);
      dragging.pointer.selector = ".fc-event-resizer";
      dragging.touchScrollAllowed = false;
      dragging.autoScroller.isEnabled = component.context.options.dragScroll;
      let hitDragging = this.hitDragging = new HitDragging(this.dragging, interactionSettingsToStore(settings));
      hitDragging.emitter.on("pointerdown", this.handlePointerDown);
      hitDragging.emitter.on("dragstart", this.handleDragStart);
      hitDragging.emitter.on("hitupdate", this.handleHitUpdate);
      hitDragging.emitter.on("dragend", this.handleDragEnd);
    }
    destroy() {
      this.dragging.destroy();
    }
    querySegEl(ev) {
      return ev.subjectEl.closest(".fc-event");
    }
  }
  function computeMutation(hit0, hit1, isFromStart, instanceRange) {
    let dateEnv = hit0.context.dateEnv;
    let date0 = hit0.dateSpan.range.start;
    let date1 = hit1.dateSpan.range.start;
    let delta = diffDates(date0, date1, dateEnv, hit0.largeUnit);
    if (isFromStart) {
      if (dateEnv.add(instanceRange.start, delta) < instanceRange.end) {
        return {
          startDelta: delta
        };
      }
    } else if (dateEnv.add(instanceRange.end, delta) > instanceRange.start) {
      return {
        endDelta: delta
      };
    }
    return null;
  }
  class UnselectAuto {
    constructor(context) {
      this.context = context;
      this.isRecentPointerDateSelect = false;
      this.matchesCancel = false;
      this.matchesEvent = false;
      this.onSelect = (selectInfo) => {
        if (selectInfo.jsEvent) {
          this.isRecentPointerDateSelect = true;
        }
      };
      this.onDocumentPointerDown = (pev) => {
        let unselectCancel = this.context.options.unselectCancel;
        let downEl = getEventTargetViaRoot(pev.origEvent);
        this.matchesCancel = !!downEl.closest(unselectCancel);
        this.matchesEvent = !!downEl.closest(EventDragging.SELECTOR);
      };
      this.onDocumentPointerUp = (pev) => {
        let { context: context2 } = this;
        let { documentPointer: documentPointer2 } = this;
        let calendarState = context2.getCurrentData();
        if (!documentPointer2.wasTouchScroll) {
          if (calendarState.dateSelection && !this.isRecentPointerDateSelect) {
            let unselectAuto = context2.options.unselectAuto;
            if (unselectAuto && (!unselectAuto || !this.matchesCancel)) {
              context2.calendarApi.unselect(pev);
            }
          }
          if (calendarState.eventSelection && !this.matchesEvent) {
            context2.dispatch({
              type: "UNSELECT_EVENT"
            });
          }
        }
        this.isRecentPointerDateSelect = false;
      };
      let documentPointer = this.documentPointer = new PointerDragging(document);
      documentPointer.shouldIgnoreMove = true;
      documentPointer.shouldWatchScroll = false;
      documentPointer.emitter.on("pointerdown", this.onDocumentPointerDown);
      documentPointer.emitter.on("pointerup", this.onDocumentPointerUp);
      context.emitter.on("select", this.onSelect);
    }
    destroy() {
      this.context.emitter.off("select", this.onSelect);
      this.documentPointer.destroy();
    }
  }
  const OPTION_REFINERS = {
    fixedMirrorParent: identity
  };
  const LISTENER_REFINERS = {
    dateClick: identity,
    eventDragStart: identity,
    eventDragStop: identity,
    eventDrop: identity,
    eventResizeStart: identity,
    eventResizeStop: identity,
    eventResize: identity,
    drop: identity,
    eventReceive: identity,
    eventLeave: identity
  };
  config.dataAttrPrefix = "";
  var index$b = createPlugin({
    name: "@fullcalendar/interaction",
    componentInteractions: [
      DateClicking,
      DateSelecting,
      EventDragging,
      EventResizing
    ],
    calendarInteractions: [
      UnselectAuto
    ],
    elementDraggingImpl: FeaturefulElementDragging,
    optionRefiners: OPTION_REFINERS,
    listenerRefiners: LISTENER_REFINERS
  });
  const _sfc_main$9 = {
    components: {
      FullCalendar
    },
    data: function() {
      return {
        calendarOptions: {
          locale: l77,
          plugins: [
            index$c,
            index$b
          ],
          initialView: "dayGridMonth",
          weekends: false,
          selectable: true,
          events: [
            {}
          ],
          select: function(info) {
          }
        }
      };
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_FullCalendar = resolveComponent("FullCalendar");
    return openBlock(), createElementBlock("div", null, [
      createVNode(_component_FullCalendar, {
        options: _ctx.calendarOptions
      }, null, 8, [
        "options"
      ])
    ]);
  }
  const index$a = _export_sfc(_sfc_main$9, [
    [
      "render",
      _sfc_render$9
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/module/calendar/index.vue"
    ]
  ]);
  const __vite_glob_0_1 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: index$a
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const _sfc_main$8 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const presetEvents = [
        {
          name: "\u5143\u65E6",
          getDate: (year) => new Date(year + 1, 0, 1)
        },
        {
          name: "\u6625\u8282",
          getDate: (year) => getChineseNewYear(year + 1)
        },
        {
          name: "\u60C5\u4EBA\u8282",
          getDate: (year) => new Date(year, 1, 14)
        },
        {
          name: "\u52B3\u52A8\u8282",
          getDate: (year) => new Date(year, 4, 1)
        },
        {
          name: "\u4E2D\u79CB\u8282",
          getDate: (year) => getMidAutumnFestival(year)
        },
        {
          name: "\u56FD\u5E86\u8282",
          getDate: (year) => new Date(year, 9, 1)
        },
        {
          name: "\u5723\u8BDE\u8282",
          getDate: (year) => new Date(year, 11, 25)
        }
      ];
      const getChineseNewYear = (year) => {
        const chineseNewYears = {
          2024: new Date(2024, 1, 10),
          2025: new Date(2025, 0, 29),
          2026: new Date(2026, 1, 17),
          2027: new Date(2027, 1, 6),
          2028: new Date(2028, 0, 26)
        };
        return chineseNewYears[year] || new Date(year, 0, 28);
      };
      const getMidAutumnFestival = (year) => {
        const midAutumnDates = {
          2024: new Date(2024, 8, 17),
          2025: new Date(2025, 9, 6),
          2026: new Date(2026, 8, 25),
          2027: new Date(2027, 8, 15),
          2028: new Date(2028, 9, 3)
        };
        return midAutumnDates[year] || new Date(year, 8, 15);
      };
      const env = reactive({
        mode: "preset",
        selectedPreset: 0,
        customDate: "",
        customName: "",
        countdown: {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        },
        targetDate: null,
        targetName: "",
        isPast: false
      });
      let timer = null;
      const calculateCountdown = () => {
        if (!env.targetDate) return;
        const now = (/* @__PURE__ */ new Date()).getTime();
        const target = new Date(env.targetDate).getTime();
        const diff = target - now;
        if (diff <= 0) {
          env.isPast = true;
          env.countdown = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          };
          return;
        }
        env.isPast = false;
        env.countdown.days = Math.floor(diff / (1e3 * 60 * 60 * 24));
        env.countdown.hours = Math.floor(diff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
        env.countdown.minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
        env.countdown.seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      };
      const selectPreset = (index2) => {
        env.selectedPreset = index2;
        const year = (/* @__PURE__ */ new Date()).getFullYear();
        const event = presetEvents[index2];
        let targetDate = event.getDate(year);
        if (targetDate.getTime() < (/* @__PURE__ */ new Date()).getTime()) {
          targetDate = event.getDate(year + 1);
        }
        env.targetDate = targetDate;
        env.targetName = event.name;
        calculateCountdown();
      };
      const setCustomDate = () => {
        if (!env.customDate) {
          message("\u8BF7\u9009\u62E9\u65E5\u671F", {
            type: "warning"
          });
          return;
        }
        env.mode = "custom";
        env.targetDate = new Date(env.customDate);
        env.targetName = env.customName || "\u81EA\u5B9A\u4E49\u5012\u8BA1\u65F6";
        calculateCountdown();
      };
      const switchToPreset = () => {
        env.mode = "preset";
        selectPreset(env.selectedPreset);
      };
      onMounted(() => {
        selectPreset(0);
        timer = setInterval(calculateCountdown, 1e3);
      });
      onUnmounted(() => {
        if (timer) {
          clearInterval(timer);
        }
      });
      const __returned__ = {
        presetEvents,
        getChineseNewYear,
        getMidAutumnFestival,
        env,
        get timer() {
          return timer;
        },
        set timer(v2) {
          timer = v2;
        },
        calculateCountdown,
        selectPreset,
        setCustomDate,
        switchToPreset,
        reactive,
        onMounted,
        onUnmounted,
        computed,
        watch,
        get IconifyIconOnline() {
          return IconifyIconOnline;
        },
        get message() {
          return message;
        }
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  };
  const _hoisted_1$8 = {
    class: "countdown-module"
  };
  const _hoisted_2$8 = {
    class: "countdown-module__content"
  };
  const _hoisted_3$8 = {
    class: "countdown-module__card"
  };
  const _hoisted_4$8 = {
    class: "countdown-module__header"
  };
  const _hoisted_5$8 = {
    class: "countdown-module__title"
  };
  const _hoisted_6$8 = {
    key: 0,
    class: "countdown-module__display"
  };
  const _hoisted_7$8 = {
    class: "countdown-module__item"
  };
  const _hoisted_8$6 = {
    class: "countdown-module__number"
  };
  const _hoisted_9$6 = {
    class: "countdown-module__item"
  };
  const _hoisted_10$5 = {
    class: "countdown-module__number"
  };
  const _hoisted_11$5 = {
    class: "countdown-module__item"
  };
  const _hoisted_12$4 = {
    class: "countdown-module__number"
  };
  const _hoisted_13$4 = {
    class: "countdown-module__item"
  };
  const _hoisted_14$4 = {
    class: "countdown-module__number"
  };
  const _hoisted_15$3 = {
    key: 1,
    class: "countdown-module__past"
  };
  const _hoisted_16$3 = {
    class: "countdown-module__presets"
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_button = resolveComponent("el-button");
    return openBlock(), createElementBlock("div", _hoisted_1$8, [
      createBaseVNode("div", _hoisted_2$8, [
        createBaseVNode("div", _hoisted_3$8, [
          createBaseVNode("div", _hoisted_4$8, [
            createBaseVNode("div", _hoisted_5$8, [
              createVNode($setup["IconifyIconOnline"], {
                icon: "ri:timer-line"
              }),
              createBaseVNode("span", null, toDisplayString($setup.env.targetName), 1)
            ]),
            createBaseVNode("div", {
              class: normalizeClass([
                "countdown-module__status",
                {
                  "is-past": $setup.env.isPast
                }
              ])
            }, toDisplayString($setup.env.isPast ? "\u5DF2\u8FC7\u53BB" : "\u5012\u8BA1\u65F6"), 3)
          ]),
          !$setup.env.isPast ? (openBlock(), createElementBlock("div", _hoisted_6$8, [
            createBaseVNode("div", _hoisted_7$8, [
              createBaseVNode("div", _hoisted_8$6, toDisplayString($setup.env.countdown.days), 1),
              _cache[0] || (_cache[0] = createBaseVNode("div", {
                class: "countdown-module__label"
              }, "\u5929", -1))
            ]),
            _cache[4] || (_cache[4] = createBaseVNode("div", {
              class: "countdown-module__separator"
            }, ":", -1)),
            createBaseVNode("div", _hoisted_9$6, [
              createBaseVNode("div", _hoisted_10$5, toDisplayString(String($setup.env.countdown.hours).padStart(2, "0")), 1),
              _cache[1] || (_cache[1] = createBaseVNode("div", {
                class: "countdown-module__label"
              }, "\u65F6", -1))
            ]),
            _cache[5] || (_cache[5] = createBaseVNode("div", {
              class: "countdown-module__separator"
            }, ":", -1)),
            createBaseVNode("div", _hoisted_11$5, [
              createBaseVNode("div", _hoisted_12$4, toDisplayString(String($setup.env.countdown.minutes).padStart(2, "0")), 1),
              _cache[2] || (_cache[2] = createBaseVNode("div", {
                class: "countdown-module__label"
              }, "\u5206", -1))
            ]),
            _cache[6] || (_cache[6] = createBaseVNode("div", {
              class: "countdown-module__separator"
            }, ":", -1)),
            createBaseVNode("div", _hoisted_13$4, [
              createBaseVNode("div", _hoisted_14$4, toDisplayString(String($setup.env.countdown.seconds).padStart(2, "0")), 1),
              _cache[3] || (_cache[3] = createBaseVNode("div", {
                class: "countdown-module__label"
              }, "\u79D2", -1))
            ])
          ])) : (openBlock(), createElementBlock("div", _hoisted_15$3, [
            createVNode($setup["IconifyIconOnline"], {
              icon: "ri:checkbox-circle-line"
            }),
            _cache[7] || (_cache[7] = createBaseVNode("span", null, "\u8BE5\u4E8B\u4EF6\u5DF2\u7ED3\u675F", -1))
          ])),
          createBaseVNode("div", _hoisted_16$3, [
            (openBlock(), createElementBlock(Fragment, null, renderList($setup.presetEvents, (event, index2) => {
              return createVNode(_component_el_button, {
                key: index2,
                type: $setup.env.mode === "preset" && $setup.env.selectedPreset === index2 ? "primary" : "default",
                size: "small",
                onClick: ($event) => {
                  $setup.selectPreset(index2);
                  $setup.env.mode = "preset";
                }
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(event.name), 1)
                ]),
                _: 2
              }, 1032, [
                "type",
                "onClick"
              ]);
            }), 64))
          ])
        ])
      ])
    ]);
  }
  const index$9 = _export_sfc(_sfc_main$8, [
    [
      "render",
      _sfc_render$8
    ],
    [
      "__scopeId",
      "data-v-2794dc21"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/module/countdown/index.vue"
    ]
  ]);
  const __vite_glob_0_2 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: index$9
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const _sfc_main$7 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      let timeId = null;
      let weatherTimer = null;
      onMounted(() => {
        useWeatherStore.actions.load();
        showTime();
        fetchWeather().catch((error) => {
          console.error("\u83B7\u53D6\u5929\u6C14\u5931\u8D25\uFF0C\u4F7F\u7528\u9ED8\u8BA4\u6570\u636E:", error);
          useWeatherStore.actions.load();
        });
        timeId = setInterval(() => {
          showTime();
        }, 1e3);
        weatherTimer = setInterval(() => {
          fetchWeather().catch(() => useWeatherStore.actions.load());
        }, 30 * 60 * 1e3);
      });
      const fetchWeather = () => __async(null, null, function* () {
        try {
          const position = yield new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
              reject(new Error("\u60A8\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u5730\u7406\u4F4D\u7F6E\u529F\u80FD"));
              return;
            }
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5e3,
              maximumAge: 0
            });
          });
          const { latitude, longitude } = position.coords;
          const weatherResponse = yield fetch(`https://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=${latitude},${longitude}&days=5&lang=${currentLocale.value === "zh-CN" ? "zh" : "en"}`);
          if (!weatherResponse.ok) {
            throw new Error("\u5929\u6C14\u6570\u636E\u83B7\u53D6\u5931\u8D25");
          }
          const weatherData = yield weatherResponse.json();
          useWeatherStore.actions.updateWeather({
            cityName: weatherData.location.name,
            temperature: weatherData.current.temp_c,
            day: weatherData.forecast.forecastday.map((day) => ({
              date: day.date,
              weatherIcon: mapWeatherCodeToIcon(day.day.condition.code),
              highTemp: day.day.maxtemp_c,
              lowTemp: day.day.mintemp_c
            })),
            weatherDay: weatherData.current.condition.text
          });
          return weatherData;
        } catch (error) {
          console.error("\u83B7\u53D6\u5929\u6C14\u4FE1\u606F\u5931\u8D25:", error);
          return null;
        }
      });
      const mapWeatherCodeToIcon = (code) => {
        if ([
          1e3
        ].includes(code)) {
          return "qing";
        } else if ([
          1003,
          1006,
          1009
        ].includes(code)) {
          return "yun";
        } else if ([
          1030,
          1135,
          1147
        ].includes(code)) {
          return "yin";
        } else if ([
          1063,
          1069,
          1072,
          1150,
          1153,
          1168,
          1171,
          1180,
          1183,
          1186,
          1189,
          1192,
          1195,
          1198,
          1201,
          1240,
          1243,
          1246
        ].includes(code)) {
          return "yu";
        }
        return "yun";
      };
      onUnmounted(() => {
        clearInterval(timeId);
        clearInterval(weatherTimer);
      });
      const icon = reactive({
        qing: "meteocons:clear-day-fill",
        yun: "meteocons:partly-cloudy-day-fill",
        yin: "meteocons:overcast-day-fill",
        yu: "meteocons:rain-fill"
      });
      const info = reactive({
        time: "",
        day: ""
      });
      const weekDays = {
        "zh-CN": [
          "\u5468\u65E5",
          "\u5468\u4E00",
          "\u5468\u4E8C",
          "\u5468\u4E09",
          "\u5468\u56DB",
          "\u5468\u4E94",
          "\u5468\u516D"
        ],
        "en-US": [
          "SUN",
          "MON",
          "TUE",
          "WED",
          "THU",
          "FRI",
          "SAT"
        ]
      };
      const currentLocale = computed(() => {
        return getConfig().Locale || "zh-CN";
      });
      const formatDateToWeekDay = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const weekDay = weekDays[currentLocale.value][date.getDay()];
        return `${weekDay} ${month}-${day}`;
      };
      const formatDateToWeek = (date) => {
        const weekDay = weekDays[currentLocale.value][date.getDay()];
        return `${weekDay}`;
      };
      const showTime = () => __async(null, null, function* () {
        info.time = dateFormat(/* @__PURE__ */ new Date(), "hh:mm");
        info.day = dateFormat(/* @__PURE__ */ new Date(), "yyyy\u5E74MM\u6708dd\u65E5");
        info.weekDay = formatDateToWeekDay(/* @__PURE__ */ new Date());
        info.week = formatDateToWeek(/* @__PURE__ */ new Date());
        info.currentWeek = formatDateToWeek(/* @__PURE__ */ new Date());
      });
      const getTimePhase = computed(() => {
        const hour = (/* @__PURE__ */ new Date()).getHours();
        if (hour >= 5 && hour < 10) return "morning";
        if (hour >= 10 && hour < 16) return "noon";
        if (hour >= 16 && hour < 19) return "dusk";
        return "morning";
      });
      const __returned__ = {
        get timeId() {
          return timeId;
        },
        set timeId(v2) {
          timeId = v2;
        },
        get weatherTimer() {
          return weatherTimer;
        },
        set weatherTimer(v2) {
          weatherTimer = v2;
        },
        fetchWeather,
        mapWeatherCodeToIcon,
        icon,
        info,
        weekDays,
        currentLocale,
        formatDateToWeekDay,
        formatDateToWeek,
        showTime,
        getTimePhase,
        get IconifyIconOnline() {
          return IconifyIconOnline;
        },
        get getConfig() {
          return getConfig;
        },
        get useWeatherStore() {
          return useWeatherStore;
        },
        get dateFormat() {
          return dateFormat;
        },
        computed,
        onMounted,
        onUnmounted,
        reactive
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  };
  const _hoisted_1$7 = {
    class: "card"
  };
  const _hoisted_2$7 = {
    class: "left-side"
  };
  const _hoisted_3$7 = {
    class: "weather"
  };
  const _hoisted_4$7 = {
    class: "temperature"
  };
  const _hoisted_5$7 = {
    class: "range"
  };
  const _hoisted_6$7 = {
    class: "right-side"
  };
  const _hoisted_7$7 = {
    class: "hour"
  };
  const _hoisted_8$5 = {
    class: "date"
  };
  const _hoisted_9$5 = {
    class: "city"
  };
  const _hoisted_10$4 = {
    class: "days-section"
  };
  const _hoisted_11$4 = {
    class: "day"
  };
  const _hoisted_12$3 = {
    class: "icon-weather-day"
  };
  const _hoisted_13$3 = {
    class: "day"
  };
  const _hoisted_14$3 = {
    class: "icon-weather-day"
  };
  const _hoisted_15$2 = {
    class: "day"
  };
  const _hoisted_16$2 = {
    class: "icon-weather-day"
  };
  const _hoisted_17$2 = {
    class: "day"
  };
  const _hoisted_18 = {
    class: "icon-weather-day"
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
    return openBlock(), createElementBlock("div", _hoisted_1$7, [
      createBaseVNode("section", {
        class: normalizeClass([
          "info-section",
          [
            $setup.getTimePhase
          ]
        ])
      }, [
        createBaseVNode("div", {
          class: normalizeClass([
            "background-design",
            $setup.getTimePhase
          ])
        }, [
          ..._cache[0] || (_cache[0] = [
            createBaseVNode("div", {
              class: "circle"
            }, null, -1),
            createBaseVNode("div", {
              class: "circle"
            }, null, -1),
            createBaseVNode("div", {
              class: "circle"
            }, null, -1)
          ])
        ], 2),
        createBaseVNode("div", _hoisted_2$7, [
          createBaseVNode("div", _hoisted_3$7, [
            createBaseVNode("div", null, [
              createVNode($setup["IconifyIconOnline"], {
                icon: $setup.icon[(_c = (_b2 = (_a2 = $setup.useWeatherStore.origin) == null ? void 0 : _a2.day) == null ? void 0 : _b2[0]) == null ? void 0 : _c.weatherIcon]
              }, null, 8, [
                "icon"
              ])
            ]),
            createBaseVNode("div", null, toDisplayString((_d = $setup.useWeatherStore.current) == null ? void 0 : _d.weatherDay), 1)
          ]),
          createBaseVNode("div", _hoisted_4$7, toDisplayString((_e = $setup.useWeatherStore.origin) == null ? void 0 : _e.temperature) + "\xB0", 1),
          createBaseVNode("div", _hoisted_5$7, toDisplayString((_f = $setup.useWeatherStore.current) == null ? void 0 : _f.minLowTemp) + "\xB0/" + toDisplayString((_g = $setup.useWeatherStore.current) == null ? void 0 : _g.maxHighTemp) + "\xB0", 1)
        ]),
        createBaseVNode("div", _hoisted_6$7, [
          createBaseVNode("div", null, [
            createBaseVNode("div", _hoisted_7$7, toDisplayString($setup.info.time), 1),
            createBaseVNode("div", _hoisted_8$5, toDisplayString($setup.info.weekDay), 1)
          ]),
          createBaseVNode("div", _hoisted_9$5, toDisplayString((_h = $setup.useWeatherStore.origin) == null ? void 0 : _h.cityName), 1)
        ])
      ], 2),
      createBaseVNode("section", _hoisted_10$4, [
        createBaseVNode("button", null, [
          createBaseVNode("span", _hoisted_11$4, toDisplayString($setup.info.currentWeek), 1),
          createBaseVNode("span", _hoisted_12$3, [
            createVNode($setup["IconifyIconOnline"], {
              icon: $setup.icon[(_k = (_j = (_i = $setup.useWeatherStore.origin) == null ? void 0 : _i.day) == null ? void 0 : _j[0]) == null ? void 0 : _k.weatherIcon]
            }, null, 8, [
              "icon"
            ])
          ])
        ]),
        createBaseVNode("button", null, [
          createBaseVNode("span", _hoisted_13$3, toDisplayString($setup.formatDateToWeek(new Date(Date.now() + 24 * 60 * 60 * 1e3))), 1),
          createBaseVNode("span", _hoisted_14$3, [
            createVNode($setup["IconifyIconOnline"], {
              icon: $setup.icon[(_n = (_m = (_l = $setup.useWeatherStore.origin) == null ? void 0 : _l.day) == null ? void 0 : _m[1]) == null ? void 0 : _n.weatherIcon]
            }, null, 8, [
              "icon"
            ])
          ])
        ]),
        createBaseVNode("button", null, [
          createBaseVNode("span", _hoisted_15$2, toDisplayString($setup.formatDateToWeek(new Date(Date.now() + 2 * 24 * 60 * 60 * 1e3))), 1),
          createBaseVNode("span", _hoisted_16$2, [
            createVNode($setup["IconifyIconOnline"], {
              icon: $setup.icon[(_q = (_p = (_o = $setup.useWeatherStore.origin) == null ? void 0 : _o.day) == null ? void 0 : _p[2]) == null ? void 0 : _q.weatherIcon]
            }, null, 8, [
              "icon"
            ])
          ])
        ]),
        createBaseVNode("button", null, [
          createBaseVNode("span", _hoisted_17$2, toDisplayString($setup.formatDateToWeek(new Date(Date.now() + 3 * 24 * 60 * 60 * 1e3))), 1),
          createBaseVNode("span", _hoisted_18, [
            createVNode($setup["IconifyIconOnline"], {
              icon: $setup.icon[(_t = (_s = (_r = $setup.useWeatherStore.origin) == null ? void 0 : _r.day) == null ? void 0 : _s[3]) == null ? void 0 : _t.weatherIcon]
            }, null, 8, [
              "icon"
            ])
          ])
        ])
      ])
    ]);
  }
  const index$8 = _export_sfc(_sfc_main$7, [
    [
      "render",
      _sfc_render$7
    ],
    [
      "__scopeId",
      "data-v-2a1b1185"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/module/day/index.vue"
    ]
  ]);
  const __vite_glob_0_3 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: index$8
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const _sfc_main$6 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const env = reactive({
        currentTime: /* @__PURE__ */ new Date(),
        username: ""
      });
      let timer = null;
      const greeting = computed(() => {
        const hour = env.currentTime.getHours();
        if (hour >= 5 && hour < 9) return "\u65E9\u4E0A\u597D";
        if (hour >= 9 && hour < 12) return "\u4E0A\u5348\u597D";
        if (hour >= 12 && hour < 14) return "\u4E2D\u5348\u597D";
        if (hour >= 14 && hour < 18) return "\u4E0B\u5348\u597D";
        if (hour >= 18 && hour < 22) return "\u665A\u4E0A\u597D";
        return "\u591C\u6DF1\u4E86";
      });
      const timeIcon = computed(() => {
        const hour = env.currentTime.getHours();
        if (hour >= 5 && hour < 9) return "meteocons:sunrise-fill";
        if (hour >= 9 && hour < 18) return "meteocons:clear-day-fill";
        if (hour >= 18 && hour < 22) return "meteocons:sunset-fill";
        return "meteocons:clear-night-fill";
      });
      const tipMessage = computed(() => {
        const hour = env.currentTime.getHours();
        if (hour >= 5 && hour < 9) return "\u65B0\u7684\u4E00\u5929\u5F00\u59CB\u4E86\uFF0C\u5143\u6C14\u6EE1\u6EE1\uFF01";
        if (hour >= 9 && hour < 12) return "\u4E0A\u5348\u662F\u6700\u4F73\u5DE5\u4F5C\u65F6\u95F4\uFF0C\u52A0\u6CB9\uFF01";
        if (hour >= 12 && hour < 14) return "\u8BB0\u5F97\u5403\u5348\u996D\uFF0C\u4F11\u606F\u4E00\u4E0B\uFF01";
        if (hour >= 14 && hour < 18) return "\u4E0B\u5348\u8336\u65F6\u95F4\uFF0C\u8865\u5145\u80FD\u91CF~";
        if (hour >= 18 && hour < 22) return "\u8F9B\u82E6\u4E00\u5929\u4E86\uFF0C\u653E\u677E\u4E00\u4E0B\uFF01";
        return "\u591C\u6DF1\u4E86\uFF0C\u6CE8\u610F\u4F11\u606F\u54E6~";
      });
      const bgGradient = computed(() => {
        const hour = env.currentTime.getHours();
        if (hour >= 5 && hour < 9) return "linear-gradient(135deg, #ff9966, #ff5e62)";
        if (hour >= 9 && hour < 12) return "linear-gradient(135deg, #56CCF2, #2F80ED)";
        if (hour >= 12 && hour < 14) return "linear-gradient(135deg, #F2994A, #F2C94C)";
        if (hour >= 14 && hour < 18) return "linear-gradient(135deg, #11998e, #38ef7d)";
        if (hour >= 18 && hour < 22) return "linear-gradient(135deg, #ee9ca7, #ffdde1)";
        return "linear-gradient(135deg, #2c3e50, #4ca1af)";
      });
      const formattedDate = computed(() => {
        return dateFormat(env.currentTime, "yyyy\u5E74MM\u6708dd\u65E5");
      });
      const formattedTime = computed(() => {
        return dateFormat(env.currentTime, "hh:mm:ss");
      });
      const weekDay = computed(() => {
        const days = [
          "\u661F\u671F\u65E5",
          "\u661F\u671F\u4E00",
          "\u661F\u671F\u4E8C",
          "\u661F\u671F\u4E09",
          "\u661F\u671F\u56DB",
          "\u661F\u671F\u4E94",
          "\u661F\u671F\u516D"
        ];
        return days[env.currentTime.getDay()];
      });
      onMounted(() => {
        try {
          const userStore = useUserStoreHook();
          env.username = (userStore == null ? void 0 : userStore.username) || (userStore == null ? void 0 : userStore.nickname) || "\u7528\u6237";
        } catch (e2) {
          env.username = "\u7528\u6237";
        }
        timer = setInterval(() => {
          env.currentTime = /* @__PURE__ */ new Date();
        }, 1e3);
      });
      onUnmounted(() => {
        if (timer) {
          clearInterval(timer);
        }
      });
      const __returned__ = {
        env,
        get timer() {
          return timer;
        },
        set timer(v2) {
          timer = v2;
        },
        greeting,
        timeIcon,
        tipMessage,
        bgGradient,
        formattedDate,
        formattedTime,
        weekDay,
        reactive,
        onMounted,
        computed,
        onUnmounted,
        get IconifyIconOnline() {
          return IconifyIconOnline;
        },
        get useUserStoreHook() {
          return useUserStoreHook;
        },
        get dateFormat() {
          return dateFormat;
        }
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  };
  const _hoisted_1$6 = {
    class: "greeting-module"
  };
  const _hoisted_2$6 = {
    class: "greeting-module__main"
  };
  const _hoisted_3$6 = {
    class: "greeting-module__icon"
  };
  const _hoisted_4$6 = {
    class: "greeting-module__text"
  };
  const _hoisted_5$6 = {
    class: "greeting-module__hello"
  };
  const _hoisted_6$6 = {
    class: "greeting-module__tip"
  };
  const _hoisted_7$6 = {
    class: "greeting-module__time"
  };
  const _hoisted_8$4 = {
    class: "greeting-module__clock"
  };
  const _hoisted_9$4 = {
    class: "greeting-module__date"
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$6, [
      createBaseVNode("div", {
        class: "greeting-module__content",
        style: normalizeStyle({
          background: $setup.bgGradient
        })
      }, [
        _cache[0] || (_cache[0] = createBaseVNode("div", {
          class: "greeting-module__decoration"
        }, [
          createBaseVNode("div", {
            class: "greeting-module__circle"
          }),
          createBaseVNode("div", {
            class: "greeting-module__circle"
          }),
          createBaseVNode("div", {
            class: "greeting-module__circle"
          })
        ], -1)),
        createBaseVNode("div", _hoisted_2$6, [
          createBaseVNode("div", _hoisted_3$6, [
            createVNode($setup["IconifyIconOnline"], {
              icon: $setup.timeIcon
            }, null, 8, [
              "icon"
            ])
          ]),
          createBaseVNode("div", _hoisted_4$6, [
            createBaseVNode("div", _hoisted_5$6, toDisplayString($setup.greeting) + "\uFF0C" + toDisplayString($setup.env.username), 1),
            createBaseVNode("div", _hoisted_6$6, toDisplayString($setup.tipMessage), 1)
          ])
        ]),
        createBaseVNode("div", _hoisted_7$6, [
          createBaseVNode("div", _hoisted_8$4, toDisplayString($setup.formattedTime), 1),
          createBaseVNode("div", _hoisted_9$4, toDisplayString($setup.formattedDate) + " " + toDisplayString($setup.weekDay), 1)
        ])
      ], 4)
    ]);
  }
  const index$7 = _export_sfc(_sfc_main$6, [
    [
      "render",
      _sfc_render$6
    ],
    [
      "__scopeId",
      "data-v-1ce77224"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/module/greeting/index.vue"
    ]
  ]);
  const __vite_glob_0_4 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: index$7
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const _sfc_main$5 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { t: t2 } = useI18n();
      const env = reactive({
        loading: false,
        currentIP: "",
        ipDetails: {
          country: "",
          region: "",
          city: "",
          isp: "",
          asn: "",
          timezone: ""
        },
        networkStatus: {
          isOnline: true,
          isPublic: false,
          lastChecked: /* @__PURE__ */ new Date()
        },
        refreshInterval: 5 * 60 * 1e3
      });
      const copyIPToClipboard = () => {
        if (!env.currentIP || env.currentIP === "\u79BB\u7EBF\u72B6\u6001" || env.currentIP === "\u83B7\u53D6\u5931\u8D25") {
          message(t2("message.noValidIP") || "\u6CA1\u6709\u6709\u6548\u7684IP\u5730\u5740\u53EF\u590D\u5236", {
            type: "warning"
          });
          return;
        }
        navigator.clipboard.writeText(env.currentIP).then(() => {
          message(t2("message.copySuccess") || "\u590D\u5236\u6210\u529F", {
            type: "success"
          });
        }).catch((err) => {
          console.error("\u590D\u5236\u5931\u8D25:", err);
          message(t2("message.copyError") || "\u590D\u5236\u5931\u8D25", {
            type: "error"
          });
        });
      };
      const refreshIP = () => __async(null, null, function* () {
        env.loading = true;
        try {
          const ipInfo = yield getCurrentIP();
          env.currentIP = ipInfo.ip;
          if (ipInfo.details) {
            env.ipDetails = ipInfo.details;
          }
          env.networkStatus = ipInfo.networkStatus;
        } catch (error) {
          console.error("\u5237\u65B0IP\u4FE1\u606F\u5931\u8D25:", error);
          message(t2("message.refreshError") || "\u5237\u65B0\u5931\u8D25", {
            type: "error"
          });
        } finally {
          env.loading = false;
        }
      });
      onMounted(() => {
        refreshIP();
      });
      const __returned__ = {
        t: t2,
        env,
        copyIPToClipboard,
        refreshIP,
        reactive,
        ref,
        onMounted,
        onBeforeUnmount,
        get getCurrentIP() {
          return getCurrentIP;
        },
        get message() {
          return message;
        },
        get useI18n() {
          return useI18n;
        }
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  };
  const _hoisted_1$5 = {
    class: "ip-module"
  };
  const _hoisted_2$5 = {
    class: "ip-module__content"
  };
  const _hoisted_3$5 = {
    class: "ip-module__container"
  };
  const _hoisted_4$5 = {
    class: "ip-module__card"
  };
  const _hoisted_5$5 = {
    class: "ip-module__card-inner"
  };
  const _hoisted_6$5 = {
    class: "ip-module__status"
  };
  const _hoisted_7$5 = {
    class: "ip-module__status-text"
  };
  const _hoisted_8$3 = {
    class: "ip-module__ip"
  };
  const _hoisted_9$3 = {
    class: "ip-module__ip-value"
  };
  const _hoisted_10$3 = {
    key: 0,
    class: "ip-module__location"
  };
  const _hoisted_11$3 = {
    class: "ip-module__location-item"
  };
  const _hoisted_12$2 = {
    class: "ip-module__location-item"
  };
  const _hoisted_13$2 = {
    class: "ip-module__refresh"
  };
  const _hoisted_14$2 = {
    class: "ip-module__last-checked"
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
    const _component_el_button = resolveComponent("el-button");
    return openBlock(), createElementBlock("div", _hoisted_1$5, [
      createBaseVNode("div", _hoisted_2$5, [
        createBaseVNode("div", _hoisted_3$5, [
          createBaseVNode("div", _hoisted_4$5, [
            createBaseVNode("div", _hoisted_5$5, [
              createBaseVNode("div", _hoisted_6$5, [
                createBaseVNode("div", {
                  class: normalizeClass([
                    "ip-module__status-indicator",
                    {
                      "is-online": $setup.env.networkStatus.isOnline,
                      "is-public": $setup.env.networkStatus.isPublic
                    }
                  ])
                }, null, 2),
                createBaseVNode("div", _hoisted_7$5, toDisplayString($setup.env.networkStatus.isOnline ? $setup.env.networkStatus.isPublic ? "\u516C\u7F51\u8FDE\u63A5" : "\u5C40\u57DF\u7F51" : "\u79BB\u7EBF"), 1)
              ]),
              createBaseVNode("div", _hoisted_8$3, [
                _cache[0] || (_cache[0] = createBaseVNode("div", {
                  class: "ip-module__ip-label"
                }, "\u516C\u7F51 IP", -1)),
                createBaseVNode("div", _hoisted_9$3, [
                  createBaseVNode("span", null, toDisplayString($setup.env.loading ? "\u52A0\u8F7D\u4E2D..." : $setup.env.currentIP), 1),
                  $setup.env.currentIP && $setup.env.currentIP !== "\u79BB\u7EBF\u72B6\u6001" && $setup.env.currentIP !== "\u83B7\u53D6\u5931\u8D25" ? (openBlock(), createBlock(_component_el_button, {
                    key: 0,
                    type: "primary",
                    link: "",
                    size: "small",
                    onClick: $setup.copyIPToClipboard
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_IconifyIconOnline, {
                        icon: "ri:file-copy-line"
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ])
              ]),
              $setup.env.currentIP && $setup.env.currentIP !== "\u79BB\u7EBF\u72B6\u6001" && $setup.env.currentIP !== "\u83B7\u53D6\u5931\u8D25" ? (openBlock(), createElementBlock("div", _hoisted_10$3, [
                createBaseVNode("div", _hoisted_11$3, [
                  createVNode(_component_IconifyIconOnline, {
                    icon: "ri:map-pin-line",
                    class: "ip-module__location-icon"
                  }),
                  createBaseVNode("span", null, toDisplayString($setup.env.ipDetails.country) + " " + toDisplayString($setup.env.ipDetails.region) + " " + toDisplayString($setup.env.ipDetails.city), 1)
                ]),
                createBaseVNode("div", _hoisted_12$2, [
                  createVNode(_component_IconifyIconOnline, {
                    icon: "ri:global-line",
                    class: "ip-module__location-icon"
                  }),
                  createBaseVNode("span", null, toDisplayString($setup.env.ipDetails.isp) + " " + toDisplayString($setup.env.ipDetails.asn), 1)
                ])
              ])) : createCommentVNode("", true)
            ]),
            _cache[2] || (_cache[2] = createBaseVNode("div", {
              class: "ip-module__card-decoration"
            }, [
              createBaseVNode("div", {
                class: "ip-module__card-circle"
              }),
              createBaseVNode("div", {
                class: "ip-module__card-circle"
              }),
              createBaseVNode("div", {
                class: "ip-module__card-circle"
              })
            ], -1)),
            createBaseVNode("div", _hoisted_13$2, [
              createVNode(_component_el_button, {
                type: "primary",
                link: "",
                size: "small",
                loading: $setup.env.loading,
                onClick: $setup.refreshIP
              }, {
                default: withCtx(() => [
                  createVNode(_component_IconifyIconOnline, {
                    icon: "ri:refresh-line"
                  }),
                  _cache[1] || (_cache[1] = createBaseVNode("span", null, "\u5237\u65B0", -1))
                ]),
                _: 1
              }, 8, [
                "loading"
              ]),
              createBaseVNode("div", _hoisted_14$2, "\u4E0A\u6B21\u68C0\u67E5: " + toDisplayString(new Date($setup.env.networkStatus.lastChecked).toLocaleTimeString()), 1)
            ])
          ])
        ])
      ])
    ]);
  }
  const index$6 = _export_sfc(_sfc_main$5, [
    [
      "render",
      _sfc_render$5
    ],
    [
      "__scopeId",
      "data-v-ef7382de"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/module/ip/index.vue"
    ]
  ]);
  const __vite_glob_0_5 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: index$6
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const STORAGE_KEY = "sc_module_memory_notes";
  const _sfc_main$4 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const noteColors = [
        {
          name: "\u9EC4\u8272",
          value: "#fff9c4"
        },
        {
          name: "\u7EFF\u8272",
          value: "#c8e6c9"
        },
        {
          name: "\u84DD\u8272",
          value: "#bbdefb"
        },
        {
          name: "\u7C89\u8272",
          value: "#f8bbd9"
        },
        {
          name: "\u7D2B\u8272",
          value: "#e1bee7"
        },
        {
          name: "\u6A59\u8272",
          value: "#ffe0b2"
        }
      ];
      const env = reactive({
        notes: [],
        currentNote: {
          id: null,
          title: "",
          content: "",
          color: noteColors[0].value,
          createdAt: null,
          updatedAt: null
        },
        isEditing: false,
        showColorPicker: false
      });
      const loadNotes = () => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            env.notes = JSON.parse(stored);
          }
        } catch (error) {
          console.error("\u52A0\u8F7D\u4FBF\u7B7E\u5931\u8D25:", error);
        }
      };
      const saveNotes = () => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(env.notes));
        } catch (error) {
          console.error("\u4FDD\u5B58\u4FBF\u7B7E\u5931\u8D25:", error);
        }
      };
      const createNote = () => {
        env.currentNote = {
          id: Date.now(),
          title: "",
          content: "",
          color: noteColors[Math.floor(Math.random() * noteColors.length)].value,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        env.isEditing = true;
      };
      const editNote = (note) => {
        env.currentNote = __spreadValues({}, note);
        env.isEditing = true;
      };
      const saveCurrentNote = () => {
        if (!env.currentNote.title.trim() && !env.currentNote.content.trim()) {
          message("\u8BF7\u8F93\u5165\u4FBF\u7B7E\u5185\u5BB9", {
            type: "warning"
          });
          return;
        }
        env.currentNote.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
        const existingIndex = env.notes.findIndex((n2) => n2.id === env.currentNote.id);
        if (existingIndex >= 0) {
          env.notes[existingIndex] = __spreadValues({}, env.currentNote);
        } else {
          env.notes.unshift(__spreadValues({}, env.currentNote));
        }
        saveNotes();
        env.isEditing = false;
        message("\u4FDD\u5B58\u6210\u529F", {
          type: "success"
        });
      };
      const deleteNote = (id) => {
        env.notes = env.notes.filter((n2) => n2.id !== id);
        saveNotes();
        message("\u5220\u9664\u6210\u529F", {
          type: "success"
        });
      };
      const cancelEdit = () => {
        env.isEditing = false;
      };
      const selectColor = (color) => {
        env.currentNote.color = color;
        env.showColorPicker = false;
      };
      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("zh-CN", {
          month: "short",
          day: "numeric"
        });
      };
      onMounted(() => {
        loadNotes();
      });
      const __returned__ = {
        STORAGE_KEY,
        noteColors,
        env,
        loadNotes,
        saveNotes,
        createNote,
        editNote,
        saveCurrentNote,
        deleteNote,
        cancelEdit,
        selectColor,
        formatDate,
        reactive,
        onMounted,
        watch,
        computed,
        get IconifyIconOnline() {
          return IconifyIconOnline;
        },
        get message() {
          return message;
        }
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  };
  const _hoisted_1$4 = {
    class: "memory-module"
  };
  const _hoisted_2$4 = {
    class: "memory-module__content"
  };
  const _hoisted_3$4 = {
    key: 0,
    class: "memory-module__editor"
  };
  const _hoisted_4$4 = {
    class: "memory-module__editor-actions"
  };
  const _hoisted_5$4 = {
    class: "memory-module__color-picker"
  };
  const _hoisted_6$4 = {
    class: "memory-module__color-options"
  };
  const _hoisted_7$4 = [
    "onClick"
  ];
  const _hoisted_8$2 = {
    class: "memory-module__editor-footer"
  };
  const _hoisted_9$2 = {
    key: 1,
    class: "memory-module__list"
  };
  const _hoisted_10$2 = {
    class: "memory-module__header"
  };
  const _hoisted_11$2 = {
    key: 0,
    class: "memory-module__notes"
  };
  const _hoisted_12$1 = [
    "onClick"
  ];
  const _hoisted_13$1 = {
    class: "memory-module__note-header"
  };
  const _hoisted_14$1 = {
    class: "memory-module__note-title"
  };
  const _hoisted_15$1 = {
    class: "memory-module__note-content"
  };
  const _hoisted_16$1 = {
    class: "memory-module__note-date"
  };
  const _hoisted_17$1 = {
    key: 1,
    class: "memory-module__empty"
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_button = resolveComponent("el-button");
    return openBlock(), createElementBlock("div", _hoisted_1$4, [
      createBaseVNode("div", _hoisted_2$4, [
        $setup.env.isEditing ? (openBlock(), createElementBlock("div", _hoisted_3$4, [
          createBaseVNode("div", {
            class: "memory-module__editor-header",
            style: normalizeStyle({
              backgroundColor: $setup.env.currentNote.color
            })
          }, [
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.env.currentNote.title = $event),
              class: "memory-module__editor-title",
              placeholder: "\u6807\u9898"
            }, null, 512), [
              [
                vModelText,
                $setup.env.currentNote.title
              ]
            ]),
            createBaseVNode("div", _hoisted_4$4, [
              createBaseVNode("div", _hoisted_5$4, [
                createVNode(_component_el_button, {
                  type: "primary",
                  link: "",
                  size: "small",
                  onClick: _cache[1] || (_cache[1] = ($event) => $setup.env.showColorPicker = !$setup.env.showColorPicker)
                }, {
                  default: withCtx(() => [
                    createVNode($setup["IconifyIconOnline"], {
                      icon: "ri:palette-line"
                    })
                  ]),
                  _: 1
                }),
                withDirectives(createBaseVNode("div", _hoisted_6$4, [
                  (openBlock(), createElementBlock(Fragment, null, renderList($setup.noteColors, (color) => {
                    return createBaseVNode("div", {
                      key: color.value,
                      class: normalizeClass([
                        "memory-module__color-option",
                        {
                          active: $setup.env.currentNote.color === color.value
                        }
                      ]),
                      style: normalizeStyle({
                        backgroundColor: color.value
                      }),
                      onClick: ($event) => $setup.selectColor(color.value)
                    }, null, 14, _hoisted_7$4);
                  }), 64))
                ], 512), [
                  [
                    vShow,
                    $setup.env.showColorPicker
                  ]
                ])
              ])
            ])
          ], 4),
          withDirectives(createBaseVNode("textarea", {
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.env.currentNote.content = $event),
            class: "memory-module__editor-content",
            style: normalizeStyle({
              backgroundColor: $setup.env.currentNote.color
            }),
            placeholder: "\u5199\u70B9\u4EC0\u4E48..."
          }, null, 4), [
            [
              vModelText,
              $setup.env.currentNote.content
            ]
          ]),
          createBaseVNode("div", _hoisted_8$2, [
            createVNode(_component_el_button, {
              type: "default",
              size: "small",
              onClick: $setup.cancelEdit
            }, {
              default: withCtx(() => [
                ..._cache[3] || (_cache[3] = [
                  createTextVNode("\u53D6\u6D88", -1)
                ])
              ]),
              _: 1
            }),
            createVNode(_component_el_button, {
              type: "primary",
              size: "small",
              onClick: $setup.saveCurrentNote
            }, {
              default: withCtx(() => [
                ..._cache[4] || (_cache[4] = [
                  createTextVNode("\u4FDD\u5B58", -1)
                ])
              ]),
              _: 1
            })
          ])
        ])) : (openBlock(), createElementBlock("div", _hoisted_9$2, [
          createBaseVNode("div", _hoisted_10$2, [
            _cache[5] || (_cache[5] = createBaseVNode("span", null, "\u4FBF\u7B7E", -1)),
            createVNode(_component_el_button, {
              type: "primary",
              link: "",
              size: "small",
              onClick: $setup.createNote
            }, {
              default: withCtx(() => [
                createVNode($setup["IconifyIconOnline"], {
                  icon: "ri:add-line"
                })
              ]),
              _: 1
            })
          ]),
          $setup.env.notes.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_11$2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.env.notes, (note) => {
              return openBlock(), createElementBlock("div", {
                key: note.id,
                class: "memory-module__note",
                style: normalizeStyle({
                  backgroundColor: note.color
                }),
                onClick: ($event) => $setup.editNote(note)
              }, [
                createBaseVNode("div", _hoisted_13$1, [
                  createBaseVNode("div", _hoisted_14$1, toDisplayString(note.title || "\u65E0\u6807\u9898"), 1),
                  createVNode(_component_el_button, {
                    type: "danger",
                    link: "",
                    size: "small",
                    onClick: withModifiers(($event) => $setup.deleteNote(note.id), [
                      "stop"
                    ])
                  }, {
                    default: withCtx(() => [
                      createVNode($setup["IconifyIconOnline"], {
                        icon: "ri:delete-bin-line"
                      })
                    ]),
                    _: 1
                  }, 8, [
                    "onClick"
                  ])
                ]),
                createBaseVNode("div", _hoisted_15$1, toDisplayString(note.content), 1),
                createBaseVNode("div", _hoisted_16$1, toDisplayString($setup.formatDate(note.updatedAt)), 1)
              ], 12, _hoisted_12$1);
            }), 128))
          ])) : (openBlock(), createElementBlock("div", _hoisted_17$1, [
            createVNode($setup["IconifyIconOnline"], {
              icon: "ri:sticky-note-line"
            }),
            _cache[6] || (_cache[6] = createBaseVNode("span", null, "\u6682\u65E0\u4FBF\u7B7E\uFF0C\u70B9\u51FB\u53F3\u4E0A\u89D2\u521B\u5EFA", -1))
          ]))
        ]))
      ])
    ]);
  }
  const index$5 = _export_sfc(_sfc_main$4, [
    [
      "render",
      _sfc_render$4
    ],
    [
      "__scopeId",
      "data-v-424d059f"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/module/memory/index.vue"
    ]
  ]);
  const __vite_glob_0_6 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: index$5
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const _sfc_main$3 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const quotes = [
        {
          text: "\u751F\u6D3B\u4E0D\u662F\u7B49\u5F85\u98CE\u66B4\u8FC7\u53BB\uFF0C\u800C\u662F\u5B66\u4F1A\u5728\u98CE\u96E8\u4E2D\u8D77\u821E\u3002",
          author: "\u4F5A\u540D"
        },
        {
          text: "\u6210\u529F\u4E0D\u662F\u7EC8\u70B9\uFF0C\u5931\u8D25\u4E5F\u4E0D\u662F\u7EC8\u7ED3\uFF0C\u552F\u6709\u52C7\u6C14\u624D\u662F\u6C38\u6052\u7684\u3002",
          author: "\u4E18\u5409\u5C14"
        },
        {
          text: "\u4ECA\u5929\u7684\u52AA\u529B\u662F\u4E3A\u4E86\u660E\u5929\u7684\u60CA\u8273\u3002",
          author: "\u4F5A\u540D"
        },
        {
          text: "\u4E0D\u79EF\u8DEC\u6B65\uFF0C\u65E0\u4EE5\u81F3\u5343\u91CC\uFF1B\u4E0D\u79EF\u5C0F\u6D41\uFF0C\u65E0\u4EE5\u6210\u6C5F\u6D77\u3002",
          author: "\u8340\u5B50"
        },
        {
          text: "\u5343\u91CC\u4E4B\u884C\uFF0C\u59CB\u4E8E\u8DB3\u4E0B\u3002",
          author: "\u8001\u5B50"
        },
        {
          text: "\u5B66\u800C\u4E0D\u601D\u5219\u7F54\uFF0C\u601D\u800C\u4E0D\u5B66\u5219\u6B86\u3002",
          author: "\u5B54\u5B50"
        },
        {
          text: "\u5929\u884C\u5065\uFF0C\u541B\u5B50\u4EE5\u81EA\u5F3A\u4E0D\u606F\u3002",
          author: "\u5468\u6613"
        },
        {
          text: "\u5B9D\u5251\u950B\u4ECE\u78E8\u783A\u51FA\uFF0C\u6885\u82B1\u9999\u81EA\u82E6\u5BD2\u6765\u3002",
          author: "\u4F5A\u540D"
        },
        {
          text: "\u8DEF\u6F2B\u6F2B\u5176\u4FEE\u8FDC\u516E\uFF0C\u543E\u5C06\u4E0A\u4E0B\u800C\u6C42\u7D22\u3002",
          author: "\u5C48\u539F"
        },
        {
          text: "\u4E1A\u7CBE\u4E8E\u52E4\uFF0C\u8352\u4E8E\u5B09\uFF1B\u884C\u6210\u4E8E\u601D\uFF0C\u6BC1\u4E8E\u968F\u3002",
          author: "\u97E9\u6108"
        },
        {
          text: "\u4E16\u4E0A\u65E0\u96BE\u4E8B\uFF0C\u53EA\u6015\u6709\u5FC3\u4EBA\u3002",
          author: "\u4F5A\u540D"
        },
        {
          text: "\u5FD7\u4E0D\u7ACB\uFF0C\u5929\u4E0B\u65E0\u53EF\u6210\u4E4B\u4E8B\u3002",
          author: "\u738B\u9633\u660E"
        },
        {
          text: "\u4EBA\u751F\u81EA\u53E4\u8C01\u65E0\u6B7B\uFF0C\u7559\u53D6\u4E39\u5FC3\u7167\u6C57\u9752\u3002",
          author: "\u6587\u5929\u7965"
        },
        {
          text: "\u5148\u5929\u4E0B\u4E4B\u5FE7\u800C\u5FE7\uFF0C\u540E\u5929\u4E0B\u4E4B\u4E50\u800C\u4E50\u3002",
          author: "\u8303\u4EF2\u6DF9"
        },
        {
          text: "\u4E0D\u754F\u6D6E\u4E91\u906E\u671B\u773C\uFF0C\u81EA\u7F18\u8EAB\u5728\u6700\u9AD8\u5C42\u3002",
          author: "\u738B\u5B89\u77F3"
        },
        {
          text: "\u6D77\u7EB3\u767E\u5DDD\uFF0C\u6709\u5BB9\u4E43\u5927\uFF1B\u58C1\u7ACB\u5343\u4EDE\uFF0C\u65E0\u6B32\u5219\u521A\u3002",
          author: "\u6797\u5219\u5F90"
        },
        {
          text: "\u5C11\u5E74\u6613\u8001\u5B66\u96BE\u6210\uFF0C\u4E00\u5BF8\u5149\u9634\u4E0D\u53EF\u8F7B\u3002",
          author: "\u6731\u71B9"
        },
        {
          text: "\u8BFB\u4E66\u7834\u4E07\u5377\uFF0C\u4E0B\u7B14\u5982\u6709\u795E\u3002",
          author: "\u675C\u752B"
        },
        {
          text: "\u4E66\u5C71\u6709\u8DEF\u52E4\u4E3A\u5F84\uFF0C\u5B66\u6D77\u65E0\u6DAF\u82E6\u4F5C\u821F\u3002",
          author: "\u97E9\u6108"
        },
        {
          text: "\u7EB8\u4E0A\u5F97\u6765\u7EC8\u89C9\u6D45\uFF0C\u7EDD\u77E5\u6B64\u4E8B\u8981\u8EAC\u884C\u3002",
          author: "\u9646\u6E38"
        }
      ];
      const env = reactive({
        loading: false,
        currentQuote: null,
        quoteIndex: 0
      });
      const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        env.quoteIndex = randomIndex;
        env.currentQuote = quotes[randomIndex];
      };
      const copyQuote = () => {
        if (!env.currentQuote) return;
        const text = `"${env.currentQuote.text}" \u2014\u2014 ${env.currentQuote.author}`;
        navigator.clipboard.writeText(text).then(() => {
          message("\u590D\u5236\u6210\u529F", {
            type: "success"
          });
        }).catch((err) => {
          console.error("\u590D\u5236\u5931\u8D25:", err);
          message("\u590D\u5236\u5931\u8D25", {
            type: "error"
          });
        });
      };
      const nextQuote = () => {
        env.quoteIndex = (env.quoteIndex + 1) % quotes.length;
        env.currentQuote = quotes[env.quoteIndex];
      };
      const prevQuote = () => {
        env.quoteIndex = (env.quoteIndex - 1 + quotes.length) % quotes.length;
        env.currentQuote = quotes[env.quoteIndex];
      };
      onMounted(() => {
        getRandomQuote();
      });
      const __returned__ = {
        quotes,
        env,
        getRandomQuote,
        copyQuote,
        nextQuote,
        prevQuote,
        reactive,
        onMounted,
        computed,
        get IconifyIconOnline() {
          return IconifyIconOnline;
        },
        get message() {
          return message;
        }
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  };
  const _hoisted_1$3 = {
    class: "quote-module"
  };
  const _hoisted_2$3 = {
    class: "quote-module__content"
  };
  const _hoisted_3$3 = {
    class: "quote-module__card"
  };
  const _hoisted_4$3 = {
    class: "quote-module__icon"
  };
  const _hoisted_5$3 = {
    key: 0,
    class: "quote-module__text"
  };
  const _hoisted_6$3 = {
    key: 1,
    class: "quote-module__author"
  };
  const _hoisted_7$3 = {
    class: "quote-module__actions"
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_button = resolveComponent("el-button");
    return openBlock(), createElementBlock("div", _hoisted_1$3, [
      createBaseVNode("div", _hoisted_2$3, [
        createBaseVNode("div", _hoisted_3$3, [
          createBaseVNode("div", _hoisted_4$3, [
            createVNode($setup["IconifyIconOnline"], {
              icon: "ri:double-quotes-l"
            })
          ]),
          $setup.env.currentQuote ? (openBlock(), createElementBlock("div", _hoisted_5$3, toDisplayString($setup.env.currentQuote.text), 1)) : createCommentVNode("", true),
          $setup.env.currentQuote ? (openBlock(), createElementBlock("div", _hoisted_6$3, " \u2014\u2014 " + toDisplayString($setup.env.currentQuote.author), 1)) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_7$3, [
            createVNode(_component_el_button, {
              type: "primary",
              link: "",
              size: "small",
              onClick: $setup.prevQuote
            }, {
              default: withCtx(() => [
                createVNode($setup["IconifyIconOnline"], {
                  icon: "ri:arrow-left-s-line"
                })
              ]),
              _: 1
            }),
            createVNode(_component_el_button, {
              type: "primary",
              link: "",
              size: "small",
              onClick: $setup.copyQuote
            }, {
              default: withCtx(() => [
                createVNode($setup["IconifyIconOnline"], {
                  icon: "ri:file-copy-line"
                })
              ]),
              _: 1
            }),
            createVNode(_component_el_button, {
              type: "primary",
              link: "",
              size: "small",
              onClick: $setup.getRandomQuote
            }, {
              default: withCtx(() => [
                createVNode($setup["IconifyIconOnline"], {
                  icon: "ri:refresh-line"
                })
              ]),
              _: 1
            }),
            createVNode(_component_el_button, {
              type: "primary",
              link: "",
              size: "small",
              onClick: $setup.nextQuote
            }, {
              default: withCtx(() => [
                createVNode($setup["IconifyIconOnline"], {
                  icon: "ri:arrow-right-s-line"
                })
              ]),
              _: 1
            })
          ])
        ])
      ])
    ]);
  }
  const index$4 = _export_sfc(_sfc_main$3, [
    [
      "render",
      _sfc_render$3
    ],
    [
      "__scopeId",
      "data-v-1c39b87b"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/module/quote/index.vue"
    ]
  ]);
  const __vite_glob_0_7 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: index$4
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const _sfc_main$2 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { t: t2 } = useI18n();
      const env = reactive({
        loading: false,
        currentTime: /* @__PURE__ */ new Date(),
        formats: [
          {
            label: "\u6807\u51C6\u65E5\u671F\u65F6\u95F4",
            value: "yyyy-MM-dd hh:mm:ss",
            example: "2023-01-01 12:30:45"
          },
          {
            label: "\u65E5\u671F",
            value: "yyyy-MM-dd",
            example: "2023-01-01"
          },
          {
            label: "\u65F6\u95F4",
            value: "hh:mm:ss",
            example: "12:30:45"
          },
          {
            label: "\u4E2D\u6587\u65E5\u671F\u65F6\u95F4",
            value: "yyyy\u5E74MM\u6708dd\u65E5 hh\u65F6mm\u5206ss\u79D2",
            example: "2023\u5E7401\u670801\u65E5 12\u65F630\u520645\u79D2"
          },
          {
            label: "ISO 8601",
            value: "yyyy-MM-ddThh:mm:ss.SSSZ",
            example: "2023-01-01T12:30:45.000Z"
          },
          {
            label: "Unix \u65F6\u95F4\u6233(\u79D2)",
            value: "timestamp-s",
            example: "1672571445"
          },
          {
            label: "Unix \u65F6\u95F4\u6233(\u6BEB\u79D2)",
            value: "timestamp-ms",
            example: "1672571445000"
          }
        ],
        customFormat: "yyyy-MM-dd hh:mm:ss",
        inputType: "datetime",
        inputValue: "",
        outputResults: [],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezones: [
          "Asia/Shanghai",
          "America/New_York",
          "Europe/London",
          "Asia/Tokyo",
          "Australia/Sydney",
          "UTC"
        ]
      });
      let clockTimer = null;
      const updateCurrentTime = () => {
        env.currentTime = /* @__PURE__ */ new Date();
      };
      const parseTime = () => {
        if (!env.inputValue) {
          return;
        }
        env.loading = true;
        env.outputResults = [];
        try {
          let parsedDate;
          if (env.inputType === "timestamp-s") {
            parsedDate = new Date(parseInt(env.inputValue) * 1e3);
          } else if (env.inputType === "timestamp-ms") {
            parsedDate = new Date(parseInt(env.inputValue));
          } else {
            parsedDate = new Date(env.inputValue);
          }
          if (isNaN(parsedDate.getTime())) {
            message(t2("message.invalidTimeFormat"), {
              type: "error"
            });
            env.loading = false;
            return;
          }
          env.outputResults = [
            {
              label: "\u6807\u51C6\u65E5\u671F\u65F6\u95F4",
              value: dateFormat(parsedDate, "yyyy-MM-dd hh:mm:ss")
            },
            {
              label: "\u65E5\u671F",
              value: dateFormat(parsedDate, "yyyy-MM-dd")
            },
            {
              label: "\u65F6\u95F4",
              value: dateFormat(parsedDate, "hh:mm:ss")
            },
            {
              label: "\u4E2D\u6587\u65E5\u671F\u65F6\u95F4",
              value: dateFormat(parsedDate, "yyyy\u5E74MM\u6708dd\u65E5 HH\u65F6mm\u5206ss\u79D2")
            },
            {
              label: "ISO 8601",
              value: parsedDate.toISOString()
            },
            {
              label: "Unix \u65F6\u95F4\u6233(\u79D2)",
              value: Math.floor(parsedDate.getTime() / 1e3).toString()
            },
            {
              label: "Unix \u65F6\u95F4\u6233(\u6BEB\u79D2)",
              value: parsedDate.getTime().toString()
            },
            {
              label: "\u81EA\u5B9A\u4E49\u683C\u5F0F",
              value: dateFormat(parsedDate, env.customFormat)
            }
          ];
          env.timezones.forEach((timezone) => {
            try {
              const options = {
                timeZone: timezone,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
              };
              const formatter = new Intl.DateTimeFormat("zh-CN", options);
              const timeInZone = formatter.format(parsedDate).replace(/\//g, "-").replace(",", "");
              env.outputResults.push({
                label: `${timezone} \u65F6\u533A`,
                value: timeInZone
              });
            } catch (error) {
              console.error(`\u65F6\u533A\u8F6C\u6362\u9519\u8BEF (${timezone}):`, error);
            }
          });
          message(t2("message.parseSuccess"), {
            type: "success"
          });
        } catch (error) {
          console.error("\u65F6\u95F4\u89E3\u6790\u9519\u8BEF:", error);
          message(t2("message.parseError"), {
            type: "error"
          });
        } finally {
          env.loading = false;
        }
      };
      const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
          message(t2("message.copySuccess"), {
            type: "success"
          });
        }).catch((err) => {
          console.error("\u590D\u5236\u5931\u8D25:", err);
          message(t2("message.copyError"), {
            type: "error"
          });
        });
      };
      onMounted(() => {
        updateCurrentTime();
        clockTimer = setInterval(updateCurrentTime, 1e3);
      });
      const __returned__ = {
        t: t2,
        env,
        get clockTimer() {
          return clockTimer;
        },
        set clockTimer(v2) {
          clockTimer = v2;
        },
        updateCurrentTime,
        parseTime,
        copyToClipboard,
        reactive,
        ref,
        onMounted,
        get message() {
          return message;
        },
        get useI18n() {
          return useI18n;
        },
        get dateFormat() {
          return dateFormat;
        }
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  };
  const _hoisted_1$2 = {
    class: "time-tool"
  };
  const _hoisted_2$2 = {
    class: "time-tool__content"
  };
  const _hoisted_3$2 = {
    class: "time-tool__clock-container"
  };
  const _hoisted_4$2 = {
    class: "time-tool__clock"
  };
  const _hoisted_5$2 = {
    class: "time-tool__clock-inner"
  };
  const _hoisted_6$2 = {
    class: "time-tool__clock-time"
  };
  const _hoisted_7$2 = {
    class: "time-tool__clock-date"
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$2, [
      createBaseVNode("div", _hoisted_2$2, [
        createBaseVNode("div", _hoisted_3$2, [
          createBaseVNode("div", _hoisted_4$2, [
            createBaseVNode("div", _hoisted_5$2, [
              createBaseVNode("div", _hoisted_6$2, toDisplayString($setup.dateFormat($setup.env.currentTime, "hh:mm:ss")), 1),
              createBaseVNode("div", _hoisted_7$2, toDisplayString($setup.dateFormat($setup.env.currentTime, "yyyy\u5E74MM\u6708dd\u65E5")) + " " + toDisplayString([
                "\u661F\u671F\u65E5",
                "\u661F\u671F\u4E00",
                "\u661F\u671F\u4E8C",
                "\u661F\u671F\u4E09",
                "\u661F\u671F\u56DB",
                "\u661F\u671F\u4E94",
                "\u661F\u671F\u516D"
              ][$setup.env.currentTime.getDay()]), 1)
            ]),
            _cache[0] || (_cache[0] = createBaseVNode("div", {
              class: "time-tool__clock-decoration"
            }, [
              createBaseVNode("div", {
                class: "time-tool__clock-circle"
              }),
              createBaseVNode("div", {
                class: "time-tool__clock-circle"
              }),
              createBaseVNode("div", {
                class: "time-tool__clock-circle"
              })
            ], -1))
          ])
        ])
      ])
    ]);
  }
  const index$3 = _export_sfc(_sfc_main$2, [
    [
      "render",
      _sfc_render$2
    ],
    [
      "__scopeId",
      "data-v-b3f914d1"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/module/time/index.vue"
    ]
  ]);
  const __vite_glob_0_8 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: index$3
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const _sfc_main$1 = defineComponent({
    title: "\u5929\u6C14",
    icon: "meteocons:clear-day-fill",
    description: "\u5929\u6C14\u4FE1\u606F",
    components: {
      scEcharts
    },
    data() {
      return {
        loading: true,
        dialogVisible: false,
        useWeatherStore,
        icon: {
          qing: "meteocons:clear-day-fill",
          yun: "meteocons:partly-cloudy-day-fill",
          yin: "meteocons:overcast-day-fill",
          yu: "meteocons:rain-fill"
        }
      };
    },
    mounted() {
      useWeatherStore.actions.load().then((res) => this.loading = false);
      this.$emit("loaded", true);
    },
    methods: {
      useRenderIcon
    }
  });
  const _hoisted_1$1 = [
    "header"
  ];
  const _hoisted_2$1 = {
    key: 1,
    class: "sw-ui-main-container sc-fjdhpX fAFgBy"
  };
  const _hoisted_3$1 = {
    class: "sw-ui-main-arcContainer sc-dnqmqq cHlxbs"
  };
  const _hoisted_4$1 = {
    class: "sw-ui-main-arc sc-iwsKbI bRmqwc"
  };
  const _hoisted_5$1 = {
    class: "sw-typography sw-ui-main-temperature sc-bwzfXH eofBUk",
    color: "inherit"
  };
  const _hoisted_6$1 = {
    class: "sw-ui-main-timeContainer sc-VigVT eMNzRy"
  };
  const _hoisted_7$1 = {
    class: "sw-typography sw-ui-main-rise sc-bwzfXH bpTFnS",
    color: "textSecondary"
  };
  const _hoisted_8$1 = {
    class: "sw-typography sw-ui-main-temperatureRange sc-jTzLTM bFsUuh sc-bwzfXH dBbtWF",
    color: "inherit"
  };
  const _hoisted_9$1 = {
    class: "sw-typography sw-ui-main-set sc-bwzfXH fwGqcW",
    color: "textSecondary"
  };
  const _hoisted_10$1 = {
    class: "sw-ui-main-container sc-fjdhpX fAFgBy"
  };
  const _hoisted_11$1 = {
    class: "sc-htpNat sw-ui-main sc-gzVnrw blUPwB"
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_empty = resolveComponent("el-empty");
    const _component_el_tag = resolveComponent("el-tag");
    const _component_el_icon = resolveComponent("el-icon");
    const _component_el_skeleton = resolveComponent("el-skeleton");
    const _component_scEcharts = resolveComponent("scEcharts");
    const _component_el_dialog = resolveComponent("el-dialog");
    return openBlock(), createElementBlock(Fragment, null, [
      createBaseVNode("div", {
        shadow: "hover",
        header: _ctx.header,
        class: "item-background"
      }, [
        createVNode(_component_el_skeleton, {
          loading: _ctx.loading,
          animated: ""
        }, {
          default: withCtx(() => {
            var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
            return [
              !((_b2 = (_a2 = _ctx.useWeatherStore.weather) == null ? void 0 : _a2.data) == null ? void 0 : _b2.cityName) ? (openBlock(), createBlock(_component_el_empty, {
                key: 0
              })) : (openBlock(), createElementBlock("div", _hoisted_2$1, [
                createBaseVNode("div", {
                  class: "sc-htpNat sw-ui-main sc-gzVnrw blUPwB",
                  onClick: _cache[0] || (_cache[0] = ($event) => _ctx.dialogVisible = true)
                }, [
                  createBaseVNode("div", _hoisted_3$1, [
                    createVNode(_component_el_tag, {
                      type: "primary",
                      class: "relative top-4 left-4 ml-1"
                    }, {
                      default: withCtx(() => {
                        var _a3, _b3;
                        return [
                          createTextVNode(toDisplayString((_b3 = (_a3 = _ctx.useWeatherStore.weather) == null ? void 0 : _a3.data) == null ? void 0 : _b3.cityName), 1)
                        ];
                      }),
                      _: 1
                    }),
                    createVNode(_component_el_tag, {
                      type: "primary",
                      class: "relative top-4 left-4 ml-1"
                    }, {
                      default: withCtx(() => {
                        var _a3, _b3;
                        return [
                          createTextVNode(toDisplayString((_b3 = (_a3 = _ctx.useWeatherStore.weather) == null ? void 0 : _a3.data) == null ? void 0 : _b3.temperature) + "\u2103", 1)
                        ];
                      }),
                      _: 1
                    }),
                    createBaseVNode("div", _hoisted_4$1, [
                      createVNode(_component_el_icon, {
                        style: {
                          "font-size": "80px",
                          "position": "relative",
                          "left": "15rem"
                        }
                      }, {
                        default: withCtx(() => {
                          var _a3;
                          return [
                            (openBlock(), createBlock(resolveDynamicComponent(_ctx.useRenderIcon(_ctx.icon[(_a3 = _ctx.useWeatherStore.current) == null ? void 0 : _a3.weatherIcon]))))
                          ];
                        }),
                        _: 1
                      })
                    ])
                  ]),
                  _cache[2] || (_cache[2] = createBaseVNode("div", {
                    class: "sw-ui-main-grow sc-htoDjs hzdUrF"
                  }, null, -1)),
                  createBaseVNode("p", _hoisted_5$1, toDisplayString((_c = _ctx.useWeatherStore.current) == null ? void 0 : _c.weatherDay), 1),
                  createBaseVNode("div", _hoisted_6$1, [
                    createBaseVNode("span", _hoisted_7$1, toDisplayString(((_e = (_d = _ctx.useWeatherStore.current) == null ? void 0 : _d.hours) == null ? void 0 : _e.length) > 0 ? (_g = (_f = _ctx.useWeatherStore.current) == null ? void 0 : _f.hours[0]) == null ? void 0 : _g.name : 0), 1),
                    createBaseVNode("span", _hoisted_8$1, toDisplayString((_h = _ctx.useWeatherStore.current) == null ? void 0 : _h.minLowTemp) + "\xB0C ~ " + toDisplayString((_i = _ctx.useWeatherStore.current) == null ? void 0 : _i.maxHighTemp) + "\xB0C ", 1),
                    createBaseVNode("span", _hoisted_9$1, toDisplayString(((_k = (_j = _ctx.useWeatherStore.current) == null ? void 0 : _j.hours) == null ? void 0 : _k.length) > 0 ? (_n = (_m = _ctx.useWeatherStore.current) == null ? void 0 : _m.hours[((_l = _ctx.useWeatherStore.current) == null ? void 0 : _l.hours.length) - 1]) == null ? void 0 : _n.name : 23), 1)
                  ])
                ])
              ])),
              (openBlock(true), createElementBlock(Fragment, null, renderList(((_p = (_o = _ctx.useWeatherStore.weather) == null ? void 0 : _o.data) == null ? void 0 : _p.day) || [], (item, i2) => {
                return openBlock(), createElementBlock("div", {
                  key: i2,
                  class: "three_days content-box"
                }, [
                  createBaseVNode("span", null, toDisplayString(item.date) + " " + toDisplayString(item.week), 1),
                  createBaseVNode("div", null, [
                    createVNode(_component_el_icon, {
                      style: {
                        "font-size": "40px"
                      }
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock(resolveDynamicComponent(_ctx.useRenderIcon(_ctx.icon[item.weatherIcon]))))
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  createBaseVNode("span", null, toDisplayString(item.minLowTemp) + "-" + toDisplayString(item.maxHighTemp) + "\u2103", 1),
                  createBaseVNode("span", null, toDisplayString(item.weatherDay), 1),
                  createBaseVNode("span", null, toDisplayString(item.windDirection), 1)
                ]);
              }), 128))
            ];
          }),
          _: 1
        }, 8, [
          "loading"
        ])
      ], 8, _hoisted_1$1),
      createVNode(_component_el_dialog, {
        modelValue: _ctx.dialogVisible,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.dialogVisible = $event),
        title: "24\u5C0F\u65F6\u5929\u6C14\u60C5\u51B5",
        draggable: ""
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_10$1, [
            createBaseVNode("div", _hoisted_11$1, [
              createVNode(_component_scEcharts, {
                height: "200px",
                width: "100%",
                option: _ctx.useWeatherStore.options
              }, null, 8, [
                "option"
              ])
            ])
          ])
        ]),
        _: 1
      }, 8, [
        "modelValue"
      ])
    ], 64);
  }
  const index$2 = _export_sfc(_sfc_main$1, [
    [
      "render",
      _sfc_render$1
    ],
    [
      "__scopeId",
      "data-v-67e5c3eb"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/module/weather/index.vue"
    ]
  ]);
  const __vite_glob_0_9 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: index$2
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  const _NOT_FOUND = defineAsyncComponent(() => __vitePreload(() => import("./404-B6xdgAzK.js"), true ? __vite__mapDeps([0,1,2,3,4]) : void 0));
  useLayoutLayoutStore = defineStore({
    id: "useLayoutLayoutStore",
    state: () => ({
      storageKey: "user-layout-setting",
      storageSfcKey: "user-layout-sfc-setting",
      grid: [],
      remoteComponents: {},
      layout: [],
      component: [],
      shadowDom: {},
      allComps: [],
      gridStackRef: null,
      modulesWithProps: {}
    }),
    actions: {
      loadComponentKey(key) {
        const sysSfc = this.getComponent(key);
        return sysSfc.sysSfcId;
      },
      loadFrameInfo(key) {
        const sysSfc = this.getComponent(key);
        if (!sysSfc) {
          return {
            frameSrc: "",
            fullPath: ""
          };
        }
        return {
          frameSrc: sysSfc.sysSfcPath,
          fullPath: sysSfc.sysSfcPath,
          key: sysSfc.sysSfcId + "#" + (/* @__PURE__ */ new Date()).getTime()
        };
      },
      setVue(vue) {
        this.Vue = vue;
      },
      loadComponent(key) {
        const sysSfc = this.getComponent(key);
        if (!sysSfc) {
          return _NOT_FOUND;
        }
        if (sysSfc.vue) {
          return loadSfcModule(sysSfc.sysSfcName + ".vue", sysSfc.sysSfcId, sysSfc);
        }
        return loadSfcModule(sysSfc.sysSfcName + ".vue", sysSfc.sysSfcId, sysSfc);
      },
      getComponent(key) {
        const rs = this.modulesWithProps[key];
        if (!rs) {
          return {
            sysSfcId: key,
            sfcIcon: "ri:image-2-line"
          };
        }
        return rs;
      },
      isLoaded(key, loadingCollection) {
        if (loadingCollection[key] === void 0) {
          loadingCollection[key] = true;
        }
        return loadingCollection[key];
      },
      loaded(key, loadingCollection) {
        loadingCollection[key] = false;
        return loadingCollection[key];
      },
      loadRemoteComponent(key, value) {
        if (!value) {
          return !!this.remoteComponents[key];
        }
        this.remoteComponents[key] = !!value;
        return value;
      },
      allCompsList() {
        var allCompsList = [];
        this.allComps.forEach((item) => {
          allCompsList.push({
            key: item.sysSfcId,
            title: item.sysSfcChineseName,
            icon: item.sysSfcIcon,
            type: item.sysSfcType,
            description: item.sysSfcDesc
          });
          this.modulesWithProps[item.sysSfcId] = item;
        });
        if (Array.isArray(this.component)) {
          for (let comp of allCompsList) {
            const _item = this.component.find((item) => {
              return item === comp.key;
            });
            if (_item) {
              comp.disabled = true;
            }
          }
        }
        return allCompsList;
      },
      pushComp(item) {
        return __async(this, null, function* () {
          this.layout.push({
            x: item.x || 0,
            y: item.y || 0,
            w: item.w || 1,
            h: item.h || 1,
            i: item.key,
            id: item.key,
            static: false,
            type: item.type
          });
          this.component.push({
            id: item.key
          });
        });
      },
      removeComp(key) {
        return __async(this, null, function* () {
          this.component = this.component ? this.component.filter((it) => it.id != key) : [];
          this.layout = this.layout.filter((it) => it.id != key);
        });
      },
      resetLayout() {
        return __async(this, null, function* () {
          this.reset();
        });
      },
      getLayout() {
        return this.layout;
      },
      getLayoutString() {
        return this.layout.join(",");
      },
      setLayout(layout) {
        return __async(this, null, function* () {
          this.layout = layout;
          this.component.length = 0;
          for (var i2 = 0; i2 < layout.length; i2++) {
            const item = [];
            this.component.push(item);
          }
          if (layout.join(",") == "24") {
            this.component[0] = [
              ...this == null ? void 0 : this.component[0],
              ...this == null ? void 0 : this.component[1],
              ...this == null ? void 0 : this.component[2]
            ];
            this.component[1] = [];
            this.component[2] = [];
            if (this.component.length == 4) {
              this.component.pop();
            }
          }
        });
      },
      loadLayout(elemet) {
        const rs = this.layout.filter((item) => item.id === elemet)[0];
        if (!rs) {
          return {
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            static: false
          };
        }
        return rs;
      },
      updateComponent(gridstackNode) {
        return __async(this, null, function* () {
          this.component.forEach((item) => {
            if (item.id == gridstackNode.id) {
              item.x = gridstackNode.x;
              item.y = gridstackNode.y;
              if (gridstackNode.w > 0) {
                item.w = gridstackNode.w;
              }
              if (gridstackNode.h > 0) {
                item.h = gridstackNode.h;
              }
            }
          });
        });
      },
      updateLayout(gridstackNode) {
        return __async(this, null, function* () {
          this.layout.forEach((item) => {
            if (item.id == gridstackNode.id) {
              item.x = gridstackNode.x;
              item.y = gridstackNode.y;
              if (gridstackNode.w > 0) {
                item.w = gridstackNode.w;
              }
              if (gridstackNode.h > 0) {
                item.h = gridstackNode.h;
              }
            }
          });
        });
      },
      saveLayout() {
        return __async(this, null, function* () {
          if (!getConfig().RemoteLayoutSave) {
            localStorageProxy().setItem(this.storageKey, {
              grid: this.grid,
              layout: this.layout,
              component: this.component
            });
            return false;
          }
          fetchUpdateUserLayout({
            grid: JSON.stringify(this.grid),
            layout: JSON.stringify(this.layout),
            component: JSON.stringify(this.component)
          }).then(() => {
            localStorageProxy().setItem(this.storageKey, {
              grid: this.grid,
              layout: this.layout,
              component: this.component
            });
          });
        });
      },
      hasMyCompsList() {
        return this.myCompsList().length > 0;
      },
      myCompsList() {
        return this.allCompsList().filter((item) => {
          return !item.disabled && (this.component ? this.component.filter((i2) => i2.id === item.key).length === 0 : true);
        });
      },
      hasSettingCompent() {
        var _a2;
        if (!Array.isArray(this.nowCompsList()) || this.nowCompsList().length == 0) {
          return false;
        }
        const _component = [];
        (_a2 = this.nowCompsList()) == null ? void 0 : _a2.forEach((item) => {
          if (isArray(item)) {
            _component.push(...item);
            return;
          }
          _component.push(item);
        });
        return _component.length > 0;
      },
      hasNowCompsList() {
        return this.nowCompsList().length > 0;
      },
      nowCompsList() {
        return this.component;
      },
      clear() {
        return __async(this, null, function* () {
          this.close();
        });
      },
      close() {
        return __async(this, null, function* () {
          localStorageProxy().removeItem(this.storageKey);
          localStorageProxy().removeItem(this.storageSfcKey);
          this.allComps = [];
          this.component = [
            [],
            [],
            []
          ];
          this.layout = [];
          this.grid = [];
        });
      },
      reset() {
        return __async(this, null, function* () {
          this.close();
          return this.loadModule();
        });
      },
      loadModule() {
        return __async(this, null, function* () {
          this.load();
        });
      },
      loadLocationCompent() {
        return __async(this, null, function* () {
          const localModule = {};
          const _localMapping = {};
          Object.entries(Object.assign({
            "../../../../module/battery/index.vue": __vite_glob_0_0,
            "../../../../module/calendar/index.vue": __vite_glob_0_1,
            "../../../../module/countdown/index.vue": __vite_glob_0_2,
            "../../../../module/day/index.vue": __vite_glob_0_3,
            "../../../../module/greeting/index.vue": __vite_glob_0_4,
            "../../../../module/ip/index.vue": __vite_glob_0_5,
            "../../../../module/memory/index.vue": __vite_glob_0_6,
            "../../../../module/quote/index.vue": __vite_glob_0_7,
            "../../../../module/time/index.vue": __vite_glob_0_8,
            "../../../../module/weather/index.vue": __vite_glob_0_9
          })).map(([key, value]) => {
            _localMapping[key] = value.default;
          });
          Object.entries(Object.assign({
            "../../../../module/calendar/config.json": __vite_glob_1_0,
            "../../../../module/day/config.json": __vite_glob_1_1,
            "../../../../module/ip/config.json": __vite_glob_1_2,
            "../../../../module/package.json": __vite_glob_1_3,
            "../../../../module/time/config.json": __vite_glob_1_4,
            "../../../../module/weather/config.json": __vite_glob_1_5
          })).map(([key, value]) => {
            const setting = JSON.parse(value.default);
            setting.vue = _localMapping[key.replace("config.json", "index.vue")];
            if (!setting.vue) {
              return;
            }
            setting.sysSfcType = 1;
            if (!setting.sysSfcIcon) {
              setting.sysSfcIcon = "ri:inbox-2-fill";
            }
            localModule[key.replace("../../..", "@repo").replace("config.json", "index.vue") + ""] = setting;
            this.allComps.push(setting);
          });
        });
      },
      loadRemoteCompent() {
        return __async(this, null, function* () {
          const res = yield fetchMineSfc({
            sysSfcCategory: "HOME"
          });
          this.allComps.push(...res.data);
          localStorageProxy().setItem(this.storageSfcKey, this.allComps);
        });
      },
      loadSfc() {
        return __async(this, null, function* () {
          const data = localStorageProxy().getItem(this.storageSfcKey);
          this.allComps = [];
          if (data) {
            this.allComps.push(...data);
            return data;
          }
          if (getConfig().RemoteLayout) {
            this.loadRemoteCompent();
            return;
          }
          if (getConfig().LocationLayout) {
            this.loadLocationCompent();
            return;
          }
        });
      },
      load() {
        return __async(this, null, function* () {
          yield this.loadSfc();
          const data = localStorageProxy().getItem(this.storageKey);
          if (!data) {
            if (!getConfig().RemoteLayoutSave) {
              this.component = [
                [],
                [],
                []
              ];
              this.layout = [];
              this.grid = [];
              return false;
            }
            return new Promise((resolve) => __async(this, null, function* () {
              const { data: data2 } = yield fetchGetUserLayout();
              const res = data2;
              this.doRegister(data2);
              localStorageProxy().setItem(this.storageKey, {
                grid: toObject(res == null ? void 0 : res.grid) || [],
                layout: toObject(res == null ? void 0 : res.layout) || [],
                component: toObject(res == null ? void 0 : res.component) || [
                  [],
                  [],
                  []
                ]
              });
              resolve(null);
            }));
          }
          return new Promise((resolve) => __async(this, null, function* () {
            this.doRegister(data);
            resolve(null);
          }));
        });
      },
      doRegister(data) {
        return __async(this, null, function* () {
          if (!(data == null ? void 0 : data.grid)) {
            this.grid = [];
          } else if (typeof data.grid == "string") {
            this.grid = JSON.parse((data == null ? void 0 : data.grid) || "[]");
          } else {
            this.grid = data == null ? void 0 : data.grid;
          }
          if (!(data == null ? void 0 : data.layout)) {
            this.layout = [];
          } else if (typeof data.layout == "string") {
            this.layout = JSON.parse((data == null ? void 0 : data.layout) || "[]");
          } else {
            this.layout = data.layout;
            this.component = data.component;
          }
          yield this.allCompsList();
        });
      }
    }
  });
  const useWeatherStore = {
    id: "weather-setting",
    storageKey: "weather-layout-setting",
    weather: {
      data: null,
      timestamp: null
    },
    origin: {},
    header: "\u5929\u6C14\u60C5\u51B5",
    weatherArray: [],
    city: null,
    current: null,
    options: {
      type: "24\u5C0F\u65F6\u5929\u6C14",
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      xAxis: {
        type: "category",
        axisLabel: {
          textStyle: {
            color: "#fff"
          }
        },
        data: []
      },
      yAxis: {
        nameTextStyle: {
          color: "#fff"
        },
        axisLabel: {
          formatter: "{value}",
          textStyle: {
            color: "#fff"
          }
        },
        type: "value"
      },
      series: [
        {
          name: "\u6E29\u5EA6",
          data: [],
          type: "line",
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: function(v2) {
                  return v2.data + "\xB0";
                }
              },
              lineStyle: {
                width: 3,
                type: "dotted"
              }
            }
          }
        },
        {
          name: "\u6E7F\u5EA6",
          data: [],
          type: "line",
          itemStyle: {
            normal: {
              label: {
                show: true
              }
            }
          }
        },
        {
          name: "\u98CE\u529B",
          data: [],
          type: "line",
          itemStyle: {
            normal: {
              label: {
                show: true
              }
            }
          }
        }
      ]
    },
    actions: {
      load() {
        return __async(this, null, function* () {
          if (!useWeatherStore.weather.data) {
            return new Promise((resolve) => {
              this.afterGetWeather();
              resolve(null);
            });
          }
          return new Promise((resolve) => {
            this.doAnalysis();
            resolve(null);
          });
        });
      },
      afterGetWeather() {
        return __async(this, null, function* () {
          const data = localStorageProxy().getItem(useWeatherStore.storageKey);
          if (!(data == null ? void 0 : data.data)) {
            fetchGetWeather({}).then((res) => __async(this, null, function* () {
              useWeatherStore.weather = {
                data: res.data,
                timestamp: (/* @__PURE__ */ new Date()).getTime()
              };
              localStorageProxy().setItem(useWeatherStore.storageKey, useWeatherStore.weather);
              this.doAnalysis();
            }));
            return;
          }
          useWeatherStore.weather.data = data == null ? void 0 : data.data;
          useWeatherStore.weather.timestamp = data == null ? void 0 : data.timestamp;
          this.doAnalysis();
        });
      },
      doAnalysis() {
        var _a2, _b2;
        const item = (_a2 = useWeatherStore.weather) == null ? void 0 : _a2.data;
        const timestamp = ((_b2 = useWeatherStore.weather) == null ? void 0 : _b2.timestamp) || 0;
        if ((/* @__PURE__ */ new Date()).getTime() - timestamp > 1e3 * 60 * 60) {
          localStorageProxy().removeItem(useWeatherStore.storageKey);
        }
        if (Object.keys(useWeatherStore.weather).length == 0) {
          return;
        }
        useWeatherStore.origin = item;
        useWeatherStore.city = item == null ? void 0 : item.city;
        useWeatherStore.header = (item == null ? void 0 : item.city) + " \u672A\u67657\u5929\u5929\u6C14\u60C5\u51B5";
        useWeatherStore.weatherArray = (item == null ? void 0 : item.day) || [];
        useWeatherStore.current = useWeatherStore.weatherArray.find((item2) => item2.date == this.toDay());
        if (useWeatherStore.current) {
          useWeatherStore.options.series[0].data = ((item == null ? void 0 : item.hours) || []).map((it) => it.temperature);
          useWeatherStore.options.series[1].data = ((item == null ? void 0 : item.hours) || []).map((it) => it.humidity);
          useWeatherStore.options.series[2].data = ((item == null ? void 0 : item.hours) || []).map((it) => it.windSpeed);
          useWeatherStore.options.xAxis.data = ((item == null ? void 0 : item.hours) || []).map((it) => it.time);
        }
      },
      isDay() {
        const currentTime = (/* @__PURE__ */ new Date()).getHours();
        return currentTime >= 6 && currentTime < 18;
      },
      toDay() {
        const date = /* @__PURE__ */ new Date();
        return date.getFullYear() + "-" + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + date.getDate();
      }
    }
  };
  const _sfc_main = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const widgets = shallowRef();
      const userLayoutObject = useLayoutLayoutStore();
      const CustomLayout = defineAsyncComponent(() => __vitePreload(() => import("./CustomLayout-rOqW_07u.js"), true ? __vite__mapDeps([5,1,2,6,7,8,9]) : void 0));
      const openRemoteLayout = getConfig().RemoteLayout;
      const openLocationLayout = getConfig().LocationLayout;
      const customizing = reactive({
        customizing: false,
        hasLayout: openRemoteLayout || openLocationLayout
      });
      const handeCustom = () => __async(null, null, function* () {
        customizing.customizing = true;
        nextTick(() => {
          const scale = 1;
          widgets.value.style.setProperty("transform", `scale(${scale})`);
          widgets.value.style.setProperty("--transform-scale", `${scale}`);
        });
      });
      const backDefault = () => __async(null, null, function* () {
        customizing.customizing = false;
        widgets.value.style.removeProperty("transform");
        userLayoutObject.resetLayout();
      });
      const handleClose = () => __async(null, null, function* () {
        customizing.customizing = false;
        widgets.value.style.removeProperty("transform");
      });
      const push = (item) => __async(null, null, function* () {
        userLayoutObject.pushComp(item);
      });
      const handleUpdate = () => __async(null, null, function* () {
        customizing.customizing = false;
        widgets.value.style.removeProperty("transform");
        userLayoutObject.saveLayout();
      });
      onBeforeMount(() => __async(null, null, function* () {
        useLayoutLayoutStore().load();
      }));
      const __returned__ = {
        widgets,
        userLayoutObject,
        CustomLayout,
        openRemoteLayout,
        openLocationLayout,
        customizing,
        handeCustom,
        backDefault,
        handleClose,
        push,
        handleUpdate,
        get useRenderIcon() {
          return useRenderIcon;
        },
        get getConfig() {
          return getConfig;
        },
        get useLayoutLayoutStore() {
          return useLayoutLayoutStore;
        },
        defineAsyncComponent,
        nextTick,
        onBeforeMount,
        reactive,
        shallowRef
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  };
  const _hoisted_1 = {
    class: "widgets-content"
  };
  const _hoisted_2 = {
    class: "widgets-top"
  };
  const _hoisted_3 = {
    class: "widgets-top-title"
  };
  const _hoisted_4 = {
    class: "widgets-top-actions"
  };
  const _hoisted_5 = {
    key: 0
  };
  const _hoisted_6 = {
    ref: "widgets",
    class: "widgets"
  };
  const _hoisted_7 = {
    class: "widgets-wrapper"
  };
  const _hoisted_8 = {
    key: 0
  };
  const _hoisted_9 = {
    key: 1,
    class: "h-full"
  };
  const _hoisted_10 = {
    key: 0,
    class: "no-widgets"
  };
  const _hoisted_11 = {
    key: 0,
    class: "widgets-aside"
  };
  const _hoisted_12 = {
    class: "widgets-aside-title"
  };
  const _hoisted_13 = {
    class: "widgets-list"
  };
  const _hoisted_14 = {
    key: 0,
    class: "widgets-list-nodata"
  };
  const _hoisted_15 = {
    class: "item-logo"
  };
  const _hoisted_16 = {
    class: "item-info"
  };
  const _hoisted_17 = {
    class: "item-actions"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_button = resolveComponent("el-button");
    const _component_el_empty = resolveComponent("el-empty");
    const _component_el_icon = resolveComponent("el-icon");
    const _component_el_header = resolveComponent("el-header");
    const _component_el_main = resolveComponent("el-main");
    const _component_el_footer = resolveComponent("el-footer");
    const _component_el_container = resolveComponent("el-container");
    return openBlock(), createElementBlock("div", {
      ref: "main",
      class: normalizeClass([
        "el-card widgets-home",
        $setup.customizing.customizing ? "customizing" : ""
      ])
    }, [
      createBaseVNode("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, toDisplayString(_ctx.$t("buttons.board")), 1),
          createBaseVNode("div", _hoisted_4, [
            $setup.customizing.hasLayout ? (openBlock(), createElementBlock("div", _hoisted_5, [
              $setup.customizing.customizing ? (openBlock(), createBlock(_component_el_button, {
                key: 0,
                type: "primary",
                icon: $setup.useRenderIcon("ep:check"),
                round: "",
                onClick: $setup.handleUpdate
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.$t("buttons.finish")), 1)
                ]),
                _: 1
              }, 8, [
                "icon"
              ])) : (openBlock(), createBlock(_component_el_button, {
                key: 1,
                type: "primary",
                icon: $setup.useRenderIcon("ep:edit"),
                round: "",
                onClick: $setup.handeCustom
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.$t("buttons.custom")), 1)
                ]),
                _: 1
              }, 8, [
                "icon"
              ]))
            ])) : createCommentVNode("", true)
          ])
        ]),
        createBaseVNode("div", _hoisted_6, [
          createBaseVNode("div", _hoisted_7, [
            !$setup.customizing.hasLayout ? (openBlock(), createElementBlock("div", _hoisted_8, [
              createVNode(_component_el_empty, {
                image: _ctx.widgetsImage,
                description: _ctx.$t("message.noPlugin"),
                "image-size": 280
              }, null, 8, [
                "image",
                "description"
              ])
            ])) : (openBlock(), createElementBlock("div", _hoisted_9, [
              !$setup.userLayoutObject.hasSettingCompent() ? (openBlock(), createElementBlock("div", _hoisted_10, [
                createVNode(_component_el_empty, {
                  image: _ctx.widgetsImage,
                  description: _ctx.$t("message.noPlugin"),
                  "image-size": 280
                }, null, 8, [
                  "image",
                  "description"
                ])
              ])) : (openBlock(), createBlock($setup["CustomLayout"], {
                key: 1,
                modelValue: $setup.customizing.customizing,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.customizing.customizing = $event)
              }, null, 8, [
                "modelValue"
              ]))
            ]))
          ])
        ], 512)
      ]),
      $setup.customizing.customizing ? (openBlock(), createElementBlock("div", _hoisted_11, [
        createVNode(_component_el_container, null, {
          default: withCtx(() => [
            createVNode(_component_el_header, null, {
              default: withCtx(() => [
                createBaseVNode("div", _hoisted_12, [
                  createVNode(_component_el_icon, null, {
                    default: withCtx(() => [
                      (openBlock(), createBlock(resolveDynamicComponent($setup.useRenderIcon("ep:circle-plus-filled"))))
                    ]),
                    _: 1
                  }),
                  createTextVNode(" " + toDisplayString(_ctx.$t("message.addWidget")), 1)
                ]),
                createBaseVNode("div", {
                  class: "widgets-aside-close",
                  onClick: _cache[1] || (_cache[1] = ($event) => $setup.handleClose())
                }, [
                  createVNode(_component_el_icon, null, {
                    default: withCtx(() => [
                      (openBlock(), createBlock(resolveDynamicComponent($setup.useRenderIcon("ep:close"))))
                    ]),
                    _: 1
                  })
                ])
              ]),
              _: 1
            }),
            createVNode(_component_el_main, {
              class: "nopadding"
            }, {
              default: withCtx(() => [
                createBaseVNode("div", _hoisted_13, [
                  !$setup.userLayoutObject.hasMyCompsList() ? (openBlock(), createElementBlock("div", _hoisted_14, [
                    createVNode(_component_el_empty, {
                      description: _ctx.$t("message.noPlugin"),
                      "image-size": 60
                    }, null, 8, [
                      "description"
                    ])
                  ])) : createCommentVNode("", true),
                  (openBlock(true), createElementBlock(Fragment, null, renderList($setup.userLayoutObject.myCompsList(), (item) => {
                    return openBlock(), createElementBlock("div", {
                      key: item.title,
                      class: "widgets-list-item"
                    }, [
                      createBaseVNode("div", _hoisted_15, [
                        createVNode(_component_el_icon, null, {
                          default: withCtx(() => [
                            (openBlock(), createBlock(resolveDynamicComponent($setup.useRenderIcon(item.icon))))
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      createBaseVNode("div", _hoisted_16, [
                        createBaseVNode("h2", null, toDisplayString(item.title), 1),
                        createBaseVNode("p", null, toDisplayString(item.description), 1)
                      ]),
                      createBaseVNode("div", _hoisted_17, [
                        createVNode(_component_el_button, {
                          type: "primary",
                          icon: $setup.useRenderIcon("ep:plus"),
                          size: "small",
                          onClick: ($event) => $setup.push(item)
                        }, null, 8, [
                          "icon",
                          "onClick"
                        ])
                      ])
                    ]);
                  }), 128))
                ])
              ]),
              _: 1
            }),
            createVNode(_component_el_footer, {
              style: {
                "height": "51px",
                "background-color": "var(--el-bg-color)"
              }
            }, {
              default: withCtx(() => [
                createVNode(_component_el_button, {
                  size: "small",
                  onClick: _cache[2] || (_cache[2] = ($event) => $setup.backDefault())
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.$t("buttons.default")), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ])) : createCommentVNode("", true)
    ], 2);
  }
  const index = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__scopeId",
      "data-v-4fbb6b45"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/pages/home/default/index.vue"
    ]
  ]);
  index$1 = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: index
  }, Symbol.toStringTag, {
    value: "Module"
  }));
}));
export {
  __tla,
  index$1 as i,
  useLayoutLayoutStore as u
};
