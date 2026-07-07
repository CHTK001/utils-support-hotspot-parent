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
import { d as defineComponent, S as useI18n, r as ref, u as useRoute, al as watch, l as onMounted, T as nextTick, aS as unref, _ as _export_sfc, c as createElementBlock, o as openBlock } from "./index-DsQ9-pB_.js";
const _sfc_main = /* @__PURE__ */ defineComponent(__spreadProps(__spreadValues({}, {
  name: "LayFrame"
}), {
  __name: "simpleFrame",
  props: {
    frameInfo: {
      type: Object,
      required: false
    }
  },
  emits: ["loaded"],
  setup(__props, {
    expose: __expose,
    emit: __emit
  }) {
    __expose();
    const loadEmit = __emit;
    const props = __props;
    const {
      t
    } = useI18n();
    const loading = ref(true);
    const currentRoute = useRoute();
    const frameSrc = ref(props.frameInfo.fullPath);
    const frameRef = ref(null);
    function hideLoading() {
      loading.value = false;
      loadEmit("loaded");
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
      var _a, _b, _c;
      if (currentRoute.name === "Redirect" && path.includes((_a = props.frameInfo) == null ? void 0 : _a.fullPath)) {
        frameSrc.value = path;
        loading.value = true;
      }
      if (((_b = props.frameInfo) == null ? void 0 : _b.fullPath) === path) {
        frameSrc.value = (_c = props.frameInfo) == null ? void 0 : _c.frameSrc;
      }
    });
    onMounted(() => {
      init();
    });
    const __returned__ = {
      loadEmit,
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
const _hoisted_1 = ["src"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("iframe", {
    ref: "frameRef",
    src: $setup.frameSrc,
    class: "frame-iframe",
    height: "100%",
    width: "100%"
  }, null, 8, _hoisted_1);
}
const simpleFrame = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2b5dfbf6"], ["__file", "H:/workspace/2/vue-support-parent-starter/packages/pages/layout/simpleFrame.vue"]]);
export {
  simpleFrame as default
};
