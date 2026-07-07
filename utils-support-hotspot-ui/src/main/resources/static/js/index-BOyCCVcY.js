import { Q as QrcodeVue } from "./qrcode.vue.esm-DKkHPbpI.js";
import { _ as _export_sfc, ar as useRenderIcon, e as resolveComponent, c as createElementBlock, o as openBlock, h as createBaseVNode, g as createVNode, i as createTextVNode, k as withCtx, t as toDisplayString } from "./index-DsQ9-pB_.js";
const _sfc_main = {
  name: "QrCodeComponent",
  components: {
    QrcodeVue
  },
  data() {
    return {
      textValue: "\u6D4B\u8BD5",
      widthValue: 200,
      levelValue: "H",
      heightValue: 100
    };
  },
  methods: {
    useRenderIcon,
    generateQRCode() {
      const canvas = this.$refs.qrcodeCanvas;
      QRCode.toCanvas(canvas, this.textValue, (error) => {
        if (error) console.error(error);
      });
    }
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
const _hoisted_7 = {
  class: "qrcode-preview"
};
const _hoisted_8 = {
  class: "qrcode-wrapper"
};
const _hoisted_9 = {
  class: "qrcode-info"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_input = resolveComponent("el-input");
  const _component_el_form_item = resolveComponent("el-form-item");
  const _component_el_form = resolveComponent("el-form");
  const _component_el_segmented = resolveComponent("el-segmented");
  const _component_el_slider = resolveComponent("el-slider");
  const _component_el_col = resolveComponent("el-col");
  const _component_qrcode_vue = resolveComponent("qrcode-vue");
  const _component_el_tag = resolveComponent("el-tag");
  const _component_el_row = resolveComponent("el-row");
  const _component_el_card = resolveComponent("el-card");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:qr-code-line",
    class: "title-icon"
  }), _cache[3] || (_cache[3] = createTextVNode(" \u4E8C\u7EF4\u7801\u751F\u6210\u5668 ", -1))]), _cache[4] || (_cache[4] = createBaseVNode("p", {
    class: "page-subtitle"
  }, "\u5C06\u6587\u672C\u8F6C\u6362\u4E3A\u4E8C\u7EF4\u7801\u56FE\u7247", -1))])])]), createBaseVNode("div", _hoisted_6, [createVNode(_component_el_card, {
    shadow: "never"
  }, {
    default: withCtx(() => [createVNode(_component_el_row, {
      gutter: 20
    }, {
      default: withCtx(() => [createVNode(_component_el_col, {
        span: 12
      }, {
        default: withCtx(() => [createVNode(_component_el_form, {
          inline: true
        }, {
          default: withCtx(() => [createVNode(_component_el_form_item, {
            label: "\u6587\u672C"
          }, {
            default: withCtx(() => [createVNode(_component_el_input, {
              modelValue: $data.textValue,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.textValue = $event),
              type: "textarea",
              rows: 10,
              class: "!w-[500px]"
            }, null, 8, ["modelValue"])]),
            _: 1
          })]),
          _: 1
        }), createVNode(_component_el_form, {
          inline: true
        }, {
          default: withCtx(() => [createVNode(_component_el_form_item, {
            label: "\u8D28\u91CF"
          }, {
            default: withCtx(() => [createVNode(_component_el_segmented, {
              modelValue: $data.levelValue,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.levelValue = $event),
              options: [{
                label: "\u9AD8",
                value: "H"
              }, {
                label: "\u4E2D",
                value: "M"
              }, {
                label: "\u4F4E",
                value: "L"
              }]
            }, null, 8, ["modelValue"])]),
            _: 1
          })]),
          _: 1
        }), createVNode(_component_el_form, {
          inline: true
        }, {
          default: withCtx(() => [createVNode(_component_el_form_item, {
            label: "\u5927\u5C0F"
          }, {
            default: withCtx(() => [createVNode(_component_el_slider, {
              modelValue: $data.widthValue,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.widthValue = $event),
              class: "!min-w-[500px]",
              min: 100,
              max: 1024,
              "show-tooltip": ""
            }, null, 8, ["modelValue"])]),
            _: 1
          })]),
          _: 1
        })]),
        _: 1
      }), createVNode(_component_el_col, {
        span: 12
      }, {
        default: withCtx(() => [createBaseVNode("div", _hoisted_7, [createBaseVNode("div", _hoisted_8, [createVNode(_component_qrcode_vue, {
          value: $data.textValue,
          level: $data.levelValue,
          size: $data.widthValue
        }, null, 8, ["value", "level", "size"])]), createBaseVNode("div", _hoisted_9, [createVNode(_component_el_tag, null, {
          default: withCtx(() => [createTextVNode(toDisplayString($data.widthValue) + " x " + toDisplayString($data.widthValue), 1)]),
          _: 1
        }), createVNode(_component_el_tag, {
          type: "info"
        }, {
          default: withCtx(() => [createTextVNode(toDisplayString($data.levelValue) + " \u8D28\u91CF", 1)]),
          _: 1
        })])])]),
        _: 1
      })]),
      _: 1
    })]),
    _: 1
  })])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bc51997c"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/tools/web/qrcode/index.vue"]]);
export {
  index as default
};
