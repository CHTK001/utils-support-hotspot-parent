var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { d as defineComponent, S as useI18n, q as computed, r as ref, l as onMounted, b as onUnmounted, _ as _export_sfc, c as createElementBlock, o as openBlock, h as createBaseVNode, a as createStaticVNode, F as Fragment, m as renderList, t as toDisplayString, v as createCommentVNode, L as normalizeClass, i as createTextVNode, n as normalizeStyle, C as getConfig, p as useRouter, j as createBlock, x as resolveDynamicComponent, g as createVNode, k as withCtx, aZ as Transition } from "./index-DsQ9-pB_.js";
const _sfc_main$6 = /* @__PURE__ */ defineComponent(__spreadProps(__spreadValues({}, {
  name: "PixelStyle"
}), {
  __name: "PixelStyle",
  props: {
    code: {
      type: [Number, String],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  emits: ["goHome", "goBack"],
  setup(__props, {
    expose: __expose,
    emit: __emit
  }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const {
      t
    } = useI18n();
    const errorCode = computed(() => String(props.code));
    const hidingDigit = ref(0);
    let hideTimer = null;
    onMounted(() => {
      if (errorCode.value === "404") {
        hideTimer = window.setInterval(() => {
          hidingDigit.value = (hidingDigit.value + 1) % 3;
        }, 2e3);
      }
    });
    onUnmounted(() => {
      if (hideTimer) {
        clearInterval(hideTimer);
      }
    });
    const __returned__ = {
      props,
      emit,
      t,
      errorCode,
      hidingDigit,
      get hideTimer() {
        return hideTimer;
      },
      set hideTimer(v) {
        hideTimer = v;
      }
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
}));
const _hoisted_1$6 = {
  key: 0,
  class: "game-scene scene-403"
};
const _hoisted_2$6 = {
  class: "fence"
};
const _hoisted_3$6 = {
  class: "pixel-code locked"
};
const _hoisted_4$6 = {
  class: "digit-inner"
};
const _hoisted_5$6 = {
  key: 1,
  class: "game-scene scene-404"
};
const _hoisted_6$6 = {
  key: 2,
  class: "game-scene scene-500"
};
const _hoisted_7$6 = {
  class: "pixel-code under-construction"
};
const _hoisted_8$5 = {
  class: "digit-inner"
};
const _hoisted_9$4 = {
  key: 3,
  class: "game-scene scene-default"
};
const _hoisted_10$2 = {
  class: "pixel-code"
};
const _hoisted_11$2 = {
  class: "digit-inner"
};
const _hoisted_12 = {
  class: "error-info"
};
const _hoisted_13 = {
  class: "error-title pixel-text"
};
const _hoisted_14 = {
  class: "error-desc pixel-text"
};
const _hoisted_15 = {
  key: 0,
  class: "fun-hint pixel-text"
};
const _hoisted_16 = {
  key: 1,
  class: "fun-hint pixel-text"
};
const _hoisted_17 = {
  key: 2,
  class: "fun-hint pixel-text"
};
const _hoisted_18 = {
  class: "action-buttons"
};
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["pixel-error-container", "scene-" + $setup.errorCode])
  }, [_cache[18] || (_cache[18] = createBaseVNode("div", {
    class: "scanlines"
  }, null, -1)), $setup.errorCode === "403" ? (openBlock(), createElementBlock("div", _hoisted_1$6, [_cache[6] || (_cache[6] = createStaticVNode('<div class="pixel-clouds" data-v-f818896e><div class="pixel-cloud cloud-1" data-v-f818896e></div><div class="pixel-cloud cloud-2" data-v-f818896e></div></div><div class="forbidden-sign" data-v-f818896e><div class="sign-post" data-v-f818896e></div><div class="sign-board" data-v-f818896e>\u{1F6AB}</div></div>', 2)), createBaseVNode("div", _hoisted_2$6, [(openBlock(), createElementBlock(Fragment, null, renderList(5, (i) => {
    return createBaseVNode("div", {
      class: "fence-post",
      key: i
    });
  }), 64)), _cache[2] || (_cache[2] = createBaseVNode("div", {
    class: "fence-bar top"
  }, null, -1)), _cache[3] || (_cache[3] = createBaseVNode("div", {
    class: "fence-bar bottom"
  }, null, -1))]), _cache[7] || (_cache[7] = createBaseVNode("div", {
    class: "dino-wrapper behind-fence"
  }, [createBaseVNode("div", {
    class: "pixel-dino"
  }), createBaseVNode("div", {
    class: "pixel-bubble"
  }, "\u{1F624}")], -1)), createBaseVNode("div", _hoisted_3$6, [_cache[4] || (_cache[4] = createBaseVNode("div", {
    class: "chain"
  }, null, -1)), (openBlock(true), createElementBlock(Fragment, null, renderList($setup.errorCode.split(""), (digit, index) => {
    return openBlock(), createElementBlock("div", {
      class: "pixel-digit",
      key: index
    }, [createBaseVNode("span", _hoisted_4$6, toDisplayString(digit), 1)]);
  }), 128)), _cache[5] || (_cache[5] = createBaseVNode("div", {
    class: "padlock"
  }, "\u{1F512}", -1))]), _cache[8] || (_cache[8] = createBaseVNode("div", {
    class: "pixel-ground"
  }, null, -1))])) : $setup.errorCode === "404" ? (openBlock(), createElementBlock("div", _hoisted_5$6, [..._cache[9] || (_cache[9] = [createStaticVNode('<div class="maze-bg" data-v-f818896e><div class="maze-wall w1" data-v-f818896e></div><div class="maze-wall w2" data-v-f818896e></div><div class="maze-wall w3" data-v-f818896e></div><div class="maze-wall w4" data-v-f818896e></div></div><div class="signpost" data-v-f818896e><div class="post" data-v-f818896e></div><div class="arrow left" data-v-f818896e>\u2190 ???</div><div class="arrow right" data-v-f818896e>??? \u2192</div></div><div class="dino-wrapper lost" data-v-f818896e><div class="pixel-dino" data-v-f818896e></div><div class="map" data-v-f818896e>\u{1F5FA}\uFE0F</div><div class="pixel-bubble" data-v-f818896e>\u2753</div><div class="sweat" data-v-f818896e>\u{1F4A6}</div></div><div class="pixel-code scattered" data-v-f818896e><div class="pixel-digit hiding-spot spot1" data-v-f818896e><span class="digit-inner" data-v-f818896e>4</span><span class="peek" data-v-f818896e>\u{1F440}</span></div><div class="pixel-digit hiding-spot spot2" data-v-f818896e><span class="digit-inner" data-v-f818896e>0</span><span class="peek" data-v-f818896e>\u{1F440}</span></div><div class="pixel-digit hiding-spot spot3" data-v-f818896e><span class="digit-inner" data-v-f818896e>4</span><span class="peek" data-v-f818896e>\u{1F440}</span></div></div><div class="treasure" data-v-f818896e>\u{1F4E6}</div><div class="pixel-ground maze" data-v-f818896e></div>', 6)])])) : $setup.errorCode === "500" ? (openBlock(), createElementBlock("div", _hoisted_6$6, [_cache[13] || (_cache[13] = createStaticVNode('<div class="construction-bg" data-v-f818896e><div class="warning-stripe" data-v-f818896e></div></div><div class="construction-sign" data-v-f818896e><div class="sign-stand" data-v-f818896e></div><div class="sign-board" data-v-f818896e>\u{1F6A7}</div></div><div class="traffic-cones" data-v-f818896e><span class="cone" data-v-f818896e>\u{1F536}</span><span class="cone" data-v-f818896e>\u{1F536}</span><span class="cone" data-v-f818896e>\u{1F536}</span></div><div class="dino-wrapper worker" data-v-f818896e><div class="hard-hat" data-v-f818896e>\u26D1\uFE0F</div><div class="pixel-dino" data-v-f818896e></div><div class="pixel-bubble" data-v-f818896e>\u{1F527}</div><div class="tool" data-v-f818896e>\u{1F528}</div></div>', 4)), createBaseVNode("div", _hoisted_7$6, [_cache[10] || (_cache[10] = createBaseVNode("div", {
    class: "barrier-tape top"
  }, null, -1)), (openBlock(true), createElementBlock(Fragment, null, renderList($setup.errorCode.split(""), (digit, index) => {
    return openBlock(), createElementBlock("div", {
      class: "pixel-digit",
      key: index
    }, [createBaseVNode("span", _hoisted_8$5, toDisplayString(digit), 1)]);
  }), 128)), _cache[11] || (_cache[11] = createBaseVNode("div", {
    class: "barrier-tape bottom"
  }, null, -1)), _cache[12] || (_cache[12] = createBaseVNode("div", {
    class: "fixing-text"
  }, "\u4FEE\u590D\u4E2D...", -1))]), _cache[14] || (_cache[14] = createBaseVNode("div", {
    class: "toolbox"
  }, "\u{1F9F0}", -1)), _cache[15] || (_cache[15] = createBaseVNode("div", {
    class: "pixel-ground construction"
  }, null, -1))])) : (openBlock(), createElementBlock("div", _hoisted_9$4, [_cache[16] || (_cache[16] = createStaticVNode('<div class="pixel-clouds" data-v-f818896e><div class="pixel-cloud cloud-1" data-v-f818896e></div><div class="pixel-cloud cloud-2" data-v-f818896e></div></div><div class="dino-wrapper" data-v-f818896e><div class="pixel-dino sad" data-v-f818896e></div><div class="pixel-bubble" data-v-f818896e>\u{1F622}</div><div class="pixel-tear" data-v-f818896e></div></div><div class="obstacles" data-v-f818896e><div class="pixel-cactus" data-v-f818896e></div><div class="pixel-cactus small" data-v-f818896e></div></div>', 3)), createBaseVNode("div", _hoisted_10$2, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.errorCode.split(""), (digit, index) => {
    return openBlock(), createElementBlock("div", {
      class: "pixel-digit",
      key: index
    }, [createBaseVNode("span", _hoisted_11$2, toDisplayString(digit), 1)]);
  }), 128))]), _cache[17] || (_cache[17] = createBaseVNode("div", {
    class: "pixel-ground"
  }, null, -1))])), createBaseVNode("div", _hoisted_12, [createBaseVNode("h1", _hoisted_13, toDisplayString($props.title), 1), createBaseVNode("p", _hoisted_14, toDisplayString($props.description), 1), $setup.errorCode === "403" ? (openBlock(), createElementBlock("p", _hoisted_15, " \u{1F6A7} \u6B64\u533A\u57DF\u9700\u8981\u7279\u6B8A\u6743\u9650\u624D\u80FD\u8FDB\u5165 ")) : $setup.errorCode === "404" ? (openBlock(), createElementBlock("p", _hoisted_16, " \u{1F50D} \u5C0F\u6050\u9F99\u6B63\u5728\u52AA\u529B\u5BFB\u627E\u9875\u9762... ")) : $setup.errorCode === "500" ? (openBlock(), createElementBlock("p", _hoisted_17, " \u{1F527} \u670D\u52A1\u5668\u6B63\u5728\u62A2\u6551\u4E2D\uFF0C\u8BF7\u7A0D\u5019... ")) : createCommentVNode("", true), createBaseVNode("div", _hoisted_18, [createBaseVNode("button", {
    class: "pixel-btn primary",
    onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("goHome"))
  }, [createBaseVNode("span", null, "\u25B6 " + toDisplayString($setup.t("error.goHome")), 1)]), createBaseVNode("button", {
    class: "pixel-btn secondary",
    onClick: _cache[1] || (_cache[1] = ($event) => $setup.emit("goBack"))
  }, [createBaseVNode("span", null, "\u25C0 " + toDisplayString($setup.t("error.goBack")), 1)])])]), _cache[19] || (_cache[19] = createBaseVNode("div", {
    class: "pixel-border top-left"
  }, null, -1)), _cache[20] || (_cache[20] = createBaseVNode("div", {
    class: "pixel-border top-right"
  }, null, -1)), _cache[21] || (_cache[21] = createBaseVNode("div", {
    class: "pixel-border bottom-left"
  }, null, -1)), _cache[22] || (_cache[22] = createBaseVNode("div", {
    class: "pixel-border bottom-right"
  }, null, -1))], 2);
}
const PixelStyle = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__scopeId", "data-v-f818896e"], ["__file", "H:/workspace/2/vue-support-parent-starter/packages/pages/error/components/styles/PixelStyle.vue"]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent(__spreadProps(__spreadValues({}, {
  name: "SpaceStyle"
}), {
  __name: "SpaceStyle",
  props: {
    code: {
      type: [Number, String],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  emits: ["goHome", "goBack"],
  setup(__props, {
    expose: __expose,
    emit: __emit
  }) {
    __expose();
    const emit = __emit;
    const {
      t
    } = useI18n();
    const __returned__ = {
      emit,
      t
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
}));
const _hoisted_1$5 = {
  class: "space-error-container"
};
const _hoisted_2$5 = {
  class: "stars"
};
const _hoisted_3$5 = {
  class: "space-content"
};
const _hoisted_4$5 = {
  class: "error-content"
};
const _hoisted_5$5 = {
  class: "error-code"
};
const _hoisted_6$5 = {
  class: "error-title"
};
const _hoisted_7$5 = {
  class: "error-desc"
};
const _hoisted_8$4 = {
  class: "action-buttons"
};
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$5, [createBaseVNode("div", _hoisted_2$5, [(openBlock(), createElementBlock(Fragment, null, renderList(50, (i) => {
    return createBaseVNode("div", {
      class: "star",
      key: i
    });
  }), 64))]), _cache[5] || (_cache[5] = createBaseVNode("div", {
    class: "meteors"
  }, [createBaseVNode("div", {
    class: "meteor meteor-1"
  }), createBaseVNode("div", {
    class: "meteor meteor-2"
  }), createBaseVNode("div", {
    class: "meteor meteor-3"
  })], -1)), createBaseVNode("div", _hoisted_3$5, [_cache[4] || (_cache[4] = createStaticVNode('<div class="astronaut-wrapper" data-v-2a7ac096><div class="astronaut" data-v-2a7ac096><div class="helmet" data-v-2a7ac096><div class="helmet-glass" data-v-2a7ac096><div class="helmet-reflection" data-v-2a7ac096></div></div><div class="face" data-v-2a7ac096><div class="eye eye-left" data-v-2a7ac096></div><div class="eye eye-right" data-v-2a7ac096></div><div class="mouth" data-v-2a7ac096></div></div></div><div class="body" data-v-2a7ac096><div class="chest-light" data-v-2a7ac096></div></div><div class="backpack" data-v-2a7ac096></div><div class="arm arm-left" data-v-2a7ac096></div><div class="arm arm-right" data-v-2a7ac096></div><div class="leg leg-left" data-v-2a7ac096></div><div class="leg leg-right" data-v-2a7ac096></div></div><svg class="tether" viewBox="0 0 200 100" data-v-2a7ac096><path d="M100,10 Q50,50 100,90" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-dasharray="5,5" data-v-2a7ac096></path></svg></div><div class="planet" data-v-2a7ac096><div class="planet-ring" data-v-2a7ac096></div><div class="planet-surface" data-v-2a7ac096><div class="crater crater-1" data-v-2a7ac096></div><div class="crater crater-2" data-v-2a7ac096></div><div class="crater crater-3" data-v-2a7ac096></div></div></div>', 2)), createBaseVNode("div", _hoisted_4$5, [createBaseVNode("div", _hoisted_5$5, [(openBlock(true), createElementBlock(Fragment, null, renderList(String($props.code).split(""), (digit, index) => {
    return openBlock(), createElementBlock("span", {
      key: index,
      class: "digit"
    }, toDisplayString(digit), 1);
  }), 128))]), createBaseVNode("h1", _hoisted_6$5, toDisplayString($props.title), 1), createBaseVNode("p", _hoisted_7$5, toDisplayString($props.description), 1), createBaseVNode("div", _hoisted_8$4, [createBaseVNode("button", {
    class: "space-btn primary",
    onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("goHome"))
  }, [_cache[2] || (_cache[2] = createBaseVNode("span", {
    class: "btn-icon"
  }, "\u{1F680}", -1)), createBaseVNode("span", null, toDisplayString($setup.t("error.goHome")), 1)]), createBaseVNode("button", {
    class: "space-btn secondary",
    onClick: _cache[1] || (_cache[1] = ($event) => $setup.emit("goBack"))
  }, [_cache[3] || (_cache[3] = createBaseVNode("span", {
    class: "btn-icon"
  }, "\u{1F6F8}", -1)), createBaseVNode("span", null, toDisplayString($setup.t("error.goBack")), 1)])])])]), _cache[6] || (_cache[6] = createBaseVNode("div", {
    class: "spaceship"
  }, [createBaseVNode("div", {
    class: "ship-body"
  }), createBaseVNode("div", {
    class: "ship-window"
  }), createBaseVNode("div", {
    class: "ship-flame"
  })], -1))]);
}
const SpaceStyle = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-2a7ac096"], ["__file", "H:/workspace/2/vue-support-parent-starter/packages/pages/error/components/styles/SpaceStyle.vue"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent(__spreadProps(__spreadValues({}, {
  name: "MinimalStyle"
}), {
  __name: "MinimalStyle",
  props: {
    code: {
      type: [Number, String],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  emits: ["goHome", "goBack"],
  setup(__props, {
    expose: __expose,
    emit: __emit
  }) {
    __expose();
    const emit = __emit;
    const {
      t
    } = useI18n();
    const __returned__ = {
      emit,
      t
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
}));
const _hoisted_1$4 = {
  class: "minimal-error-container"
};
const _hoisted_2$4 = {
  class: "minimal-content"
};
const _hoisted_3$4 = {
  class: "error-code-wrapper"
};
const _hoisted_4$4 = {
  class: "error-code"
};
const _hoisted_5$4 = {
  class: "error-icon"
};
const _hoisted_6$4 = {
  key: 0,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5"
};
const _hoisted_7$4 = {
  key: 1,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5"
};
const _hoisted_8$3 = {
  key: 2,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5"
};
const _hoisted_9$3 = {
  class: "error-title"
};
const _hoisted_10$1 = {
  class: "error-desc"
};
const _hoisted_11$1 = {
  class: "action-buttons"
};
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$4, [_cache[10] || (_cache[10] = createBaseVNode("div", {
    class: "bg-shapes"
  }, [createBaseVNode("div", {
    class: "shape shape-1"
  }), createBaseVNode("div", {
    class: "shape shape-2"
  }), createBaseVNode("div", {
    class: "shape shape-3"
  })], -1)), createBaseVNode("div", _hoisted_2$4, [createBaseVNode("div", _hoisted_3$4, [createBaseVNode("span", _hoisted_4$4, toDisplayString($props.code), 1), _cache[2] || (_cache[2] = createBaseVNode("div", {
    class: "code-underline"
  }, null, -1))]), createBaseVNode("div", _hoisted_5$4, [String($props.code) === "404" ? (openBlock(), createElementBlock("svg", _hoisted_6$4, [..._cache[3] || (_cache[3] = [createBaseVNode("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }, null, -1), createBaseVNode("path", {
    d: "m21 21-4.35-4.35"
  }, null, -1), createBaseVNode("path", {
    d: "M8 11h6",
    "stroke-linecap": "round"
  }, null, -1)])])) : String($props.code) === "403" ? (openBlock(), createElementBlock("svg", _hoisted_7$4, [..._cache[4] || (_cache[4] = [createBaseVNode("rect", {
    x: "3",
    y: "11",
    width: "18",
    height: "11",
    rx: "2",
    ry: "2"
  }, null, -1), createBaseVNode("path", {
    d: "M7 11V7a5 5 0 0 1 10 0v4"
  }, null, -1), createBaseVNode("circle", {
    cx: "12",
    cy: "16",
    r: "1",
    fill: "currentColor"
  }, null, -1)])])) : (openBlock(), createElementBlock("svg", _hoisted_8$3, [..._cache[5] || (_cache[5] = [createBaseVNode("path", {
    d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
  }, null, -1), createBaseVNode("line", {
    x1: "12",
    y1: "9",
    x2: "12",
    y2: "13"
  }, null, -1), createBaseVNode("line", {
    x1: "12",
    y1: "17",
    x2: "12.01",
    y2: "17"
  }, null, -1)])]))]), createBaseVNode("h1", _hoisted_9$3, toDisplayString($props.title), 1), createBaseVNode("p", _hoisted_10$1, toDisplayString($props.description), 1), _cache[8] || (_cache[8] = createBaseVNode("div", {
    class: "divider"
  }, [createBaseVNode("span", {
    class: "divider-dot"
  }), createBaseVNode("span", {
    class: "divider-dot"
  }), createBaseVNode("span", {
    class: "divider-dot"
  })], -1)), createBaseVNode("div", _hoisted_11$1, [createBaseVNode("button", {
    class: "minimal-btn primary",
    onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("goHome"))
  }, [_cache[6] || (_cache[6] = createBaseVNode("svg", {
    class: "btn-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2"
  }, [createBaseVNode("path", {
    d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
  }), createBaseVNode("polyline", {
    points: "9 22 9 12 15 12 15 22"
  })], -1)), createBaseVNode("span", null, toDisplayString($setup.t("error.goHome")), 1)]), createBaseVNode("button", {
    class: "minimal-btn secondary",
    onClick: _cache[1] || (_cache[1] = ($event) => $setup.emit("goBack"))
  }, [_cache[7] || (_cache[7] = createBaseVNode("svg", {
    class: "btn-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2"
  }, [createBaseVNode("line", {
    x1: "19",
    y1: "12",
    x2: "5",
    y2: "12"
  }), createBaseVNode("polyline", {
    points: "12 19 5 12 12 5"
  })], -1)), createBaseVNode("span", null, toDisplayString($setup.t("error.goBack")), 1)])]), _cache[9] || (_cache[9] = createBaseVNode("div", {
    class: "decorative-lines"
  }, [createBaseVNode("div", {
    class: "line line-1"
  }), createBaseVNode("div", {
    class: "line line-2"
  }), createBaseVNode("div", {
    class: "line line-3"
  })], -1))])]);
}
const MinimalStyle = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-79d04d46"], ["__file", "H:/workspace/2/vue-support-parent-starter/packages/pages/error/components/styles/MinimalStyle.vue"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent(__spreadProps(__spreadValues({}, {
  name: "ForbiddenStyle"
}), {
  __name: "ForbiddenStyle",
  props: {
    code: {
      type: [Number, String],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  emits: ["goHome", "goBack"],
  setup(__props, {
    expose: __expose,
    emit: __emit
  }) {
    __expose();
    const emit = __emit;
    const {
      t
    } = useI18n();
    const __returned__ = {
      emit,
      t
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
}));
const _hoisted_1$3 = {
  class: "forbidden-container"
};
const _hoisted_2$3 = {
  class: "forbidden-content"
};
const _hoisted_3$3 = {
  class: "error-code"
};
const _hoisted_4$3 = {
  class: "code-number"
};
const _hoisted_5$3 = {
  class: "error-info"
};
const _hoisted_6$3 = {
  class: "error-title"
};
const _hoisted_7$3 = {
  class: "error-desc"
};
const _hoisted_8$2 = {
  class: "permission-hint"
};
const _hoisted_9$2 = {
  class: "action-buttons"
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$3, [_cache[8] || (_cache[8] = createBaseVNode("div", {
    class: "grid-bg"
  }, null, -1)), _cache[9] || (_cache[9] = createBaseVNode("div", {
    class: "warning-stripes top"
  }, null, -1)), _cache[10] || (_cache[10] = createBaseVNode("div", {
    class: "warning-stripes bottom"
  }, null, -1)), createBaseVNode("div", _hoisted_2$3, [_cache[7] || (_cache[7] = createStaticVNode('<div class="lock-wrapper" data-v-a251abdb><div class="lock" data-v-a251abdb><div class="lock-top" data-v-a251abdb><div class="lock-hook" data-v-a251abdb></div></div><div class="lock-body" data-v-a251abdb><div class="keyhole" data-v-a251abdb></div></div></div><div class="forbidden-sign" data-v-a251abdb><div class="sign-circle" data-v-a251abdb><div class="sign-line" data-v-a251abdb></div></div></div></div>', 1)), createBaseVNode("div", _hoisted_3$3, [_cache[2] || (_cache[2] = createBaseVNode("span", {
    class: "code-prefix"
  }, "ERROR", -1)), createBaseVNode("div", _hoisted_4$3, [(openBlock(true), createElementBlock(Fragment, null, renderList(String($props.code).split(""), (digit, index) => {
    return openBlock(), createElementBlock("span", {
      key: index,
      class: "digit"
    }, toDisplayString(digit), 1);
  }), 128))])]), createBaseVNode("div", _hoisted_5$3, [createBaseVNode("h1", _hoisted_6$3, [_cache[3] || (_cache[3] = createBaseVNode("span", {
    class: "shield-icon"
  }, "\u{1F6E1}\uFE0F", -1)), createTextVNode(" " + toDisplayString($props.title), 1)]), createBaseVNode("p", _hoisted_7$3, toDisplayString($props.description), 1), createBaseVNode("div", _hoisted_8$2, [_cache[4] || (_cache[4] = createBaseVNode("div", {
    class: "hint-icon"
  }, "\u{1F510}", -1)), createBaseVNode("span", null, toDisplayString($setup.t("error.noPermission") || "\u60A8\u6CA1\u6709\u8BBF\u95EE\u6B64\u9875\u9762\u7684\u6743\u9650"), 1)])]), createBaseVNode("div", _hoisted_9$2, [createBaseVNode("button", {
    class: "forbidden-btn primary",
    onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("goHome"))
  }, [_cache[5] || (_cache[5] = createBaseVNode("span", {
    class: "btn-icon"
  }, "\u{1F3E0}", -1)), createBaseVNode("span", null, toDisplayString($setup.t("error.goHome")), 1)]), createBaseVNode("button", {
    class: "forbidden-btn secondary",
    onClick: _cache[1] || (_cache[1] = ($event) => $setup.emit("goBack"))
  }, [_cache[6] || (_cache[6] = createBaseVNode("span", {
    class: "btn-icon"
  }, "\u21A9\uFE0F", -1)), createBaseVNode("span", null, toDisplayString($setup.t("error.goBack")), 1)])])]), _cache[11] || (_cache[11] = createBaseVNode("div", {
    class: "shield-decor shield-1"
  }, null, -1)), _cache[12] || (_cache[12] = createBaseVNode("div", {
    class: "shield-decor shield-2"
  }, null, -1))]);
}
const ForbiddenStyle = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-a251abdb"], ["__file", "H:/workspace/2/vue-support-parent-starter/packages/pages/error/components/styles/ForbiddenStyle.vue"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent(__spreadProps(__spreadValues({}, {
  name: "NotFoundStyle"
}), {
  __name: "NotFoundStyle",
  props: {
    code: {
      type: [Number, String],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  emits: ["goHome", "goBack"],
  setup(__props, {
    expose: __expose,
    emit: __emit
  }) {
    __expose();
    const emit = __emit;
    const {
      t
    } = useI18n();
    const __returned__ = {
      emit,
      t
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
}));
const _hoisted_1$2 = {
  class: "notfound-container"
};
const _hoisted_2$2 = {
  class: "notfound-content"
};
const _hoisted_3$2 = {
  class: "error-info"
};
const _hoisted_4$2 = {
  class: "error-title"
};
const _hoisted_5$2 = {
  class: "error-desc"
};
const _hoisted_6$2 = {
  class: "search-hint"
};
const _hoisted_7$2 = {
  class: "action-buttons"
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$2, [_cache[6] || (_cache[6] = createStaticVNode('<div class="desert-bg" data-v-ab0a01de><div class="sun" data-v-ab0a01de></div><div class="dune dune-1" data-v-ab0a01de></div><div class="dune dune-2" data-v-ab0a01de></div><div class="dune dune-3" data-v-ab0a01de></div></div>', 1)), createBaseVNode("div", _hoisted_2$2, [_cache[5] || (_cache[5] = createStaticVNode('<div class="traveler-scene" data-v-ab0a01de><div class="signpost" data-v-ab0a01de><div class="post" data-v-ab0a01de></div><div class="sign sign-1" data-v-ab0a01de>???</div><div class="sign sign-2" data-v-ab0a01de>HOME</div><div class="sign sign-3" data-v-ab0a01de>404</div></div><div class="traveler" data-v-ab0a01de><div class="head" data-v-ab0a01de><div class="face" data-v-ab0a01de><div class="eye eye-left" data-v-ab0a01de>?</div><div class="eye eye-right" data-v-ab0a01de>?</div></div></div><div class="body" data-v-ab0a01de></div><div class="arm arm-left" data-v-ab0a01de></div><div class="arm arm-right" data-v-ab0a01de></div><div class="leg leg-left" data-v-ab0a01de></div><div class="leg leg-right" data-v-ab0a01de></div><div class="map" data-v-ab0a01de>\u{1F5FA}\uFE0F</div></div><div class="telescope" data-v-ab0a01de>\u{1F52D}</div></div><div class="error-code" data-v-ab0a01de><div class="code-wrapper" data-v-ab0a01de><span class="digit digit-4-1" data-v-ab0a01de>4</span><span class="digit digit-0" data-v-ab0a01de><span class="magnifier" data-v-ab0a01de>\u{1F50D}</span></span><span class="digit digit-4-2" data-v-ab0a01de>4</span></div><div class="code-label" data-v-ab0a01de>PAGE NOT FOUND</div></div>', 2)), createBaseVNode("div", _hoisted_3$2, [createBaseVNode("h1", _hoisted_4$2, toDisplayString($props.title), 1), createBaseVNode("p", _hoisted_5$2, toDisplayString($props.description), 1), createBaseVNode("div", _hoisted_6$2, [_cache[2] || (_cache[2] = createBaseVNode("span", {
    class: "hint-icon"
  }, "\u{1F9ED}", -1)), createBaseVNode("span", null, toDisplayString($setup.t("error.pageLost") || "\u9875\u9762\u4F3C\u4E4E\u8FF7\u8DEF\u4E86..."), 1)])]), createBaseVNode("div", _hoisted_7$2, [createBaseVNode("button", {
    class: "notfound-btn primary",
    onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("goHome"))
  }, [_cache[3] || (_cache[3] = createBaseVNode("span", {
    class: "btn-icon"
  }, "\u{1F3E0}", -1)), createBaseVNode("span", null, toDisplayString($setup.t("error.goHome")), 1)]), createBaseVNode("button", {
    class: "notfound-btn secondary",
    onClick: _cache[1] || (_cache[1] = ($event) => $setup.emit("goBack"))
  }, [_cache[4] || (_cache[4] = createBaseVNode("span", {
    class: "btn-icon"
  }, "\u21A9\uFE0F", -1)), createBaseVNode("span", null, toDisplayString($setup.t("error.goBack")), 1)])])]), _cache[7] || (_cache[7] = createBaseVNode("div", {
    class: "floating-marks"
  }, [createBaseVNode("span", {
    class: "mark mark-1"
  }, "?"), createBaseVNode("span", {
    class: "mark mark-2"
  }, "?"), createBaseVNode("span", {
    class: "mark mark-3"
  }, "?")], -1))]);
}
const NotFoundStyle = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-ab0a01de"], ["__file", "H:/workspace/2/vue-support-parent-starter/packages/pages/error/components/styles/NotFoundStyle.vue"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent(__spreadProps(__spreadValues({}, {
  name: "ServerErrorStyle"
}), {
  __name: "ServerErrorStyle",
  props: {
    code: {
      type: [Number, String],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  emits: ["goHome", "goBack"],
  setup(__props, {
    expose: __expose,
    emit: __emit
  }) {
    __expose();
    const emit = __emit;
    const {
      t
    } = useI18n();
    const __returned__ = {
      emit,
      t
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
}));
const _hoisted_1$1 = {
  class: "server-error-container"
};
const _hoisted_2$1 = {
  class: "server-error-content"
};
const _hoisted_3$1 = {
  class: "error-code"
};
const _hoisted_4$1 = {
  class: "code-glitch",
  "data-text": "500"
};
const _hoisted_5$1 = {
  class: "error-info"
};
const _hoisted_6$1 = {
  class: "error-title"
};
const _hoisted_7$1 = {
  class: "error-desc"
};
const _hoisted_8$1 = {
  class: "status-panel"
};
const _hoisted_9$1 = {
  class: "status-item"
};
const _hoisted_10 = {
  class: "action-buttons"
};
const _hoisted_11 = {
  class: "code-rain"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [_cache[9] || (_cache[9] = createBaseVNode("div", {
    class: "circuit-bg"
  }, null, -1)), _cache[10] || (_cache[10] = createBaseVNode("div", {
    class: "glitch-overlay"
  }, null, -1)), createBaseVNode("div", _hoisted_2$1, [_cache[8] || (_cache[8] = createStaticVNode('<div class="server-rack" data-v-039a84b2><div class="server-unit" data-v-039a84b2><div class="server-lights" data-v-039a84b2><span class="light red blink" data-v-039a84b2></span><span class="light red blink delay-1" data-v-039a84b2></span><span class="light red blink delay-2" data-v-039a84b2></span></div><div class="server-slots" data-v-039a84b2><div class="slot" data-v-039a84b2></div><div class="slot" data-v-039a84b2></div><div class="slot" data-v-039a84b2></div></div></div><div class="server-unit" data-v-039a84b2><div class="server-lights" data-v-039a84b2><span class="light yellow" data-v-039a84b2></span><span class="light off" data-v-039a84b2></span><span class="light off" data-v-039a84b2></span></div><div class="server-slots" data-v-039a84b2><div class="slot" data-v-039a84b2></div><div class="slot" data-v-039a84b2></div><div class="slot" data-v-039a84b2></div></div></div><div class="server-unit crashed" data-v-039a84b2><div class="server-lights" data-v-039a84b2><span class="light off" data-v-039a84b2></span><span class="light off" data-v-039a84b2></span><span class="light off" data-v-039a84b2></span></div><div class="server-slots" data-v-039a84b2><div class="slot" data-v-039a84b2></div><div class="slot" data-v-039a84b2></div><div class="slot" data-v-039a84b2></div></div><div class="smoke" data-v-039a84b2><span data-v-039a84b2>\u{1F4A8}</span><span data-v-039a84b2>\u{1F4A8}</span><span data-v-039a84b2>\u{1F4A8}</span></div></div><div class="warning-badge" data-v-039a84b2>\u26A0\uFE0F</div></div>', 1)), createBaseVNode("div", _hoisted_3$1, [createBaseVNode("div", _hoisted_4$1, [(openBlock(true), createElementBlock(Fragment, null, renderList(String($props.code).split(""), (digit, index) => {
    return openBlock(), createElementBlock("span", {
      key: index,
      class: "digit"
    }, toDisplayString(digit), 1);
  }), 128))]), _cache[2] || (_cache[2] = createBaseVNode("div", {
    class: "code-label"
  }, "INTERNAL SERVER ERROR", -1))]), createBaseVNode("div", _hoisted_5$1, [createBaseVNode("h1", _hoisted_6$1, [_cache[3] || (_cache[3] = createBaseVNode("span", {
    class: "crash-icon"
  }, "\u{1F4A5}", -1)), createTextVNode(" " + toDisplayString($props.title), 1)]), createBaseVNode("p", _hoisted_7$1, toDisplayString($props.description), 1), createBaseVNode("div", _hoisted_8$1, [createBaseVNode("div", _hoisted_9$1, [_cache[4] || (_cache[4] = createBaseVNode("span", {
    class: "status-icon"
  }, "\u{1F527}", -1)), createBaseVNode("span", null, toDisplayString($setup.t("error.serverMaintenance") || "\u670D\u52A1\u5668\u6B63\u5728\u7EF4\u62A4\u4E2D"), 1)]), _cache[5] || (_cache[5] = createBaseVNode("div", {
    class: "progress-bar"
  }, [createBaseVNode("div", {
    class: "progress-fill"
  })], -1))])]), createBaseVNode("div", _hoisted_10, [createBaseVNode("button", {
    class: "server-btn primary",
    onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("goHome"))
  }, [_cache[6] || (_cache[6] = createBaseVNode("span", {
    class: "btn-icon"
  }, "\u{1F3E0}", -1)), createBaseVNode("span", null, toDisplayString($setup.t("error.goHome")), 1)]), createBaseVNode("button", {
    class: "server-btn secondary",
    onClick: _cache[1] || (_cache[1] = ($event) => $setup.emit("goBack"))
  }, [_cache[7] || (_cache[7] = createBaseVNode("span", {
    class: "btn-icon"
  }, "\u{1F504}", -1)), createBaseVNode("span", null, toDisplayString($setup.t("error.retry") || "\u91CD\u8BD5"), 1)])])]), createBaseVNode("div", _hoisted_11, [(openBlock(), createElementBlock(Fragment, null, renderList(20, (i) => {
    return createBaseVNode("span", {
      key: i,
      class: "rain-drop",
      style: normalizeStyle({
        left: `${i * 5}%`,
        animationDelay: `${i * 0.1}s`
      })
    }, toDisplayString(Math.random() > 0.5 ? "0" : "1"), 5);
  }), 64))])]);
}
const ServerErrorStyle = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-039a84b2"], ["__file", "H:/workspace/2/vue-support-parent-starter/packages/pages/error/components/styles/ServerErrorStyle.vue"]]);
const STORAGE_KEY = "error-page-style";
const _sfc_main = /* @__PURE__ */ defineComponent(__spreadProps(__spreadValues({}, {
  name: "ErrorPage"
}), {
  __name: "ErrorPage",
  props: {
    code: {
      type: [Number, String],
      required: true
    },
    style: {
      type: String,
      required: false,
      default: "pixel"
    }
  },
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const showStyleSwitcher = computed(() => {
      var _a;
      return (_a = getConfig().ShowErrorPageStyleSwitcher) != null ? _a : false;
    });
    const defaultStyle = computed(() => {
      var _a;
      return (_a = getConfig().ErrorPageStyle) != null ? _a : "pixel";
    });
    const props = __props;
    const {
      t
    } = useI18n();
    const router = useRouter();
    const styleOptions = [{
      key: "pixel",
      label: "\u50CF\u7D20\u6050\u9F99",
      icon: "\u{1F996}"
    }, {
      key: "space",
      label: "\u592A\u7A7A\u5B87\u822A\u5458",
      icon: "\u{1F680}"
    }, {
      key: "minimal",
      label: "\u7B80\u7EA6\u98CE\u683C",
      icon: "\u2728"
    }, {
      key: "forbidden",
      label: "\u7981\u6B62\u8BBF\u95EE",
      icon: "\u{1F512}"
    }, {
      key: "notfound",
      label: "\u8FF7\u8DEF\u6C99\u6F20",
      icon: "\u{1F3DC}\uFE0F"
    }, {
      key: "servererror",
      label: "\u670D\u52A1\u5668\u6545\u969C",
      icon: "\u{1F4A5}"
    }];
    const currentStyle = ref(props.style || defaultStyle.value);
    const showStylePicker = ref(false);
    onMounted(() => {
      if (showStyleSwitcher.value) {
        const savedStyle = localStorage.getItem(STORAGE_KEY);
        if (savedStyle && styleOptions.some((s) => s.key === savedStyle)) {
          currentStyle.value = savedStyle;
          return;
        }
      }
      currentStyle.value = props.style || defaultStyle.value;
    });
    const switchStyle = (style) => {
      currentStyle.value = style;
      localStorage.setItem(STORAGE_KEY, style);
      showStylePicker.value = false;
    };
    const nextStyle = () => {
      const currentIndex = styleOptions.findIndex((s) => s.key === currentStyle.value);
      const nextIndex = (currentIndex + 1) % styleOptions.length;
      switchStyle(styleOptions[nextIndex].key);
    };
    const errorInfo = computed(() => {
      const code = String(props.code);
      const messages = {
        "403": {
          title: t("error.forbidden"),
          desc: t("error.forbiddenDesc")
        },
        "404": {
          title: t("error.notFound"),
          desc: t("error.notFoundDesc")
        },
        "500": {
          title: t("error.serverError"),
          desc: t("error.serverErrorDesc")
        }
      };
      return messages[code] || messages["404"];
    });
    const goHome = () => {
      router.push("/");
    };
    const goBack = () => {
      router.go(-1);
    };
    const styleComponent = computed(() => {
      const styles = {
        pixel: PixelStyle,
        space: SpaceStyle,
        minimal: MinimalStyle,
        forbidden: ForbiddenStyle,
        notfound: NotFoundStyle,
        servererror: ServerErrorStyle
      };
      return styles[currentStyle.value] || styles.pixel;
    });
    const currentStyleInfo = computed(() => {
      return styleOptions.find((s) => s.key === currentStyle.value) || styleOptions[0];
    });
    const __returned__ = {
      showStyleSwitcher,
      defaultStyle,
      props,
      t,
      router,
      styleOptions,
      STORAGE_KEY,
      currentStyle,
      showStylePicker,
      switchStyle,
      nextStyle,
      errorInfo,
      goHome,
      goBack,
      styleComponent,
      currentStyleInfo
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
}));
const _hoisted_1 = {
  class: "error-page"
};
const _hoisted_2 = {
  key: 0,
  class: "style-switcher"
};
const _hoisted_3 = ["title"];
const _hoisted_4 = {
  key: 0,
  class: "style-picker"
};
const _hoisted_5 = {
  class: "picker-header"
};
const _hoisted_6 = {
  class: "picker-options"
};
const _hoisted_7 = ["onClick"];
const _hoisted_8 = {
  class: "option-icon"
};
const _hoisted_9 = {
  class: "option-label"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [(openBlock(), createBlock(resolveDynamicComponent($setup.styleComponent), {
    code: $props.code,
    title: $setup.errorInfo.title,
    description: $setup.errorInfo.desc,
    onGoHome: $setup.goHome,
    onGoBack: $setup.goBack
  }, null, 40, ["code", "title", "description"])), $setup.showStyleSwitcher ? (openBlock(), createElementBlock("div", _hoisted_2, [createBaseVNode("button", {
    class: "style-toggle-btn",
    onClick: _cache[0] || (_cache[0] = ($event) => $setup.showStylePicker = !$setup.showStylePicker),
    title: "\u5F53\u524D\u98CE\u683C: " + $setup.currentStyleInfo.label
  }, [..._cache[2] || (_cache[2] = [createBaseVNode("span", {
    class: "btn-icon"
  }, "\u{1F3A8}", -1)])], 8, _hoisted_3), createBaseVNode("button", {
    class: "style-next-btn",
    onClick: $setup.nextStyle,
    title: "\u5207\u6362\u4E0B\u4E00\u4E2A\u98CE\u683C"
  }, [..._cache[3] || (_cache[3] = [createBaseVNode("span", {
    class: "btn-icon"
  }, "\u23ED\uFE0F", -1)])]), createVNode(Transition, {
    name: "fade"
  }, {
    default: withCtx(() => [$setup.showStylePicker ? (openBlock(), createElementBlock("div", _hoisted_4, [createBaseVNode("div", _hoisted_5, [_cache[4] || (_cache[4] = createBaseVNode("span", null, "\u9009\u62E9\u9519\u8BEF\u9875\u98CE\u683C", -1)), createBaseVNode("button", {
      class: "close-btn",
      onClick: _cache[1] || (_cache[1] = ($event) => $setup.showStylePicker = false)
    }, "\u2715")]), createBaseVNode("div", _hoisted_6, [(openBlock(), createElementBlock(Fragment, null, renderList($setup.styleOptions, (option) => {
      return createBaseVNode("button", {
        key: option.key,
        class: normalizeClass(["style-option", {
          active: $setup.currentStyle === option.key
        }]),
        onClick: ($event) => $setup.switchStyle(option.key)
      }, [createBaseVNode("span", _hoisted_8, toDisplayString(option.icon), 1), createBaseVNode("span", _hoisted_9, toDisplayString(option.label), 1)], 10, _hoisted_7);
    }), 64))])])) : createCommentVNode("", true)]),
    _: 1
  })])) : createCommentVNode("", true)]);
}
const ErrorPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bca89c32"], ["__file", "H:/workspace/2/vue-support-parent-starter/packages/pages/error/components/ErrorPage.vue"]]);
export {
  ErrorPage as E
};
