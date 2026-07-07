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
import { _ as _export_sfc, e as resolveComponent, c as createElementBlock, o as openBlock, h as createBaseVNode, g as createVNode, i as createTextVNode, t as toDisplayString, k as withCtx, F as Fragment, m as renderList, P as reactive, Z as onBeforeMount, y as http } from "./index-DsQ9-pB_.js";
const _sfc_main = {
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    function scrollToElement(element) {
      element == null ? void 0 : element.scrollIntoView({
        behavior: "smooth",
        // 平滑滚动
        block: "start",
        // 元素顶部与视窗顶部对齐
        // 或者 'end' 让元素底部与视窗底部对齐
        // 或者 'center' 让元素在视窗中垂直居中
        inline: "nearest"
        // 水平方向上，选择最近的边缘对齐
        // 或者 'start', 'end', 'center'
      });
    }
    const data = reactive({
      data: [],
      title: ""
    });
    const handleClick = (index2) => __async(null, null, function* () {
      scrollToElement(document.getElementById("element" + index2));
    });
    onBeforeMount(() => __async(null, null, function* () {
      http.get((window.agentPath || "/agent") + "/stream_data").then((res) => {
        var _a;
        let json = res.data;
        let xhr1 = json["data"];
        json["title"];
        let split = xhr1.split("----");
        data.title = split[0] + split[1];
        split = split.slice(2);
        let arr = [];
        let _index = 0;
        for (let item of split) {
          if (!item.trim()) {
            continue;
          }
          let index2 = item.indexOf("</span>");
          let id = void 0;
          if (index2 > -1) {
            id = item.substring(0, index2).replace("Opend <span style='color:red;'>", "").replaceAll("\\", "_").replaceAll(".", "_").replaceAll(":", "_").replaceAll("s+", "_").replaceAll("/", "_").trim();
          }
          arr.push({
            index: _index++,
            id,
            code: item,
            title: (_a = item == null ? void 0 : item.trim()) == null ? void 0 : _a.split("\n")[0]
          });
        }
        data.data = arr;
      });
    }));
    const __returned__ = {
      scrollToElement,
      data,
      handleClick,
      get http() {
        return http;
      },
      onBeforeMount,
      reactive
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
  class: "quick-nav"
};
const _hoisted_10 = {
  class: "nav-header"
};
const _hoisted_11 = {
  class: "nav-list"
};
const _hoisted_12 = ["title", "onClick"];
const _hoisted_13 = ["innerHTML"];
const _hoisted_14 = {
  class: "info-card"
};
const _hoisted_15 = ["innerHTML"];
const _hoisted_16 = {
  class: "flex-1 overflow-auto"
};
const _hoisted_17 = ["id"];
const _hoisted_18 = {
  class: "card-header"
};
const _hoisted_19 = {
  class: "item-number"
};
const _hoisted_20 = ["innerHTML"];
const _hoisted_21 = {
  class: "code-block"
};
const _hoisted_22 = ["innerHTML"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_card = resolveComponent("el-card");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:file-list-3-line",
    class: "title-icon"
  }), _cache[0] || (_cache[0] = createTextVNode(" \u53E5\u67C4\u76D1\u63A7 ", -1))]), _cache[1] || (_cache[1] = createBaseVNode("p", {
    class: "page-subtitle"
  }, "\u5B9E\u65F6\u67E5\u770B\u7CFB\u7EDF\u53E5\u67C4\u4FE1\u606F\u548C\u8C03\u7528\u94FE", -1))]), createBaseVNode("div", _hoisted_6, [createBaseVNode("div", _hoisted_7, [createBaseVNode("div", _hoisted_8, toDisplayString($setup.data.data.length), 1), _cache[2] || (_cache[2] = createBaseVNode("div", {
    class: "stat-label"
  }, "\u603B\u53E5\u67C4\u6570", -1))])])])]), createBaseVNode("div", _hoisted_9, [createVNode(_component_el_card, {
    shadow: "hover"
  }, {
    default: withCtx(() => [createBaseVNode("div", _hoisted_10, [createVNode(_component_IconifyIconOnline, {
      icon: "ri:list-check"
    }), _cache[3] || (_cache[3] = createBaseVNode("span", null, "\u5FEB\u901F\u5BFC\u822A", -1))]), createBaseVNode("div", _hoisted_11, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.data.data, (it) => {
      return openBlock(), createElementBlock("div", {
        key: it.index,
        class: "nav-item",
        title: it.title,
        onClick: ($event) => $setup.handleClick(it.index)
      }, [createVNode(_component_IconifyIconOnline, {
        icon: "ri:arrow-right-s-line",
        class: "nav-icon"
      }), createBaseVNode("span", {
        innerHTML: it.title,
        class: "truncate"
      }, null, 8, _hoisted_13)], 8, _hoisted_12);
    }), 128))])]),
    _: 1
  })]), createBaseVNode("div", _hoisted_14, [createVNode(_component_el_card, {
    shadow: "never"
  }, {
    default: withCtx(() => [createBaseVNode("div", {
      class: "info-content",
      innerHTML: $setup.data.title
    }, null, 8, _hoisted_15)]),
    _: 1
  })]), createBaseVNode("div", _hoisted_16, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.data.data, (it) => {
    return openBlock(), createElementBlock("div", {
      id: "element" + it.index,
      key: it.index,
      class: "handle-item"
    }, [createVNode(_component_el_card, {
      shadow: "hover",
      class: "mb-4"
    }, {
      header: withCtx(() => [createBaseVNode("div", _hoisted_18, [createBaseVNode("span", _hoisted_19, toDisplayString(it.index + 1), 1), createBaseVNode("span", {
        class: "item-title",
        innerHTML: it.title
      }, null, 8, _hoisted_20)])]),
      default: withCtx(() => [createBaseVNode("pre", _hoisted_21, [createBaseVNode("code", {
        innerHTML: it.code
      }, null, 8, _hoisted_22)])]),
      _: 2
    }, 1024)], 8, _hoisted_17);
  }), 128))])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-75537cac"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/hotspot/handle/index.vue"]]);
export {
  index as default
};
