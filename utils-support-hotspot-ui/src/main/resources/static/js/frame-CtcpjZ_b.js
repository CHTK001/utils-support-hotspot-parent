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
import { d as defineComponent, S as useI18n, r as ref, u as useRoute, aS as unref, al as watch, l as onMounted, T as nextTick, _ as _export_sfc, f as resolveDirective, w as withDirectives, c as createElementBlock, o as openBlock, h as createBaseVNode } from "./index-DsQ9-pB_.js";
const _sfc_main = /* @__PURE__ */ defineComponent(__spreadProps(__spreadValues({}, {
  name: "LayFrame"
}), {
  __name: "frame",
  props: {
    frameInfo: {
      type: Object,
      required: false
    }
  },
  setup(__props, {
    expose: __expose
  }) {
    var _a, _b, _c;
    __expose();
    const props = __props;
    const {
      t
    } = useI18n();
    const loading = ref(true);
    const currentRoute = useRoute();
    const frameSrc = ref("");
    const frameRef = ref(null);
    if ((_a = unref(currentRoute.meta)) == null ? void 0 : _a.frameSrc) {
      frameSrc.value = (_b = unref(currentRoute.meta)) == null ? void 0 : _b.frameSrc;
    }
    ((_c = unref(currentRoute.meta)) == null ? void 0 : _c.frameLoading) === false && hideLoading();
    function hideLoading() {
      loading.value = false;
    }
    function init() {
      nextTick(() => {
        const iframe = unref(frameRef);
        if (!iframe) return;
        const _frame = iframe;
        if (_frame.attachEvent) {
          _frame.attachEvent("onload", () => {
            hideLoading();
          });
        } else {
          iframe.onload = () => {
            hideLoading();
          };
        }
      });
    }
    watch(() => currentRoute.fullPath, (path) => {
      var _a2, _b2, _c2;
      if (currentRoute.name === "Redirect" && path.includes((_a2 = props.frameInfo) == null ? void 0 : _a2.fullPath)) {
        frameSrc.value = path;
        loading.value = true;
      }
      if (((_b2 = props.frameInfo) == null ? void 0 : _b2.fullPath) === path) {
        frameSrc.value = (_c2 = props.frameInfo) == null ? void 0 : _c2.frameSrc;
      }
    });
    onMounted(() => {
      init();
    });
    const __returned__ = {
      props,
      t,
      loading,
      currentRoute,
      frameSrc,
      frameRef,
      hideLoading,
      init
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
}));
const _hoisted_1 = ["element-loading-text"];
const _hoisted_2 = ["src"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_loading = resolveDirective("loading");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: "frame",
    "element-loading-text": $setup.t("status.pureLoad")
  }, [createBaseVNode("iframe", {
    ref: "frameRef",
    src: $setup.frameSrc,
    class: "frame-iframe"
  }, null, 8, _hoisted_2)], 8, _hoisted_1)), [[_directive_loading, $setup.loading]]);
}
const frame = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-10c8e0b8"], ["__file", "H:/workspace/2/vue-support-parent-starter/packages/pages/layout/frame.vue"]]);
export {
  frame as default
};
