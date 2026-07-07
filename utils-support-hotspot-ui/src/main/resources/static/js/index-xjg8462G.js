import { d as defineComponent, q as computed, P as reactive, r as ref, ar as useRenderIcon, _ as _export_sfc, e as resolveComponent, c as createElementBlock, o as openBlock, v as createCommentVNode, h as createBaseVNode, g as createVNode, i as createTextVNode, k as withCtx, j as createBlock } from "./index-DsQ9-pB_.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const url = computed(() => {
      return link[type.value].replace("{{input}}", input.value);
    });
    const show = ref(true);
    const link = reactive({
      1: "https://jx.xmflv.cc/?url={{input}}?vfm=2008_aldbd&fc=828fb30b722f3164&fv=p_0",
      2: "https://www.8090g.cn/?url={{input}}",
      3: "https://vip.parwix.com:4433/player/?url={{input}}",
      4: "https://jx.m3u8.tv/jiexi/?url={{input}}"
    });
    const type = ref(1);
    const input = ref();
    const goFullScreen = () => {
      const iframe = document.getElementById("myFrame");
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    };
    const __returned__ = {
      url,
      show,
      link,
      type,
      input,
      goFullScreen,
      get useRenderIcon() {
        return useRenderIcon;
      }
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});
const _hoisted_1 = {
  class: "page flex flex-col h-full"
};
const _hoisted_2 = {
  key: 0,
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
  key: 1,
  class: "video-controls"
};
const _hoisted_7 = {
  class: "action-buttons"
};
const _hoisted_8 = {
  class: "flex-1 overflow-hidden"
};
const _hoisted_9 = ["src"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_option = resolveComponent("el-option");
  const _component_el_select = resolveComponent("el-select");
  const _component_el_form_item = resolveComponent("el-form-item");
  const _component_el_input = resolveComponent("el-input");
  const _component_el_form = resolveComponent("el-form");
  const _component_el_card = resolveComponent("el-card");
  const _component_el_button = resolveComponent("el-button");
  return openBlock(), createElementBlock("div", _hoisted_1, [$setup.show ? (openBlock(), createElementBlock("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:video-line",
    class: "title-icon"
  }), _cache[6] || (_cache[6] = createTextVNode(" \u89C6\u9891\u89E3\u6790\u5DE5\u5177 ", -1))]), _cache[7] || (_cache[7] = createBaseVNode("p", {
    class: "page-subtitle"
  }, "\u5728\u7EBF\u64AD\u653E VIP \u89C6\u9891\u8D44\u6E90", -1))])])])) : createCommentVNode("", true), $setup.show ? (openBlock(), createElementBlock("div", _hoisted_6, [createVNode(_component_el_card, {
    shadow: "never",
    class: "controls-card"
  }, {
    default: withCtx(() => [createVNode(_component_el_form, {
      inline: true
    }, {
      default: withCtx(() => [createVNode(_component_el_form_item, {
        label: "\u89E3\u6790\u670D\u52A1",
        class: "w-[200px]"
      }, {
        default: withCtx(() => [createVNode(_component_el_select, {
          modelValue: $setup.type,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.type = $event),
          class: "w-[200px]"
        }, {
          default: withCtx(() => [createVNode(_component_el_option, {
            label: "\u667A\u80FD\u89E3\u6790",
            value: 1
          }), createVNode(_component_el_option, {
            label: "\u5907\u7528\u5730\u57401",
            value: 2
          }), createVNode(_component_el_option, {
            label: "\u5907\u7528\u5730\u57402",
            value: 3
          }), createVNode(_component_el_option, {
            label: "\u5907\u7528\u5730\u57403",
            value: 4
          })]),
          _: 1
        }, 8, ["modelValue"])]),
        _: 1
      }), createVNode(_component_el_form_item, {
        label: "\u89C6\u9891\u5730\u5740",
        class: "w-[800px]"
      }, {
        default: withCtx(() => [createVNode(_component_el_input, {
          modelValue: $setup.input,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.input = $event),
          class: "w-[800px]"
        }, null, 8, ["modelValue"])]),
        _: 1
      })]),
      _: 1
    })]),
    _: 1
  })])) : createCommentVNode("", true), createBaseVNode("div", _hoisted_7, [$setup.show ? (openBlock(), createBlock(_component_el_button, {
    key: 0,
    icon: $setup.useRenderIcon("ri:fullscreen-fill"),
    onClick: _cache[2] || (_cache[2] = ($event) => $setup.goFullScreen())
  }, {
    default: withCtx(() => [..._cache[8] || (_cache[8] = [createTextVNode("\u5168\u5C4F", -1)])]),
    _: 1
  }, 8, ["icon"])) : (openBlock(), createBlock(_component_el_button, {
    key: 1,
    icon: $setup.useRenderIcon("ri:fullscreen-exit-fill"),
    onClick: _cache[3] || (_cache[3] = ($event) => $setup.goFullScreen())
  }, {
    default: withCtx(() => [..._cache[9] || (_cache[9] = [createTextVNode("\u9000\u51FA\u5168\u5C4F", -1)])]),
    _: 1
  }, 8, ["icon"])), $setup.show ? (openBlock(), createBlock(_component_el_button, {
    key: 2,
    icon: $setup.useRenderIcon("ri:arrow-up-double-line"),
    onClick: _cache[4] || (_cache[4] = ($event) => $setup.show = false)
  }, null, 8, ["icon"])) : (openBlock(), createBlock(_component_el_button, {
    key: 3,
    icon: $setup.useRenderIcon("ri:arrow-down-double-line"),
    onClick: _cache[5] || (_cache[5] = ($event) => $setup.show = true)
  }, null, 8, ["icon"]))]), createBaseVNode("div", _hoisted_8, [createBaseVNode("iframe", {
    id: "myFrame",
    class: "video-frame",
    src: $setup.url
  }, null, 8, _hoisted_9)])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3edce680"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/tools/video/index.vue"]]);
export {
  index as default
};
