var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { d as defineComponent, r as ref, al as watch, _ as _export_sfc, e as resolveComponent, c as createElementBlock, o as openBlock, h as createBaseVNode, g as createVNode, i as createTextVNode, k as withCtx, F as Fragment, m as renderList, j as createBlock, t as toDisplayString } from "./index-DsQ9-pB_.js";
new TextEncoder();
const decoder = new TextDecoder();
function decodeBase64(encoded) {
  if (Uint8Array.fromBase64) {
    return Uint8Array.fromBase64(encoded);
  }
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
function decode(input) {
  if (Uint8Array.fromBase64) {
    return Uint8Array.fromBase64(typeof input === "string" ? input : decoder.decode(input), {
      alphabet: "base64url"
    });
  }
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return decodeBase64(encoded);
  } catch (e) {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
}
class JOSEError extends Error {
  constructor(message, options) {
    var _a;
    super(message, options);
    __publicField(this, "code", "ERR_JOSE_GENERIC");
    this.name = this.constructor.name;
    (_a = Error.captureStackTrace) == null ? void 0 : _a.call(Error, this, this.constructor);
  }
}
__publicField(JOSEError, "code", "ERR_JOSE_GENERIC");
class JWTInvalid extends JOSEError {
  constructor() {
    super(...arguments);
    __publicField(this, "code", "ERR_JWT_INVALID");
  }
}
__publicField(JWTInvalid, "code", "ERR_JWT_INVALID");
function isObjectLike(value) {
  return typeof value === "object" && value !== null;
}
const isObject = (input) => {
  if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(input) === null) {
    return true;
  }
  let proto = input;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(input) === proto;
};
function decodeProtectedHeader(token) {
  let protectedB64u;
  if (typeof token === "string") {
    const parts = token.split(".");
    if (parts.length === 3 || parts.length === 5) {
      [protectedB64u] = parts;
    }
  } else if (typeof token === "object" && token) {
    if ("protected" in token) {
      protectedB64u = token.protected;
    } else {
      throw new TypeError("Token does not contain a Protected Header");
    }
  }
  try {
    if (typeof protectedB64u !== "string" || !protectedB64u) {
      throw new Error();
    }
    const result = JSON.parse(decoder.decode(decode(protectedB64u)));
    if (!isObject(result)) {
      throw new Error();
    }
    return result;
  } catch (e) {
    throw new TypeError("Invalid Token or Protected Header formatting");
  }
}
function decodeJwt(jwt) {
  if (typeof jwt !== "string")
    throw new JWTInvalid("JWTs must use Compact JWS serialization, JWT must be a string");
  const { 1: payload, length } = jwt.split(".");
  if (length === 5)
    throw new JWTInvalid("Only JWTs using Compact JWS serialization can be decoded");
  if (length !== 3)
    throw new JWTInvalid("Invalid JWT");
  if (!payload)
    throw new JWTInvalid("JWTs must contain a payload");
  let decoded;
  try {
    decoded = decode(payload);
  } catch (e) {
    throw new JWTInvalid("Failed to base64url decode the payload");
  }
  let result;
  try {
    result = JSON.parse(decoder.decode(decoded));
  } catch (e) {
    throw new JWTInvalid("Failed to parse the decoded payload as JSON");
  }
  if (!isObject(result))
    throw new JWTInvalid("Invalid JWT Claims Set");
  return result;
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const jwtValue = ref("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
    watch(jwtValue, (oldValue, newValue) => {
      handleJwt();
    });
    const payload = ref();
    const header = ref();
    const handleJwt = () => {
      try {
        header.value = Object.entries(decodeProtectedHeader(jwtValue.value));
        payload.value = Object.entries(decodeJwt(jwtValue.value));
      } catch (e) {
        payload.value = [];
        header.value = [];
      }
    };
    handleJwt();
    const __returned__ = {
      jwtValue,
      payload,
      header,
      handleJwt
    };
    Object.defineProperty(__returned__, "__isScriptSetup", {
      enumerable: false,
      value: true
    });
    return __returned__;
  }
});
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
  class: "flex-1 overflow-hidden"
};
const _hoisted_7 = {
  class: "section-header"
};
const _hoisted_8 = {
  class: "section-header"
};
const _hoisted_9 = {
  class: "result-container"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_input = resolveComponent("el-input");
  const _component_el_col = resolveComponent("el-col");
  const _component_el_tag = resolveComponent("el-tag");
  const _component_el_descriptions_item = resolveComponent("el-descriptions-item");
  const _component_el_descriptions = resolveComponent("el-descriptions");
  const _component_el_row = resolveComponent("el-row");
  const _component_el_card = resolveComponent("el-card");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:lock-password-line",
    class: "title-icon"
  }), _cache[1] || (_cache[1] = createTextVNode(" JWT \u89E3\u6790\u5DE5\u5177 ", -1))]), _cache[2] || (_cache[2] = createBaseVNode("p", {
    class: "page-subtitle"
  }, "\u89E3\u6790\u548C\u67E5\u770B JWT Token \u7684 Header \u548C Payload", -1))])])]), createBaseVNode("div", _hoisted_6, [createVNode(_component_el_card, {
    shadow: "never",
    class: "h-full"
  }, {
    default: withCtx(() => [createVNode(_component_el_row, {
      gutter: 20,
      class: "h-full"
    }, {
      default: withCtx(() => [createVNode(_component_el_col, {
        span: 12,
        class: "h-full"
      }, {
        default: withCtx(() => [createBaseVNode("div", _hoisted_7, [createVNode(_component_IconifyIconOnline, {
          icon: "ri:key-2-line",
          class: "section-icon"
        }), _cache[3] || (_cache[3] = createBaseVNode("span", null, "JWT Token", -1))]), createVNode(_component_el_input, {
          modelValue: $setup.jwtValue,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.jwtValue = $event),
          type: "textarea",
          rows: 25,
          placeholder: "\u8BF7\u8F93\u5165 JWT Token...",
          class: "jwt-input"
        }, null, 8, ["modelValue"])]),
        _: 1
      }), createVNode(_component_el_col, {
        span: 12,
        class: "h-full"
      }, {
        default: withCtx(() => [createBaseVNode("div", _hoisted_8, [createVNode(_component_IconifyIconOnline, {
          icon: "ri:file-list-3-line",
          class: "section-icon"
        }), _cache[4] || (_cache[4] = createBaseVNode("span", null, "\u89E3\u6790\u7ED3\u679C", -1))]), createBaseVNode("div", _hoisted_9, [createVNode(_component_el_descriptions, {
          border: "",
          title: "Header",
          column: 1,
          class: "mb-4"
        }, {
          default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.header, (key) => {
            return openBlock(), createBlock(_component_el_descriptions_item, {
              key,
              label: key[0]
            }, {
              default: withCtx(() => [createVNode(_component_el_tag, {
                type: "info",
                size: "small"
              }, {
                default: withCtx(() => [createTextVNode(toDisplayString(key[1]), 1)]),
                _: 2
              }, 1024)]),
              _: 2
            }, 1032, ["label"]);
          }), 128))]),
          _: 1
        }), createVNode(_component_el_descriptions, {
          border: "",
          title: "Payload",
          column: 1
        }, {
          default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.payload, (key) => {
            return openBlock(), createBlock(_component_el_descriptions_item, {
              key,
              label: key[0]
            }, {
              default: withCtx(() => [createVNode(_component_el_tag, {
                size: "small"
              }, {
                default: withCtx(() => [createTextVNode(toDisplayString(key[1]), 1)]),
                _: 2
              }, 1024)]),
              _: 2
            }, 1032, ["label"]);
          }), 128))]),
          _: 1
        })])]),
        _: 1
      })]),
      _: 1
    })]),
    _: 1
  })])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a9e5625f"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/tools/web/jwt/index.vue"]]);
export {
  index as default
};
