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
import { _ as _export_sfc, c as createElementBlock, o as openBlock, h as createBaseVNode, v as createCommentVNode, i as createTextVNode, t as toDisplayString, n as normalizeStyle, r as ref } from "./index-DsQ9-pB_.js";
const _sfc_main = {
  __name: "spining2",
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
      default: false
    },
    showLoading: {
      type: Boolean,
      default: false
    },
    showLoadingLabel: {
      type: String,
      default: "\u52A0\u8F7D\u4E2D..."
    },
    borderRadius: {
      type: Number,
      default: 10
    }
  },
  emits: ["update:modelValue"],
  setup(__props, {
    expose: __expose,
    emit: __emit
  }) {
    const emit = __emit;
    const props = __props;
    const _step = ref(0);
    const stepTo = (value) => {
      const animate = () => {
        if (_step.value < value) {
          _step.value++;
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };
    const reset = () => __async(null, null, function* () {
      _step.value = 0;
    });
    __expose({
      stepTo,
      reset
    });
    const __returned__ = {
      emit,
      props,
      _step,
      stepTo,
      reset,
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
  class: "shadow-text"
};
const _hoisted_2 = {
  class: "text-center inline-block text-white text-14px w-full h-full"
};
const _hoisted_3 = {
  class: "relative flex flex-col items-center justify-center h-full"
};
const _hoisted_4 = {
  key: 0,
  class: "mt-4 xl:text-lg text-base text-white font-bold"
};
const _hoisted_5 = {
  key: 1,
  class: "mt-4 text-sm text-white font-bold"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "h-full w-full",
    style: normalizeStyle({
      "--loading-border-radius": $setup.props.borderRadius + "px"
    })
  }, [createBaseVNode("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [_cache[1] || (_cache[1] = createBaseVNode("div", {
    class: "rounded-2.5 flex items-center justify-center shadow-bg1"
  }, [createBaseVNode("div", {
    "data-v-a4c4d738": "",
    class: "relative w-8 h-8 flex justify-between items-center text-white"
  }, [createBaseVNode("div", {
    class: "spinner"
  }, [createBaseVNode("span"), createBaseVNode("span"), createBaseVNode("span"), createBaseVNode("span"), createBaseVNode("span"), createBaseVNode("span"), createBaseVNode("span"), createBaseVNode("span")])])], -1)), $setup.props.showNumber ? (openBlock(), createElementBlock("p", _hoisted_4, [createTextVNode(toDisplayString($setup._step) + " ", 1), _cache[0] || (_cache[0] = createBaseVNode("span", {
    class: "text-sm"
  }, "%", -1))])) : createCommentVNode("", true), $setup.props.showLoading ? (openBlock(), createElementBlock("p", _hoisted_5, toDisplayString($setup.props.showLoadingLabel), 1)) : createCommentVNode("", true)])])])], 4);
}
const spining2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9cf1ca44"], ["__file", "H:/workspace/2/vue-support-parent-starter/packages/components/ScLoading/layout/spining2.vue"]]);
export {
  spining2 as default
};
