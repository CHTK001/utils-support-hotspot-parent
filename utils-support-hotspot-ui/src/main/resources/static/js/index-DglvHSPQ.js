import { _ as _export_sfc, e as resolveComponent, f as resolveDirective, c as createElementBlock, o as openBlock, h as createBaseVNode, g as createVNode, i as createTextVNode, t as toDisplayString, k as withCtx, w as withDirectives, v as createCommentVNode, j as createBlock, F as Fragment, m as renderList, P as reactive, al as watch, ar as useRenderIcon } from "./index-DsQ9-pB_.js";
const _sfc_main = {
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const setting = reactive({
      upperCase: true,
      lengthCase: 1
    });
    const data = reactive({
      token: []
    });
    const generateTokenList = () => {
      const t = [];
      for (let i = 0; i < setting.lengthCase; i++) {
        t.push(generateToken());
      }
      data.token = t;
    };
    function generateToken() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1);
      }
      s[14] = "4";
      s[19] = hexDigits.substr(s[19] & 3 | 8, 1);
      s[8] = s[13] = s[18] = s[23] = "-";
      var uuid = s.join("");
      return setting.upperCase ? uuid.toUpperCase() : uuid.toLocaleLowerCase();
    }
    watch(setting, () => {
      generateTokenList();
    }, {
      deep: true,
      immediate: true
    });
    const __returned__ = {
      setting,
      data,
      generateTokenList,
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
  class: "uuid-list"
};
const _hoisted_11 = {
  key: 0,
  class: "uuid-items"
};
const _hoisted_12 = {
  class: "uuid-index"
};
const _hoisted_13 = {
  class: "uuid-value"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_switch = resolveComponent("el-switch");
  const _component_el_form_item = resolveComponent("el-form-item");
  const _component_el_form = resolveComponent("el-form");
  const _component_el_button = resolveComponent("el-button");
  const _component_el_slider = resolveComponent("el-slider");
  const _component_el_empty = resolveComponent("el-empty");
  const _component_el_card = resolveComponent("el-card");
  const _directive_copy = resolveDirective("copy");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:fingerprint-line",
    class: "title-icon"
  }), _cache[4] || (_cache[4] = createTextVNode(" UUID \u751F\u6210\u5668 ", -1))]), _cache[5] || (_cache[5] = createBaseVNode("p", {
    class: "page-subtitle"
  }, "\u751F\u6210\u552F\u4E00\u6807\u8BC6\u7B26 UUID", -1))]), createBaseVNode("div", _hoisted_6, [createBaseVNode("div", _hoisted_7, [createBaseVNode("div", _hoisted_8, toDisplayString($setup.data.token.length), 1), _cache[6] || (_cache[6] = createBaseVNode("div", {
    class: "stat-label"
  }, "\u5DF2\u751F\u6210", -1))])])])]), createBaseVNode("div", _hoisted_9, [createVNode(_component_el_card, {
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
      })]),
      _: 1
    }), createVNode(_component_el_form, {
      inline: true
    }, {
      default: withCtx(() => [createVNode(_component_el_form_item, null, {
        default: withCtx(() => [$setup.data.token.length > 0 ? withDirectives((openBlock(), createBlock(_component_el_button, {
          key: 0,
          size: "small",
          icon: $setup.useRenderIcon("ep:copy-document")
        }, null, 8, ["icon"])), [[_directive_copy, $setup.data.token.join("\n"), "click"]]) : createCommentVNode("", true), createVNode(_component_el_button, {
          type: "primary",
          size: "small",
          icon: $setup.useRenderIcon("ep:refresh"),
          onClick: _cache[2] || (_cache[2] = ($event) => $setup.generateTokenList())
        }, null, 8, ["icon"])]),
        _: 1
      })]),
      _: 1
    }), createVNode(_component_el_form, {
      inline: true
    }, {
      default: withCtx(() => [createVNode(_component_el_form_item, {
        label: "\u6570\u91CF"
      }, {
        default: withCtx(() => [createVNode(_component_el_slider, {
          modelValue: $setup.setting.lengthCase,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.setting.lengthCase = $event),
          class: "!min-w-[500px]",
          min: 1,
          max: 100,
          "show-tooltip": ""
        }, null, 8, ["modelValue"])]),
        _: 1
      })]),
      _: 1
    }), createBaseVNode("div", _hoisted_10, [$setup.data.token.length > 0 ? (openBlock(), createElementBlock("ul", _hoisted_11, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.data.token, (item, index2) => {
      return openBlock(), createElementBlock("li", {
        key: index2,
        class: "uuid-item"
      }, [createBaseVNode("span", _hoisted_12, toDisplayString(index2 + 1), 1), createBaseVNode("span", _hoisted_13, toDisplayString(item), 1), withDirectives((openBlock(), createBlock(_component_el_button, {
        link: "",
        type: "primary",
        size: "small"
      }, {
        default: withCtx(() => [createVNode(_component_IconifyIconOnline, {
          icon: "ep:copy-document"
        })]),
        _: 1
      })), [[_directive_copy, item, "click"]])]);
    }), 128))])) : (openBlock(), createBlock(_component_el_empty, {
      key: 1,
      description: "\u70B9\u51FB\u751F\u6210\u6309\u94AE\u521B\u5EFA UUID"
    }))])]),
    _: 1
  })])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-80a122e9"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/tools/codec/uuid/index.vue"]]);
export {
  index as default
};
