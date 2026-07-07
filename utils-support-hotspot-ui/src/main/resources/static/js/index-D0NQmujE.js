const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["static/js/default-tj3gz0P0.js","static/js/index-DsQ9-pB_.js","static/css/index-B-32fySL.css","static/css/default-D7zDsDSr.css","static/js/spining-CPvpUNrP.js","static/css/spining-BXx_dkC2.css","static/js/spining2-CCpHb20E.js","static/css/spining2-DokMT2k4.css","static/js/banter-Cnw-XMuz.js","static/css/banter-YLKbVoCO.css","static/js/jimi-DfLO0WpY.js","static/css/jimi-CUfRMuQA.css","static/js/box-C3CQwOJG.js","static/css/box-YlAsndno.css","static/js/pencil-DVPafpzM.js","static/css/pencil-BdB8qEZ7.css","static/js/loader-B3SNPAiA.js","static/css/loader-DGX2shzT.css","static/js/loader2-GlmK_2tV.js","static/css/loader2-BImeKz9o.css","static/js/loader3-BR5d9Byi.js","static/css/loader3-DcdZbZtO.css","static/js/loader4-wgEQEkC-.js","static/css/loader4-CUwi5JrR.css","static/js/loader5-BPDPPMtr.js","static/css/loader5-BRSE8PMH.css","static/js/loader6-BKF7UK8k.js","static/css/loader6-BCAA5w81.css"])))=>i.map(i=>d[i]);
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
import { _ as _export_sfc, c as createElementBlock, v as createCommentVNode, o as openBlock, j as createBlock, aA as shallowRef, r as ref, T as nextTick, b8 as defineAsyncComponent, s as __vitePreload, __tla as __tla_0 } from "./index-DsQ9-pB_.js";
let index;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch (e) {
    }
  })()
]).then(() => __async(null, null, function* () {
  const _sfc_main = {
    __name: "index",
    props: {
      modelValue: {
        type: Boolean,
        default: false
      },
      layout: {
        type: String,
        default: "default"
      },
      showNumber: {
        type: Boolean,
        default: true
      },
      showLoading: {
        type: Boolean,
        default: false
      },
      showLoadingLabel: {
        type: String,
        default: "\u52A0\u8F7D\u4E2D..."
      },
      autoCloseFinished: {
        type: Boolean,
        default: false
      }
    },
    emits: [
      "update:modelValue"
    ],
    setup(__props, { expose: __expose, emit: __emit }) {
      const DefaultLayout = defineAsyncComponent(() => __vitePreload(() => import("./default-tj3gz0P0.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0));
      const SpiningLayout = defineAsyncComponent(() => __vitePreload(() => import("./spining-CPvpUNrP.js"), true ? __vite__mapDeps([4,1,2,5]) : void 0));
      const Spining2Layout = defineAsyncComponent(() => __vitePreload(() => import("./spining2-CCpHb20E.js"), true ? __vite__mapDeps([6,1,2,7]) : void 0));
      const BanterLayout = defineAsyncComponent(() => __vitePreload(() => import("./banter-Cnw-XMuz.js"), true ? __vite__mapDeps([8,1,2,9]) : void 0));
      const JimiLayout = defineAsyncComponent(() => __vitePreload(() => import("./jimi-DfLO0WpY.js"), true ? __vite__mapDeps([10,1,2,11]) : void 0));
      const BoxLayout = defineAsyncComponent(() => __vitePreload(() => import("./box-C3CQwOJG.js"), true ? __vite__mapDeps([12,1,2,13]) : void 0));
      const PencilLayout = defineAsyncComponent(() => __vitePreload(() => import("./pencil-DVPafpzM.js"), true ? __vite__mapDeps([14,1,2,15]) : void 0));
      const LoaderLayout = defineAsyncComponent(() => __vitePreload(() => import("./loader-B3SNPAiA.js"), true ? __vite__mapDeps([16,1,2,17]) : void 0));
      const Loader2Layout = defineAsyncComponent(() => __vitePreload(() => import("./loader2-GlmK_2tV.js"), true ? __vite__mapDeps([18,1,2,19]) : void 0));
      const Loader3Layout = defineAsyncComponent(() => __vitePreload(() => import("./loader3-BR5d9Byi.js"), true ? __vite__mapDeps([20,1,2,21]) : void 0));
      const Loader4Layout = defineAsyncComponent(() => __vitePreload(() => import("./loader4-wgEQEkC-.js"), true ? __vite__mapDeps([22,1,2,23]) : void 0));
      const Loader5Layout = defineAsyncComponent(() => __vitePreload(() => import("./loader5-BPDPPMtr.js"), true ? __vite__mapDeps([24,1,2,25]) : void 0));
      const Loader6Layout = defineAsyncComponent(() => __vitePreload(() => import("./loader6-BKF7UK8k.js"), true ? __vite__mapDeps([26,1,2,27]) : void 0));
      const emit = __emit;
      const props = __props;
      const layoutRef = shallowRef();
      const _step = ref(0);
      const step = () => __async(null, null, function* () {
        stepBy(1);
      });
      const stepBy = (value) => __async(null, null, function* () {
        stepTo(_step.value + value);
      });
      const stepTo = (value) => __async(null, null, function* () {
        _step.value = value;
        check();
        nextTick(() => {
          layoutRef.value.stepTo(_step.value);
        });
        checkFisihed();
      });
      const checkFisihed = () => __async(null, null, function* () {
        if (props.autoCloseFinished && _step.value === 100) {
          emit("update:modelValue", false);
          emit("finished");
        }
      });
      const check = () => __async(null, null, function* () {
        if (_step.value > 100) {
          _step.value = 100;
        }
        if (_step.value < 0) {
          _step.value = 0;
        }
      });
      const reset = () => __async(null, null, function* () {
        _step.value = 0;
        nextTick(() => {
          layoutRef.value.reset();
        });
      });
      const close = () => __async(null, null, function* () {
        emit("update:modelValue", false);
      });
      __expose({
        step,
        stepBy,
        stepTo,
        close,
        reset
      });
      const __returned__ = {
        DefaultLayout,
        SpiningLayout,
        Spining2Layout,
        BanterLayout,
        JimiLayout,
        BoxLayout,
        PencilLayout,
        LoaderLayout,
        Loader2Layout,
        Loader3Layout,
        Loader4Layout,
        Loader5Layout,
        Loader6Layout,
        emit,
        props,
        layoutRef,
        _step,
        step,
        stepBy,
        stepTo,
        checkFisihed,
        check,
        reset,
        close,
        ref,
        defineAsyncComponent,
        shallowRef,
        nextTick
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  };
  const _hoisted_1 = {
    key: 0,
    class: "h-full w-full absolute top-0 left-0"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return $setup.props.modelValue ? (openBlock(), createElementBlock("div", _hoisted_1, [
      $setup.props.layout === "spining" ? (openBlock(), createBlock($setup["SpiningLayout"], {
        key: 0,
        ref: "layoutRef",
        "show-number": $setup.props.showNumber,
        "show-loading": $setup.props.showLoading,
        "show-loading-label": $setup.props.showLoadingLabel
      }, null, 8, [
        "show-number",
        "show-loading",
        "show-loading-label"
      ])) : $setup.props.layout === "spining2" ? (openBlock(), createBlock($setup["Spining2Layout"], {
        key: 1,
        ref: "layoutRef",
        "show-number": $setup.props.showNumber,
        "show-loading": $setup.props.showLoading,
        "show-loading-label": $setup.props.showLoadingLabel
      }, null, 8, [
        "show-number",
        "show-loading",
        "show-loading-label"
      ])) : $setup.props.layout === "loader" ? (openBlock(), createBlock($setup["LoaderLayout"], {
        key: 2,
        ref: "layoutRef",
        "show-number": $setup.props.showNumber,
        "show-loading": $setup.props.showLoading,
        "show-loading-label": $setup.props.showLoadingLabel
      }, null, 8, [
        "show-number",
        "show-loading",
        "show-loading-label"
      ])) : $setup.props.layout === "loader2" ? (openBlock(), createBlock($setup["Loader2Layout"], {
        key: 3,
        ref: "layoutRef",
        "show-number": $setup.props.showNumber,
        "show-loading": $setup.props.showLoading,
        "show-loading-label": $setup.props.showLoadingLabel
      }, null, 8, [
        "show-number",
        "show-loading",
        "show-loading-label"
      ])) : $setup.props.layout === "loader3" ? (openBlock(), createBlock($setup["Loader3Layout"], {
        key: 4,
        ref: "layoutRef",
        "show-number": $setup.props.showNumber,
        "show-loading": $setup.props.showLoading,
        "show-loading-label": $setup.props.showLoadingLabel
      }, null, 8, [
        "show-number",
        "show-loading",
        "show-loading-label"
      ])) : $setup.props.layout === "loader4" ? (openBlock(), createBlock($setup["Loader4Layout"], {
        key: 5,
        ref: "layoutRef",
        "show-number": $setup.props.showNumber,
        "show-loading": $setup.props.showLoading,
        "show-loading-label": $setup.props.showLoadingLabel
      }, null, 8, [
        "show-number",
        "show-loading",
        "show-loading-label"
      ])) : $setup.props.layout === "loader5" ? (openBlock(), createBlock($setup["Loader5Layout"], {
        key: 6,
        ref: "layoutRef",
        "show-number": $setup.props.showNumber,
        "show-loading": $setup.props.showLoading,
        "show-loading-label": $setup.props.showLoadingLabel
      }, null, 8, [
        "show-number",
        "show-loading",
        "show-loading-label"
      ])) : $setup.props.layout === "loader6" ? (openBlock(), createBlock($setup["Loader6Layout"], {
        key: 7,
        ref: "layoutRef",
        "show-number": $setup.props.showNumber,
        "show-loading": $setup.props.showLoading,
        "show-loading-label": $setup.props.showLoadingLabel
      }, null, 8, [
        "show-number",
        "show-loading",
        "show-loading-label"
      ])) : $setup.props.layout === "banter" ? (openBlock(), createBlock($setup["BanterLayout"], {
        key: 8,
        ref: "layoutRef",
        "show-number": $setup.props.showNumber,
        "show-loading": $setup.props.showLoading,
        "show-loading-label": $setup.props.showLoadingLabel
      }, null, 8, [
        "show-number",
        "show-loading",
        "show-loading-label"
      ])) : $setup.props.layout === "pencil" ? (openBlock(), createBlock($setup["PencilLayout"], {
        key: 9,
        ref: "layoutRef",
        "show-number": $setup.props.showNumber,
        "show-loading": $setup.props.showLoading,
        "show-loading-label": $setup.props.showLoadingLabel
      }, null, 8, [
        "show-number",
        "show-loading",
        "show-loading-label"
      ])) : $setup.props.layout === "jimi" ? (openBlock(), createBlock($setup["JimiLayout"], {
        key: 10,
        ref: "layoutRef",
        "show-number": $setup.props.showNumber,
        "show-loading": $setup.props.showLoading,
        "show-loading-label": $setup.props.showLoadingLabel
      }, null, 8, [
        "show-number",
        "show-loading",
        "show-loading-label"
      ])) : $setup.props.layout === "box" ? (openBlock(), createBlock($setup["BoxLayout"], {
        key: 11,
        ref: "layoutRef",
        "show-number": $setup.props.showNumber,
        "show-loading": $setup.props.showLoading,
        "show-loading-label": $setup.props.showLoadingLabel
      }, null, 8, [
        "show-number",
        "show-loading",
        "show-loading-label"
      ])) : (openBlock(), createBlock($setup["DefaultLayout"], {
        key: 12,
        ref: "layoutRef",
        "show-number": $setup.props.showNumber,
        "show-loading": $setup.props.showLoading,
        "show-loading-label": $setup.props.showLoadingLabel
      }, null, 8, [
        "show-number",
        "show-loading",
        "show-loading-label"
      ]))
    ])) : createCommentVNode("", true);
  }
  index = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/components/ScLoading/index.vue"
    ]
  ]);
}));
export {
  __tla,
  index as default
};
