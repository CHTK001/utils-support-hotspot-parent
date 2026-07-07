import { _ as _export_sfc, e as resolveComponent, c as createElementBlock, o as openBlock, h as createBaseVNode, g as createVNode, i as createTextVNode, t as toDisplayString, k as withCtx, F as Fragment, m as renderList, j as createBlock, r as ref, l as onMounted } from "./index-DsQ9-pB_.js";
const _sfc_main = {
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const browserInfo = ref({});
    const getBrowserInfo = () => {
      const info = {
        \u540D\u79F0: navigator.appName,
        \u7248\u672C: navigator.appVersion,
        \u4F9B\u5E94\u5546: navigator.vendor,
        \u5F15\u64CE: navigator.product,
        \u7528\u6237\u4EE3\u7406: navigator.userAgent,
        \u5E94\u7528\u7A0B\u5E8F\u7248\u672C: navigator.appVersion,
        \u5E73\u53F0: navigator.platform,
        \u8BED\u8A00: navigator.language,
        \u5C4F\u5E55\u5206\u8FA8\u7387: `${screen.width}x${screen.height}`,
        \u7A97\u53E3\u5927\u5C0F: `${window.innerWidth}x${window.innerHeight}`,
        \u989C\u8272\u6DF1\u5EA6: screen.colorDepth + " bits",
        \u5728\u7EBF\u72B6\u6001: navigator.onLine,
        Cookies\u542F\u7528: navigator.cookieEnabled,
        Java\u542F\u7528: navigator.javaEnabled(),
        \u63D2\u4EF6: Array.from(navigator.plugins).map((plugin) => plugin.name).join(", "),
        MIME\u7C7B\u578B: Array.from(navigator.mimeTypes).map((mimeType) => mimeType.type).join(", "),
        \u65F6\u533A\u504F\u79FB: (/* @__PURE__ */ new Date()).getTimezoneOffset(),
        \u65F6\u533A: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      return info;
    };
    onMounted(() => {
      browserInfo.value = getBrowserInfo();
    });
    const __returned__ = {
      browserInfo,
      getBrowserInfo,
      ref,
      onMounted
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
};
const _hoisted_1 = {
  class: "page flex flex-col h-full"
};
const _hoisted_2 = {
  class: "page-header"
};
const _hoisted_3 = {
  class: "header-content"
};
const _hoisted_4 = {
  class: "title-section"
};
const _hoisted_5 = {
  class: "page-title"
};
const _hoisted_6 = {
  class: "stats-section"
};
const _hoisted_7 = {
  class: "stat-card"
};
const _hoisted_8 = {
  class: "stat-number"
};
const _hoisted_9 = {
  class: "flex-1 overflow-auto"
};
const _hoisted_10 = {
  class: "info-value"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_descriptions_item = resolveComponent("el-descriptions-item");
  const _component_el_descriptions = resolveComponent("el-descriptions");
  const _component_el_card = resolveComponent("el-card");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:device-line",
    class: "title-icon"
  }), _cache[0] || (_cache[0] = createTextVNode(" \u8BBE\u5907\u4FE1\u606F ", -1))]), _cache[1] || (_cache[1] = createBaseVNode("p", {
    class: "page-subtitle"
  }, "\u67E5\u770B\u5F53\u524D\u6D4F\u89C8\u5668\u548C\u8BBE\u5907\u7684\u8BE6\u7EC6\u4FE1\u606F", -1))]), createBaseVNode("div", _hoisted_6, [createBaseVNode("div", _hoisted_7, [createBaseVNode("div", _hoisted_8, toDisplayString(Object.keys($setup.browserInfo).length), 1), _cache[2] || (_cache[2] = createBaseVNode("div", {
    class: "stat-label"
  }, "\u4FE1\u606F\u9879", -1))])])])]), createBaseVNode("div", _hoisted_9, [createVNode(_component_el_card, {
    shadow: "never"
  }, {
    default: withCtx(() => [createVNode(_component_el_descriptions, {
      border: "",
      column: 2,
      class: "device-info"
    }, {
      default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.browserInfo, (value, key) => {
        return openBlock(), createBlock(_component_el_descriptions_item, {
          key,
          label: key
        }, {
          default: withCtx(() => [createBaseVNode("span", _hoisted_10, toDisplayString(value), 1)]),
          _: 2
        }, 1032, ["label"]);
      }), 128))]),
      _: 1
    })]),
    _: 1
  })])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-87923b7a"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/tools/web/device/index.vue"]]);
export {
  index as default
};
