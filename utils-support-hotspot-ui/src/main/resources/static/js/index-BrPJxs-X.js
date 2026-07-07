import { _ as _export_sfc, e as resolveComponent, f as resolveDirective, c as createElementBlock, o as openBlock, h as createBaseVNode, g as createVNode, i as createTextVNode, k as withCtx, w as withDirectives, P as reactive, al as watch, ar as useRenderIcon } from "./index-DsQ9-pB_.js";
const _sfc_main = {
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const setting = reactive({
      upperCase: true,
      lengthCase: 16
    });
    const data = reactive({
      upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowerCase: "abcdefghijklmnopqrstuvwxyz",
      numberCase: "0123456789",
      symbolCase: "~!@#$%^&*()_+-=[]{}|;:,.<>/?",
      token: null
    });
    watch(setting, () => {
      generateToken();
    }, {
      deep: true,
      immediate: true
    });
    function generateToken() {
      let token = "";
      let possibleChars = "";
      if (setting.upperCase) {
        possibleChars += data.upperCase;
      }
      if (setting.lowerCase) {
        possibleChars += data.lowerCase;
      }
      if (setting.numberCase) {
        possibleChars += data.numberCase;
      }
      if (setting.symbolCase) {
        possibleChars += data.symbolCase;
      }
      for (let i = 0; i < setting.lengthCase; i++) {
        token += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      }
      return data.token = token;
    }
    const __returned__ = {
      setting,
      data,
      generateToken,
      get useRenderIcon() {
        return useRenderIcon;
      },
      reactive,
      watch
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
  class: "flex-1 overflow-auto"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_switch = resolveComponent("el-switch");
  const _component_el_form_item = resolveComponent("el-form-item");
  const _component_el_form = resolveComponent("el-form");
  const _component_el_slider = resolveComponent("el-slider");
  const _component_el_button = resolveComponent("el-button");
  const _component_el_input = resolveComponent("el-input");
  const _component_el_card = resolveComponent("el-card");
  const _directive_copy = resolveDirective("copy");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:key-2-line",
    class: "title-icon"
  }), _cache[7] || (_cache[7] = createTextVNode(" Token \u751F\u6210\u5668 ", -1))]), _cache[8] || (_cache[8] = createBaseVNode("p", {
    class: "page-subtitle"
  }, "\u751F\u6210\u5B89\u5168\u7684\u968F\u673A Token \u5B57\u7B26\u4E32", -1))])])]), createBaseVNode("div", _hoisted_6, [createVNode(_component_el_card, {
    shadow: "never"
  }, {
    default: withCtx(() => [createVNode(_component_el_form, {
      inline: true
    }, {
      default: withCtx(() => [createVNode(_component_el_form_item, {
        label: "\u5927\u5199\u5B57\u6BCD"
      }, {
        default: withCtx(() => [createVNode(_component_el_switch, {
          modelValue: $setup.setting.upperCase,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.setting.upperCase = $event)
        }, null, 8, ["modelValue"])]),
        _: 1
      }), createVNode(_component_el_form_item, {
        label: "\u5C0F\u5199\u5B57\u6BCD"
      }, {
        default: withCtx(() => [createVNode(_component_el_switch, {
          modelValue: $setup.setting.lowerCase,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.setting.lowerCase = $event)
        }, null, 8, ["modelValue"])]),
        _: 1
      }), createVNode(_component_el_form_item, {
        label: "\u6570\u5B57"
      }, {
        default: withCtx(() => [createVNode(_component_el_switch, {
          modelValue: $setup.setting.numberCase,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.setting.numberCase = $event)
        }, null, 8, ["modelValue"])]),
        _: 1
      }), createVNode(_component_el_form_item, {
        label: "\u7279\u6B8A\u7B26\u53F7"
      }, {
        default: withCtx(() => [createVNode(_component_el_switch, {
          modelValue: $setup.setting.symbolCase,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.setting.symbolCase = $event)
        }, null, 8, ["modelValue"])]),
        _: 1
      })]),
      _: 1
    }), createVNode(_component_el_form, {
      inline: true
    }, {
      default: withCtx(() => [createVNode(_component_el_form_item, {
        label: "\u957F\u5EA6"
      }, {
        default: withCtx(() => [createVNode(_component_el_slider, {
          modelValue: $setup.setting.lengthCase,
          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.setting.lengthCase = $event),
          class: "!min-w-[500px]",
          min: 1,
          max: 1024,
          "show-tooltip": ""
        }, null, 8, ["modelValue"])]),
        _: 1
      })]),
      _: 1
    }), createVNode(_component_el_form, {
      inline: true
    }, {
      default: withCtx(() => [createVNode(_component_el_form_item, null, {
        default: withCtx(() => [withDirectives(createVNode(_component_el_button, {
          size: "small",
          icon: $setup.useRenderIcon("ep:copy-document")
        }, null, 8, ["icon"]), [[_directive_copy, $setup.data.token, "click"]]), createVNode(_component_el_button, {
          type: "primary",
          size: "small",
          icon: $setup.useRenderIcon("ep:refresh"),
          onClick: _cache[5] || (_cache[5] = ($event) => $setup.generateToken())
        }, null, 8, ["icon"])]),
        _: 1
      })]),
      _: 1
    }), createVNode(_component_el_input, {
      modelValue: $setup.data.token,
      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.data.token = $event),
      type: "textarea",
      rows: 20,
      class: "code-textarea"
    }, null, 8, ["modelValue"])]),
    _: 1
  })])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-15dc51b9"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/tools/codec/token/index.vue"]]);
export {
  index as default
};
