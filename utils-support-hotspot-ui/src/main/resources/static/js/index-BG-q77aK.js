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
import { _ as _export_sfc, e as resolveComponent, c as createElementBlock, o as openBlock, h as createBaseVNode, g as createVNode, i as createTextVNode, t as toDisplayString, k as withCtx, j as createBlock, F as Fragment, m as renderList, P as reactive, l as onMounted, bF as wsService, b as onUnmounted, T as nextTick, ar as useRenderIcon } from "./index-DsQ9-pB_.js";
import { P as Prism } from "./prism-inline-color.min-C0_E9ZbJ.js";
import "./prism-http.min-YQ52BusG.js";
import { f as format } from "./sqlFormatter-Bv4W08uf.js";
const _sfc_main = {
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const form = reactive({
      message: null
    });
    const dataList = reactive([]);
    const config = reactive({
      lock: true,
      mainData: null
    });
    let unsubscribe = null;
    const handleWsMessage = (message) => {
      if (message.event === "AGENT_SQL") {
        try {
          const sqlData = typeof message.data === "string" ? JSON.parse(message.data) : message.data;
          dataList.push({
            data: sqlData
          });
          while (dataList.length > 1e4) {
            dataList.shift();
          }
          if (config.lock) {
            nextTick(() => {
              const container = document.querySelector("#containerRef");
              if (container) {
                container.scrollTop = container.scrollHeight;
              }
            });
          }
        } catch (error) {
          console.error("\u89E3\u6790 SQL \u6570\u636E\u5931\u8D25:", error);
        }
      }
    };
    const handleEventOne = (row) => {
      config.mainData = row;
      setTimeout(() => __async(null, null, function* () {
        Prism.highlightAll();
        try {
          document.querySelectorAll("pre code").forEach((ele) => {
            Prism.highlightElement(ele);
          });
        } catch (error) {
        }
      }), 300);
    };
    const getData = (data) => {
      return data.filter((item) => filter(item));
    };
    const filter = (row) => {
      var _a, _b;
      if (!form.message) {
        return true;
      }
      if (!((_a = row == null ? void 0 : row.data) == null ? void 0 : _a.sql)) {
        return false;
      }
      return ((_b = row.data.sql) == null ? void 0 : _b.indexOf(form.message)) > -1;
    };
    onMounted(() => {
      unsubscribe = wsService.subscribe("SQL", "AGENT_SQL", handleWsMessage);
    });
    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });
    const __returned__ = {
      form,
      dataList,
      config,
      get unsubscribe() {
        return unsubscribe;
      },
      set unsubscribe(v) {
        unsubscribe = v;
      },
      handleWsMessage,
      handleEventOne,
      getData,
      filter,
      get useRenderIcon() {
        return useRenderIcon;
      },
      get Prism() {
        return Prism;
      },
      get format() {
        return format;
      },
      nextTick,
      onMounted,
      onUnmounted,
      reactive,
      get wsService() {
        return wsService;
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
  class: "sql-container"
};
const _hoisted_11 = {
  class: "control-buttons"
};
const _hoisted_12 = {
  class: "section-header"
};
const _hoisted_13 = {
  id: "containerRef",
  class: "sql-list"
};
const _hoisted_14 = {
  class: "sql-index"
};
const _hoisted_15 = {
  class: "sql-table"
};
const _hoisted_16 = {
  key: 0,
  class: "sql-detail"
};
const _hoisted_17 = {
  class: "section-header"
};
const _hoisted_18 = {
  class: "sql-code"
};
const _hoisted_19 = {
  class: "language-sql"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_button = resolveComponent("el-button");
  const _component_el_col = resolveComponent("el-col");
  const _component_el_empty = resolveComponent("el-empty");
  const _component_el_row = resolveComponent("el-row");
  const _component_el_card = resolveComponent("el-card");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:database-2-line",
    class: "title-icon"
  }), _cache[3] || (_cache[3] = createTextVNode(" SQL \u76D1\u63A7 ", -1))]), _cache[4] || (_cache[4] = createBaseVNode("p", {
    class: "page-subtitle"
  }, "\u5B9E\u65F6\u76D1\u63A7\u548C\u5206\u6790 SQL \u6267\u884C\u60C5\u51B5", -1))]), createBaseVNode("div", _hoisted_6, [createBaseVNode("div", _hoisted_7, [createBaseVNode("div", _hoisted_8, toDisplayString($setup.dataList.length), 1), _cache[5] || (_cache[5] = createBaseVNode("div", {
    class: "stat-label"
  }, "SQL \u8BB0\u5F55", -1))])])])]), createBaseVNode("div", _hoisted_9, [createVNode(_component_el_card, {
    shadow: "never",
    class: "h-full"
  }, {
    default: withCtx(() => [createBaseVNode("div", _hoisted_10, [createBaseVNode("div", _hoisted_11, [$setup.config.lock ? (openBlock(), createBlock(_component_el_button, {
      key: 0,
      type: "primary",
      circle: "",
      icon: $setup.useRenderIcon("ep:lock"),
      onClick: _cache[0] || (_cache[0] = ($event) => $setup.config.lock = false),
      title: "\u89E3\u9501\u6EDA\u52A8"
    }, null, 8, ["icon"])) : (openBlock(), createBlock(_component_el_button, {
      key: 1,
      circle: "",
      icon: $setup.useRenderIcon("ep:unlock"),
      onClick: _cache[1] || (_cache[1] = ($event) => $setup.config.lock = true),
      title: "\u9501\u5B9A\u6EDA\u52A8"
    }, null, 8, ["icon"])), createVNode(_component_el_button, {
      circle: "",
      type: "danger",
      icon: $setup.useRenderIcon("ep:delete-filled"),
      onClick: _cache[2] || (_cache[2] = ($event) => $setup.dataList.length = 0),
      title: "\u6E05\u7A7A\u8BB0\u5F55"
    }, null, 8, ["icon"])]), createVNode(_component_el_row, {
      gutter: 16,
      class: "h-full"
    }, {
      default: withCtx(() => [createVNode(_component_el_col, {
        span: 8,
        class: "h-full"
      }, {
        default: withCtx(() => [createBaseVNode("div", _hoisted_12, [createVNode(_component_IconifyIconOnline, {
          icon: "ri:list-check",
          class: "section-icon"
        }), _cache[6] || (_cache[6] = createBaseVNode("span", null, "SQL \u5217\u8868", -1))]), createBaseVNode("ul", _hoisted_13, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.getData($setup.dataList), (item, index2) => {
          return openBlock(), createElementBlock("li", {
            key: index2,
            class: "sql-item"
          }, [createVNode(_component_el_button, {
            class: "sql-button",
            onClick: ($event) => $setup.handleEventOne(item)
          }, {
            default: withCtx(() => {
              var _a, _b;
              return [createBaseVNode("span", _hoisted_14, toDisplayString(index2 + 1), 1), createBaseVNode("span", _hoisted_15, toDisplayString(((_b = (_a = item == null ? void 0 : item.data) == null ? void 0 : _a.tables) == null ? void 0 : _b[0]) || "SQL"), 1)];
            }),
            _: 2
          }, 1032, ["onClick"])]);
        }), 128))])]),
        _: 1
      }), createVNode(_component_el_col, {
        span: 16,
        class: "h-full"
      }, {
        default: withCtx(() => {
          var _a, _b;
          return [$setup.config.mainData ? (openBlock(), createElementBlock("div", _hoisted_16, [createBaseVNode("div", _hoisted_17, [createVNode(_component_IconifyIconOnline, {
            icon: "ri:code-box-line",
            class: "section-icon"
          }), _cache[7] || (_cache[7] = createBaseVNode("span", null, "SQL \u8BED\u53E5", -1))]), createBaseVNode("pre", _hoisted_18, [createBaseVNode("code", _hoisted_19, toDisplayString($setup.format(((_b = (_a = $setup.config.mainData) == null ? void 0 : _a.data) == null ? void 0 : _b.sql) || "SELECT 1")), 1)])])) : (openBlock(), createBlock(_component_el_empty, {
            key: 1,
            description: "\u8BF7\u9009\u62E9 SQL \u8BB0\u5F55\u67E5\u770B\u8BE6\u60C5"
          }))];
        }),
        _: 1
      })]),
      _: 1
    })])]),
    _: 1
  })])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-33f5f5e2"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/hotspot/sql/index.vue"]]);
export {
  index as default
};
