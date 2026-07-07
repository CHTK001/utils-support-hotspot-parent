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
import { P as Prism } from "./prism-inline-color.min-C0_E9ZbJ.js";
import { f as format } from "./sqlFormatter-Bv4W08uf.js";
import "./prism-http.min-YQ52BusG.js";
import { _ as _export_sfc, e as resolveComponent, c as createElementBlock, o as openBlock, h as createBaseVNode, g as createVNode, i as createTextVNode, t as toDisplayString, k as withCtx, n as normalizeStyle, v as createCommentVNode, j as createBlock, x as resolveDynamicComponent, P as reactive, r as ref, l as onMounted, bF as wsService, b as onUnmounted, T as nextTick, ar as useRenderIcon } from "./index-DsQ9-pB_.js";
import { d as dateFormat } from "./index-Df2x6qn1.js";
const _sfc_main = {
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const config = reactive({
      dialogVisible: false,
      dialogDetailData: {}
    });
    const dataList = reactive([]);
    const datav = ref(false);
    const defaultProps = {
      children: "children",
      label: "description"
    };
    let unsubscribe = null;
    const handleWsMessage = (message) => {
      if (message.event === "AGENT_TRACE") {
        try {
          const traceData = typeof message.data === "string" ? JSON.parse(message.data) : message.data;
          dataList.unshift(traceData);
          while (dataList.length > 1e3) {
            dataList.pop();
          }
        } catch (error) {
          console.error("\u89E3\u6790\u94FE\u8DEF\u6570\u636E\u5931\u8D25:", error);
        }
      }
    };
    const handleShowTrack = (data) => __async(null, null, function* () {
      config.dialogVisible = true;
      config.dialogDetailData = data;
      yield nextTick();
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
    onMounted(() => {
      unsubscribe = wsService.subscribe("TRACE", "AGENT_TRACE", handleWsMessage);
    });
    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });
    const __returned__ = {
      config,
      dataList,
      datav,
      defaultProps,
      get unsubscribe() {
        return unsubscribe;
      },
      set unsubscribe(v) {
        unsubscribe = v;
      },
      handleWsMessage,
      handleShowTrack,
      get Prism() {
        return Prism;
      },
      get format() {
        return format;
      },
      get dateFormat() {
        return dateFormat;
      },
      nextTick,
      onMounted,
      onUnmounted,
      reactive,
      ref,
      get useRenderIcon() {
        return useRenderIcon;
      },
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
  ref: "containerRef",
  class: "h-full overflow-auto"
};
const _hoisted_11 = {
  class: "flex flex-wrap bg-transparent"
};
const _hoisted_12 = {
  class: "w-full max-w-full px-3 sm:flex-0 shrink-0 bg-transparent"
};
const _hoisted_13 = {
  class: "relative flex flex-col min-w-0 break-words bg-transparent shadow-soft-xl dark:shadow-soft-dark-xl rounded-2xl bg-clip-border"
};
const _hoisted_14 = {
  class: "flex-auto"
};
const _hoisted_15 = ["title"];
const _hoisted_16 = {
  key: 0
};
const _hoisted_17 = ["innerHTML"];
const _hoisted_18 = {
  key: 1
};
const _hoisted_19 = {
  key: 1
};
const _hoisted_20 = ["innerHTML"];
const _hoisted_21 = ["innerHTML"];
const _hoisted_22 = {
  key: 2,
  class: "text-pretty"
};
const _hoisted_23 = {
  key: 2,
  style: {
    "height": "26px"
  }
};
const _hoisted_24 = {
  style: {
    "height": "26px"
  }
};
const _hoisted_25 = ["innerHTML"];
const _hoisted_26 = {
  class: "demo-drawer__content bg-transparent"
};
const _hoisted_27 = {
  key: 0
};
const _hoisted_28 = {
  class: "language-http"
};
const _hoisted_29 = {
  key: 1
};
const _hoisted_30 = {
  class: "language-http"
};
const _hoisted_31 = ["innerHTML"];
const _hoisted_32 = {
  key: 2
};
const _hoisted_33 = {
  class: "language-sql"
};
const _hoisted_34 = {
  key: 3
};
const _hoisted_35 = {
  class: "language-java"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_tag = resolveComponent("el-tag");
  const _component_el_icon = resolveComponent("el-icon");
  const _component_el_tree = resolveComponent("el-tree");
  const _component_el_card = resolveComponent("el-card");
  const _component_el_descriptions_item = resolveComponent("el-descriptions-item");
  const _component_el_descriptions = resolveComponent("el-descriptions");
  const _component_el_divider = resolveComponent("el-divider");
  const _component_el_drawer = resolveComponent("el-drawer");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:route-line",
    class: "title-icon"
  }), _cache[1] || (_cache[1] = createTextVNode(" \u94FE\u8DEF\u8FFD\u8E2A ", -1))]), _cache[2] || (_cache[2] = createBaseVNode("p", {
    class: "page-subtitle"
  }, "\u5B9E\u65F6\u67E5\u770B\u8BF7\u6C42\u8C03\u7528\u94FE\u548C\u6267\u884C\u8DEF\u5F84", -1))]), createBaseVNode("div", _hoisted_6, [createBaseVNode("div", _hoisted_7, [createBaseVNode("div", _hoisted_8, toDisplayString($setup.dataList.length), 1), _cache[3] || (_cache[3] = createBaseVNode("div", {
    class: "stat-label"
  }, "\u8FFD\u8E2A\u8BB0\u5F55", -1))])])])]), createBaseVNode("div", _hoisted_9, [createVNode(_component_el_card, {
    shadow: "never",
    class: "h-full trace-card"
  }, {
    default: withCtx(() => [createBaseVNode("div", _hoisted_10, [createVNode(_component_el_tree, {
      data: $setup.dataList,
      style: normalizeStyle({
        height: "100%",
        "background- color": $setup.datav ? "transparent" : "",
        "--datav": $setup.datav ? "transparent" : "",
        color: $setup.datav ? "#fff" : "unset",
        overflow: "auto"
      }),
      props: $setup.defaultProps
    }, {
      default: withCtx(({
        data
      }) => [createBaseVNode("div", _hoisted_11, [createBaseVNode("div", _hoisted_12, [createBaseVNode("div", _hoisted_13, [createBaseVNode("div", _hoisted_14, [createBaseVNode("span", {
        class: "custom-tree-node bg-transparent",
        title: data.description
      }, [data.id == data.linkId ? (openBlock(), createElementBlock("span", _hoisted_16, [(data.description || "").indexOf("span") > -1 ? (openBlock(), createElementBlock("span", {
        key: 0,
        innerHTML: data.description || data.ex
      }, null, 8, _hoisted_17)) : (openBlock(), createElementBlock("span", _hoisted_18, [createVNode(_component_el_tag, null, {
        default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("Http", -1)])]),
        _: 1
      }), createVNode(_component_el_tag, {
        type: "primary",
        class: "ml-1"
      }, {
        default: withCtx(() => [createTextVNode(toDisplayString(data.description || data.ex), 1)]),
        _: 2
      }, 1024)]))])) : (openBlock(), createElementBlock("span", _hoisted_19, [createBaseVNode("span", null, [(data.description || "").indexOf("span") > -1 ? (openBlock(), createElementBlock("span", {
        key: 0,
        innerHTML: data.description || data.ex
      }, null, 8, _hoisted_20)) : (data.typeName || "").indexOf("span") > -1 || (data.typeName || "").indexOf("el-tag") > -1 ? (openBlock(), createElementBlock("span", {
        key: 1,
        innerHTML: data.typeName
      }, null, 8, _hoisted_21)) : (openBlock(), createElementBlock("span", _hoisted_22, toDisplayString(data.description), 1))])])), _cache[5] || (_cache[5] = createTextVNode(" @ ", -1)), (data == null ? void 0 : data.timestamp) ? (openBlock(), createElementBlock("span", _hoisted_23, toDisplayString($setup.dateFormat((data == null ? void 0 : data.timestamp) * 1)), 1)) : createCommentVNode("", true), _cache[6] || (_cache[6] = createTextVNode(" \u8017\u65F6: ", -1)), createBaseVNode("span", _hoisted_24, toDisplayString(data == null ? void 0 : data.costTime) + " ms", 1), createVNode(_component_el_icon, {
        class: "z-[10]",
        onClick: ($event) => $setup.handleShowTrack(data)
      }, {
        default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent($setup.useRenderIcon("ri:information-2-line"))))]),
        _: 1
      }, 8, ["onClick"])], 8, _hoisted_15)])])])])]),
      _: 1
    }, 8, ["data", "style"])], 512)]),
    _: 1
  })]), createVNode(_component_el_drawer, {
    ref: "drawerRef",
    modelValue: $setup.config.dialogVisible,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.config.dialogVisible = $event),
    "append-to-body": true,
    size: "60%",
    direction: "rtl",
    class: "trace-drawer",
    "destroy-on-close": true
  }, {
    title: withCtx(() => [createBaseVNode("span", {
      innerHTML: $setup.config.dialogDetailData.description
    }, null, 8, _hoisted_25)]),
    default: withCtx(() => {
      var _a, _b;
      return [createBaseVNode("div", _hoisted_26, [createVNode(_component_el_descriptions, {
        border: "",
        column: 1
      }, {
        default: withCtx(() => [createVNode(_component_el_descriptions_item, {
          label: "linkId"
        }, {
          default: withCtx(() => [createTextVNode(toDisplayString($setup.config.dialogDetailData.linkId), 1)]),
          _: 1
        }), $setup.config.dialogDetailData.applicationName ? (openBlock(), createBlock(_component_el_descriptions_item, {
          key: 0,
          label: "\u5E94\u7528\u5730\u5740"
        }, {
          default: withCtx(() => [createVNode(_component_el_tag, null, {
            default: withCtx(() => [createTextVNode(toDisplayString($setup.config.dialogDetailData.applicationName), 1)]),
            _: 1
          }), createTextVNode(" " + toDisplayString($setup.config.dialogDetailData.applicationHost) + ":" + toDisplayString($setup.config.dialogDetailData.applicationPort), 1)]),
          _: 1
        })) : createCommentVNode("", true), createVNode(_component_el_descriptions_item, {
          label: "\u8FDB\u5165\u65B9\u6CD5\u65F6\u95F4"
        }, {
          default: withCtx(() => [createTextVNode(toDisplayString($setup.dateFormat($setup.config.dialogDetailData.enterTime * 1)), 1)]),
          _: 1
        }), createVNode(_component_el_descriptions_item, {
          label: "\u8017\u65F6"
        }, {
          default: withCtx(() => [createTextVNode(toDisplayString($setup.config.dialogDetailData.costTime) + " ms", 1)]),
          _: 1
        })]),
        _: 1
      }), $setup.config.dialogDetailData.headers && $setup.config.dialogDetailData.headers.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_27, [_cache[7] || (_cache[7] = createBaseVNode("div", null, "header", -1)), createBaseVNode("pre", null, [createBaseVNode("code", _hoisted_28, toDisplayString((_a = $setup.config.dialogDetailData.headers) == null ? void 0 : _a.join("\n")), 1)])])) : createCommentVNode("", true), $setup.config.dialogDetailData.tips && $setup.config.dialogDetailData.tips.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_29, [createVNode(_component_el_divider), _cache[8] || (_cache[8] = createBaseVNode("div", null, "tips", -1)), createBaseVNode("pre", null, [createBaseVNode("code", _hoisted_30, [createBaseVNode("span", {
        innerHTML: $setup.config.dialogDetailData.tips.join("\n")
      }, null, 8, _hoisted_31)])])])) : createCommentVNode("", true), $setup.config.dialogDetailData.category == "SQL" ? (openBlock(), createElementBlock("div", _hoisted_32, [createVNode(_component_el_divider), _cache[9] || (_cache[9] = createBaseVNode("div", null, "sql", -1)), createBaseVNode("pre", null, [createBaseVNode("code", _hoisted_33, toDisplayString($setup.format($setup.config.dialogDetailData.description)), 1)])])) : createCommentVNode("", true), $setup.config.dialogDetailData.stackTrace && $setup.config.dialogDetailData.stackTrace.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_34, [createVNode(_component_el_divider), _cache[10] || (_cache[10] = createBaseVNode("div", null, "\u5806\u6808", -1)), createBaseVNode("pre", null, [createBaseVNode("code", _hoisted_35, toDisplayString($setup.config.dialogDetailData.stackTrace instanceof Array ? (_b = $setup.config.dialogDetailData.stackTrace) == null ? void 0 : _b.join("\r\n") : $setup.config.dialogDetailData.stackTrace), 1)])])) : createCommentVNode("", true)])];
    }),
    _: 1
  }, 8, ["modelValue"])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-732d71d9"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/hotspot/trace/index.vue"]]);
export {
  index as default
};
