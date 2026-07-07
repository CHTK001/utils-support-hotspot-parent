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
import { d as defineComponent, C as getConfig, _ as _export_sfc, c as createElementBlock, o as openBlock, i as createTextVNode, h as createBaseVNode, t as toDisplayString, aA as shallowRef, q as computed, al as watch, a4 as useMultiTagsStoreHook, w as withDirectives, F as Fragment, m as renderList, aw as vShow, aG as renderSlot, S as useI18n, Y as K, r as ref, af as emitter, am as onBeforeUnmount, aI as X, l as onMounted, T as nextTick, p as useRouter, aK as h, aZ as Transition, aa as usePermissionStoreHook, e as resolveComponent, j as createBlock, v as createCommentVNode, k as withCtx, g as createVNode, n as normalizeStyle, bS as KeepAlive, x as resolveDynamicComponent, L as normalizeClass } from "./index-DsQ9-pB_.js";
import { u as useTags } from "./index-FAPmuDlh.js";
import "./index-DzMTRvxk.js";
import "./index-Df2x6qn1.js";
import "./md5-DScUA_Ek.js";
import "./qrcode.vue.esm-DKkHPbpI.js";
import "./interact.min-C7rynaR3.js";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const TITLE = getConfig("Title");
    const __returned__ = {
      TITLE
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});
const _hoisted_1$2 = {
  class: "layout-footer text-[rgba(0,0,0,0.6)] dark:text-[rgba(220,220,242,0.8)]"
};
const _hoisted_2$1 = {
  class: "hover:text-primary",
  href: "https://github.com/pure-admin",
  target: "_blank"
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("footer", _hoisted_1$2, [_cache[0] || (_cache[0] = createTextVNode(" Copyright \xA9 2020-present ", -1)), createBaseVNode("a", _hoisted_2$1, "\xA0" + toDisplayString($setup.TITLE), 1)]);
}
const LayFooter = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-7349ba87"], ["__file", "H:/workspace/2/vue-support-parent-starter/layout/default/src/components/lay-footer/index.vue"]]);
const MAP = /* @__PURE__ */ new Map();
const useMultiFrame = () => {
  function setMap(path, Comp) {
    MAP.set(path, Comp);
  }
  function getMap(path) {
    if (path) {
      return MAP.get(path);
    }
    return [...MAP.entries()];
  }
  function delMap(path) {
    MAP.delete(path);
  }
  return {
    setMap,
    getMap,
    delMap,
    MAP
  };
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "index",
  props: {
    currRoute: {
      type: null,
      required: true
    },
    currComp: {
      type: null,
      required: true
    }
  },
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const props = __props;
    const compList = shallowRef([]);
    const {
      setMap,
      getMap,
      MAP: MAP2,
      delMap
    } = useMultiFrame();
    const keep = computed(() => {
      var _a, _b;
      return getConfig().KeepAlive && ((_a = props.currRoute.meta) == null ? void 0 : _a.keepAlive) && !!((_b = props.currRoute.meta) == null ? void 0 : _b.frameSrc);
    });
    const normalComp = computed(() => !keep.value && props.currComp);
    watch(useMultiTagsStoreHook().multiTags, (tags) => {
      if (!Array.isArray(tags) || !keep.value) {
        return;
      }
      const iframeTags = tags.filter((i) => {
        var _a;
        return (_a = i.meta) == null ? void 0 : _a.frameSrc;
      });
      if (iframeTags.length < MAP2.size) {
        for (const i of MAP2.keys()) {
          if (!tags.some((s) => s.path === i)) {
            delMap(i);
            compList.value = getMap();
          }
        }
      }
    });
    watch(() => props.currRoute.fullPath, (path) => {
      try {
        const storage = localStorage.getItem("layout");
        if (storage) {
          const layoutConfig = JSON.parse(storage);
          if (layoutConfig.darkMode) {
            document.documentElement.classList.add("dark");
          }
        }
      } catch (e) {
        console.warn("Failed to set dark theme from localStorage:", e);
      }
      const multiTags = useMultiTagsStoreHook().multiTags;
      const iframeTags = multiTags == null ? void 0 : multiTags.filter((i) => {
        var _a;
        return (_a = i.meta) == null ? void 0 : _a.frameSrc;
      });
      if (keep.value) {
        if (iframeTags.length !== MAP2.size) {
          const sameKey = [...MAP2.keys()].find((i) => path === i);
          if (!sameKey) {
            setMap(path, props.currComp);
          }
        }
      }
      if (MAP2.size > 0) {
        compList.value = getMap();
      }
    }, {
      immediate: true
    });
    const __returned__ = {
      props,
      compList,
      setMap,
      getMap,
      MAP: MAP2,
      delMap,
      keep,
      normalComp
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});
const _hoisted_1$1 = {
  class: "w-full h-full"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(Fragment, null, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.compList, ([fullPath, Comp]) => {
    var _a;
    return withDirectives((openBlock(), createElementBlock("div", {
      key: fullPath,
      class: "w-full h-full"
    }, [renderSlot(_ctx.$slots, "default", {
      fullPath,
      Comp,
      frameInfo: {
        frameSrc: (_a = $props.currRoute.meta) == null ? void 0 : _a.frameSrc,
        fullPath
      }
    })], 512)), [[vShow, fullPath === $props.currRoute.fullPath]]);
  }), 128)), withDirectives(createBaseVNode("div", _hoisted_1$1, [renderSlot(_ctx.$slots, "default", {
    Comp: $setup.normalComp,
    fullPath: $props.currRoute.fullPath
  })], 512), [[vShow, !$setup.keep]])], 64);
}
const LayFrame = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "H:/workspace/2/vue-support-parent-starter/layout/default/src/components/lay-frame/index.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  props: {
    fixedHeader: Boolean
  },
  setup(__props, {
    expose: __expose
  }) {
    var _a, _b, _c, _d;
    __expose();
    const props = __props;
    const {
      t
    } = useI18n();
    const {
      showModel
    } = useTags();
    const {
      $storage,
      $config
    } = K();
    const isKeepAlive = ref((_c = (_b = (_a = $storage == null ? void 0 : $storage.configure) == null ? void 0 : _a.keepAlive) != null ? _b : $config == null ? void 0 : $config.KeepAlive) != null ? _c : true);
    emitter.on("keepAliveChange", (value) => {
      isKeepAlive.value = value;
    });
    const transitions = computed(() => {
      return (route) => {
        return route.meta.transition;
      };
    });
    const hideTabs = computed(() => {
      return $storage == null ? void 0 : $storage.configure.hideTabs;
    });
    const contentMargin = computed(() => {
      return ($storage == null ? void 0 : $storage.configure.contentMargin) || 16;
    });
    const layoutRadius = computed(() => {
      return ($storage == null ? void 0 : $storage.configure.layoutRadius) || 10;
    });
    const layoutBlur = computed(() => {
      return ($storage == null ? void 0 : $storage.configure.layoutBlur) || 4;
    });
    const hideFooter = ref((_d = $storage == null ? void 0 : $storage.configure.hideFooter) != null ? _d : false);
    emitter.on("hideFooterChange", (value) => {
      hideFooter.value = value;
    });
    onBeforeUnmount(() => {
      emitter.off("hideFooterChange");
      emitter.off("keepAliveChange");
    });
    const stretch = computed(() => {
      return $storage == null ? void 0 : $storage.configure.stretch;
    });
    const layoutMode = computed(() => ($storage == null ? void 0 : $storage.layout.layout) || "vertical");
    const isVerticalLayout = computed(() => layoutMode.value === "vertical");
    const cardBody = computed(() => {
      return $storage == null ? void 0 : $storage.configure.cardBody;
    });
    const getMainWidth = computed(() => {
      return X(stretch.value) ? stretch.value + "px" : stretch.value ? "1440px" : "100%";
    });
    const isMobileLayout = computed(() => layoutMode.value === "mobile");
    const getSectionStyle = computed(() => {
      if (isMobileLayout.value) {
        return ["padding-top: 0;"];
      }
      return [hideTabs.value && isVerticalLayout.value ? "padding-top: 48px;" : "", !hideTabs.value && isVerticalLayout.value ? showModel.value == "chrome" ? "padding-top: 85px;" : "padding-top: 81px;" : "", hideTabs.value && !isVerticalLayout.value ? "padding-top: 48px;" : "", !hideTabs.value && !isVerticalLayout.value ? showModel.value == "chrome" ? "padding-top: 85px;" : "padding-top: 81px;" : "", props.fixedHeader ? "" : `padding-top: 0;${hideTabs.value ? "min-height: calc(100vh - 48px);" : "min-height: calc(100vh - 86px);"}`];
    });
    onMounted(() => __async(null, null, function* () {
      try {
        const storage = localStorage.getItem("layout");
        if (storage) {
          const layoutConfig = JSON.parse(storage);
          if (layoutConfig.darkMode) {
            document.documentElement.classList.add("dark");
          }
        }
      } catch (e) {
        console.warn("Failed to set dark theme from localStorage:", e);
      }
      nextTick(() => {
        document.body.style.setProperty("height", "100vh");
        document.body.style.setProperty("overflow", "hidden");
        document.body.style.setProperty("--contentMargin", contentMargin.value + "px");
        document.body.style.setProperty("--layoutRadius", layoutRadius.value + "px");
        document.body.style.setProperty("--layoutBlur", layoutBlur.value + "px");
      });
    }));
    const transitionMain = defineComponent({
      props: {
        route: {
          type: void 0,
          required: true
        }
      },
      render() {
        var _a2, _b2, _c2;
        try {
          const storage = localStorage.getItem("layout");
          if (storage) {
            const layoutConfig = JSON.parse(storage);
            if (layoutConfig.darkMode) {
              document.documentElement.classList.add("dark");
            }
          }
        } catch (e) {
          console.warn("Failed to set dark theme from localStorage:", e);
        }
        const menuTransition = $storage.configure.menuTransition;
        const transitionName = menuTransition ? ((_a2 = transitions.value(this.route)) == null ? void 0 : _a2.name) || "fade-transform" : "";
        const enterTransition = menuTransition ? (_b2 = transitions.value(this.route)) == null ? void 0 : _b2.enterTransition : "";
        const leaveTransition = menuTransition ? (_c2 = transitions.value(this.route)) == null ? void 0 : _c2.leaveTransition : "";
        return h(Transition, {
          name: !menuTransition ? "" : enterTransition ? "pure-classes-transition" : transitionName,
          enterActiveClass: !menuTransition ? "" : enterTransition ? `animate__animated ${enterTransition}` : void 0,
          leaveActiveClass: !menuTransition ? "" : leaveTransition ? `animate__animated ${leaveTransition}` : void 0,
          mode: "out-in",
          appear: true
        }, {
          default: () => [this.$slots.default()]
        });
      }
    });
    const router = useRouter();
    const __returned__ = {
      props,
      t,
      showModel,
      $storage,
      $config,
      isKeepAlive,
      transitions,
      hideTabs,
      contentMargin,
      layoutRadius,
      layoutBlur,
      hideFooter,
      stretch,
      layoutMode,
      isVerticalLayout,
      cardBody,
      getMainWidth,
      isMobileLayout,
      getSectionStyle,
      transitionMain,
      router,
      get usePermissionStoreHook() {
        return usePermissionStoreHook;
      },
      LayFooter,
      LayFrame
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});
const _hoisted_1 = {
  class: "grow bg-layout"
};
const _hoisted_2 = {
  key: 1,
  class: "grow bg-layout"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_el_backtop = resolveComponent("el-backtop");
  const _component_el_card = resolveComponent("el-card");
  const _component_el_scrollbar = resolveComponent("el-scrollbar");
  const _component_router_view = resolveComponent("router-view");
  return openBlock(), createElementBlock("section", {
    class: normalizeClass([$props.fixedHeader ? "app-main" : "app-main-nofixed-header"]),
    style: normalizeStyle($setup.getSectionStyle)
  }, [(openBlock(), createBlock(_component_router_view, {
    key: _ctx.$route.fullPath
  }, {
    default: withCtx(({
      Component,
      route
    }) => [createVNode($setup["LayFrame"], {
      currComp: Component,
      currRoute: route
    }, {
      default: withCtx(({
        Comp,
        fullPath,
        frameInfo
      }) => [$props.fixedHeader ? (openBlock(), createBlock(_component_el_scrollbar, {
        key: 0,
        "wrap-style": {
          display: "flex",
          "flex-wrap": "wrap",
          "max-width": $setup.getMainWidth,
          margin: "0 auto",
          transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)"
        },
        "view-style": {
          display: "flex",
          flex: "auto",
          overflow: "hidden",
          "flex-direction": "column"
        }
      }, {
        default: withCtx(() => [createVNode(_component_el_backtop, {
          title: $setup.t("buttons.pureBackTop"),
          target: ".app-main .el-scrollbar__wrap"
        }, null, 8, ["title"]), createBaseVNode("div", _hoisted_1, [$setup.cardBody ? (openBlock(), createBlock(_component_el_card, {
          key: 0,
          class: "layout sidebar-custom",
          shadow: "never",
          style: normalizeStyle({
            height: "calc(100% - " + $setup.contentMargin * 2 + "px)",
            "border-radius": $setup.layoutRadius + "px  !important",
            margin: $setup.contentMargin + "px"
          })
        }, {
          default: withCtx(() => [createVNode($setup["transitionMain"], {
            route
          }, {
            default: withCtx(() => [$setup.isKeepAlive ? (openBlock(), createBlock(KeepAlive, {
              key: 0,
              include: $setup.usePermissionStoreHook().cachePageList
            }, [(openBlock(), createBlock(resolveDynamicComponent(Comp), {
              key: fullPath,
              frameInfo,
              class: "main-content"
            }, null, 8, ["frameInfo"]))], 1032, ["include"])) : (openBlock(), createBlock(resolveDynamicComponent(Comp), {
              key: fullPath,
              frameInfo,
              class: "main-content"
            }, null, 8, ["frameInfo"]))]),
            _: 2
          }, 1032, ["route"])]),
          _: 2
        }, 1032, ["style"])) : (openBlock(), createElementBlock("div", {
          key: 1,
          class: "h-full layout sidebar-custom",
          shadow: "never",
          style: normalizeStyle({
            margin: $setup.contentMargin + "px",
            height: "calc(100% - " + $setup.contentMargin * 2 + "px)",
            "border-radius": $setup.layoutRadius + "px !important"
          })
        }, [createVNode($setup["transitionMain"], {
          route
        }, {
          default: withCtx(() => [$setup.isKeepAlive ? (openBlock(), createBlock(KeepAlive, {
            key: 0,
            include: $setup.usePermissionStoreHook().cachePageList
          }, [(openBlock(), createBlock(resolveDynamicComponent(Comp), {
            key: fullPath,
            frameInfo,
            class: "main-content",
            style: normalizeStyle({
              "border-radius": $setup.layoutRadius + "px"
            })
          }, null, 8, ["frameInfo", "style"]))], 1032, ["include"])) : (openBlock(), createBlock(resolveDynamicComponent(Comp), {
            key: fullPath,
            frameInfo,
            class: "main-content",
            style: normalizeStyle({
              "border-radius": $setup.layoutRadius + "px"
            })
          }, null, 8, ["frameInfo", "style"]))]),
          _: 2
        }, 1032, ["route"])], 4))]), !$setup.hideFooter ? (openBlock(), createBlock($setup["LayFooter"], {
          key: 0
        })) : createCommentVNode("", true)]),
        _: 2
      }, 1032, ["wrap-style"])) : (openBlock(), createElementBlock("div", _hoisted_2, [$setup.cardBody ? (openBlock(), createBlock(_component_el_card, {
        key: 0,
        class: "h-full layout sidebar-custom",
        shadow: "never",
        style: normalizeStyle({
          height: "calc(100% - " + $setup.contentMargin * 2 + "px)",
          "border-radius": $setup.layoutRadius + "px  !important",
          margin: $setup.contentMargin + "px"
        })
      }, {
        default: withCtx(() => [createVNode($setup["transitionMain"], {
          route
        }, {
          default: withCtx(() => [$setup.isKeepAlive ? (openBlock(), createBlock(KeepAlive, {
            key: 0,
            include: $setup.usePermissionStoreHook().cachePageList
          }, [(openBlock(), createBlock(resolveDynamicComponent(Comp), {
            key: fullPath,
            frameInfo,
            class: "main-content"
          }, null, 8, ["frameInfo"]))], 1032, ["include"])) : (openBlock(), createBlock(resolveDynamicComponent(Comp), {
            key: fullPath,
            frameInfo,
            class: "main-content"
          }, null, 8, ["frameInfo"]))]),
          _: 2
        }, 1032, ["route"])]),
        _: 2
      }, 1032, ["style"])) : (openBlock(), createElementBlock("div", {
        key: 1,
        class: "h-full layout sidebar-custom",
        shadow: "never",
        style: normalizeStyle({
          height: "calc(100% - " + $setup.contentMargin * 2 + "px)",
          margin: $setup.contentMargin + "px",
          "border-radius": $setup.layoutRadius + "px  !important"
        })
      }, [createVNode($setup["transitionMain"], {
        route
      }, {
        default: withCtx(() => [$setup.isKeepAlive ? (openBlock(), createBlock(KeepAlive, {
          key: 0,
          include: $setup.usePermissionStoreHook().cachePageList
        }, [(openBlock(), createBlock(resolveDynamicComponent(Comp), {
          key: fullPath,
          frameInfo,
          class: "main-content",
          style: normalizeStyle({
            "border-radius": $setup.layoutRadius + "px"
          })
        }, null, 8, ["frameInfo", "style"]))], 1032, ["include"])) : (openBlock(), createBlock(resolveDynamicComponent(Comp), {
          key: fullPath,
          frameInfo,
          class: "main-content",
          style: normalizeStyle({
            "border-radius": $setup.layoutRadius + "px"
          })
        }, null, 8, ["frameInfo", "style"]))]),
        _: 2
      }, 1032, ["route"])], 4))]))]),
      _: 2
    }, 1032, ["currComp", "currRoute"])]),
    _: 1
  })), !$setup.hideFooter && !$props.fixedHeader ? (openBlock(), createBlock($setup["LayFooter"], {
    key: 0
  })) : createCommentVNode("", true)], 6);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7450ec45"], ["__file", "H:/workspace/2/vue-support-parent-starter/layout/default/src/components/lay-content/index.vue"]]);
export {
  index as default
};
