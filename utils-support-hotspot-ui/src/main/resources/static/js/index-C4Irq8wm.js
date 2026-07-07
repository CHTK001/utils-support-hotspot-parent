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
import { _ as _export_sfc, e as resolveComponent, c as createElementBlock, o as openBlock, h as createBaseVNode, g as createVNode, i as createTextVNode, k as withCtx, t as toDisplayString, P as reactive, r as ref, T as nextTick, aS as unref, bN as inject, ar as useRenderIcon } from "./index-DsQ9-pB_.js";
import { P as Prism } from "./prism-inline-color.min-C0_E9ZbJ.js";
import { f as format } from "./sqlFormatter-Bv4W08uf.js";
const _sfc_main = {
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const setting = reactive({
      type: "0"
    });
    const oldSql = ref("select field1,field2,field3 from my_table where my_condition;");
    const newSql = ref("select field1,field2,field3 from my_table where my_condition;");
    const handle = () => {
      try {
        if (setting.type == "0") {
          return handleFormat();
        }
        if (setting.type == "1") {
          return handleAnalysis();
        }
        if (setting.type == "-1") {
          newSql.value = "";
          oldSql.value = "";
        }
      } catch (e) {
      }
    };
    const handleAnalysis = () => {
      const sqlPart = oldSql.value.match(/Preparing: (.*)/)[1];
      const paramsPart = oldSql.value.match(/Parameters: (.*)/)[1].replace(/\(.*?\)/g, "");
      const paramsArray = paramsPart.split(", ").map((param) => param.trim());
      let completeSql = sqlPart;
      paramsArray.forEach((param, index2) => {
        completeSql = completeSql.replace("?", param);
      });
      newSql.value = format(completeSql);
      handlePrism();
    };
    const handleFormat = () => {
      newSql.value = format(oldSql.value);
      handlePrism();
    };
    const handlePrism = () => __async(null, null, function* () {
      setTimeout(() => __async(null, null, function* () {
        Prism.highlightAll();
        try {
          document.querySelectorAll("pre code").forEach((ele) => {
            Prism.highlightElement(ele);
          });
        } catch (error) {
        }
      }), 300);
    });
    handlePrism();
    const __returned__ = {
      setting,
      oldSql,
      newSql,
      handle,
      handleAnalysis,
      handleFormat,
      handlePrism,
      get format() {
        return format;
      },
      inject,
      reactive,
      unref,
      nextTick,
      ref,
      get Prism() {
        return Prism;
      },
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
  class: "flex-1 overflow-hidden"
};
const _hoisted_7 = {
  class: "toolbar-section"
};
const _hoisted_8 = {
  class: "editor-header"
};
const _hoisted_9 = {
  class: "editor-header"
};
const _hoisted_10 = {
  ref: "sqlPre",
  class: "sql-result"
};
const _hoisted_11 = {
  class: "language-sql line-numbers"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_segmented = resolveComponent("el-segmented");
  const _component_el_input = resolveComponent("el-input");
  const _component_el_col = resolveComponent("el-col");
  const _component_el_button = resolveComponent("el-button");
  const _component_el_row = resolveComponent("el-row");
  const _component_el_card = resolveComponent("el-card");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:code-s-slash-line",
    class: "title-icon"
  }), _cache[2] || (_cache[2] = createTextVNode(" SQL \u683C\u5F0F\u5316\u5DE5\u5177 ", -1))]), _cache[3] || (_cache[3] = createBaseVNode("p", {
    class: "page-subtitle"
  }, "\u683C\u5F0F\u5316\u548C\u89E3\u6790 SQL \u8BED\u53E5", -1))])])]), createBaseVNode("div", _hoisted_6, [createVNode(_component_el_card, {
    shadow: "never",
    class: "h-full"
  }, {
    default: withCtx(() => [createBaseVNode("div", _hoisted_7, [createVNode(_component_el_segmented, {
      modelValue: $setup.setting.type,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.setting.type = $event),
      options: [{
        label: "\u683C\u5F0F\u5316",
        value: "0"
      }, {
        label: "\u89E3\u6790SQL",
        value: "1"
      }, {
        label: "\u6E05\u7A7A",
        value: "-1"
      }],
      onChange: $setup.handle
    }, null, 8, ["modelValue"])]), createVNode(_component_el_row, {
      gutter: 16,
      class: "sql-editor-row"
    }, {
      default: withCtx(() => [createVNode(_component_el_col, {
        span: 10
      }, {
        default: withCtx(() => [createBaseVNode("div", _hoisted_8, [createVNode(_component_IconifyIconOnline, {
          icon: "ri:file-edit-line",
          class: "editor-icon"
        }), _cache[4] || (_cache[4] = createBaseVNode("span", null, "\u8F93\u5165 SQL", -1))]), createVNode(_component_el_input, {
          modelValue: $setup.oldSql,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.oldSql = $event),
          type: "textarea",
          rows: 25,
          class: "sql-textarea",
          placeholder: "\u8BF7\u8F93\u5165 SQL \u8BED\u53E5..."
        }, null, 8, ["modelValue"])]),
        _: 1
      }), createVNode(_component_el_col, {
        span: 2,
        class: "flex items-center justify-center"
      }, {
        default: withCtx(() => [createVNode(_component_el_button, {
          type: "primary",
          circle: "",
          size: "large",
          icon: $setup.useRenderIcon("ep:d-arrow-right"),
          onClick: $setup.handle
        }, null, 8, ["icon"])]),
        _: 1
      }), createVNode(_component_el_col, {
        span: 12
      }, {
        default: withCtx(() => [createBaseVNode("div", _hoisted_9, [createVNode(_component_IconifyIconOnline, {
          icon: "ri:code-box-line",
          class: "editor-icon"
        }), _cache[5] || (_cache[5] = createBaseVNode("span", null, "\u683C\u5F0F\u5316\u7ED3\u679C", -1))]), createBaseVNode("pre", _hoisted_10, [createBaseVNode("code", _hoisted_11, toDisplayString($setup.newSql), 1)], 512)]),
        _: 1
      })]),
      _: 1
    })]),
    _: 1
  })])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-49b20d4d"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/tools/web/sql/index.vue"]]);
export {
  index as default
};
