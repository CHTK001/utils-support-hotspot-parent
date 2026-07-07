const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["static/js/index-Dwz4dnSr.js","static/js/index-DsQ9-pB_.js","static/css/index-B-32fySL.css","static/js/index-Df2x6qn1.js","static/css/index-Boeb5zUF.css"])))=>i.map(i=>d[i]);
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
import { d as defineComponent, r as ref, l as onMounted, _ as _export_sfc, c as createElementBlock, h as createBaseVNode, a as createStaticVNode, t as toDisplayString, n as normalizeStyle, F as Fragment, m as renderList, o as openBlock, u as useRoute, p as useRouter, q as computed, s as __vitePreload, e as resolveComponent, j as createBlock, v as createCommentVNode, x as resolveDynamicComponent, g as createVNode, __tla as __tla_0 } from "./index-DsQ9-pB_.js";
let RemainingComponentPage;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch (e) {
    }
  })()
]).then(() => __async(null, null, function* () {
  const _sfc_main$1 = defineComponent({
    __name: "CoolLoading",
    props: {
      loadingText: {
        type: String,
        required: false,
        default: "\u7EC4\u4EF6\u52A0\u8F7D\u4E2D..."
      },
      showProgress: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const progress = ref(0);
      const getParticleStyle = (index) => {
        const angle = index * 18 % 360;
        const radius = 100 + Math.random() * 50;
        const delay = Math.random() * 2;
        return {
          "--angle": `${angle}deg`,
          "--radius": `${radius}px`,
          "--delay": `${delay}s`
        };
      };
      onMounted(() => {
        if (props.showProgress) {
          const interval = setInterval(() => {
            if (progress.value < 90) {
              progress.value += Math.random() * 10;
            } else {
              clearInterval(interval);
            }
          }, 200);
        }
      });
      const __returned__ = {
        props,
        progress,
        getParticleStyle
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  });
  const _hoisted_1$1 = {
    class: "cool-loading"
  };
  const _hoisted_2$1 = {
    class: "loading-container"
  };
  const _hoisted_3 = {
    class: "loading-text"
  };
  const _hoisted_4 = {
    class: "text-gradient"
  };
  const _hoisted_5 = {
    class: "progress-bar"
  };
  const _hoisted_6 = {
    class: "particles"
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$1, [
      createBaseVNode("div", _hoisted_2$1, [
        _cache[0] || (_cache[0] = createStaticVNode('<div class="loading-spinner" data-v-0b23426b><div class="spinner-ring" data-v-0b23426b></div><div class="spinner-ring" data-v-0b23426b></div><div class="spinner-ring" data-v-0b23426b></div><div class="spinner-ring" data-v-0b23426b></div></div>', 1)),
        createBaseVNode("div", _hoisted_3, [
          createBaseVNode("span", _hoisted_4, toDisplayString($props.loadingText), 1)
        ]),
        createBaseVNode("div", _hoisted_5, [
          createBaseVNode("div", {
            class: "progress-fill",
            style: normalizeStyle({
              width: $setup.progress + "%"
            })
          }, null, 4)
        ]),
        createBaseVNode("div", _hoisted_6, [
          (openBlock(), createElementBlock(Fragment, null, renderList(20, (i) => {
            return createBaseVNode("div", {
              key: i,
              class: "particle",
              style: normalizeStyle($setup.getParticleStyle(i))
            }, null, 4);
          }), 64))
        ])
      ])
    ]);
  }
  const CoolLoading = _export_sfc(_sfc_main$1, [
    [
      "render",
      _sfc_render$1
    ],
    [
      "__scopeId",
      "data-v-0b23426b"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/pages/loading/CoolLoading.vue"
    ]
  ]);
  const _sfc_main = defineComponent({
    __name: "RemainingComponentPage",
    setup(__props, { expose: __expose }) {
      __expose();
      const route = useRoute();
      const router = useRouter();
      const componentPath = computed(() => {
        return route.params.componentPath;
      });
      const dynamicComponent = ref(null);
      const isLoading = ref(false);
      const loadError = ref(false);
      const loadComponent = () => __async(null, null, function* () {
        try {
          isLoading.value = true;
          loadError.value = false;
          dynamicComponent.value = null;
          if (!componentPath.value) {
            console.error("\u7EC4\u4EF6\u8DEF\u5F84\u53C2\u6570\u7F3A\u5931");
            loadError.value = true;
            return;
          }
          if (componentPath.value === "video-search") {
            const { VideoSearch } = yield __vitePreload(() => __async(null, null, function* () {
              const { VideoSearch: VideoSearch2 } = yield import("./index-Dwz4dnSr.js").then((m) => __async(null, null, function* () {
                yield m.__tla;
                return m;
              }));
              return {
                VideoSearch: VideoSearch2
              };
            }), true ? __vite__mapDeps([0,1,2,3,4]) : void 0);
            dynamicComponent.value = VideoSearch;
          } else if (componentPath.value === "video-search-result") {
            const { VideoSearchResult } = yield __vitePreload(() => __async(null, null, function* () {
              const { VideoSearchResult: VideoSearchResult2 } = yield import("./index-Dwz4dnSr.js").then((m) => __async(null, null, function* () {
                yield m.__tla;
                return m;
              }));
              return {
                VideoSearchResult: VideoSearchResult2
              };
            }), true ? __vite__mapDeps([0,1,2,3,4]) : void 0);
            dynamicComponent.value = VideoSearchResult;
          } else if (componentPath.value === "video-manage-result") {
            const { VideoManageSearchResult } = yield __vitePreload(() => __async(null, null, function* () {
              const { VideoManageSearchResult: VideoManageSearchResult2 } = yield import("./index-Dwz4dnSr.js").then((m) => __async(null, null, function* () {
                yield m.__tla;
                return m;
              }));
              return {
                VideoManageSearchResult: VideoManageSearchResult2
              };
            }), true ? __vite__mapDeps([0,1,2,3,4]) : void 0);
            dynamicComponent.value = VideoManageSearchResult;
          } else if (componentPath.value === "video-detail-result") {
            const { VideoDetailResult } = yield __vitePreload(() => __async(null, null, function* () {
              const { VideoDetailResult: VideoDetailResult2 } = yield import("./index-Dwz4dnSr.js").then((m) => __async(null, null, function* () {
                yield m.__tla;
                return m;
              }));
              return {
                VideoDetailResult: VideoDetailResult2
              };
            }), true ? __vite__mapDeps([0,1,2,3,4]) : void 0);
            dynamicComponent.value = VideoDetailResult;
          } else if (componentPath.value === "video-play") {
            const { VideoPlay } = yield __vitePreload(() => __async(null, null, function* () {
              const { VideoPlay: VideoPlay2 } = yield import("./index-Dwz4dnSr.js").then((m) => __async(null, null, function* () {
                yield m.__tla;
                return m;
              }));
              return {
                VideoPlay: VideoPlay2
              };
            }), true ? __vite__mapDeps([0,1,2,3,4]) : void 0);
            dynamicComponent.value = VideoPlay;
          } else if (componentPath.value === "video-manage") {
            const { VideoManage } = yield __vitePreload(() => __async(null, null, function* () {
              const { VideoManage: VideoManage2 } = yield import("./index-Dwz4dnSr.js").then((m) => __async(null, null, function* () {
                yield m.__tla;
                return m;
              }));
              return {
                VideoManage: VideoManage2
              };
            }), true ? __vite__mapDeps([0,1,2,3,4]) : void 0);
            dynamicComponent.value = VideoManage;
          } else {
            const actualPath = convertPathToComponentPath(componentPath.value);
            const componentModule = yield import(actualPath).then((m) => __async(null, null, function* () {
              yield m.__tla;
              return m;
            }));
            dynamicComponent.value = componentModule.default || componentModule;
          }
          if (!dynamicComponent.value) {
            loadError.value = true;
          }
        } catch (error) {
          console.error("\u52A0\u8F7D\u7EC4\u4EF6\u5931\u8D25:", error);
          loadError.value = true;
          dynamicComponent.value = null;
        } finally {
          isLoading.value = false;
        }
      });
      const convertPathToComponentPath = (path) => {
        const pathMap = {
          "video-search": "@pages/video",
          "video-search-result": "@pages/video",
          "video-manage": "@pages/video"
        };
        return pathMap[path] || `@/views/${path.replace(/-/g, "/")}/index.vue`;
      };
      const goBack = () => {
        router.back();
      };
      onMounted(() => {
        loadComponent();
      });
      const __returned__ = {
        route,
        router,
        componentPath,
        dynamicComponent,
        isLoading,
        loadError,
        loadComponent,
        convertPathToComponentPath,
        goBack,
        get CoolLoading() {
          return CoolLoading;
        }
      };
      Object.defineProperty(__returned__, "__isScriptSetup", {
        enumerable: false,
        value: true
      });
      return __returned__;
    }
  });
  const _hoisted_1 = {
    class: "remaining-component-page"
  };
  const _hoisted_2 = {
    key: 2,
    class: "error-404"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_NoFound = resolveComponent("NoFound");
    return openBlock(), createElementBlock("div", _hoisted_1, [
      $setup.isLoading ? (openBlock(), createBlock($setup["CoolLoading"], {
        key: 0,
        "loading-text": "\u9875\u9762\u52A0\u8F7D\u4E2D...",
        "show-progress": true
      })) : $setup.dynamicComponent && !$setup.isLoading ? (openBlock(), createBlock(resolveDynamicComponent($setup.dynamicComponent), {
        key: 1
      })) : !$setup.isLoading && $setup.loadError ? (openBlock(), createElementBlock("div", _hoisted_2, [
        createVNode(_component_NoFound)
      ])) : createCommentVNode("", true)
    ]);
  }
  RemainingComponentPage = _export_sfc(_sfc_main, [
    [
      "render",
      _sfc_render
    ],
    [
      "__scopeId",
      "data-v-9fc20a19"
    ],
    [
      "__file",
      "H:/workspace/2/vue-support-parent-starter/packages/pages/page/remaining/RemainingComponentPage.vue"
    ]
  ]);
}));
export {
  __tla,
  RemainingComponentPage as default
};
