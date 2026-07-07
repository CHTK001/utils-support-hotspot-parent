var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a2, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    }
  return a2;
};
var __spreadProps = (a2, b2) => __defProps(a2, __getOwnPropDescs(b2));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e2) {
        reject(e2);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e2) {
        reject(e2);
      }
    };
    var step = (x2) => x2.done ? resolve(x2.value) : Promise.resolve(x2.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { d as defineComponent, bN as inject, r as ref, P as reactive, aJ as toRef, Z as onBeforeMount, l as onMounted, bT as watchEffect, am as onBeforeUnmount, q as computed, al as watch, c as createElementBlock, o as openBlock, aG as renderSlot, v as createCommentVNode, L as normalizeClass, n as normalizeStyle, aS as unref, bU as getCurrentScope, bV as onScopeDispose, T as nextTick, bW as provide, bX as toRefs, w as withDirectives, F as Fragment, m as renderList, j as createBlock, k as withCtx, aX as mergeProps, aw as vShow, g as createVNode, a as createStaticVNode, i as createTextVNode, x as resolveDynamicComponent, _ as _export_sfc, e as resolveComponent, h as createBaseVNode, bS as KeepAlive, b8 as defineAsyncComponent, ar as useRenderIcon } from "./index-DsQ9-pB_.js";
import { i as interact } from "./interact.min-C7rynaR3.js";
import { u as useLayoutLayoutStore } from "./index-DaWI7J-N.js";
import "./index-Df2x6qn1.js";
import "./index-DzMTRvxk.js";
const y$2 = typeof window < "u";
var Ot$1;
y$2 && ((Ot$1 = window == null ? void 0 : window.navigator) == null ? void 0 : Ot$1.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function ie(t2) {
  return t2 == null;
}
function it() {
}
const W = Object.freeze({
  aliceblue: "f0f8ff",
  antiquewhite: "faebd7",
  aqua: "0ff",
  aquamarine: "7fffd4",
  azure: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "000",
  blanchedalmond: "ffebcd",
  blue: "00f",
  blueviolet: "8a2be2",
  brown: "a52a2a",
  burlywood: "deb887",
  burntsienna: "ea7e5d",
  cadetblue: "5f9ea0",
  chartreuse: "7fff00",
  chocolate: "d2691e",
  coral: "ff7f50",
  cornflowerblue: "6495ed",
  cornsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "0ff",
  darkblue: "00008b",
  darkcyan: "008b8b",
  darkgoldenrod: "b8860b",
  darkgray: "a9a9a9",
  darkgreen: "006400",
  darkgrey: "a9a9a9",
  darkkhaki: "bdb76b",
  darkmagenta: "8b008b",
  darkolivegreen: "556b2f",
  darkorange: "ff8c00",
  darkorchid: "9932cc",
  darkred: "8b0000",
  darksalmon: "e9967a",
  darkseagreen: "8fbc8f",
  darkslateblue: "483d8b",
  darkslategray: "2f4f4f",
  darkslategrey: "2f4f4f",
  darkturquoise: "00ced1",
  darkviolet: "9400d3",
  deeppink: "ff1493",
  deepskyblue: "00bfff",
  dimgray: "696969",
  dimgrey: "696969",
  dodgerblue: "1e90ff",
  firebrick: "b22222",
  floralwhite: "fffaf0",
  forestgreen: "228b22",
  fuchsia: "f0f",
  gainsboro: "dcdcdc",
  ghostwhite: "f8f8ff",
  gold: "ffd700",
  goldenrod: "daa520",
  gray: "808080",
  green: "008000",
  greenyellow: "adff2f",
  grey: "808080",
  honeydew: "f0fff0",
  hotpink: "ff69b4",
  indianred: "cd5c5c",
  indigo: "4b0082",
  ivory: "fffff0",
  khaki: "f0e68c",
  lavender: "e6e6fa",
  lavenderblush: "fff0f5",
  lawngreen: "7cfc00",
  lemonchiffon: "fffacd",
  lightblue: "add8e6",
  lightcoral: "f08080",
  lightcyan: "e0ffff",
  lightgoldenrodyellow: "fafad2",
  lightgray: "d3d3d3",
  lightgreen: "90ee90",
  lightgrey: "d3d3d3",
  lightpink: "ffb6c1",
  lightsalmon: "ffa07a",
  lightseagreen: "20b2aa",
  lightskyblue: "87cefa",
  lightslategray: "789",
  lightslategrey: "789",
  lightsteelblue: "b0c4de",
  lightyellow: "ffffe0",
  lime: "0f0",
  limegreen: "32cd32",
  linen: "faf0e6",
  magenta: "f0f",
  maroon: "800000",
  mediumaquamarine: "66cdaa",
  mediumblue: "0000cd",
  mediumorchid: "ba55d3",
  mediumpurple: "9370db",
  mediumseagreen: "3cb371",
  mediumslateblue: "7b68ee",
  mediumspringgreen: "00fa9a",
  mediumturquoise: "48d1cc",
  mediumvioletred: "c71585",
  midnightblue: "191970",
  mintcream: "f5fffa",
  mistyrose: "ffe4e1",
  moccasin: "ffe4b5",
  navajowhite: "ffdead",
  navy: "000080",
  oldlace: "fdf5e6",
  olive: "808000",
  olivedrab: "6b8e23",
  orange: "ffa500",
  orangered: "ff4500",
  orchid: "da70d6",
  palegoldenrod: "eee8aa",
  palegreen: "98fb98",
  paleturquoise: "afeeee",
  palevioletred: "db7093",
  papayawhip: "ffefd5",
  peachpuff: "ffdab9",
  peru: "cd853f",
  pink: "ffc0cb",
  plum: "dda0dd",
  powderblue: "b0e0e6",
  purple: "800080",
  rebeccapurple: "663399",
  red: "f00",
  rosybrown: "bc8f8f",
  royalblue: "4169e1",
  saddlebrown: "8b4513",
  salmon: "fa8072",
  sandybrown: "f4a460",
  seagreen: "2e8b57",
  seashell: "fff5ee",
  sienna: "a0522d",
  silver: "c0c0c0",
  skyblue: "87ceeb",
  slateblue: "6a5acd",
  slategray: "708090",
  slategrey: "708090",
  snow: "fffafa",
  springgreen: "00ff7f",
  steelblue: "4682b4",
  tan: "d2b48c",
  teal: "008080",
  thistle: "d8bfd8",
  tomato: "ff6347",
  turquoise: "40e0d0",
  violet: "ee82ee",
  wheat: "f5deb3",
  white: "fff",
  whitesmoke: "f5f5f5",
  yellow: "ff0",
  yellowgreen: "9acd32"
});
Object.freeze(new Set(Object.keys(W)));
function Zr() {
  const t2 = /* @__PURE__ */ new Map();
  return {
    on(e2, n) {
      const r2 = t2.get(e2);
      (r2 == null ? void 0 : r2.add(n)) || t2.set(e2, /* @__PURE__ */ new Set([n]));
    },
    off(e2, n) {
      const r2 = t2.get(e2);
      r2 && r2.delete(n);
    },
    clear(e2) {
      const n = t2.get(e2);
      n && n.clear();
    },
    clearAll() {
      t2.clear();
    },
    emit(e2, ...n) {
      const r2 = t2.get(e2);
      r2 && r2.forEach((o) => {
        o(...n);
      });
    }
  };
}
function eo(t2, e2 = 16) {
  if (typeof t2 != "function")
    return it;
  const n = (...i2) => {
    t2(...i2);
  };
  if (e2 <= 0)
    return Jt(n);
  let r2 = 0, o;
  return function(...i2) {
    const s2 = Date.now(), c2 = s2 - r2;
    clearTimeout(o), c2 >= e2 ? (r2 = s2, n(...i2)) : o = setTimeout(
      () => {
        r2 = Date.now(), n(...i2);
      },
      Math.max(0, e2 - c2)
    );
  };
}
function no(t2, e2 = 100) {
  if (typeof t2 != "function")
    return it;
  const n = (...o) => {
    t2(...o);
  };
  if (e2 <= 0)
    return Jt(n);
  let r2;
  return function(...o) {
    clearTimeout(r2), r2 = setTimeout(() => {
      n(...o);
    }, e2);
  };
}
function Jt(t2) {
  if (typeof t2 != "function")
    return t2;
  let e2 = false, n, r2;
  return function(...o) {
    return n = o, e2 || (e2 = true, r2 = Promise.resolve().then(() => (e2 = false, r2 = void 0, t2(...n)))), r2;
  };
}
const x$1 = /* @__PURE__ */ new Set(), vt = /* @__PURE__ */ new WeakMap();
function hn() {
  x$1.forEach((t2) => {
    t2(...vt.get(t2));
  }), x$1.clear();
}
function oo(t2, ...e2) {
  if (typeof t2 != "function")
    return t2;
  vt.set(t2, e2), !x$1.has(t2) && (x$1.add(t2), x$1.size === 1 && Promise.resolve().then(hn));
}
const T = Symbol("LAYOUT_KEY"), v$1 = Symbol("EMITTER_KEY");
function A(r2) {
  let n = 0, t2;
  for (let e2 = 0, i2 = r2.length; e2 < i2; e2++)
    t2 = r2[e2].y + r2[e2].h, t2 > n && (n = t2);
  return n;
}
function Y(r2) {
  const n = Array(r2.length);
  for (let t2 = 0, e2 = r2.length; t2 < e2; t2++)
    n[t2] = y$1(r2[t2]);
  return n;
}
function y$1(r2) {
  return __spreadValues({}, r2);
}
function a$1(r2, n) {
  return !(r2 === n || r2.x + r2.w <= n.x || r2.x >= n.x + n.w || r2.y + r2.h <= n.y || r2.y >= n.y + n.h);
}
function $(r2, n, t2) {
  const e2 = b(r2), i2 = g(r2), o = Array(r2.length);
  for (let s2 = 0, f = i2.length; s2 < f; s2++) {
    let c2 = i2[s2];
    c2.static || (c2 = E(e2, c2, n, t2), e2.push(c2)), o[r2.findIndex((l) => l.i === c2.i)] = c2, c2.moved = false;
  }
  return o;
}
function E(r2, n, t2, e2) {
  if (t2)
    for (; n.y > 0 && !h(r2, n); )
      n.y--;
  else if (e2) {
    const o = e2[n.i].y;
    for (; n.y > o && !h(r2, n); )
      n.y--;
  }
  let i2;
  for (; i2 = h(r2, n); )
    n.y = i2.y + i2.h;
  return n;
}
function _(r2, n) {
  const t2 = b(r2);
  for (let e2 = 0, i2 = r2.length; e2 < i2; e2++) {
    const o = r2[e2];
    if (o.x + o.w > n.cols && (o.x = n.cols - o.w), o.x < 0 && (o.x = 0, o.w = n.cols), !o.static) t2.push(o);
    else
      for (; h(t2, o); )
        o.y++;
  }
  return r2;
}
function C(r2, n) {
  for (let t2 = 0, e2 = r2.length; t2 < e2; t2++)
    if (r2[t2].i === n) return r2[t2];
}
function h(r2, n) {
  for (let t2 = 0, e2 = r2.length; t2 < e2; t2++)
    if (a$1(r2[t2], n)) return r2[t2];
}
function L(r2, n) {
  return r2.filter((t2) => a$1(t2, n));
}
function b(r2) {
  return r2.filter((n) => n.static);
}
function x(r2, n, t2, e2, i2 = false, o = false) {
  if (n.static) return r2;
  const s2 = n.x, f = n.y, c2 = e2 && n.y > e2;
  typeof t2 == "number" && (n.x = t2), typeof e2 == "number" && (n.y = e2), n.moved = true;
  let l = g(r2);
  c2 && (l = l.reverse());
  const p = L(l, n);
  if (o && p.length)
    return n.x = s2, n.y = f, n.moved = false, r2;
  for (let w = 0, m = p.length; w < m; w++) {
    const u = p[w];
    u.moved || n.y > u.y && n.y - u.y > u.h / 4 || (u.static ? r2 = d$1(r2, u, n, i2) : r2 = d$1(r2, n, u, i2));
  }
  return r2;
}
function d$1(r2, n, t2, e2) {
  if (e2) {
    const o = {
      x: t2.x,
      y: t2.y,
      w: t2.w,
      h: t2.h
    };
    if (o.y = Math.max(n.y - t2.h, 0), !h(r2, o))
      return x(r2, t2, void 0, o.y, false);
  }
  return x(r2, t2, void 0, t2.y + 1, false);
}
function G(r2, n, t2, e2) {
  const i2 = "translate3d(" + n + "px," + r2 + "px, 0)";
  return {
    transform: i2,
    WebkitTransform: i2,
    MozTransform: i2,
    msTransform: i2,
    OTransform: i2,
    width: t2 + "px",
    height: e2 + "px",
    position: "absolute"
  };
}
function O(r2, n, t2, e2) {
  const i2 = "translate3d(" + n * -1 + "px," + r2 + "px, 0)";
  return {
    transform: i2,
    WebkitTransform: i2,
    MozTransform: i2,
    msTransform: i2,
    OTransform: i2,
    width: t2 + "px",
    height: e2 + "px",
    position: "absolute"
  };
}
function R(r2, n, t2, e2) {
  return {
    top: r2 + "px",
    left: n + "px",
    width: t2 + "px",
    height: e2 + "px",
    position: "absolute"
  };
}
function V(r2, n, t2, e2) {
  return {
    top: r2 + "px",
    right: n + "px",
    width: t2 + "px",
    height: e2 + "px",
    position: "absolute"
  };
}
function g(r2) {
  return Array.from(r2).sort(function(n, t2) {
    return n.y === t2.y && n.x === t2.x ? 0 : n.y > t2.y || n.y === t2.y && n.x > t2.x ? 1 : -1;
  });
}
function k(r2, n) {
  n = n || "Layout";
  const t2 = ["x", "y", "w", "h"], e2 = [];
  if (!Array.isArray(r2)) throw new Error(n + " must be an array!");
  for (let i2 = 0, o = r2.length; i2 < o; i2++) {
    const s2 = r2[i2];
    for (let f = 0; f < t2.length; f++)
      if (typeof s2[t2[f]] != "number")
        throw new Error(
          "VueGridLayout: " + n + "[" + i2 + "]." + t2[f] + " must be a number!"
        );
    if (s2.i === void 0 || s2.i === null)
      throw new Error("VueGridLayout: " + n + "[" + i2 + "].i cannot be null!");
    if (typeof s2.i != "number" && typeof s2.i != "string")
      throw new Error("VueGridLayout: " + n + "[" + i2 + "].i must be a string or number!");
    if (e2.indexOf(s2.i) >= 0)
      throw new Error("VueGridLayout: " + n + "[" + i2 + "].i must be unique!");
    if (e2.push(s2.i), s2.static !== void 0 && typeof s2.static != "boolean")
      throw new Error("VueGridLayout: " + n + "[" + i2 + "].static must be a boolean!");
  }
}
function K(r2, n = "vgl") {
  const t2 = () => `${n}-${r2}`;
  return {
    b: t2,
    be: (s2) => `${t2()}__${s2}`,
    bm: (s2) => `${t2()}--${s2}`,
    bem: (s2, f) => `${t2()}__${s2}--${f}`
  };
}
function a(t2) {
  return c(t2);
}
function c(t2) {
  var f;
  const n = ((f = t2.target) == null ? void 0 : f.offsetParent) || document.body, e2 = t2.offsetParent === document.body ? { left: 0, top: 0 } : n.getBoundingClientRect(), o = t2.clientX + n.scrollLeft - e2.left, r2 = t2.clientY + n.scrollTop - e2.top;
  return { x: o, y: r2 };
}
function i(t2, n, e2, o) {
  return s(t2) ? {
    deltaX: e2 - t2,
    deltaY: o - n,
    lastX: t2,
    lastY: n,
    x: e2,
    y: o
  } : {
    deltaX: 0,
    deltaY: 0,
    lastX: e2,
    lastY: o,
    x: e2,
    y: o
  };
}
function s(t2) {
  return typeof t2 == "number" && !Number.isNaN(t2);
}
function y(t2, e2) {
  const o = d(t2);
  let n = o[0];
  for (let r2 = 1, c2 = o.length; r2 < c2; r2++) {
    const i2 = o[r2];
    e2 > t2[i2] && (n = i2);
  }
  return n;
}
function B(t2, e2) {
  if (!e2[t2])
    throw new Error(
      "ResponsiveGridLayout: `cols` entry for breakpoint " + t2 + " is missing!"
    );
  return e2[t2];
}
function v(t2, e2, o, n, r2, c2, i2) {
  if (e2[n]) return Y(e2[n]);
  let s2 = t2;
  const u = d(o), l = u.slice(u.indexOf(n));
  for (let f = 0, g2 = l.length; f < g2; f++) {
    const a2 = l[f];
    if (e2[a2]) {
      s2 = e2[a2];
      break;
    }
  }
  return s2 = Y(s2 || []), $(_(s2, { cols: c2 }), i2);
}
function d(t2) {
  return Object.keys(t2).sort((o, n) => t2[o] - t2[n]);
}
let t = "auto";
function e() {
  return typeof document < "u";
}
function r() {
  return e() ? typeof document.dir < "u" ? document.dir : document.getElementsByTagName("html")[0].getAttribute("dir") : t;
}
const ot = /* @__PURE__ */ defineComponent({
  __name: "grid-item",
  props: {
    isDraggable: { type: Boolean, default: void 0 },
    isResizable: { type: Boolean, default: void 0 },
    isBounded: { type: Boolean, default: void 0 },
    static: { type: Boolean, default: false },
    minH: { default: 1 },
    minW: { default: 1 },
    maxH: { default: 1 / 0 },
    maxW: { default: 1 / 0 },
    x: {},
    y: {},
    w: {},
    h: {},
    i: {},
    dragIgnoreFrom: { default: "a, button" },
    dragAllowFrom: { default: void 0 },
    resizeIgnoreFrom: { default: "a, button" },
    preserveAspectRatio: { type: Boolean, default: false },
    dragOption: { default: () => ({}) },
    resizeOption: { default: () => ({}) }
  },
  emits: ["container-resized", "resize", "resized", "move", "moved"],
  setup(Me2, { expose: We2, emit: Be2 }) {
    const i$1 = Me2, M = Be2, l = inject(T), g2 = inject(v$1);
    if (!l)
      throw new Error("[grid-layout-plus]: missing layout store, GridItem must under a GridLayout.");
    const d2 = ref(null), e2 = reactive({
      cols: 1,
      containerWidth: 100,
      rowHeight: 30,
      margin: [10, 10],
      maxRows: 1 / 0,
      draggable: void 0,
      resizable: void 0,
      bounded: void 0,
      transformScale: 1,
      useCssTransforms: true,
      useStyleCursor: true,
      isDragging: false,
      dragging: {
        top: -1,
        left: -1
      },
      isResizing: false,
      resizing: {
        width: -1,
        height: -1
      },
      style: {},
      rtl: false
    });
    let X2 = false, _2 = false, $2 = NaN, G$1 = NaN, k2 = NaN, E2 = NaN, j = -1, K$1 = -1, V$1 = -1, q = -1, h2 = i$1.x, v2 = i$1.y, p = i$1.w, y2 = i$1.h;
    const W2 = ref(), J = reactive({
      i: toRef(i$1, "i"),
      state: e2,
      wrapper: W2,
      calcXY: A2
    });
    function Q(t2) {
      Ie(t2);
    }
    function Z2() {
      de();
    }
    function U(t2) {
      ie(i$1.isDraggable) && (e2.draggable = t2);
    }
    function ee(t2) {
      ie(i$1.isResizable) && (e2.resizable = t2);
    }
    function te(t2) {
      ie(i$1.isBounded) && (e2.bounded = t2);
    }
    function ie$1(t2) {
      e2.transformScale = t2;
    }
    function ae2(t2) {
      e2.rowHeight = t2;
    }
    function re2(t2) {
      e2.maxRows = t2;
    }
    function ne() {
      e2.rtl = r() === "rtl", de();
    }
    function oe2(t2) {
      e2.cols = Math.floor(t2);
    }
    l.increaseItem(J), onBeforeMount(() => {
      e2.rtl = r() === "rtl";
    }), onMounted(() => {
      l.responsive && l.lastBreakpoint ? e2.cols = B(l.lastBreakpoint, l.cols) : e2.cols = l.colNum, e2.rowHeight = l.rowHeight, e2.containerWidth = l.width !== null ? l.width : 100, e2.margin = l.margin !== void 0 ? l.margin.map(Number) : [10, 10], e2.maxRows = l.maxRows, ie(i$1.isDraggable) ? e2.draggable = l.isDraggable : e2.draggable = i$1.isDraggable, ie(i$1.isResizable) ? e2.resizable = l.isResizable : e2.resizable = i$1.isResizable, ie(i$1.isBounded) ? e2.bounded = l.isBounded : e2.bounded = i$1.isBounded, e2.transformScale = l.transformScale, e2.useCssTransforms = l.useCssTransforms, e2.useStyleCursor = l.useStyleCursor, watchEffect(() => {
        h2 = i$1.x, v2 = i$1.y, y2 = i$1.h, p = i$1.w, oo(H);
      }), g2.on("updateWidth", Q), g2.on("compact", Z2), g2.on("setDraggable", U), g2.on("setResizable", ee), g2.on("setBounded", te), g2.on("setTransformScale", ie$1), g2.on("setRowHeight", ae2), g2.on("setMaxRows", re2), g2.on("directionchange", ne), g2.on("setColNum", oe2);
    }), onBeforeUnmount(() => {
      g2.off("updateWidth", Q), g2.off("compact", Z2), g2.off("setDraggable", U), g2.off("setResizable", ee), g2.off("setBounded", te), g2.off("setTransformScale", ie$1), g2.off("setRowHeight", ae2), g2.off("setMaxRows", re2), g2.off("directionchange", ne), g2.off("setColNum", oe2), d2.value && (d2.value.unset(), d2.value = null), l.decreaseItem(J);
    }), We2({ state: e2, wrapper: W2 });
    const Ce2 = typeof navigator < "u" ? navigator.userAgent.toLowerCase().includes("android") : false, se = computed(() => e2.resizable && !i$1.static), m = computed(() => l.isMirrored ? !e2.rtl : e2.rtl), De2 = computed(() => (e2.draggable || e2.resizable) && !i$1.static), z = K("item"), Ne2 = computed(() => ({
      [z.b()]: true,
      [z.bm("resizable")]: se.value,
      [z.bm("static")]: i$1.static,
      [z.bm("resizing")]: e2.isResizing,
      [z.bm("dragging")]: e2.isDragging,
      [z.bm("transform")]: e2.useCssTransforms,
      [z.bm("rtl")]: m.value,
      [z.bm("no-touch")]: Ce2 && De2.value
    })), T$1 = computed(() => [z.be("resizer"), m.value && z.bem("resizer", "rtl")].filter(Boolean));
    watch(
      () => i$1.isDraggable,
      (t2) => {
        e2.draggable = t2;
      }
    ), watch(
      () => i$1.static,
      () => {
        oo(ue), oo(S);
      }
    ), watch(
      () => e2.draggable,
      () => {
        oo(ue);
      }
    ), watch(
      () => i$1.isResizable,
      (t2) => {
        e2.resizable = t2;
      }
    ), watch(
      () => i$1.isBounded,
      (t2) => {
        e2.bounded = t2;
      }
    ), watch(
      () => e2.resizable,
      () => {
        oo(S);
      }
    ), watch(
      () => e2.rowHeight,
      () => {
        oo(H), oo(F);
      }
    ), watch([() => e2.cols, () => e2.containerWidth], () => {
      oo(S), oo(H), oo(F);
    }), watch([() => i$1.minH, () => i$1.maxH, () => i$1.minW, () => i$1.maxW], () => {
      oo(S);
    }), watch(m, () => {
      oo(S), oo(H);
    }), watch([() => l.margin, () => l.margin[0], () => l.margin[1]], () => {
      const t2 = l.margin;
      !t2 || t2[0] === e2.margin[0] && t2[1] === e2.margin[1] || (e2.margin = t2.map(Number), oo(H), oo(F));
    });
    function H() {
      i$1.x + i$1.w > e2.cols ? (h2 = 0, p = i$1.w > e2.cols ? e2.cols : i$1.w) : (h2 = i$1.x, p = i$1.w);
      const t2 = B$1(h2, v2, p, y2);
      e2.isDragging && (t2.top = e2.dragging.top, m.value ? t2.right = e2.dragging.left : t2.left = e2.dragging.left), e2.isResizing && (t2.width = e2.resizing.width, t2.height = e2.resizing.height);
      let r2;
      e2.useCssTransforms ? m.value ? r2 = O(t2.top, t2.right, t2.width, t2.height) : r2 = G(t2.top, t2.left, t2.width, t2.height) : m.value ? r2 = V(t2.top, t2.right, t2.width, t2.height) : r2 = R(t2.top, t2.left, t2.width, t2.height), e2.style = r2;
    }
    function F() {
      const t2 = {};
      for (const r2 of ["width", "height"]) {
        const o = e2.style[r2].match(/^(\d+)px$/);
        if (!o)
          return;
        t2[r2] = o[1];
      }
      M("container-resized", i$1.i, i$1.h, i$1.w, t2.height, t2.width);
    }
    function le(t2) {
      if (i$1.static) return;
      const r2 = t2.type;
      if (r2 === "resizestart" && e2.isResizing || r2 !== "resizestart" && !e2.isResizing)
        return;
      const s2 = a(t2);
      if (ie(s2)) return;
      const { x: o, y: c2 } = s2, n = { width: 0, height: 0 };
      let a$12;
      switch (r2) {
        case "resizestart": {
          S(), j = p, K$1 = y2, a$12 = B$1(h2, v2, p, y2), n.width = a$12.width, n.height = a$12.height, e2.resizing = n, e2.isResizing = true;
          break;
        }
        case "resizemove": {
          !t2.edges.right && !t2.edges.left && (k2 = o), !t2.edges.top && !t2.edges.bottom && (E2 = c2);
          const u = i(k2, E2, o, c2);
          m.value ? n.width = e2.resizing.width - u.deltaX / e2.transformScale : n.width = e2.resizing.width + u.deltaX / e2.transformScale, n.height = e2.resizing.height + u.deltaY / e2.transformScale, e2.resizing = n;
          break;
        }
        case "resizeend": {
          a$12 = B$1(h2, v2, p, y2), n.width = a$12.width, n.height = a$12.height, e2.resizing = { width: -1, height: -1 }, e2.isResizing = false;
          break;
        }
      }
      a$12 = Te(n.height, n.width), a$12.w < i$1.minW && (a$12.w = i$1.minW), a$12.w > i$1.maxW && (a$12.w = i$1.maxW), a$12.h < i$1.minH && (a$12.h = i$1.minH), a$12.h > i$1.maxH && (a$12.h = i$1.maxH), a$12.h < 1 && (a$12.h = 1), a$12.w < 1 && (a$12.w = 1), k2 = o, E2 = c2, (p !== a$12.w || y2 !== a$12.h) && M("resize", i$1.i, a$12.h, a$12.w, n.height, n.width), t2.type === "resizeend" && (j !== p || K$1 !== y2) && M("resized", i$1.i, a$12.h, a$12.w, n.height, n.width), g2.emit("resizeEvent", t2.type, i$1.i, h2, v2, a$12.h, a$12.w);
    }
    function ge2(t2) {
      if (i$1.static || e2.isResizing) return;
      const r2 = t2.type;
      if (r2 === "dragstart" && e2.isDragging || r2 !== "dragstart" && !e2.isDragging)
        return;
      const s2 = a(t2);
      if (ie(s2)) return;
      const { x: o, y: c2 } = s2, n = t2.target;
      if (!n.offsetParent) return;
      const a$12 = { top: 0, left: 0 };
      switch (r2) {
        case "dragstart": {
          V$1 = h2, q = v2;
          const w = n.offsetParent.getBoundingClientRect(), R2 = n.getBoundingClientRect(), C2 = R2.left / e2.transformScale, D2 = w.left / e2.transformScale, P2 = R2.right / e2.transformScale, Y2 = w.right / e2.transformScale, L2 = R2.top / e2.transformScale, O2 = w.top / e2.transformScale;
          m.value ? a$12.left = (P2 - Y2) * -1 : a$12.left = C2 - D2, a$12.top = L2 - O2, e2.dragging = a$12, e2.isDragging = true;
          break;
        }
        case "dragmove": {
          const w = i($2, G$1, o, c2);
          if (m.value ? a$12.left = e2.dragging.left - w.deltaX / e2.transformScale : a$12.left = e2.dragging.left + w.deltaX / e2.transformScale, a$12.top = e2.dragging.top + w.deltaY / e2.transformScale, e2.bounded) {
            const R2 = n.offsetParent.clientHeight - ce(i$1.h, e2.rowHeight, e2.margin[1]);
            a$12.top = fe2(a$12.top, 0, R2);
            const C2 = I(), D2 = e2.containerWidth - ce(i$1.w, C2, e2.margin[0]);
            a$12.left = fe2(a$12.left, 0, D2);
          }
          e2.dragging = a$12;
          break;
        }
        case "dragend": {
          const w = n.offsetParent.getBoundingClientRect(), R2 = n.getBoundingClientRect(), C2 = R2.left / e2.transformScale, D2 = w.left / e2.transformScale, P2 = R2.right / e2.transformScale, Y2 = w.right / e2.transformScale, L2 = R2.top / e2.transformScale, O2 = w.top / e2.transformScale;
          m.value ? a$12.left = (P2 - Y2) * -1 : a$12.left = C2 - D2, a$12.top = L2 - O2, e2.dragging = { top: -1, left: -1 }, e2.isDragging = false;
          break;
        }
      }
      let u;
      m.value, u = A2(a$12.top, a$12.left), $2 = o, G$1 = c2, (h2 !== u.x || v2 !== u.y) && M("move", i$1.i, u.x, u.y), t2.type === "dragend" && (V$1 !== h2 || q !== v2) && M("moved", i$1.i, u.x, u.y), g2.emit("dragEvent", t2.type, i$1.i, u.x, u.y, y2, p);
    }
    function B$1(t2, r2, s2, o) {
      const c2 = I();
      let n;
      return m.value ? n = {
        right: Math.round(c2 * t2 + (t2 + 1) * e2.margin[0]),
        top: Math.round(e2.rowHeight * r2 + (r2 + 1) * e2.margin[1]),
        // 0 * Infinity === NaN, which causes problems with resize constraints;
        // Fix this if it occurs.
        // Note we do it here rather than later because Math.round(Infinity) causes depot
        width: s2 === 1 / 0 ? s2 : Math.round(c2 * s2 + Math.max(0, s2 - 1) * e2.margin[0]),
        height: o === 1 / 0 ? o : Math.round(e2.rowHeight * o + Math.max(0, o - 1) * e2.margin[1])
      } : n = {
        left: Math.round(c2 * t2 + (t2 + 1) * e2.margin[0]),
        top: Math.round(e2.rowHeight * r2 + (r2 + 1) * e2.margin[1]),
        // 0 * Infinity === NaN, which causes problems with resize constraints;
        // Fix this if it occurs.
        // Note we do it here rather than later because Math.round(Infinity) causes depot
        width: s2 === 1 / 0 ? s2 : Math.round(c2 * s2 + Math.max(0, s2 - 1) * e2.margin[0]),
        height: o === 1 / 0 ? o : Math.round(e2.rowHeight * o + Math.max(0, o - 1) * e2.margin[1])
      }, n;
    }
    function A2(t2, r2) {
      const s2 = I();
      let o = Math.round((r2 - e2.margin[0]) / (s2 + e2.margin[0])), c2 = Math.round((t2 - e2.margin[1]) / (e2.rowHeight + e2.margin[1]));
      return o = Math.max(Math.min(o, e2.cols - p), 0), c2 = Math.max(Math.min(c2, e2.maxRows - y2), 0), { x: o, y: c2 };
    }
    function I() {
      return (e2.containerWidth - e2.margin[0] * (e2.cols + 1)) / e2.cols;
    }
    function ce(t2, r2, s2) {
      return Number.isFinite(t2) ? Math.round(r2 * t2 + Math.max(0, t2 - 1) * s2) : t2;
    }
    function fe2(t2, r2, s2) {
      return Math.max(Math.min(t2, s2), r2);
    }
    function Te(t2, r2, s2 = false) {
      const o = I();
      let c2 = Math.round((r2 + e2.margin[0]) / (o + e2.margin[0])), n = 0;
      return s2 ? n = Math.ceil((t2 + e2.margin[1]) / (e2.rowHeight + e2.margin[1])) : n = Math.round((t2 + e2.margin[1]) / (e2.rowHeight + e2.margin[1])), c2 = Math.max(Math.min(c2, e2.cols - h2), 0), n = Math.max(Math.min(n, e2.maxRows - v2), 0), { w: c2, h: n };
    }
    function Ie(t2, r2) {
      e2.containerWidth = t2;
    }
    function de() {
      H();
    }
    function me() {
      !d2.value && W2.value && (d2.value = interact(W2.value), e2.useStyleCursor || d2.value.styleCursor(false));
    }
    const ke2 = eo(ge2);
    function ue() {
      if (me(), !!d2.value)
        if (e2.draggable && !i$1.static) {
          const t2 = __spreadValues({
            ignoreFrom: i$1.dragIgnoreFrom,
            allowFrom: i$1.dragAllowFrom
          }, i$1.dragOption);
          d2.value.draggable(t2), X2 || (X2 = true, d2.value.on("dragstart dragmove dragend", (r2) => {
            r2.type === "dragmove" ? ke2(r2) : ge2(r2);
          }));
        } else
          d2.value.draggable({ enabled: false });
    }
    const Ee = eo(le);
    function S() {
      if (me(), !!d2.value)
        if (e2.resizable && !i$1.static) {
          const t2 = B$1(0, 0, i$1.maxW, i$1.maxH), r2 = B$1(0, 0, i$1.minW, i$1.minH), s2 = __spreadValues({
            edges: {
              left: m.value ? `.${T$1.value[0]}` : false,
              right: m.value ? false : `.${T$1.value[0]}`,
              bottom: `.${T$1.value[0]}`,
              top: false
            },
            ignoreFrom: i$1.resizeIgnoreFrom,
            restrictSize: {
              min: {
                height: r2.height * e2.transformScale,
                width: r2.width * e2.transformScale
              },
              max: {
                height: t2.height * e2.transformScale,
                width: t2.width * e2.transformScale
              }
            }
          }, i$1.resizeOption);
          i$1.preserveAspectRatio && (s2.modifiers = [interact.modifiers.aspectRatio({ ratio: "preserve" })]), d2.value.resizable(s2), _2 || (_2 = true, d2.value.on("resizestart resizemove resizeend", (o) => {
            o.type === "resizemove" ? Ee(o) : le(o);
          }));
        } else
          d2.value.resizable({ enabled: false });
    }
    return (t2, r2) => (openBlock(), createElementBlock("section", {
      ref_key: "wrapper",
      ref: W2,
      class: normalizeClass(Ne2.value),
      style: normalizeStyle(e2.style)
    }, [
      renderSlot(t2.$slots, "default"),
      se.value ? (openBlock(), createElementBlock("span", {
        key: 0,
        class: normalizeClass(T$1.value)
      }, null, 2)) : createCommentVNode("", true)
    ], 6));
  }
});
const D = typeof window < "u";
var pt;
D && ((pt = window == null ? void 0 : window.navigator) != null && pt.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function Be(e2) {
  return e2 != null;
}
function P() {
}
const xn = Object.freeze({
  aliceblue: "f0f8ff",
  antiquewhite: "faebd7",
  aqua: "0ff",
  aquamarine: "7fffd4",
  azure: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "000",
  blanchedalmond: "ffebcd",
  blue: "00f",
  blueviolet: "8a2be2",
  brown: "a52a2a",
  burlywood: "deb887",
  burntsienna: "ea7e5d",
  cadetblue: "5f9ea0",
  chartreuse: "7fff00",
  chocolate: "d2691e",
  coral: "ff7f50",
  cornflowerblue: "6495ed",
  cornsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "0ff",
  darkblue: "00008b",
  darkcyan: "008b8b",
  darkgoldenrod: "b8860b",
  darkgray: "a9a9a9",
  darkgreen: "006400",
  darkgrey: "a9a9a9",
  darkkhaki: "bdb76b",
  darkmagenta: "8b008b",
  darkolivegreen: "556b2f",
  darkorange: "ff8c00",
  darkorchid: "9932cc",
  darkred: "8b0000",
  darksalmon: "e9967a",
  darkseagreen: "8fbc8f",
  darkslateblue: "483d8b",
  darkslategray: "2f4f4f",
  darkslategrey: "2f4f4f",
  darkturquoise: "00ced1",
  darkviolet: "9400d3",
  deeppink: "ff1493",
  deepskyblue: "00bfff",
  dimgray: "696969",
  dimgrey: "696969",
  dodgerblue: "1e90ff",
  firebrick: "b22222",
  floralwhite: "fffaf0",
  forestgreen: "228b22",
  fuchsia: "f0f",
  gainsboro: "dcdcdc",
  ghostwhite: "f8f8ff",
  gold: "ffd700",
  goldenrod: "daa520",
  gray: "808080",
  green: "008000",
  greenyellow: "adff2f",
  grey: "808080",
  honeydew: "f0fff0",
  hotpink: "ff69b4",
  indianred: "cd5c5c",
  indigo: "4b0082",
  ivory: "fffff0",
  khaki: "f0e68c",
  lavender: "e6e6fa",
  lavenderblush: "fff0f5",
  lawngreen: "7cfc00",
  lemonchiffon: "fffacd",
  lightblue: "add8e6",
  lightcoral: "f08080",
  lightcyan: "e0ffff",
  lightgoldenrodyellow: "fafad2",
  lightgray: "d3d3d3",
  lightgreen: "90ee90",
  lightgrey: "d3d3d3",
  lightpink: "ffb6c1",
  lightsalmon: "ffa07a",
  lightseagreen: "20b2aa",
  lightskyblue: "87cefa",
  lightslategray: "789",
  lightslategrey: "789",
  lightsteelblue: "b0c4de",
  lightyellow: "ffffe0",
  lime: "0f0",
  limegreen: "32cd32",
  linen: "faf0e6",
  magenta: "f0f",
  maroon: "800000",
  mediumaquamarine: "66cdaa",
  mediumblue: "0000cd",
  mediumorchid: "ba55d3",
  mediumpurple: "9370db",
  mediumseagreen: "3cb371",
  mediumslateblue: "7b68ee",
  mediumspringgreen: "00fa9a",
  mediumturquoise: "48d1cc",
  mediumvioletred: "c71585",
  midnightblue: "191970",
  mintcream: "f5fffa",
  mistyrose: "ffe4e1",
  moccasin: "ffe4b5",
  navajowhite: "ffdead",
  navy: "000080",
  oldlace: "fdf5e6",
  olive: "808000",
  olivedrab: "6b8e23",
  orange: "ffa500",
  orangered: "ff4500",
  orchid: "da70d6",
  palegoldenrod: "eee8aa",
  palegreen: "98fb98",
  paleturquoise: "afeeee",
  palevioletred: "db7093",
  papayawhip: "ffefd5",
  peachpuff: "ffdab9",
  peru: "cd853f",
  pink: "ffc0cb",
  plum: "dda0dd",
  powderblue: "b0e0e6",
  purple: "800080",
  rebeccapurple: "663399",
  red: "f00",
  rosybrown: "bc8f8f",
  royalblue: "4169e1",
  saddlebrown: "8b4513",
  salmon: "fa8072",
  sandybrown: "f4a460",
  seagreen: "2e8b57",
  seashell: "fff5ee",
  sienna: "a0522d",
  silver: "c0c0c0",
  skyblue: "87ceeb",
  slateblue: "6a5acd",
  slategray: "708090",
  slategrey: "708090",
  snow: "fffafa",
  springgreen: "00ff7f",
  steelblue: "4682b4",
  tan: "d2b48c",
  teal: "008080",
  thistle: "d8bfd8",
  tomato: "ff6347",
  turquoise: "40e0d0",
  violet: "ee82ee",
  wheat: "f5deb3",
  white: "fff",
  whitesmoke: "f5f5f5",
  yellow: "ff0",
  yellowgreen: "9acd32"
});
Object.freeze(new Set(Object.keys(xn)));
const Tn = D && ("ontouchstart" in window || On() > 0), Sn = Tn ? "pointerdown" : "click";
function On() {
  return typeof navigator < "u" && (navigator.maxTouchPoints || navigator.msMaxTouchPoints) || 0;
}
function zn(e2, t2, n = window.Event) {
  const _a = t2, { type: r2, bubbles: o = false, cancelable: i2 = false } = _a, s2 = __objRest(_a, ["type", "bubbles", "cancelable"]);
  if (!Be(r2) || r2 === "") return false;
  let c2;
  return Be(n) ? c2 = new n(r2, { bubbles: o, cancelable: i2 }) : (c2 = document.createEvent("HTMLEvents"), c2.initEvent(r2, o, i2)), Object.assign(c2, s2), e2.dispatchEvent(c2);
}
const qt = "clickoutside", Ue = /* @__PURE__ */ new Set();
D && document.addEventListener(
  Sn,
  (e2) => {
    const t2 = e2.target, n = e2.composedPath && e2.composedPath();
    Ue.forEach((r2) => {
      r2 !== t2 && (n ? !n.includes(r2) : !r2.contains(t2)) && (!r2.__transferElement || r2.__transferElement !== t2 && !r2.__transferElement.contains(t2)) && zn(r2, { type: qt });
    });
  },
  true
);
const Ln = [
  [
    "requestFullscreen",
    "exitFullscreen",
    "fullscreenElement",
    "fullscreenEnabled",
    "fullscreenchange",
    "fullscreenerror"
  ],
  // New WebKit
  [
    "webkitRequestFullscreen",
    "webkitExitFullscreen",
    "webkitFullscreenElement",
    "webkitFullscreenEnabled",
    "webkitfullscreenchange",
    "webkitfullscreenerror"
  ],
  // Old WebKit
  [
    "webkitRequestFullScreen",
    "webkitCancelFullScreen",
    "webkitCurrentFullScreenElement",
    "webkitCancelFullScreen",
    "webkitfullscreenchange",
    "webkitfullscreenerror"
  ],
  [
    "mozRequestFullScreen",
    "mozCancelFullScreen",
    "mozFullScreenElement",
    "mozFullScreenEnabled",
    "mozfullscreenchange",
    "mozfullscreenerror"
  ],
  [
    "msRequestFullscreen",
    "msExitFullscreen",
    "msFullscreenElement",
    "msFullscreenEnabled",
    "MSFullscreenChange",
    "MSFullscreenError"
  ]
];
let ae;
if (D) {
  for (const e2 of Ln)
    if (e2[1] in document) {
      ae = e2;
      break;
    }
}
({
  full: computed(() => false)
});
const Xt = /* @__PURE__ */ new Set(), Je = /* @__PURE__ */ new WeakMap();
if (D && ae) {
  const e2 = ae[2], t2 = ae[4];
  document.addEventListener(
    t2,
    () => {
      if (Xt.forEach((n) => {
        n.value = false;
      }), document[e2]) {
        const n = Je.get(document[e2]);
        n && (n.value = true);
      }
    },
    false
  );
}
const Z = /* @__PURE__ */ new Map();
Z.set("x", 0);
Z.set("y", 0);
var re = [], Or = function() {
  return re.some(function(e2) {
    return e2.activeTargets.length > 0;
  });
}, zr = function() {
  return re.some(function(e2) {
    return e2.skippedTargets.length > 0;
  });
}, Ot = "ResizeObserver loop completed with undelivered notifications.", kr = function() {
  var e2;
  typeof ErrorEvent == "function" ? e2 = new ErrorEvent("error", {
    message: Ot
  }) : (e2 = document.createEvent("Event"), e2.initEvent("error", false, false), e2.message = Ot), window.dispatchEvent(e2);
}, we;
(function(e2) {
  e2.BORDER_BOX = "border-box", e2.CONTENT_BOX = "content-box", e2.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box";
})(we || (we = {}));
var oe = function(e2) {
  return Object.freeze(e2);
}, Ar = /* @__PURE__ */ (function() {
  function e2(t2, n) {
    this.inlineSize = t2, this.blockSize = n, oe(this);
  }
  return e2;
})(), on = (function() {
  function e2(t2, n, r2, o) {
    return this.x = t2, this.y = n, this.width = r2, this.height = o, this.top = this.y, this.left = this.x, this.bottom = this.top + this.height, this.right = this.left + this.width, oe(this);
  }
  return e2.prototype.toJSON = function() {
    var t2 = this, n = t2.x, r2 = t2.y, o = t2.top, i2 = t2.right, s2 = t2.bottom, c2 = t2.left, a2 = t2.width, l = t2.height;
    return { x: n, y: r2, top: o, right: i2, bottom: s2, left: c2, width: a2, height: l };
  }, e2.fromRect = function(t2) {
    return new e2(t2.x, t2.y, t2.width, t2.height);
  }, e2;
})(), dt = function(e2) {
  return e2 instanceof SVGElement && "getBBox" in e2;
}, sn = function(e2) {
  if (dt(e2)) {
    var t2 = e2.getBBox(), n = t2.width, r2 = t2.height;
    return !n && !r2;
  }
  var o = e2, i2 = o.offsetWidth, s2 = o.offsetHeight;
  return !(i2 || s2 || e2.getClientRects().length);
}, zt = function(e2) {
  var t2;
  if (e2 instanceof Element)
    return true;
  var n = (t2 = e2 == null ? void 0 : e2.ownerDocument) === null || t2 === void 0 ? void 0 : t2.defaultView;
  return !!(n && e2 instanceof n.Element);
}, Cr = function(e2) {
  switch (e2.tagName) {
    case "INPUT":
      if (e2.type !== "image")
        break;
    case "VIDEO":
    case "AUDIO":
    case "EMBED":
    case "OBJECT":
    case "CANVAS":
    case "IFRAME":
    case "IMG":
      return true;
  }
  return false;
}, ge = typeof window < "u" ? window : {}, ke = /* @__PURE__ */ new WeakMap(), kt = /auto|scroll/, Mr = /^tb|vertical/, Lr = /msie|trident/i.test(ge.navigator && ge.navigator.userAgent), X = function(e2) {
  return parseFloat(e2 || "0");
}, fe = function(e2, t2, n) {
  return e2 === void 0 && (e2 = 0), t2 === void 0 && (t2 = 0), n === void 0 && (n = false), new Ar((n ? t2 : e2) || 0, (n ? e2 : t2) || 0);
}, At = oe({
  devicePixelContentBoxSize: fe(),
  borderBoxSize: fe(),
  contentBoxSize: fe(),
  contentRect: new on(0, 0, 0, 0)
}), cn = function(e2, t2) {
  if (t2 === void 0 && (t2 = false), ke.has(e2) && !t2)
    return ke.get(e2);
  if (sn(e2))
    return ke.set(e2, At), At;
  var n = getComputedStyle(e2), r2 = dt(e2) && e2.ownerSVGElement && e2.getBBox(), o = !Lr && n.boxSizing === "border-box", i2 = Mr.test(n.writingMode || ""), s2 = !r2 && kt.test(n.overflowY || ""), c2 = !r2 && kt.test(n.overflowX || ""), a2 = r2 ? 0 : X(n.paddingTop), l = r2 ? 0 : X(n.paddingRight), f = r2 ? 0 : X(n.paddingBottom), d2 = r2 ? 0 : X(n.paddingLeft), v2 = r2 ? 0 : X(n.borderTopWidth), m = r2 ? 0 : X(n.borderRightWidth), b2 = r2 ? 0 : X(n.borderBottomWidth), g2 = r2 ? 0 : X(n.borderLeftWidth), p = d2 + l, h2 = a2 + f, u = g2 + m, y2 = v2 + b2, O2 = c2 ? e2.offsetHeight - y2 - e2.clientHeight : 0, T2 = s2 ? e2.offsetWidth - u - e2.clientWidth : 0, S = o ? p + u : 0, C2 = o ? h2 + y2 : 0, k2 = r2 ? r2.width : X(n.width) - S - T2, M = r2 ? r2.height : X(n.height) - C2 - O2, L2 = k2 + p + T2 + u, $2 = M + h2 + O2 + y2, _2 = oe({
    devicePixelContentBoxSize: fe(Math.round(k2 * devicePixelRatio), Math.round(M * devicePixelRatio), i2),
    borderBoxSize: fe(L2, $2, i2),
    contentBoxSize: fe(k2, M, i2),
    contentRect: new on(d2, a2, k2, M)
  });
  return ke.set(e2, _2), _2;
}, an = function(e2, t2, n) {
  var r2 = cn(e2, n), o = r2.borderBoxSize, i2 = r2.contentBoxSize, s2 = r2.devicePixelContentBoxSize;
  switch (t2) {
    case we.DEVICE_PIXEL_CONTENT_BOX:
      return s2;
    case we.BORDER_BOX:
      return o;
    default:
      return i2;
  }
}, Br = /* @__PURE__ */ (function() {
  function e2(t2) {
    var n = cn(t2);
    this.target = t2, this.contentRect = n.contentRect, this.borderBoxSize = oe([n.borderBoxSize]), this.contentBoxSize = oe([n.contentBoxSize]), this.devicePixelContentBoxSize = oe([n.devicePixelContentBoxSize]);
  }
  return e2;
})(), ln = function(e2) {
  if (sn(e2))
    return 1 / 0;
  for (var t2 = 0, n = e2.parentNode; n; )
    t2 += 1, n = n.parentNode;
  return t2;
}, Pr = function() {
  var e2 = 1 / 0, t2 = [];
  re.forEach(function(s2) {
    if (s2.activeTargets.length !== 0) {
      var c2 = [];
      s2.activeTargets.forEach(function(l) {
        var f = new Br(l.target), d2 = ln(l.target);
        c2.push(f), l.lastReportedSize = an(l.target, l.observedBox), d2 < e2 && (e2 = d2);
      }), t2.push(function() {
        s2.callback.call(s2.observer, c2, s2.observer);
      }), s2.activeTargets.splice(0, s2.activeTargets.length);
    }
  });
  for (var n = 0, r2 = t2; n < r2.length; n++) {
    var o = r2[n];
    o();
  }
  return e2;
}, Ct = function(e2) {
  re.forEach(function(n) {
    n.activeTargets.splice(0, n.activeTargets.length), n.skippedTargets.splice(0, n.skippedTargets.length), n.observationTargets.forEach(function(o) {
      o.isActive() && (ln(o.target) > e2 ? n.activeTargets.push(o) : n.skippedTargets.push(o));
    });
  });
}, Fr = function() {
  var e2 = 0;
  for (Ct(e2); Or(); )
    e2 = Pr(), Ct(e2);
  return zr() && kr(), e2 > 0;
}, je, fn = [], Dr = function() {
  return fn.splice(0).forEach(function(e2) {
    return e2();
  });
}, _r = function(e2) {
  if (!je) {
    var t2 = 0, n = document.createTextNode(""), r2 = { characterData: true };
    new MutationObserver(function() {
      return Dr();
    }).observe(n, r2), je = function() {
      n.textContent = "".concat(t2 ? t2-- : t2++);
    };
  }
  fn.push(e2), je();
}, Nr = function(e2) {
  _r(function() {
    requestAnimationFrame(e2);
  });
}, Me = 0, Wr = function() {
  return !!Me;
}, Ir = 250, Hr = { attributes: true, characterData: true, childList: true, subtree: true }, Mt = [
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
], Lt = function(e2) {
  return e2 === void 0 && (e2 = 0), Date.now() + e2;
}, Ye = false, $r = (function() {
  function e2() {
    var t2 = this;
    this.stopped = true, this.listener = function() {
      return t2.schedule();
    };
  }
  return e2.prototype.run = function(t2) {
    var n = this;
    if (t2 === void 0 && (t2 = Ir), !Ye) {
      Ye = true;
      var r2 = Lt(t2);
      Nr(function() {
        var o = false;
        try {
          o = Fr();
        } finally {
          if (Ye = false, t2 = r2 - Lt(), !Wr())
            return;
          o ? n.run(1e3) : t2 > 0 ? n.run(t2) : n.start();
        }
      });
    }
  }, e2.prototype.schedule = function() {
    this.stop(), this.run();
  }, e2.prototype.observe = function() {
    var t2 = this, n = function() {
      return t2.observer && t2.observer.observe(document.body, Hr);
    };
    document.body ? n() : ge.addEventListener("DOMContentLoaded", n);
  }, e2.prototype.start = function() {
    var t2 = this;
    this.stopped && (this.stopped = false, this.observer = new MutationObserver(this.listener), this.observe(), Mt.forEach(function(n) {
      return ge.addEventListener(n, t2.listener, true);
    }));
  }, e2.prototype.stop = function() {
    var t2 = this;
    this.stopped || (this.observer && this.observer.disconnect(), Mt.forEach(function(n) {
      return ge.removeEventListener(n, t2.listener, true);
    }), this.stopped = true);
  }, e2;
})(), tt = new $r(), Bt = function(e2) {
  !Me && e2 > 0 && tt.start(), Me += e2, !Me && tt.stop();
}, qr = function(e2) {
  return !dt(e2) && !Cr(e2) && getComputedStyle(e2).display === "inline";
}, Vr = (function() {
  function e2(t2, n) {
    this.target = t2, this.observedBox = n || we.CONTENT_BOX, this.lastReportedSize = {
      inlineSize: 0,
      blockSize: 0
    };
  }
  return e2.prototype.isActive = function() {
    var t2 = an(this.target, this.observedBox, true);
    return qr(this.target) && (this.lastReportedSize = t2), this.lastReportedSize.inlineSize !== t2.inlineSize || this.lastReportedSize.blockSize !== t2.blockSize;
  }, e2;
})(), Xr = /* @__PURE__ */ (function() {
  function e2(t2, n) {
    this.activeTargets = [], this.skippedTargets = [], this.observationTargets = [], this.observer = t2, this.callback = n;
  }
  return e2;
})(), Ae = /* @__PURE__ */ new WeakMap(), Pt = function(e2, t2) {
  for (var n = 0; n < e2.length; n += 1)
    if (e2[n].target === t2)
      return n;
  return -1;
}, Ce = (function() {
  function e2() {
  }
  return e2.connect = function(t2, n) {
    var r2 = new Xr(t2, n);
    Ae.set(t2, r2);
  }, e2.observe = function(t2, n, r2) {
    var o = Ae.get(t2), i2 = o.observationTargets.length === 0;
    Pt(o.observationTargets, n) < 0 && (i2 && re.push(o), o.observationTargets.push(new Vr(n, r2 && r2.box)), Bt(1), tt.schedule());
  }, e2.unobserve = function(t2, n) {
    var r2 = Ae.get(t2), o = Pt(r2.observationTargets, n), i2 = r2.observationTargets.length === 1;
    o >= 0 && (i2 && re.splice(re.indexOf(r2), 1), r2.observationTargets.splice(o, 1), Bt(-1));
  }, e2.disconnect = function(t2) {
    var n = this, r2 = Ae.get(t2);
    r2.observationTargets.slice().forEach(function(o) {
      return n.unobserve(t2, o.target);
    }), r2.activeTargets.splice(0, r2.activeTargets.length);
  }, e2;
})(), Ft = (function() {
  function e2(t2) {
    if (arguments.length === 0)
      throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
    if (typeof t2 != "function")
      throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
    Ce.connect(this, t2);
  }
  return e2.prototype.observe = function(t2, n) {
    if (arguments.length === 0)
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
    if (!zt(t2))
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
    Ce.observe(this, t2, n);
  }, e2.prototype.unobserve = function(t2) {
    if (arguments.length === 0)
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
    if (!zt(t2))
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
    Ce.unobserve(this, t2);
  }, e2.prototype.disconnect = function() {
    Ce.disconnect(this);
  }, e2.toString = function() {
    return "function ResizeObserver () { [polyfill code] }";
  }, e2;
})();
const Ne = /* @__PURE__ */ new WeakMap();
function jr(e2) {
  var _a;
  var t2;
  for (let n = 0, r2 = e2.length; n < r2; ++n) {
    const o = e2[n], i2 = Ne.get(o.target);
    if (typeof i2 == "function") {
      const { inlineSize: s2, blockSize: c2 } = (_a = (t2 = o.borderBoxSize) == null ? void 0 : t2[0]) != null ? _a : {}, { offsetWidth: a2, offsetHeight: l } = o.target;
      i2(
        Object.assign(o, {
          offsetWidth: a2,
          offsetHeight: l,
          width: s2 != null ? s2 : a2,
          height: c2 != null ? c2 : l
        })
      );
    }
  }
}
const un = new (D && window.ResizeObserver || Ft)(
  jr
);
function xe(e2, t2) {
  Ne.set(e2, t2), un.observe(e2);
}
function nt(e2) {
  Ne.has(e2) && (un.unobserve(e2), Ne.delete(e2));
}
function wo(e2 = {}) {
  let t2 = P;
  const n = watch(
    () => unref(e2.target),
    (o) => {
      t2(), !(!o || typeof e2.onResize != "function") && (xe(o, e2.onResize), t2 = () => {
        nt(o), t2 = P;
      });
    },
    { immediate: true }
  ), r2 = () => {
    n(), t2();
  };
  return getCurrentScope() && onScopeDispose(r2), {
    /**
     * @deprecated Will be removed in next major version, please directly use `observeResize` from imports.
     */
    observeResize: xe,
    /**
     * @deprecated Will be removed in next major version, please directly use `unobserveResize` from imports.
     */
    unobserveResize: nt,
    unobserve: r2
  };
}
const dn = ref(false);
computed(() => dn.value);
const Dt = "__theme_style__", Le = "__theme_observer__";
const We = reactive(/* @__PURE__ */ new Map()), rt = /* @__PURE__ */ new Map();
watch(We, () => {
  if (!D) return;
  rt.clear();
  const e2 = document.head.querySelector(`#${Dt}`);
  e2 && document.head.removeChild(e2);
  const t2 = document.createElement("style");
  let n = `.${Le} { width: 1px }`, r2 = 1;
  for (const [o, [i2, s2]] of We.entries())
    n += ` html.${i2} .${Le}, .${s2} .${Le} { width: ${++r2}px }`, rt.set(r2, o);
  t2.textContent = n, t2.id = Dt, document.head.appendChild(t2);
});
const De = /* @__PURE__ */ defineComponent({
  __name: "grid-layout",
  props: {
    autoSize: { type: Boolean, default: true },
    colNum: { default: 12 },
    rowHeight: { default: 150 },
    maxRows: { default: 1 / 0 },
    margin: { default: () => [10, 10] },
    isDraggable: { type: Boolean, default: true },
    isResizable: { type: Boolean, default: true },
    isMirrored: { type: Boolean, default: false },
    isBounded: { type: Boolean, default: false },
    useCssTransforms: { type: Boolean, default: true },
    verticalCompact: { type: Boolean, default: true },
    restoreOnDrag: { type: Boolean, default: false },
    layout: {},
    responsive: { type: Boolean, default: false },
    responsiveLayouts: { default: () => ({}) },
    transformScale: { default: 1 },
    breakpoints: { default: () => ({ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }) },
    cols: { default: () => ({ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }) },
    preventCollision: { type: Boolean, default: false },
    useStyleCursor: { type: Boolean, default: true }
  },
  emits: [
    "layout-before-mount",
    "layout-mounted",
    "layout-updated",
    "breakpoint-changed",
    "update:layout",
    "layout-ready"
  ],
  setup(Y$1, { expose: N, emit: $$1 }) {
    const a2 = Y$1, u = $$1, t2 = reactive({
      width: -1,
      mergedStyle: {},
      lastLayoutLength: 0,
      isDragging: false,
      placeholder: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        i: ""
      },
      layouts: {},
      // array to store all layouts from different breakpoints
      lastBreakpoint: null,
      // store last active breakpoint
      originalLayout: null
      // store original Layout
    }), k$1 = /* @__PURE__ */ new Map(), o = ref(a2.layout), g2 = ref(), { observeResize: A$1, unobserveResize: U } = wo(), r2 = Zr();
    r2.on("resizeEvent", q), r2.on("dragEvent", G2), onBeforeMount(() => {
      u("layout-before-mount", o.value);
    }), onMounted(() => {
      u("layout-mounted", o.value), nextTick(() => {
        k(o.value), t2.originalLayout = o.value, nextTick(() => {
          D2(), g2.value && A$1(g2.value, no(C$1, 16)), $(o.value, a2.verticalCompact), u("layout-updated", o.value), y$12(), C$1();
        });
      });
    }), onBeforeUnmount(() => {
      r2.clearAll(), g2.value && U(g2.value);
    });
    function q(e2, n, l, f, d2, c2) {
      S(e2, n, l, f, d2, c2);
    }
    function G2(e2, n, l, f, d2, c2) {
      E2(e2, n, l, f, d2, c2);
    }
    watch(
      () => t2.width,
      (e2, n) => {
        nextTick(() => {
          r2.emit("updateWidth", e2), n === -1 && nextTick(() => {
            u("layout-ready", o.value);
          }), y$12();
        });
      }
    ), watch(
      () => [a2.layout, a2.layout.length],
      () => {
        o.value = a2.layout, R2();
      }
    ), watch(
      () => a2.colNum,
      (e2) => {
        r2.emit("setColNum", e2);
      }
    ), watch(
      () => a2.rowHeight,
      (e2) => {
        r2.emit("setRowHeight", e2);
      }
    ), watch(
      () => a2.isDraggable,
      (e2) => {
        r2.emit("setDraggable", e2);
      }
    ), watch(
      () => a2.isResizable,
      (e2) => {
        r2.emit("setResizable", e2);
      }
    ), watch(
      () => a2.isBounded,
      (e2) => {
        r2.emit("setBounded", e2);
      }
    ), watch(
      () => a2.transformScale,
      (e2) => {
        r2.emit("setTransformScale", e2);
      }
    ), watch(
      () => a2.responsive,
      (e2) => {
        e2 || (u("update:layout", t2.originalLayout), r2.emit("setColNum", a2.colNum)), C$1();
      }
    ), watch(
      () => a2.maxRows,
      (e2) => {
        r2.emit("setMaxRows", e2);
      }
    ), watch([() => a2.margin, () => a2.margin[1]], y$12), provide(
      T,
      reactive(__spreadProps(__spreadValues(__spreadValues({}, toRefs(a2)), toRefs(t2)), {
        increaseItem: K2,
        decreaseItem: j
      }))
    ), provide(v$1, r2), N({ state: t2, getItem: P2, resizeEvent: S, dragEvent: E2, layoutUpdate: R2 });
    function K2(e2) {
      k$1.set(e2.i, e2);
    }
    function j(e2) {
      k$1.delete(e2.i);
    }
    function P2(e2) {
      return k$1.get(e2);
    }
    function R2() {
      if (!ie(o.value) && !ie(t2.originalLayout)) {
        if (o.value.length !== t2.originalLayout.length) {
          const e2 = J(o.value, t2.originalLayout);
          if (e2.length > 0)
            if (o.value.length > t2.originalLayout.length)
              t2.originalLayout = t2.originalLayout.concat(e2);
            else {
              const n = new Set(e2.map((l) => l.i));
              t2.originalLayout = t2.originalLayout.filter((l) => !n.has(l.i));
            }
          t2.lastLayoutLength = o.value.length, D2();
        }
        $(o.value, a2.verticalCompact), r2.emit("updateWidth", t2.width), y$12(), u("layout-updated", o.value);
      }
    }
    function y$12() {
      t2.mergedStyle = {
        height: V2()
      };
    }
    function C$1() {
      g2.value && (t2.width = g2.value.offsetWidth), r2.emit("resizeEvent");
    }
    function V2() {
      if (!a2.autoSize) return;
      const e2 = parseFloat(a2.margin[1]);
      return A(o.value) * (a2.rowHeight + e2) + e2 + "px";
    }
    let b2;
    function E2(e2, n, l, f, d2, c2) {
      let i2 = C(o.value, n);
      ie(i2) && (i2 = { h: 0, w: 0, x: 0, y: 0, i: "" }), e2 === "dragstart" && !a2.verticalCompact && (b2 = o.value.reduce(
        (v2, { i: x2, x: p, y: h2 }) => __spreadProps(__spreadValues({}, v2), {
          [x2]: { x: p, y: h2 }
        }),
        {}
      )), e2 === "dragmove" || e2 === "dragstart" ? (t2.placeholder.i = n, t2.placeholder.x = i2.x, t2.placeholder.y = i2.y, t2.placeholder.w = c2, t2.placeholder.h = d2, nextTick(() => {
        t2.isDragging = true;
      }), r2.emit("updateWidth", t2.width)) : nextTick(() => {
        t2.isDragging = false;
      }), o.value = x(o.value, i2, l, f, true, a2.preventCollision), a2.restoreOnDrag ? (i2.static = true, $(o.value, a2.verticalCompact, b2), i2.static = false) : $(o.value, a2.verticalCompact), r2.emit("compact"), y$12(), e2 === "dragend" && (b2 = void 0, u("layout-updated", o.value));
    }
    function S(e2, n, l, f, d2, c2) {
      let i2 = C(o.value, n);
      ie(i2) && (i2 = { h: 0, w: 0, x: 0, y: 0, i: "" });
      let v2;
      if (a2.preventCollision) {
        const x2 = L(o.value, __spreadProps(__spreadValues({}, i2), { w: c2, h: d2 })).filter(
          (p) => p.i !== i2.i
        );
        if (v2 = x2.length > 0, v2) {
          let p = 1 / 0, h2 = 1 / 0;
          x2.forEach((L2) => {
            L2.x > i2.x && (p = Math.min(p, L2.x)), L2.y > i2.y && (h2 = Math.min(h2, L2.y));
          }), Number.isFinite(p) && (i2.w = p - i2.x), Number.isFinite(h2) && (i2.h = h2 - i2.y);
        }
      }
      v2 || (i2.w = c2, i2.h = d2), e2 === "resizestart" || e2 === "resizemove" ? (t2.placeholder.i = n, t2.placeholder.x = l, t2.placeholder.y = f, t2.placeholder.w = i2.w, t2.placeholder.h = i2.h, nextTick(() => {
        t2.isDragging = true;
      }), r2.emit("updateWidth", t2.width)) : e2 && nextTick(() => {
        t2.isDragging = false;
      }), a2.responsive && X2(), $(o.value, a2.verticalCompact), r2.emit("compact"), y$12(), e2 === "resizeend" && u("layout-updated", o.value);
    }
    function X2() {
      const e2 = y(a2.breakpoints, t2.width);
      if (e2 === t2.lastBreakpoint)
        return;
      const n = B(e2, a2.cols);
      !ie(t2.lastBreakpoint) && !t2.layouts[t2.lastBreakpoint] && (t2.layouts[t2.lastBreakpoint] = Y(o.value));
      const l = v(
        t2.originalLayout,
        t2.layouts,
        a2.breakpoints,
        e2,
        t2.lastBreakpoint,
        n,
        a2.verticalCompact
      );
      t2.layouts[e2] = l, t2.lastBreakpoint !== e2 && u("breakpoint-changed", e2, l), o.value = l, u("update:layout", l), t2.lastBreakpoint = e2, r2.emit("setColNum", n);
    }
    function D2() {
      t2.layouts = Object.assign({}, a2.responsiveLayouts);
    }
    function J(e2, n) {
      const l = new Set(n.map((i2) => i2.i)), f = new Set(e2.map((i2) => i2.i)), d2 = e2.filter((i2) => !l.has(i2.i)), c2 = n.filter((i2) => !f.has(i2.i));
      return d2.concat(c2);
    }
    return (e2, n) => (openBlock(), createElementBlock("div", {
      ref_key: "wrapper",
      ref: g2,
      class: "vgl-layout",
      style: normalizeStyle(t2.mergedStyle)
    }, [
      e2.$slots.default ? renderSlot(e2.$slots, "default", { key: 0 }) : (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(o.value, (l) => (openBlock(), createBlock(ot, mergeProps({
        key: l.i,
        ref_for: true
      }, l), {
        default: withCtx(() => [
          renderSlot(e2.$slots, "item", { item: l })
        ]),
        _: 2
      }, 1040))), 128)),
      withDirectives(createVNode(ot, {
        class: "vgl-item--placeholder",
        x: t2.placeholder.x,
        y: t2.placeholder.y,
        w: t2.placeholder.w,
        h: t2.placeholder.h,
        i: t2.placeholder.i
      }, null, 8, ["x", "y", "w", "h", "i"]), [
        [vShow, t2.isDragging]
      ])
    ], 4));
  }
});
(function() {
  try {
    if (typeof document < "u") {
      var e2 = document.createElement("style");
      e2.appendChild(document.createTextNode('.vgl-layout{--vgl-placeholder-bg: red;--vgl-placeholder-opacity: 20%;--vgl-placeholder-z-index: 2;--vgl-item-resizing-z-index: 3;--vgl-item-resizing-opacity: 60%;--vgl-item-dragging-z-index: 3;--vgl-item-dragging-opacity: 100%;--vgl-resizer-size: 10px;--vgl-resizer-border-color: #444;--vgl-resizer-border-width: 2px;position:relative;box-sizing:border-box;transition:height .2s ease}.vgl-item{position:absolute;box-sizing:border-box;transition:.2s ease;transition-property:left,top,right}.vgl-item--placeholder{z-index:var(--vgl-placeholder-z-index, 2);-webkit-user-select:none;-moz-user-select:none;user-select:none;background-color:var(--vgl-placeholder-bg, red);opacity:var(--vgl-placeholder-opacity, 20%);transition-duration:.1s}.vgl-item--no-touch{touch-action:none}.vgl-item--transform{right:auto;left:0;transition-property:transform}.vgl-item--transform.vgl-item--rtl{right:0;left:auto}.vgl-item--resizing{z-index:var(--vgl-item-resizing-z-index, 3);-webkit-user-select:none;-moz-user-select:none;user-select:none;opacity:var(--vgl-item-resizing-opacity, 60%)}.vgl-item--dragging{z-index:var(--vgl-item-dragging-z-index, 3);-webkit-user-select:none;-moz-user-select:none;user-select:none;opacity:var(--vgl-item-dragging-opacity, 100%);transition:none}.vgl-item__resizer{position:absolute;right:0;bottom:0;box-sizing:border-box;width:var(--vgl-resizer-size);height:var(--vgl-resizer-size);cursor:se-resize}.vgl-item__resizer:before{position:absolute;top:0;right:3px;bottom:3px;left:0;content:"";border:0 solid var(--vgl-resizer-border-color);border-right-width:var(--vgl-resizer-border-width);border-bottom-width:var(--vgl-resizer-border-width)}.vgl-item__resizer--rtl{right:auto;left:0;cursor:sw-resize}.vgl-item__resizer--rtl:before{top:0;right:0;bottom:3px;left:3px;border-right-width:0;border-bottom-width:var(--vgl-resizer-border-width);border-left-width:var(--vgl-resizer-border-width)}')), document.head.appendChild(e2);
    }
  } catch (r2) {
    console.error("vite-plugin-css-injected-by-js", r2);
  }
})();
const _hoisted_1$1 = {
  xmlns: "http://www.w3.org/2000/svg",
  "xml:space": "preserve",
  id: "\u56FE\u5C42_1",
  x: "0",
  y: "0",
  version: "1.1",
  viewBox: "0 0 750 750"
};
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$1, [
    (openBlock(), createBlock(resolveDynamicComponent("style"), null, {
      default: withCtx(() => [..._cache[0] || (_cache[0] = [
        createTextVNode(".st1{opacity:.1;fill:#b3b3b3}.st2{opacity:.3}.st2,.st4{fill:#b3b3b3}", -1)
      ])]),
      _: 1
    })),
    _cache[1] || (_cache[1] = createStaticVNode('<path d="M465.1 261.4H264c-1.3 0-2.4 1.1-2.4 2.4v255.6c0 1.3 1.1 2.4 2.4 2.4h201.1c1.3 0 2.4-1.1 2.4-2.4V263.8c0-1.4-1.1-2.4-2.4-2.4M417.9 443c0 1.3-1.1 2.4-2.4 2.4h-102c-1.3 0-2.4-1.1-2.4-2.4v-11.3c0-1.3 1.1-2.4 2.4-2.4h102c1.3 0 2.4 1.1 2.4 2.4zm0-45.8c0 1.3-1.1 2.4-2.4 2.4h-102c-1.3 0-2.4-1.1-2.4-2.4v-11.3c0-1.3 1.1-2.4 2.4-2.4h102c1.3 0 2.4 1.1 2.4 2.4zm0-45.7c0 1.3-1.1 2.4-2.4 2.4h-102c-1.3 0-2.4-1.1-2.4-2.4v-11.3c0-1.3 1.1-2.4 2.4-2.4h102c1.3 0 2.4 1.1 2.4 2.4z" style="opacity:.35;fill:#b3b3b3;"></path><path d="M462.1 236.8c-77.3-.6-141.1 58.3-148.1 133.9-18.5-19.1-44.4-31.1-73.1-31.3-56.8-.4-103.2 45.3-103.6 102.1l-.8 101.4 175.6 1.3 30.1.2 265.1 2 1.2-160.9c.7-81.5-64.9-148.1-146.4-148.7" class="st1"></path><path d="M216.9 227.4c-3.4 0-6.5 1.1-9 2.9q.3-1.5.3-3c.1-8.3-6.6-15.1-15-15.2s-15.1 6.6-15.2 15v.9c-1.6-.6-3.4-1-5.2-1-8.3-.1-15.1 6.6-15.2 15-.1 8.2 6.4 14.9 14.5 15.2l44.6.3c8.3.1 15.1-6.6 15.2-15s-6.7-15-15-15.1M596.4 194.2c-3.4 0-6.5 1.1-9 2.9q.3-1.5.3-3c.1-8.3-6.6-15.1-15-15.2s-15.1 6.6-15.2 15v.9c-1.6-.6-3.4-1-5.2-1-8.3-.1-15.1 6.6-15.2 15-.1 8.2 6.4 14.9 14.5 15.2l44.6.3c8.3.1 15.1-6.6 15.2-15s-6.7-15-15-15.1" class="st2"></path><g style="opacity:.1;"><path d="M496.9 497.5c-2.1 0-3.7 1.6-3.7 3.7 0 1.5.8 2.7 2 3.3l-.5 65.1h3.5l.5-65.3c1.1-.6 1.8-1.8 1.8-3.1.1-2.1-1.5-3.6-3.6-3.7M572.3 501.7c0-1.9-1.6-3.6-3.7-3.7-2.1 0-3.7 1.6-3.7 3.7 0 1.4.8 2.6 1.9 3.2l-.5 65.2h3.5l.5-65.2c1.2-.6 1.9-1.8 2-3.2" class="st4"></path></g><path d="m484.776 526.29.123-16.5 92.3.688-.123 16.5z" class="st1"></path><path d="m495.4 509.8-.2.3-9.7 16.2h-.7l.1-16.5zM518.7 510l-9.9 16.5-12.5-.1 3.9-6.6 5.8-9.9zM542 510.2l-9.9 16.4-12.5-.1 9.7-16.4zM565.3 510.4l-9.8 16.4-12.6-.1 9.8-16.4zM577.2 510.4l-.1 16.6-10.9-.1 9.8-16.5zM484.577 551.81l.123-16.5 92.3.688-.123 16.5z" class="st1"></path><path d="m495.2 535.3-.2.3-9.7 16.2h-.7l.1-16.5zM518.5 535.5l-9.9 16.5-12.5-.1 3.9-6.6 5.8-9.9zM541.8 535.7l-9.9 16.4-12.5-.1 9.7-16.4zM565.1 535.9l-9.7 16.4-12.7-.1 9.8-16.4zM577 536l-.1 16.5-10.9-.1 9.8-16.4zM577.1 527v-4.4c0-2.8.1-6.9.1-12.2l.1.1-92.3-.5.1-.1c0 5.6-.1 11.2-.1 16.5l-.1-.1 65.8.6 19.5.1h5.3-5.3l-19.5-.1-65.8-.3h-.3l.1-16.8h.1l92.3.8h.1v.1c0 5.3-.1 9.4-.1 12.2v4.1000000000000005" class="st1"></path><path d="M576.9 552.5v-4.4c0-2.8.1-6.9.1-12.2l.1.1-92.3-.5.1-.1c0 5.6-.1 11.2-.1 16.5l-.1-.1 65.8.6 19.5.1h5.3-5.3l-19.5-.1-65.8-.3h-.3l.1-16.7h.1l92.3.8h.1v.1c0 5.3-.1 9.4-.1 12.2v4" class="st1"></path>', 8))
  ]);
}
const Widgets = { render };
const _sfc_main = {
  __name: "CustomLayout",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const loadingCollection = {};
    const userLayoutObject = useLayoutLayoutStore();
    const props = __props;
    const handleRemove = (key) => __async(null, null, function* () {
      userLayoutObject.removeComp(key);
    });
    const __returned__ = {
      loadingCollection,
      userLayoutObject,
      props,
      handleRemove,
      defineAsyncComponent,
      reactive,
      ref,
      get GridLayout() {
        return De;
      },
      get Widgets() {
        return Widgets;
      },
      get useRenderIcon() {
        return useRenderIcon;
      },
      get useLayoutLayoutStore() {
        return useLayoutLayoutStore;
      }
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
};
const _hoisted_1 = {
  class: "customizing h-full"
};
const _hoisted_2 = {
  class: "item"
};
const _hoisted_3 = {
  class: "widgets-item"
};
const _hoisted_4 = {
  class: "h-full"
};
const _hoisted_5 = {
  class: "!w-full !h-full",
  style: {
    "width": "100% !important"
  }
};
const _hoisted_6 = {
  key: 0,
  class: "!h-full"
};
const _hoisted_7 = {
  key: 1,
  class: "relative h-full"
};
const _hoisted_8 = {
  key: 0,
  class: "customize-overlay"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_el_skeleton = resolveComponent("el-skeleton");
  const _component_el_button = resolveComponent("el-button");
  const _component_el_button_group = resolveComponent("el-button-group");
  const _component_el_icon = resolveComponent("el-icon");
  return openBlock(), createElementBlock("div", _hoisted_1, [createVNode($setup["GridLayout"], {
    class: "!h-full",
    "row-height": 200,
    layout: $setup.userLayoutObject.layout,
    "onUpdate:layout": _cache[0] || (_cache[0] = ($event) => $setup.userLayoutObject.layout = $event),
    "is-draggable": $setup.props.modelValue,
    "is-resizable": $setup.props.modelValue,
    "vertical-compact": "",
    "use-css-transforms": ""
  }, {
    item: withCtx(({
      item
    }) => [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createVNode(_component_el_skeleton, {
      class: "h-full",
      loading: $setup.userLayoutObject.isLoaded(item, $setup.loadingCollection),
      animated: ""
    }, {
      template: withCtx(() => [createBaseVNode("div", _hoisted_5, [item.type == 1 && $setup.props.modelValue || !$setup.props.modelValue || $setup.userLayoutObject.loadRemoteComponent(item.id) ? (openBlock(), createElementBlock("div", _hoisted_6, [(openBlock(), createBlock(KeepAlive, {
        class: "!h-full"
      }, [(openBlock(), createBlock(resolveDynamicComponent($setup.userLayoutObject.loadComponent(item.id)), {
        class: "!h-full",
        frameInfo: $setup.userLayoutObject.loadFrameInfo(item.id),
        key: $setup.userLayoutObject.loadFrameInfo(item.id).key,
        onLoaded: () => $setup.userLayoutObject.loaded(item.id, $setup.loadingCollection)
      }, null, 40, ["frameInfo", "onLoaded"]))], 1024))])) : $setup.props.modelValue ? (openBlock(), createElementBlock("div", _hoisted_7, [(openBlock(), createBlock(resolveDynamicComponent($setup.useRenderIcon($setup.userLayoutObject.getComponent(item.id).sysSfcIcon)), {
        class: "w-full !h-full"
      }))])) : createCommentVNode("", true)])]),
      _: 2
    }, 1032, ["loading"])]), $setup.props.modelValue ? (openBlock(), createElementBlock("div", _hoisted_8, [createVNode(_component_el_button_group, {
      class: "close"
    }, {
      default: withCtx(() => [item.type != 1 ? (openBlock(), createBlock(_component_el_button, {
        key: 0,
        type: "primary",
        plain: "",
        size: "small",
        icon: !$setup.userLayoutObject.loadRemoteComponent(item.id) ? $setup.useRenderIcon("ri:eye-close-line") : $setup.useRenderIcon("ri:eye-line"),
        onClick: ($event) => $setup.userLayoutObject.loadRemoteComponent(item.id, !$setup.userLayoutObject.loadRemoteComponent(item.id))
      }, null, 8, ["icon", "onClick"])) : createCommentVNode("", true), createVNode(_component_el_button, {
        type: "danger",
        plain: "",
        icon: $setup.useRenderIcon("ep:close"),
        size: "small",
        onClick: ($event) => $setup.handleRemove(item.id)
      }, null, 8, ["icon", "onClick"])]),
      _: 2
    }, 1024), createBaseVNode("label", null, [createVNode(_component_el_icon, null, {
      default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent($setup.useRenderIcon($setup.userLayoutObject.getComponent(item.id).sysSfcIcon))))]),
      _: 2
    }, 1024)])])) : createCommentVNode("", true)])])]),
    _: 1
  }, 8, ["layout", "is-draggable", "is-resizable"])]);
}
const CustomLayout = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-99df7bb3"], ["__file", "H:/workspace/2/vue-support-parent-starter/packages/pages/home/default/layout/CustomLayout.vue"]]);
export {
  CustomLayout as default
};
