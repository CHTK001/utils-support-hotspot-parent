const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["static/js/index-D0NQmujE.js","static/js/index-DsQ9-pB_.js","static/css/index-B-32fySL.css"])))=>i.map(i=>d[i]);
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
import { _ as _export_sfc, e as resolveComponent, c as createElementBlock, o as openBlock, h as createBaseVNode, g as createVNode, i as createTextVNode, k as withCtx, r as ref, b8 as defineAsyncComponent, s as __vitePreload, __tla as __tla_0 } from "./index-DsQ9-pB_.js";
let index;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch (e) {
    }
  })()
]).then(() => __async(null, null, function* () {
  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max) || min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const _sfc_main = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const loadingShow = ref(true);
      const loadingRef = ref();
      const showNumber = ref(true);
      const showLoading = ref(false);
      const layout = ref("loader5");
      const LoadingLayout = defineAsyncComponent(() => __vitePreload(() => import("./index-D0NQmujE.js").then((m) => __async(null, null, function* () {
        yield m.__tla;
        return m;
      })), true ? __vite__mapDeps([0,1,2]) : void 0));
      setInterval(() => {
        loadingRef.value.stepBy(getRandomInt(1, 10));
      }, 1e3);
      const __returned__ = {
        loadingShow,
        loadingRef,
        showNumber,
        showLoading,
        layout,
        LoadingLayout,
        get getRandomInt() {
          return getRandomInt;
        },
        defineAsyncComponent,
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
    class: "loading-demo-page"
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
    class: "control-panel"
  };
  const _hoisted_7 = {
    class: "card-header"
  };
  const _hoisted_8 = {
    class: "option-item"
  };
  const _hoisted_9 = {
    class: "option-item"
  };
  const _hoisted_10 = {
    class: "option-item"
  };
  const _hoisted_11 = {
    class: "loading-display"
  };
  const _hoisted_12 = {
    class: "loading-container"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
    const _component_el_option = resolveComponent("el-option");
    const _component_el_select = resolveComponent("el-select");
    const _component_el_form_item = resolveComponent("el-form-item");
    const _component_el_switch = resolveComponent("el-switch");
    const _component_el_form = resolveComponent("el-form");
    const _component_el_card = resolveComponent("el-card");
    return openBlock(), createElementBlock("div", _hoisted_1, [
      createBaseVNode("div", _hoisted_2, [
        createBaseVNode("div", _hoisted_3, [
          createBaseVNode("div", _hoisted_4, [
            createBaseVNode("h1", _hoisted_5, [
              createVNode(_component_IconifyIconOnline, {
                icon: "ri:loader-4-line",
                class: "title-icon"
              }),
              _cache[4] || (_cache[4] = createTextVNode(" Loading \u52A0\u8F7D\u52A8\u753B\u6F14\u793A ", -1))
            ]),
            _cache[5] || (_cache[5] = createBaseVNode("p", {
              class: "page-subtitle"
            }, "\u5C55\u793A\u591A\u79CD\u52A0\u8F7D\u52A8\u753B\u6548\u679C\uFF0C\u53EF\u81EA\u5B9A\u4E49\u914D\u7F6E", -1))
          ])
        ])
      ]),
      createBaseVNode("div", _hoisted_6, [
        createVNode(_component_el_card, {
          shadow: "hover",
          class: "control-card"
        }, {
          header: withCtx(() => [
            createBaseVNode("div", _hoisted_7, [
              createVNode(_component_IconifyIconOnline, {
                icon: "ri:settings-3-line",
                class: "header-icon"
              }),
              _cache[6] || (_cache[6] = createBaseVNode("span", null, "\u914D\u7F6E\u9009\u9879", -1))
            ])
          ]),
          default: withCtx(() => [
            createVNode(_component_el_form, {
              inline: true,
              class: "control-form"
            }, {
              default: withCtx(() => [
                createVNode(_component_el_form_item, {
                  label: "\u5E03\u5C40\u6837\u5F0F"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_select, {
                      modelValue: $setup.layout,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.layout = $event),
                      placeholder: "\u8BF7\u9009\u62E9\u5E03\u5C40",
                      class: "layout-select"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_el_option, {
                          label: "Spinning",
                          value: "spining"
                        }, {
                          default: withCtx(() => [
                            createBaseVNode("div", _hoisted_8, [
                              createVNode(_component_IconifyIconOnline, {
                                icon: "ri:loader-line"
                              }),
                              _cache[7] || (_cache[7] = createBaseVNode("span", null, "Spinning", -1))
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_el_option, {
                          label: "Spinning 2",
                          value: "spining2"
                        }, {
                          default: withCtx(() => [
                            createBaseVNode("div", _hoisted_9, [
                              createVNode(_component_IconifyIconOnline, {
                                icon: "ri:loader-2-line"
                              }),
                              _cache[8] || (_cache[8] = createBaseVNode("span", null, "Spinning 2", -1))
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_el_option, {
                          label: "Pencil",
                          value: "pencil"
                        }, {
                          default: withCtx(() => [
                            createBaseVNode("div", _hoisted_10, [
                              createVNode(_component_IconifyIconOnline, {
                                icon: "ri:pencil-line"
                              }),
                              _cache[9] || (_cache[9] = createBaseVNode("span", null, "Pencil", -1))
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(_component_el_option, {
                          label: "Loader",
                          value: "loader"
                        }),
                        createVNode(_component_el_option, {
                          label: "Loader 2",
                          value: "loader2"
                        }),
                        createVNode(_component_el_option, {
                          label: "Loader 3",
                          value: "loader3"
                        }),
                        createVNode(_component_el_option, {
                          label: "Loader 4",
                          value: "loader4"
                        }),
                        createVNode(_component_el_option, {
                          label: "Loader 5",
                          value: "loader5"
                        }),
                        createVNode(_component_el_option, {
                          label: "Loader 6",
                          value: "loader6"
                        }),
                        createVNode(_component_el_option, {
                          label: "Banter",
                          value: "banter"
                        }),
                        createVNode(_component_el_option, {
                          label: "Default",
                          value: "default"
                        }),
                        createVNode(_component_el_option, {
                          label: "Jimi",
                          value: "jimi"
                        }),
                        createVNode(_component_el_option, {
                          label: "Box",
                          value: "box"
                        })
                      ]),
                      _: 1
                    }, 8, [
                      "modelValue"
                    ])
                  ]),
                  _: 1
                }),
                createVNode(_component_el_form_item, {
                  label: "\u663E\u793A\u6570\u5B57"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_switch, {
                      modelValue: $setup.showNumber,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.showNumber = $event),
                      "active-color": "var(--el-color-primary)"
                    }, null, 8, [
                      "modelValue"
                    ])
                  ]),
                  _: 1
                }),
                createVNode(_component_el_form_item, {
                  label: "\u663E\u793A\u6587\u672C"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_switch, {
                      modelValue: $setup.showLoading,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.showLoading = $event),
                      "active-color": "var(--el-color-primary)"
                    }, null, 8, [
                      "modelValue"
                    ])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      createBaseVNode("div", _hoisted_11, [
        createVNode(_component_el_card, {
          shadow: "never",
          class: "display-card"
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_12, [
              createVNode($setup["LoadingLayout"], {
                ref: "loadingRef",
                modelValue: $setup.loadingShow,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.loadingShow = $event),
                layout: $setup.layout,
                "show-number": $setup.showNumber,
                "show-loading": $setup.showLoading
              }, null, 8, [
                "modelValue",
                "layout",
                "show-number",
                "show-loading"
              ])
            ])
          ]),
          _: 1
        })
      ])
    ]);
  }
  index = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__scopeId",
      "data-v-8ffe1a05"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/demo/loading/index.vue"
    ]
  ]);
}));
export {
  __tla,
  index as default
};
