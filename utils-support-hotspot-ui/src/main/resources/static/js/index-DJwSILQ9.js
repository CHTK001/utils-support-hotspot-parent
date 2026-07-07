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
import { _ as _export_sfc, e as resolveComponent, c as createElementBlock, o as openBlock, h as createBaseVNode, g as createVNode, k as withCtx, i as createTextVNode, t as toDisplayString, j as createBlock, r as ref, q as computed, Z as onBeforeMount, y as http } from "./index-DsQ9-pB_.js";
const _sfc_main = {
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const data = ref([]);
    const infoVisible = ref(false);
    const info = ref("");
    const searchKeyword = ref("");
    const filteredData = computed(() => {
      if (!searchKeyword.value) return data.value;
      const keyword = searchKeyword.value.toLowerCase();
      return data.value.filter((item) => {
        var _a, _b;
        return ((_a = item.name) == null ? void 0 : _a.toLowerCase().includes(keyword)) || ((_b = item.className) == null ? void 0 : _b.toLowerCase().includes(keyword));
      });
    });
    const handleInfo = (row) => {
      info.value = JSON.stringify(row, null, 2);
      infoVisible.value = true;
    };
    onBeforeMount(() => __async(null, null, function* () {
      http.get((window.agentPath || "/agent") + "/spring-bean-data").then((res) => {
        data.value = res.data.data || [];
      });
    }));
    const __returned__ = {
      data,
      infoVisible,
      info,
      searchKeyword,
      filteredData,
      handleInfo,
      get http() {
        return http;
      },
      computed,
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
  class: "page-container"
};
const _hoisted_2 = {
  class: "page-header"
};
const _hoisted_3 = {
  class: "header-left"
};
const _hoisted_4 = {
  class: "header-right"
};
const _hoisted_5 = {
  class: "card-header"
};
const _hoisted_6 = {
  class: "card-title"
};
const _hoisted_7 = {
  class: "bean-name"
};
const _hoisted_8 = {
  class: "class-name"
};
const _hoisted_9 = {
  key: 1,
  class: "text-placeholder"
};
const _hoisted_10 = {
  class: "detail-content"
};
const _hoisted_11 = {
  class: "code-block"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_tag = resolveComponent("el-tag");
  const _component_el_input = resolveComponent("el-input");
  const _component_el_table_column = resolveComponent("el-table-column");
  const _component_el_tooltip = resolveComponent("el-tooltip");
  const _component_el_button = resolveComponent("el-button");
  const _component_el_table = resolveComponent("el-table");
  const _component_el_card = resolveComponent("el-card");
  const _component_el_dialog = resolveComponent("el-dialog");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:seedling-line",
    class: "header-icon"
  }), _cache[2] || (_cache[2] = createBaseVNode("div", {
    class: "header-info"
  }, [createBaseVNode("h2", {
    class: "header-title"
  }, "SpringBean \u7BA1\u7406"), createBaseVNode("p", {
    class: "header-desc"
  }, "\u67E5\u770B\u548C\u7BA1\u7406 Spring \u5BB9\u5668\u4E2D\u7684 Bean \u4FE1\u606F")], -1))]), createBaseVNode("div", _hoisted_4, [createVNode(_component_el_tag, {
    type: "info",
    effect: "light",
    size: "large",
    round: ""
  }, {
    default: withCtx(() => [createVNode(_component_IconifyIconOnline, {
      icon: "ri:database-2-line",
      class: "mr-1"
    }), createTextVNode(" \u5171 " + toDisplayString($setup.data.length) + " \u4E2A Bean ", 1)]),
    _: 1
  })])]), createVNode(_component_el_card, {
    class: "modern-card",
    shadow: "hover"
  }, {
    header: withCtx(() => [createBaseVNode("div", _hoisted_5, [createBaseVNode("span", _hoisted_6, [createVNode(_component_IconifyIconOnline, {
      icon: "ri:list-check-2",
      class: "card-icon"
    }), _cache[3] || (_cache[3] = createTextVNode(" Bean \u5217\u8868 ", -1))]), createVNode(_component_el_input, {
      modelValue: $setup.searchKeyword,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.searchKeyword = $event),
      placeholder: "\u641C\u7D22 Bean \u540D\u79F0\u6216\u7C7B\u540D...",
      clearable: "",
      class: "search-input"
    }, {
      prefix: withCtx(() => [createVNode(_component_IconifyIconOnline, {
        icon: "ep:search"
      })]),
      _: 1
    }, 8, ["modelValue"])])]),
    default: withCtx(() => [createVNode(_component_el_table, {
      data: $setup.filteredData,
      style: {
        "width": "100%"
      },
      "row-key": "id",
      stripe: "",
      "highlight-current-row": "",
      class: "modern-table"
    }, {
      default: withCtx(() => [createVNode(_component_el_table_column, {
        prop: "id",
        label: "ID",
        width: "100"
      }), createVNode(_component_el_table_column, {
        prop: "name",
        label: "Bean \u540D\u79F0",
        "min-width": "200"
      }, {
        default: withCtx(({
          row
        }) => [createBaseVNode("div", _hoisted_7, [createVNode(_component_IconifyIconOnline, {
          icon: "ri:code-box-line",
          class: "bean-icon"
        }), createBaseVNode("span", null, toDisplayString(row.name), 1)])]),
        _: 1
      }), createVNode(_component_el_table_column, {
        prop: "className",
        label: "\u7C7B\u540D",
        "min-width": "300"
      }, {
        default: withCtx(({
          row
        }) => [createVNode(_component_el_tooltip, {
          content: row.className,
          placement: "top",
          "show-after": 500
        }, {
          default: withCtx(() => [createBaseVNode("span", _hoisted_8, toDisplayString(row.className), 1)]),
          _: 2
        }, 1032, ["content"])]),
        _: 1
      }), createVNode(_component_el_table_column, {
        prop: "resource",
        label: "\u8D44\u6E90",
        "min-width": "200"
      }, {
        default: withCtx(({
          row
        }) => [row.resource ? (openBlock(), createBlock(_component_el_tag, {
          key: 0,
          type: "info",
          effect: "plain",
          size: "small"
        }, {
          default: withCtx(() => [createTextVNode(toDisplayString(row.resource), 1)]),
          _: 2
        }, 1024)) : (openBlock(), createElementBlock("span", _hoisted_9, "-"))]),
        _: 1
      }), createVNode(_component_el_table_column, {
        label: "\u64CD\u4F5C",
        width: "120",
        fixed: "right"
      }, {
        default: withCtx(({
          row
        }) => [createVNode(_component_el_button, {
          type: "primary",
          link: "",
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
  }), createVNode(_component_el_dialog, {
    modelValue: $setup.infoVisible,
    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.infoVisible = $event),
    title: "Bean \u8BE6\u60C5",
    width: "60%",
    "destroy-on-close": "",
    class: "modern-dialog"
  }, {
    default: withCtx(() => [createBaseVNode("div", _hoisted_10, [createBaseVNode("pre", _hoisted_11, [createBaseVNode("code", null, toDisplayString($setup.info), 1)])])]),
    _: 1
  }, 8, ["modelValue"])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e7c406f3"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/hotspot/springBean/index.vue"]]);
export {
  index as default
};
