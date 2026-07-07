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
import { _ as _export_sfc, e as resolveComponent, c as createElementBlock, o as openBlock, h as createBaseVNode, g as createVNode, i as createTextVNode, t as toDisplayString, k as withCtx, r as ref, Z as onBeforeMount, y as http } from "./index-DsQ9-pB_.js";
const _sfc_main = {
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const data = ref([]);
    const infoVisible = ref(false);
    const info = ref("");
    const handleInfo = (row) => {
      info.value = JSON.stringify(row, null, 2);
      infoVisible.value = true;
    };
    onBeforeMount(() => __async(null, null, function* () {
      http.get((window.agentPath || "/agent") + "/table_info").then((res) => {
        data.value = res.data.data || [];
      });
    }));
    const __returned__ = {
      data,
      infoVisible,
      info,
      handleInfo,
      get http() {
        return http;
      },
      onBeforeMount,
      ref
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
  class: "flex-1 overflow-hidden"
};
const _hoisted_10 = {
  class: "flex items-center gap-2"
};
const _hoisted_11 = {
  class: "font-medium"
};
const _hoisted_12 = {
  class: "font-mono"
};
const _hoisted_13 = {
  class: "code-block"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_table_column = resolveComponent("el-table-column");
  const _component_el_tag = resolveComponent("el-tag");
  const _component_el_button = resolveComponent("el-button");
  const _component_el_table = resolveComponent("el-table");
  const _component_el_card = resolveComponent("el-card");
  const _component_el_dialog = resolveComponent("el-dialog");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:database-2-line",
    class: "title-icon"
  }), _cache[1] || (_cache[1] = createTextVNode(" \u6570\u636E\u5E93\u8868\u4FE1\u606F ", -1))]), _cache[2] || (_cache[2] = createBaseVNode("p", {
    class: "page-subtitle"
  }, "\u67E5\u770B\u548C\u7BA1\u7406\u6570\u636E\u5E93\u8868\u7ED3\u6784\u4FE1\u606F", -1))]), createBaseVNode("div", _hoisted_6, [createBaseVNode("div", _hoisted_7, [createBaseVNode("div", _hoisted_8, toDisplayString($setup.data.length), 1), _cache[3] || (_cache[3] = createBaseVNode("div", {
    class: "stat-label"
  }, "\u603B\u8868\u6570", -1))])])])]), createBaseVNode("div", _hoisted_9, [createVNode(_component_el_card, {
    class: "h-full",
    shadow: "never"
  }, {
    default: withCtx(() => [createVNode(_component_el_table, {
      data: $setup.data,
      border: "",
      stripe: "",
      style: {
        "width": "100%"
      },
      "row-key": "name",
      height: "100%"
    }, {
      default: withCtx(() => [createVNode(_component_el_table_column, {
        type: "index",
        label: "#",
        width: "60",
        align: "center"
      }), createVNode(_component_el_table_column, {
        prop: "name",
        label: "\u8868\u540D",
        "min-width": "200"
      }, {
        default: withCtx(({
          row
        }) => [createBaseVNode("div", _hoisted_10, [createVNode(_component_IconifyIconOnline, {
          icon: "ri:table-line",
          class: "text-primary"
        }), createBaseVNode("span", _hoisted_11, toDisplayString(row.name), 1)])]),
        _: 1
      }), createVNode(_component_el_table_column, {
        prop: "comment",
        label: "\u6CE8\u91CA",
        "min-width": "250",
        "show-overflow-tooltip": ""
      }), createVNode(_component_el_table_column, {
        prop: "engine",
        label: "\u5F15\u64CE",
        width: "120",
        align: "center"
      }, {
        default: withCtx(({
          row
        }) => [createVNode(_component_el_tag, {
          size: "small",
          type: "info"
        }, {
          default: withCtx(() => [createTextVNode(toDisplayString(row.engine), 1)]),
          _: 2
        }, 1024)]),
        _: 1
      }), createVNode(_component_el_table_column, {
        prop: "rows",
        label: "\u884C\u6570",
        width: "120",
        align: "right"
      }, {
        default: withCtx(({
          row
        }) => {
          var _a;
          return [createBaseVNode("span", _hoisted_12, toDisplayString((_a = row.rows) == null ? void 0 : _a.toLocaleString()), 1)];
        }),
        _: 1
      }), createVNode(_component_el_table_column, {
        label: "\u64CD\u4F5C",
        width: "120",
        align: "center",
        fixed: "right"
      }, {
        default: withCtx(({
          row
        }) => [createVNode(_component_el_button, {
          link: "",
          type: "primary",
          onClick: ($event) => $setup.handleInfo(row)
        }, {
          default: withCtx(() => [createVNode(_component_IconifyIconOnline, {
            icon: "ri:eye-line",
            class: "mr-1"
          }), _cache[4] || (_cache[4] = createTextVNode(" \u8BE6\u60C5 ", -1))]),
          _: 1
        }, 8, ["onClick"])]),
        _: 1
      })]),
      _: 1
    }, 8, ["data"])]),
    _: 1
  })]), createVNode(_component_el_dialog, {
    modelValue: $setup.infoVisible,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.infoVisible = $event),
    title: "\u8868\u8BE6\u60C5",
    width: "60%",
    "destroy-on-close": ""
  }, {
    default: withCtx(() => [createBaseVNode("pre", _hoisted_13, [createBaseVNode("code", null, toDisplayString($setup.info), 1)])]),
    _: 1
  }, 8, ["modelValue"])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fba4ea9e"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/hotspot/table/index.vue"]]);
export {
  index as default
};
