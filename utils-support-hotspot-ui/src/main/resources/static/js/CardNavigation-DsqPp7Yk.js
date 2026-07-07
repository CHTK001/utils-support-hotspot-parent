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
import { d as defineComponent, Y as K, p as useRouter, u as useRoute, r as ref, q as computed, aa as usePermissionStoreHook, al as watch, l as onMounted, b as onUnmounted, _ as _export_sfc, e as resolveComponent, c as createElementBlock, o as openBlock, h as createBaseVNode, v as createCommentVNode, g as createVNode, w as withDirectives, aw as vShow, F as Fragment, m as renderList, n as normalizeStyle, L as normalizeClass, j as createBlock, t as toDisplayString, x as resolveDynamicComponent } from "./index-DsQ9-pB_.js";
import { L as LaySidebarBreadCrumb, a as LayTool } from "./index-FAPmuDlh.js";
import "./index-DzMTRvxk.js";
import "./index-Df2x6qn1.js";
import "./md5-DScUA_Ek.js";
import "./qrcode.vue.esm-DKkHPbpI.js";
import "./interact.min-C7rynaR3.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CardNavigation",
  props: {
    showTitle: {
      type: Boolean,
      required: false,
      default: true
    },
    maxVisibleCards: {
      type: Number,
      required: false,
      default: 6
    }
  },
  emits: ["cardClick"],
  setup(__props, {
    expose: __expose,
    emit: __emit
  }) {
    __expose();
    const {
      $storage,
      $config
    } = K();
    const props = __props;
    const emit = __emit;
    const router = useRouter();
    const route = useRoute();
    const scrollContainer = ref();
    const hoveredMenu = ref(null);
    const hoveredSubMenu = ref(null);
    const hoveredThirdMenu = ref(null);
    const hoverTimeout = ref();
    const subHoverTimeout = ref();
    const thirdHoverTimeout = ref();
    const hoveredMenuElement = ref();
    const subMenuPosition = ref({
      top: 0,
      left: 0
    });
    const subMenuPosition2 = ref({
      top: 0,
      left: 0
    });
    const subMenuPosition3 = ref({
      top: 0,
      left: 0
    });
    const currentComponent = ref(null);
    const showCardNavigation = ref(true);
    const isDragging = ref(false);
    const dragStartX = ref(0);
    const scrollStartX = ref(0);
    const canScrollLeft = ref(false);
    const canScrollRight = ref(false);
    function getRandomHue() {
      var _a;
      const cardColorMode = ((_a = $storage.configure) == null ? void 0 : _a.cardColorMode) || "all";
      if (cardColorMode === "white") {
        return 0;
      }
      const allHues = [220, 280, 340, 30, 120, 180, 200, 260, 320, 60, 90, 150];
      if (cardColorMode === "third") {
        const limitedHues = allHues.slice(0, 4);
        return limitedHues[Math.floor(Math.random() * limitedHues.length)];
      }
      return allHues[Math.floor(Math.random() * allHues.length)];
    }
    const mainMenuItems = computed(() => {
      const items = usePermissionStoreHook().wholeMenus.filter((menu) => {
        var _a;
        return ((_a = menu.meta) == null ? void 0 : _a.showLink) !== false && menu.path !== "/";
      });
      return items.map((menu) => __spreadProps(__spreadValues({}, menu), {
        randomHue: getRandomHue()
      }));
    });
    function getSubMenuItems(menu, level = 1) {
      if (!menu.children || menu.children.length === 0) return [];
      if (level > 3) return [];
      const items = [];
      menu.children.forEach((child) => {
        var _a;
        if (((_a = child.meta) == null ? void 0 : _a.showLink) === false) return;
        const hasComponents = child.component || child.components && Object.keys(child.components).length > 0;
        const hasChildren = child.children && child.children.length > 0;
        if (level < 3) {
          items.push(__spreadProps(__spreadValues({}, child), {
            level,
            hasSubMenu: hasChildren && !hasComponents
            // 有子菜单且不是最终页面
          }));
        } else {
          if (hasComponents) {
            items.push(__spreadProps(__spreadValues({}, child), {
              level,
              hasSubMenu: false
            }));
          }
        }
      });
      return items;
    }
    function shouldShowSubMenu(menu, level = 1) {
      const subItems = getSubMenuItems(menu, level);
      return subItems.length > 0;
    }
    function handleCardClick(menu) {
      emit("cardClick", menu);
      if (shouldShowSubMenu(menu)) {
        return;
      }
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("nav");
      currentUrl.pathname = menu.path;
      window.history.pushState({}, "", currentUrl.toString());
      router.push(menu.path);
    }
    function handleSubMenuClick(subMenu) {
      var _a, _b;
      emit("cardClick", subMenu);
      if (((_a = subMenu.meta) == null ? void 0 : _a.remaining) === true) {
        if (((_b = subMenu.meta) == null ? void 0 : _b.remainingSelf) === true) {
          const componentPath = convertPathToComponentParam(subMenu.path);
          router.push(`/remaining-component/${componentPath}`);
        } else {
          const componentPath = convertPathToComponentParam(subMenu.path);
          const fullUrl = `${window.location.origin}/#/remaining-component/${componentPath}`;
          window.open(fullUrl, "_blank");
        }
      } else {
        window.open("/" + router.resolve(subMenu.path).href, "_blank");
      }
      hoveredMenu.value = null;
    }
    function convertPathToComponentParam(path) {
      const cleanPath = path.replace(/^\//, "");
      return cleanPath.replace(/\//g, "-");
    }
    function handleMouseEnter(menu, event) {
      if (hoverTimeout.value) {
        clearTimeout(hoverTimeout.value);
      }
      if (shouldShowSubMenu(menu)) {
        if (hoveredMenu.value !== menu && event) {
          hoveredMenu.value = menu;
          const target = event.currentTarget;
          const rect = target.getBoundingClientRect();
          subMenuPosition.value = {
            top: rect.top - 10,
            // 在卡片上方10px
            left: rect.left + rect.width / 2
            // 水平居中对齐
          };
        } else if (!event) {
          if (hoverTimeout.value) {
            clearTimeout(hoverTimeout.value);
          }
        }
      }
    }
    function handleMouseLeave() {
      hoverTimeout.value = setTimeout(() => {
        hoveredMenu.value = null;
        hoveredSubMenu.value = null;
        hoveredThirdMenu.value = null;
      }, 200);
    }
    function handleSubMenuEnter(subMenu, event) {
      if (subHoverTimeout.value) {
        clearTimeout(subHoverTimeout.value);
      }
      if (hoverTimeout.value) {
        clearTimeout(hoverTimeout.value);
      }
      if (shouldShowSubMenu(subMenu, 2)) {
        if (hoveredSubMenu.value !== subMenu && event) {
          hoveredSubMenu.value = subMenu;
          const target = event.currentTarget;
          const rect = target.getBoundingClientRect();
          subMenuPosition2.value = {
            top: rect.top,
            left: rect.right + 10
          };
        }
      }
    }
    function handleSubMenuLeave() {
      subHoverTimeout.value = setTimeout(() => {
        hoveredSubMenu.value = null;
        hoveredThirdMenu.value = null;
      }, 200);
    }
    function handleThirdMenuEnter(thirdMenu, event) {
      if (thirdHoverTimeout.value) {
        clearTimeout(thirdHoverTimeout.value);
      }
      if (subHoverTimeout.value) {
        clearTimeout(subHoverTimeout.value);
      }
      if (hoverTimeout.value) {
        clearTimeout(hoverTimeout.value);
      }
      if (shouldShowSubMenu(thirdMenu, 3)) {
        if (hoveredThirdMenu.value !== thirdMenu && event) {
          hoveredThirdMenu.value = thirdMenu;
          const target = event.currentTarget;
          const rect = target.getBoundingClientRect();
          subMenuPosition3.value = {
            top: rect.top,
            left: rect.right + 10
          };
        }
      }
    }
    function handleThirdMenuLeave() {
      thirdHoverTimeout.value = setTimeout(() => {
        hoveredThirdMenu.value = null;
      }, 200);
    }
    function checkScrollState() {
      if (scrollContainer.value) {
        const {
          scrollLeft: scrollLeft2,
          scrollWidth,
          clientWidth
        } = scrollContainer.value;
        canScrollLeft.value = scrollLeft2 > 0;
        canScrollRight.value = scrollLeft2 < scrollWidth - clientWidth - 1;
      }
    }
    function scrollLeft() {
      if (scrollContainer.value) {
        scrollContainer.value.scrollBy({
          left: -200,
          behavior: "smooth"
        });
        setTimeout(checkScrollState, 300);
      }
    }
    function scrollRight() {
      if (scrollContainer.value) {
        const cardWidth = 200;
        scrollContainer.value.scrollBy({
          left: cardWidth,
          behavior: "smooth"
        });
        setTimeout(checkScrollState, 300);
      }
    }
    function handleMouseDown(event) {
      var _a;
      isDragging.value = true;
      dragStartX.value = event.clientX;
      scrollStartX.value = ((_a = scrollContainer.value) == null ? void 0 : _a.scrollLeft) || 0;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      event.preventDefault();
    }
    function handleMouseMove(event) {
      if (!isDragging.value || !scrollContainer.value) return;
      const deltaX = event.clientX - dragStartX.value;
      scrollContainer.value.scrollLeft = scrollStartX.value - deltaX;
      checkScrollState();
    }
    function handleMouseUp() {
      isDragging.value = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    function handleTouchStart(event) {
      var _a;
      isDragging.value = true;
      dragStartX.value = event.touches[0].clientX;
      scrollStartX.value = ((_a = scrollContainer.value) == null ? void 0 : _a.scrollLeft) || 0;
    }
    function handleTouchMove(event) {
      if (!isDragging.value || !scrollContainer.value) return;
      const deltaX = event.touches[0].clientX - dragStartX.value;
      scrollContainer.value.scrollLeft = scrollStartX.value - deltaX;
      checkScrollState();
      event.preventDefault();
    }
    function handleTouchEnd() {
      isDragging.value = false;
    }
    function getRouteComponent() {
      const currentPath = route.path;
      const urlParams = new URLSearchParams(window.location.search);
      const showNav = urlParams.get("nav") === "true" || window.location.hash === "#nav";
      if (showNav || currentPath === "/" || currentPath === "") {
        showCardNavigation.value = true;
        currentComponent.value = null;
        return;
      }
      try {
        const resolved = router.resolve(currentPath);
        if (resolved.matched && resolved.matched.length > 0) {
          const matchedRoute = resolved.matched[resolved.matched.length - 1];
          if (matchedRoute.components && matchedRoute.components.default) {
            showCardNavigation.value = false;
            currentComponent.value = matchedRoute.components.default;
            return;
          }
        }
      } catch (error) {
        console.warn("\u8DEF\u7531\u89E3\u6790\u5931\u8D25:", error);
      }
      showCardNavigation.value = true;
      currentComponent.value = null;
    }
    function goBackToNavigation() {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("nav", "true");
      window.history.pushState({}, "", currentUrl.toString());
      getRouteComponent();
    }
    watch(() => route.path, () => {
      getRouteComponent();
    }, {
      immediate: true
    });
    watch(() => route.query, () => {
      getRouteComponent();
    }, {
      immediate: true
    });
    onMounted(() => {
      getRouteComponent();
      window.addEventListener("popstate", () => {
        getRouteComponent();
      });
      setTimeout(() => {
        checkScrollState();
      }, 100);
      if (scrollContainer.value) {
        scrollContainer.value.addEventListener("scroll", checkScrollState);
      }
    });
    onUnmounted(() => {
      window.removeEventListener("popstate", getRouteComponent);
      if (scrollContainer.value) {
        scrollContainer.value.removeEventListener("scroll", checkScrollState);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    });
    const __returned__ = {
      $storage,
      $config,
      props,
      emit,
      router,
      route,
      scrollContainer,
      hoveredMenu,
      hoveredSubMenu,
      hoveredThirdMenu,
      hoverTimeout,
      subHoverTimeout,
      thirdHoverTimeout,
      hoveredMenuElement,
      subMenuPosition,
      subMenuPosition2,
      subMenuPosition3,
      currentComponent,
      showCardNavigation,
      isDragging,
      dragStartX,
      scrollStartX,
      canScrollLeft,
      canScrollRight,
      getRandomHue,
      mainMenuItems,
      getSubMenuItems,
      shouldShowSubMenu,
      handleCardClick,
      handleSubMenuClick,
      convertPathToComponentParam,
      handleMouseEnter,
      handleMouseLeave,
      handleSubMenuEnter,
      handleSubMenuLeave,
      handleThirdMenuEnter,
      handleThirdMenuLeave,
      checkScrollState,
      scrollLeft,
      scrollRight,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      getRouteComponent,
      goBackToNavigation,
      LayTool,
      LaySidebarBreadCrumb
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});
const _hoisted_1 = {
  class: "card-navigation-container"
};
const _hoisted_2 = {
  class: "card-navigation-header"
};
const _hoisted_3 = {
  key: 0,
  class: "horizontal-card-wrapper"
};
const _hoisted_4 = ["onClick", "onMouseenter"];
const _hoisted_5 = {
  class: "card-icon-area"
};
const _hoisted_6 = {
  key: 0,
  class: "card-title"
};
const _hoisted_7 = {
  key: 1,
  class: "component-container"
};
const _hoisted_8 = {
  class: "sub-menu-grid"
};
const _hoisted_9 = ["onClick", "onMouseenter"];
const _hoisted_10 = {
  class: "sub-card-icon"
};
const _hoisted_11 = {
  class: "sub-card-title"
};
const _hoisted_12 = {
  key: 0,
  class: "sub-menu-indicator"
};
const _hoisted_13 = {
  class: "sub-menu-grid"
};
const _hoisted_14 = ["onClick", "onMouseenter"];
const _hoisted_15 = {
  class: "sub-card-icon"
};
const _hoisted_16 = {
  class: "sub-card-title"
};
const _hoisted_17 = {
  key: 0,
  class: "sub-menu-indicator"
};
const _hoisted_18 = {
  class: "sub-menu-grid"
};
const _hoisted_19 = ["onClick"];
const _hoisted_20 = {
  class: "sub-card-icon"
};
const _hoisted_21 = {
  class: "sub-card-title"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [!$setup.showCardNavigation ? (openBlock(), createElementBlock("div", {
    key: 0,
    class: "back-button",
    onClick: $setup.goBackToNavigation
  }, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:arrow-left-line"
  }), _cache[3] || (_cache[3] = createBaseVNode("span", null, "\u8FD4\u56DE\u5BFC\u822A", -1))])) : createCommentVNode("", true), createVNode($setup["LaySidebarBreadCrumb"], {
    class: "breadcrumb-container"
  }), createVNode($setup["LayTool"], {
    class: "tool-container"
  })]), $setup.showCardNavigation ? (openBlock(), createElementBlock("div", _hoisted_3, [withDirectives(createBaseVNode("div", {
    class: "scroll-arrow scroll-arrow-left",
    onClick: $setup.scrollLeft
  }, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:arrow-left-fill"
  })], 512), [[vShow, $setup.canScrollLeft]]), createBaseVNode("div", {
    ref: "scrollContainer",
    class: normalizeClass(["card-scroll-container", {
      "is-dragging": $setup.isDragging
    }]),
    onMousedown: $setup.handleMouseDown,
    onTouchstart: $setup.handleTouchStart,
    onTouchmove: $setup.handleTouchMove,
    onTouchend: $setup.handleTouchEnd
  }, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.mainMenuItems, (menu) => {
    var _a, _b, _c, _d;
    return openBlock(), createElementBlock("div", {
      key: menu.path,
      class: normalizeClass(["menu-card", {
        "white-mode": ((_a = $setup.$storage.configure) == null ? void 0 : _a.cardColorMode) === "white"
      }]),
      style: normalizeStyle({
        "--card-hue": menu.randomHue
      }),
      onClick: ($event) => !$setup.isDragging && $setup.handleCardClick(menu),
      onMouseenter: (event) => !$setup.isDragging && $setup.handleMouseEnter(menu, event),
      onMouseleave: $setup.handleMouseLeave
    }, [createBaseVNode("div", _hoisted_5, [((_b = menu.meta) == null ? void 0 : _b.icon) ? (openBlock(), createBlock(_component_IconifyIconOnline, {
      key: 0,
      icon: menu.meta.icon
    }, null, 8, ["icon"])) : ((_c = menu.meta) == null ? void 0 : _c.iconOnline) ? (openBlock(), createBlock(_component_IconifyIconOnline, {
      key: 1,
      icon: menu.meta.iconOnline
    }, null, 8, ["icon"])) : (openBlock(), createBlock(_component_IconifyIconOnline, {
      key: 2,
      icon: "ep:menu"
    }))]), $setup.props.showTitle ? (openBlock(), createElementBlock("div", _hoisted_6, toDisplayString((_d = menu.meta) == null ? void 0 : _d.title), 1)) : createCommentVNode("", true)], 46, _hoisted_4);
  }), 128))], 34), withDirectives(createBaseVNode("div", {
    class: "scroll-arrow scroll-arrow-right",
    onClick: $setup.scrollRight
  }, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:arrow-right-fill"
  })], 512), [[vShow, $setup.canScrollRight]])])) : createCommentVNode("", true), !$setup.showCardNavigation ? (openBlock(), createElementBlock("div", _hoisted_7, [$setup.currentComponent ? (openBlock(), createBlock(resolveDynamicComponent($setup.currentComponent), {
    key: 0
  })) : createCommentVNode("", true)])) : createCommentVNode("", true), $setup.hoveredMenu && $setup.shouldShowSubMenu($setup.hoveredMenu) ? (openBlock(), createElementBlock("div", {
    key: 2,
    class: "sub-menu-popup",
    style: normalizeStyle({
      top: $setup.subMenuPosition.top + "px",
      left: $setup.subMenuPosition.left + "px"
    }),
    onMouseenter: _cache[0] || (_cache[0] = ($event) => $setup.handleMouseEnter($setup.hoveredMenu)),
    onMouseleave: $setup.handleMouseLeave
  }, [createBaseVNode("div", _hoisted_8, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.getSubMenuItems($setup.hoveredMenu, 1), (subMenu) => {
    var _a, _b, _c;
    return openBlock(), createElementBlock("div", {
      key: subMenu.path,
      class: "sub-menu-card",
      onClick: ($event) => $setup.handleSubMenuClick(subMenu),
      onMouseenter: ($event) => $setup.handleSubMenuEnter(subMenu, $event)
    }, [createBaseVNode("div", _hoisted_10, [((_a = subMenu.meta) == null ? void 0 : _a.icon) ? (openBlock(), createBlock(_component_IconifyIconOnline, {
      key: 0,
      icon: subMenu.meta.icon
    }, null, 8, ["icon"])) : ((_b = subMenu.meta) == null ? void 0 : _b.iconOnline) ? (openBlock(), createBlock(_component_IconifyIconOnline, {
      key: 1,
      icon: subMenu.meta.iconOnline
    }, null, 8, ["icon"])) : (openBlock(), createBlock(_component_IconifyIconOnline, {
      key: 2,
      icon: "ep:menu"
    }))]), createBaseVNode("div", _hoisted_11, toDisplayString((_c = subMenu.meta) == null ? void 0 : _c.title), 1), subMenu.hasSubMenu ? (openBlock(), createElementBlock("div", _hoisted_12, "\u203A")) : createCommentVNode("", true)], 40, _hoisted_9);
  }), 128))])], 36)) : createCommentVNode("", true), $setup.hoveredSubMenu && $setup.shouldShowSubMenu($setup.hoveredSubMenu, 2) ? (openBlock(), createElementBlock("div", {
    key: 3,
    class: "sub-menu-popup level-2",
    style: normalizeStyle({
      top: $setup.subMenuPosition2.top + "px",
      left: $setup.subMenuPosition2.left + "px"
    }),
    onMouseenter: _cache[1] || (_cache[1] = ($event) => $setup.handleSubMenuEnter($setup.hoveredSubMenu)),
    onMouseleave: $setup.handleSubMenuLeave
  }, [createBaseVNode("div", _hoisted_13, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.getSubMenuItems($setup.hoveredSubMenu, 2), (subMenu) => {
    var _a, _b, _c;
    return openBlock(), createElementBlock("div", {
      key: subMenu.path,
      class: "sub-menu-card",
      onClick: ($event) => $setup.handleSubMenuClick(subMenu),
      onMouseenter: ($event) => $setup.handleThirdMenuEnter(subMenu, $event)
    }, [createBaseVNode("div", _hoisted_15, [((_a = subMenu.meta) == null ? void 0 : _a.icon) ? (openBlock(), createBlock(_component_IconifyIconOnline, {
      key: 0,
      icon: subMenu.meta.icon
    }, null, 8, ["icon"])) : ((_b = subMenu.meta) == null ? void 0 : _b.iconOnline) ? (openBlock(), createBlock(_component_IconifyIconOnline, {
      key: 1,
      icon: subMenu.meta.iconOnline
    }, null, 8, ["icon"])) : (openBlock(), createBlock(_component_IconifyIconOnline, {
      key: 2,
      icon: "ep:menu"
    }))]), createBaseVNode("div", _hoisted_16, toDisplayString((_c = subMenu.meta) == null ? void 0 : _c.title), 1), subMenu.hasSubMenu ? (openBlock(), createElementBlock("div", _hoisted_17, "\u203A")) : createCommentVNode("", true)], 40, _hoisted_14);
  }), 128))])], 36)) : createCommentVNode("", true), $setup.hoveredThirdMenu && $setup.shouldShowSubMenu($setup.hoveredThirdMenu, 3) ? (openBlock(), createElementBlock("div", {
    key: 4,
    class: "sub-menu-popup level-3",
    style: normalizeStyle({
      top: $setup.subMenuPosition3.top + "px",
      left: $setup.subMenuPosition3.left + "px"
    }),
    onMouseenter: _cache[2] || (_cache[2] = () => $setup.handleThirdMenuEnter($setup.hoveredThirdMenu)),
    onMouseleave: $setup.handleThirdMenuLeave
  }, [createBaseVNode("div", _hoisted_18, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.getSubMenuItems($setup.hoveredThirdMenu, 3), (subMenu) => {
    var _a, _b, _c;
    return openBlock(), createElementBlock("div", {
      key: subMenu.path,
      class: "sub-menu-card",
      onClick: ($event) => $setup.handleSubMenuClick(subMenu)
    }, [createBaseVNode("div", _hoisted_20, [((_a = subMenu.meta) == null ? void 0 : _a.icon) ? (openBlock(), createBlock(_component_IconifyIconOnline, {
      key: 0,
      icon: subMenu.meta.icon
    }, null, 8, ["icon"])) : ((_b = subMenu.meta) == null ? void 0 : _b.iconOnline) ? (openBlock(), createBlock(_component_IconifyIconOnline, {
      key: 1,
      icon: subMenu.meta.iconOnline
    }, null, 8, ["icon"])) : (openBlock(), createBlock(_component_IconifyIconOnline, {
      key: 2,
      icon: "ep:menu"
    }))]), createBaseVNode("div", _hoisted_21, toDisplayString((_c = subMenu.meta) == null ? void 0 : _c.title), 1)], 8, _hoisted_19);
  }), 128))])], 36)) : createCommentVNode("", true)]);
}
const CardNavigation = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a6f6dda6"], ["__file", "H:/workspace/2/vue-support-parent-starter/layout/default/src/components/lay-sidebar/components/CardNavigation.vue"]]);
export {
  CardNavigation as default
};
