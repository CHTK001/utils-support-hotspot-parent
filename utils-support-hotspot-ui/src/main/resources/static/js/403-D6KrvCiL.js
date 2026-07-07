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
import { d as defineComponent, q as computed, bm as globalSetting, _ as _export_sfc, j as createBlock, o as openBlock, n as normalizeStyle } from "./index-DsQ9-pB_.js";
import { E as ErrorPage } from "./ErrorPage-Dobz1U6-.js";
const _sfc_main = /* @__PURE__ */ defineComponent(__spreadProps(__spreadValues({}, {
  name: "403"
}), {
  __name: "403",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const errorPageStyle = computed(() => globalSetting.ErrorPageStyle || "forbidden");
    const __returned__ = {
      errorPageStyle,
      ErrorPage
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
}));
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["ErrorPage"], {
    code: "403",
    style: normalizeStyle($setup.errorPageStyle)
  }, null, 8, ["style"]);
}
const _403 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "H:/workspace/2/vue-support-parent-starter/packages/pages/error/403.vue"]]);
export {
  _403 as default
};
