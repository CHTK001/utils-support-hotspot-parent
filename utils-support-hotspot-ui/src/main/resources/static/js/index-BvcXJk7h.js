var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
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
import { bH as getDefaultExportFromCjs, _ as _export_sfc, c as createElementBlock, o as openBlock, w as withDirectives, aV as vModelText, h as createBaseVNode, n as normalizeStyle, a1 as markRaw, e as resolveComponent, g as createVNode, i as createTextVNode, k as withCtx, j as createBlock, v as createCommentVNode, r as ref, q as computed, bL as YamlLoader } from "./index-DsQ9-pB_.js";
var codemirror$1 = { exports: {} };
var codemirror = codemirror$1.exports;
var hasRequiredCodemirror;
function requireCodemirror() {
  if (hasRequiredCodemirror) return codemirror$1.exports;
  hasRequiredCodemirror = 1;
  (function(module, exports) {
    (function(global, factory) {
      module.exports = factory();
    })(codemirror, (function() {
      var userAgent = navigator.userAgent;
      var platform = navigator.platform;
      var gecko = /gecko\/\d/i.test(userAgent);
      var ie_upto10 = /MSIE \d/.test(userAgent);
      var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent);
      var edge = /Edge\/(\d+)/.exec(userAgent);
      var ie = ie_upto10 || ie_11up || edge;
      var ie_version = ie && (ie_upto10 ? document.documentMode || 6 : +(edge || ie_11up)[1]);
      var webkit = !edge && /WebKit\//.test(userAgent);
      var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(userAgent);
      var chrome = !edge && /Chrome\/(\d+)/.exec(userAgent);
      var chrome_version = chrome && +chrome[1];
      var presto = /Opera\//.test(userAgent);
      var safari = /Apple Computer/.test(navigator.vendor);
      var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent);
      var phantom = /PhantomJS/.test(userAgent);
      var ios = safari && (/Mobile\/\w+/.test(userAgent) || navigator.maxTouchPoints > 2);
      var android = /Android/.test(userAgent);
      var mobile = ios || android || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
      var mac = ios || /Mac/.test(platform);
      var chromeOS = /\bCrOS\b/.test(userAgent);
      var windows = /win/i.test(platform);
      var presto_version = presto && userAgent.match(/Version\/(\d*\.\d*)/);
      if (presto_version) {
        presto_version = Number(presto_version[1]);
      }
      if (presto_version && presto_version >= 15) {
        presto = false;
        webkit = true;
      }
      var flipCtrlCmd = mac && (qtwebkit || presto && (presto_version == null || presto_version < 12.11));
      var captureRightClick = gecko || ie && ie_version >= 9;
      function classTest(cls) {
        return new RegExp("(^|\\s)" + cls + "(?:$|\\s)\\s*");
      }
      var rmClass = function(node, cls) {
        var current = node.className;
        var match = classTest(cls).exec(current);
        if (match) {
          var after = current.slice(match.index + match[0].length);
          node.className = current.slice(0, match.index) + (after ? match[1] + after : "");
        }
      };
      function removeChildren(e) {
        for (var count = e.childNodes.length; count > 0; --count) {
          e.removeChild(e.firstChild);
        }
        return e;
      }
      function removeChildrenAndAdd(parent, e) {
        return removeChildren(parent).appendChild(e);
      }
      function elt(tag, content, className, style) {
        var e = document.createElement(tag);
        if (className) {
          e.className = className;
        }
        if (style) {
          e.style.cssText = style;
        }
        if (typeof content == "string") {
          e.appendChild(document.createTextNode(content));
        } else if (content) {
          for (var i2 = 0; i2 < content.length; ++i2) {
            e.appendChild(content[i2]);
          }
        }
        return e;
      }
      function eltP(tag, content, className, style) {
        var e = elt(tag, content, className, style);
        e.setAttribute("role", "presentation");
        return e;
      }
      var range;
      if (document.createRange) {
        range = function(node, start, end, endNode) {
          var r = document.createRange();
          r.setEnd(endNode || node, end);
          r.setStart(node, start);
          return r;
        };
      } else {
        range = function(node, start, end) {
          var r = document.body.createTextRange();
          try {
            r.moveToElementText(node.parentNode);
          } catch (e) {
            return r;
          }
          r.collapse(true);
          r.moveEnd("character", end);
          r.moveStart("character", start);
          return r;
        };
      }
      function contains(parent, child) {
        if (child.nodeType == 3) {
          child = child.parentNode;
        }
        if (parent.contains) {
          return parent.contains(child);
        }
        do {
          if (child.nodeType == 11) {
            child = child.host;
          }
          if (child == parent) {
            return true;
          }
        } while (child = child.parentNode);
      }
      function activeElt(rootNode2) {
        var doc2 = rootNode2.ownerDocument || rootNode2;
        var activeElement;
        try {
          activeElement = rootNode2.activeElement;
        } catch (e) {
          activeElement = doc2.body || null;
        }
        while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
        return activeElement;
      }
      function addClass(node, cls) {
        var current = node.className;
        if (!classTest(cls).test(current)) {
          node.className += (current ? " " : "") + cls;
        }
      }
      function joinClasses(a, b) {
        var as = a.split(" ");
        for (var i2 = 0; i2 < as.length; i2++) {
          if (as[i2] && !classTest(as[i2]).test(b)) {
            b += " " + as[i2];
          }
        }
        return b;
      }
      var selectInput = function(node) {
        node.select();
      };
      if (ios) {
        selectInput = function(node) {
          node.selectionStart = 0;
          node.selectionEnd = node.value.length;
        };
      } else if (ie) {
        selectInput = function(node) {
          try {
            node.select();
          } catch (_e) {
          }
        };
      }
      function doc(cm) {
        return cm.display.wrapper.ownerDocument;
      }
      function root(cm) {
        return rootNode(cm.display.wrapper);
      }
      function rootNode(element) {
        return element.getRootNode ? element.getRootNode() : element.ownerDocument;
      }
      function win(cm) {
        return doc(cm).defaultView;
      }
      function bind(f) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function() {
          return f.apply(null, args);
        };
      }
      function copyObj(obj, target, overwrite) {
        if (!target) {
          target = {};
        }
        for (var prop2 in obj) {
          if (obj.hasOwnProperty(prop2) && (overwrite !== false || !target.hasOwnProperty(prop2))) {
            target[prop2] = obj[prop2];
          }
        }
        return target;
      }
      function countColumn(string, end, tabSize, startIndex, startValue) {
        if (end == null) {
          end = string.search(/[^\s\u00a0]/);
          if (end == -1) {
            end = string.length;
          }
        }
        for (var i2 = startIndex || 0, n = startValue || 0; ; ) {
          var nextTab = string.indexOf("	", i2);
          if (nextTab < 0 || nextTab >= end) {
            return n + (end - i2);
          }
          n += nextTab - i2;
          n += tabSize - n % tabSize;
          i2 = nextTab + 1;
        }
      }
      var Delayed = function() {
        this.id = null;
        this.f = null;
        this.time = 0;
        this.handler = bind(this.onTimeout, this);
      };
      Delayed.prototype.onTimeout = function(self) {
        self.id = 0;
        if (self.time <= +/* @__PURE__ */ new Date()) {
          self.f();
        } else {
          setTimeout(self.handler, self.time - +/* @__PURE__ */ new Date());
        }
      };
      Delayed.prototype.set = function(ms, f) {
        this.f = f;
        var time = +/* @__PURE__ */ new Date() + ms;
        if (!this.id || time < this.time) {
          clearTimeout(this.id);
          this.id = setTimeout(this.handler, ms);
          this.time = time;
        }
      };
      function indexOf(array, elt2) {
        for (var i2 = 0; i2 < array.length; ++i2) {
          if (array[i2] == elt2) {
            return i2;
          }
        }
        return -1;
      }
      var scrollerGap = 50;
      var Pass = { toString: function() {
        return "CodeMirror.Pass";
      } };
      var sel_dontScroll = { scroll: false }, sel_mouse = { origin: "*mouse" }, sel_move = { origin: "+move" };
      function findColumn(string, goal, tabSize) {
        for (var pos = 0, col = 0; ; ) {
          var nextTab = string.indexOf("	", pos);
          if (nextTab == -1) {
            nextTab = string.length;
          }
          var skipped = nextTab - pos;
          if (nextTab == string.length || col + skipped >= goal) {
            return pos + Math.min(skipped, goal - col);
          }
          col += nextTab - pos;
          col += tabSize - col % tabSize;
          pos = nextTab + 1;
          if (col >= goal) {
            return pos;
          }
        }
      }
      var spaceStrs = [""];
      function spaceStr(n) {
        while (spaceStrs.length <= n) {
          spaceStrs.push(lst(spaceStrs) + " ");
        }
        return spaceStrs[n];
      }
      function lst(arr) {
        return arr[arr.length - 1];
      }
      function map(array, f) {
        var out = [];
        for (var i2 = 0; i2 < array.length; i2++) {
          out[i2] = f(array[i2], i2);
        }
        return out;
      }
      function insertSorted(array, value, score) {
        var pos = 0, priority = score(value);
        while (pos < array.length && score(array[pos]) <= priority) {
          pos++;
        }
        array.splice(pos, 0, value);
      }
      function nothing() {
      }
      function createObj(base, props) {
        var inst;
        if (Object.create) {
          inst = Object.create(base);
        } else {
          nothing.prototype = base;
          inst = new nothing();
        }
        if (props) {
          copyObj(props, inst);
        }
        return inst;
      }
      var nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
      function isWordCharBasic(ch) {
        return /\w/.test(ch) || ch > "\x80" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
      }
      function isWordChar(ch, helper) {
        if (!helper) {
          return isWordCharBasic(ch);
        }
        if (helper.source.indexOf("\\w") > -1 && isWordCharBasic(ch)) {
          return true;
        }
        return helper.test(ch);
      }
      function isEmpty(obj) {
        for (var n in obj) {
          if (obj.hasOwnProperty(n) && obj[n]) {
            return false;
          }
        }
        return true;
      }
      var extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
      function isExtendingChar(ch) {
        return ch.charCodeAt(0) >= 768 && extendingChars.test(ch);
      }
      function skipExtendingChars(str, pos, dir) {
        while ((dir < 0 ? pos > 0 : pos < str.length) && isExtendingChar(str.charAt(pos))) {
          pos += dir;
        }
        return pos;
      }
      function findFirst(pred, from, to) {
        var dir = from > to ? -1 : 1;
        for (; ; ) {
          if (from == to) {
            return from;
          }
          var midF = (from + to) / 2, mid = dir < 0 ? Math.ceil(midF) : Math.floor(midF);
          if (mid == from) {
            return pred(mid) ? from : to;
          }
          if (pred(mid)) {
            to = mid;
          } else {
            from = mid + dir;
          }
        }
      }
      function iterateBidiSections(order, from, to, f) {
        if (!order) {
          return f(from, to, "ltr", 0);
        }
        var found = false;
        for (var i2 = 0; i2 < order.length; ++i2) {
          var part = order[i2];
          if (part.from < to && part.to > from || from == to && part.to == from) {
            f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr", i2);
            found = true;
          }
        }
        if (!found) {
          f(from, to, "ltr");
        }
      }
      var bidiOther = null;
      function getBidiPartAt(order, ch, sticky) {
        var found;
        bidiOther = null;
        for (var i2 = 0; i2 < order.length; ++i2) {
          var cur = order[i2];
          if (cur.from < ch && cur.to > ch) {
            return i2;
          }
          if (cur.to == ch) {
            if (cur.from != cur.to && sticky == "before") {
              found = i2;
            } else {
              bidiOther = i2;
            }
          }
          if (cur.from == ch) {
            if (cur.from != cur.to && sticky != "before") {
              found = i2;
            } else {
              bidiOther = i2;
            }
          }
        }
        return found != null ? found : bidiOther;
      }
      var bidiOrdering = /* @__PURE__ */ (function() {
        var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
        var arabicTypes = "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111";
        function charType(code) {
          if (code <= 247) {
            return lowTypes.charAt(code);
          } else if (1424 <= code && code <= 1524) {
            return "R";
          } else if (1536 <= code && code <= 1785) {
            return arabicTypes.charAt(code - 1536);
          } else if (1774 <= code && code <= 2220) {
            return "r";
          } else if (8192 <= code && code <= 8203) {
            return "w";
          } else if (code == 8204) {
            return "b";
          } else {
            return "L";
          }
        }
        var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
        var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
        function BidiSpan(level, from, to) {
          this.level = level;
          this.from = from;
          this.to = to;
        }
        return function(str, direction) {
          var outerType = direction == "ltr" ? "L" : "R";
          if (str.length == 0 || direction == "ltr" && !bidiRE.test(str)) {
            return false;
          }
          var len = str.length, types = [];
          for (var i2 = 0; i2 < len; ++i2) {
            types.push(charType(str.charCodeAt(i2)));
          }
          for (var i$12 = 0, prev = outerType; i$12 < len; ++i$12) {
            var type = types[i$12];
            if (type == "m") {
              types[i$12] = prev;
            } else {
              prev = type;
            }
          }
          for (var i$22 = 0, cur = outerType; i$22 < len; ++i$22) {
            var type$1 = types[i$22];
            if (type$1 == "1" && cur == "r") {
              types[i$22] = "n";
            } else if (isStrong.test(type$1)) {
              cur = type$1;
              if (type$1 == "r") {
                types[i$22] = "R";
              }
            }
          }
          for (var i$3 = 1, prev$1 = types[0]; i$3 < len - 1; ++i$3) {
            var type$2 = types[i$3];
            if (type$2 == "+" && prev$1 == "1" && types[i$3 + 1] == "1") {
              types[i$3] = "1";
            } else if (type$2 == "," && prev$1 == types[i$3 + 1] && (prev$1 == "1" || prev$1 == "n")) {
              types[i$3] = prev$1;
            }
            prev$1 = type$2;
          }
          for (var i$4 = 0; i$4 < len; ++i$4) {
            var type$3 = types[i$4];
            if (type$3 == ",") {
              types[i$4] = "N";
            } else if (type$3 == "%") {
              var end = void 0;
              for (end = i$4 + 1; end < len && types[end] == "%"; ++end) {
              }
              var replace = i$4 && types[i$4 - 1] == "!" || end < len && types[end] == "1" ? "1" : "N";
              for (var j = i$4; j < end; ++j) {
                types[j] = replace;
              }
              i$4 = end - 1;
            }
          }
          for (var i$5 = 0, cur$1 = outerType; i$5 < len; ++i$5) {
            var type$4 = types[i$5];
            if (cur$1 == "L" && type$4 == "1") {
              types[i$5] = "L";
            } else if (isStrong.test(type$4)) {
              cur$1 = type$4;
            }
          }
          for (var i$6 = 0; i$6 < len; ++i$6) {
            if (isNeutral.test(types[i$6])) {
              var end$1 = void 0;
              for (end$1 = i$6 + 1; end$1 < len && isNeutral.test(types[end$1]); ++end$1) {
              }
              var before = (i$6 ? types[i$6 - 1] : outerType) == "L";
              var after = (end$1 < len ? types[end$1] : outerType) == "L";
              var replace$1 = before == after ? before ? "L" : "R" : outerType;
              for (var j$1 = i$6; j$1 < end$1; ++j$1) {
                types[j$1] = replace$1;
              }
              i$6 = end$1 - 1;
            }
          }
          var order = [], m;
          for (var i$7 = 0; i$7 < len; ) {
            if (countsAsLeft.test(types[i$7])) {
              var start = i$7;
              for (++i$7; i$7 < len && countsAsLeft.test(types[i$7]); ++i$7) {
              }
              order.push(new BidiSpan(0, start, i$7));
            } else {
              var pos = i$7, at = order.length, isRTL = direction == "rtl" ? 1 : 0;
              for (++i$7; i$7 < len && types[i$7] != "L"; ++i$7) {
              }
              for (var j$2 = pos; j$2 < i$7; ) {
                if (countsAsNum.test(types[j$2])) {
                  if (pos < j$2) {
                    order.splice(at, 0, new BidiSpan(1, pos, j$2));
                    at += isRTL;
                  }
                  var nstart = j$2;
                  for (++j$2; j$2 < i$7 && countsAsNum.test(types[j$2]); ++j$2) {
                  }
                  order.splice(at, 0, new BidiSpan(2, nstart, j$2));
                  at += isRTL;
                  pos = j$2;
                } else {
                  ++j$2;
                }
              }
              if (pos < i$7) {
                order.splice(at, 0, new BidiSpan(1, pos, i$7));
              }
            }
          }
          if (direction == "ltr") {
            if (order[0].level == 1 && (m = str.match(/^\s+/))) {
              order[0].from = m[0].length;
              order.unshift(new BidiSpan(0, 0, m[0].length));
            }
            if (lst(order).level == 1 && (m = str.match(/\s+$/))) {
              lst(order).to -= m[0].length;
              order.push(new BidiSpan(0, len - m[0].length, len));
            }
          }
          return direction == "rtl" ? order.reverse() : order;
        };
      })();
      function getOrder(line, direction) {
        var order = line.order;
        if (order == null) {
          order = line.order = bidiOrdering(line.text, direction);
        }
        return order;
      }
      var noHandlers = [];
      var on = function(emitter, type, f) {
        if (emitter.addEventListener) {
          emitter.addEventListener(type, f, false);
        } else if (emitter.attachEvent) {
          emitter.attachEvent("on" + type, f);
        } else {
          var map2 = emitter._handlers || (emitter._handlers = {});
          map2[type] = (map2[type] || noHandlers).concat(f);
        }
      };
      function getHandlers(emitter, type) {
        return emitter._handlers && emitter._handlers[type] || noHandlers;
      }
      function off(emitter, type, f) {
        if (emitter.removeEventListener) {
          emitter.removeEventListener(type, f, false);
        } else if (emitter.detachEvent) {
          emitter.detachEvent("on" + type, f);
        } else {
          var map2 = emitter._handlers, arr = map2 && map2[type];
          if (arr) {
            var index2 = indexOf(arr, f);
            if (index2 > -1) {
              map2[type] = arr.slice(0, index2).concat(arr.slice(index2 + 1));
            }
          }
        }
      }
      function signal(emitter, type) {
        var handlers = getHandlers(emitter, type);
        if (!handlers.length) {
          return;
        }
        var args = Array.prototype.slice.call(arguments, 2);
        for (var i2 = 0; i2 < handlers.length; ++i2) {
          handlers[i2].apply(null, args);
        }
      }
      function signalDOMEvent(cm, e, override) {
        if (typeof e == "string") {
          e = { type: e, preventDefault: function() {
            this.defaultPrevented = true;
          } };
        }
        signal(cm, override || e.type, cm, e);
        return e_defaultPrevented(e) || e.codemirrorIgnore;
      }
      function signalCursorActivity(cm) {
        var arr = cm._handlers && cm._handlers.cursorActivity;
        if (!arr) {
          return;
        }
        var set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []);
        for (var i2 = 0; i2 < arr.length; ++i2) {
          if (indexOf(set, arr[i2]) == -1) {
            set.push(arr[i2]);
          }
        }
      }
      function hasHandler(emitter, type) {
        return getHandlers(emitter, type).length > 0;
      }
      function eventMixin(ctor) {
        ctor.prototype.on = function(type, f) {
          on(this, type, f);
        };
        ctor.prototype.off = function(type, f) {
          off(this, type, f);
        };
      }
      function e_preventDefault(e) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }
      function e_stopPropagation(e) {
        if (e.stopPropagation) {
          e.stopPropagation();
        } else {
          e.cancelBubble = true;
        }
      }
      function e_defaultPrevented(e) {
        return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
      }
      function e_stop(e) {
        e_preventDefault(e);
        e_stopPropagation(e);
      }
      function e_target(e) {
        return e.target || e.srcElement;
      }
      function e_button(e) {
        var b = e.which;
        if (b == null) {
          if (e.button & 1) {
            b = 1;
          } else if (e.button & 2) {
            b = 3;
          } else if (e.button & 4) {
            b = 2;
          }
        }
        if (mac && e.ctrlKey && b == 1) {
          b = 3;
        }
        return b;
      }
      var dragAndDrop = (function() {
        if (ie && ie_version < 9) {
          return false;
        }
        var div = elt("div");
        return "draggable" in div || "dragDrop" in div;
      })();
      var zwspSupported;
      function zeroWidthElement(measure) {
        if (zwspSupported == null) {
          var test = elt("span", "\u200B");
          removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")]));
          if (measure.firstChild.offsetHeight != 0) {
            zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !(ie && ie_version < 8);
          }
        }
        var node = zwspSupported ? elt("span", "\u200B") : elt("span", "\xA0", null, "display: inline-block; width: 1px; margin-right: -1px");
        node.setAttribute("cm-text", "");
        return node;
      }
      var badBidiRects;
      function hasBadBidiRects(measure) {
        if (badBidiRects != null) {
          return badBidiRects;
        }
        var txt = removeChildrenAndAdd(measure, document.createTextNode("A\u062EA"));
        var r0 = range(txt, 0, 1).getBoundingClientRect();
        var r1 = range(txt, 1, 2).getBoundingClientRect();
        removeChildren(measure);
        if (!r0 || r0.left == r0.right) {
          return false;
        }
        return badBidiRects = r1.right - r0.right < 3;
      }
      var splitLinesAuto = "\n\nb".split(/\n/).length != 3 ? function(string) {
        var pos = 0, result = [], l = string.length;
        while (pos <= l) {
          var nl = string.indexOf("\n", pos);
          if (nl == -1) {
            nl = string.length;
          }
          var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
          var rt = line.indexOf("\r");
          if (rt != -1) {
            result.push(line.slice(0, rt));
            pos += rt + 1;
          } else {
            result.push(line);
            pos = nl + 1;
          }
        }
        return result;
      } : function(string) {
        return string.split(/\r\n?|\n/);
      };
      var hasSelection = window.getSelection ? function(te) {
        try {
          return te.selectionStart != te.selectionEnd;
        } catch (e) {
          return false;
        }
      } : function(te) {
        var range2;
        try {
          range2 = te.ownerDocument.selection.createRange();
        } catch (e) {
        }
        if (!range2 || range2.parentElement() != te) {
          return false;
        }
        return range2.compareEndPoints("StartToEnd", range2) != 0;
      };
      var hasCopyEvent = (function() {
        var e = elt("div");
        if ("oncopy" in e) {
          return true;
        }
        e.setAttribute("oncopy", "return;");
        return typeof e.oncopy == "function";
      })();
      var badZoomedRects = null;
      function hasBadZoomedRects(measure) {
        if (badZoomedRects != null) {
          return badZoomedRects;
        }
        var node = removeChildrenAndAdd(measure, elt("span", "x"));
        var normal = node.getBoundingClientRect();
        var fromRange = range(node, 0, 1).getBoundingClientRect();
        return badZoomedRects = Math.abs(normal.left - fromRange.left) > 1;
      }
      var modes = {}, mimeModes = {};
      function defineMode(name, mode) {
        if (arguments.length > 2) {
          mode.dependencies = Array.prototype.slice.call(arguments, 2);
        }
        modes[name] = mode;
      }
      function defineMIME(mime, spec) {
        mimeModes[mime] = spec;
      }
      function resolveMode(spec) {
        if (typeof spec == "string" && mimeModes.hasOwnProperty(spec)) {
          spec = mimeModes[spec];
        } else if (spec && typeof spec.name == "string" && mimeModes.hasOwnProperty(spec.name)) {
          var found = mimeModes[spec.name];
          if (typeof found == "string") {
            found = { name: found };
          }
          spec = createObj(found, spec);
          spec.name = found.name;
        } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
          return resolveMode("application/xml");
        } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(spec)) {
          return resolveMode("application/json");
        }
        if (typeof spec == "string") {
          return { name: spec };
        } else {
          return spec || { name: "null" };
        }
      }
      function getMode(options, spec) {
        spec = resolveMode(spec);
        var mfactory = modes[spec.name];
        if (!mfactory) {
          return getMode(options, "text/plain");
        }
        var modeObj = mfactory(options, spec);
        if (modeExtensions.hasOwnProperty(spec.name)) {
          var exts = modeExtensions[spec.name];
          for (var prop2 in exts) {
            if (!exts.hasOwnProperty(prop2)) {
              continue;
            }
            if (modeObj.hasOwnProperty(prop2)) {
              modeObj["_" + prop2] = modeObj[prop2];
            }
            modeObj[prop2] = exts[prop2];
          }
        }
        modeObj.name = spec.name;
        if (spec.helperType) {
          modeObj.helperType = spec.helperType;
        }
        if (spec.modeProps) {
          for (var prop$1 in spec.modeProps) {
            modeObj[prop$1] = spec.modeProps[prop$1];
          }
        }
        return modeObj;
      }
      var modeExtensions = {};
      function extendMode(mode, properties) {
        var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : modeExtensions[mode] = {};
        copyObj(properties, exts);
      }
      function copyState(mode, state) {
        if (state === true) {
          return state;
        }
        if (mode.copyState) {
          return mode.copyState(state);
        }
        var nstate = {};
        for (var n in state) {
          var val = state[n];
          if (val instanceof Array) {
            val = val.concat([]);
          }
          nstate[n] = val;
        }
        return nstate;
      }
      function innerMode(mode, state) {
        var info;
        while (mode.innerMode) {
          info = mode.innerMode(state);
          if (!info || info.mode == mode) {
            break;
          }
          state = info.state;
          mode = info.mode;
        }
        return info || { mode, state };
      }
      function startState(mode, a1, a2) {
        return mode.startState ? mode.startState(a1, a2) : true;
      }
      var StringStream = function(string, tabSize, lineOracle) {
        this.pos = this.start = 0;
        this.string = string;
        this.tabSize = tabSize || 8;
        this.lastColumnPos = this.lastColumnValue = 0;
        this.lineStart = 0;
        this.lineOracle = lineOracle;
      };
      StringStream.prototype.eol = function() {
        return this.pos >= this.string.length;
      };
      StringStream.prototype.sol = function() {
        return this.pos == this.lineStart;
      };
      StringStream.prototype.peek = function() {
        return this.string.charAt(this.pos) || void 0;
      };
      StringStream.prototype.next = function() {
        if (this.pos < this.string.length) {
          return this.string.charAt(this.pos++);
        }
      };
      StringStream.prototype.eat = function(match) {
        var ch = this.string.charAt(this.pos);
        var ok;
        if (typeof match == "string") {
          ok = ch == match;
        } else {
          ok = ch && (match.test ? match.test(ch) : match(ch));
        }
        if (ok) {
          ++this.pos;
          return ch;
        }
      };
      StringStream.prototype.eatWhile = function(match) {
        var start = this.pos;
        while (this.eat(match)) {
        }
        return this.pos > start;
      };
      StringStream.prototype.eatSpace = function() {
        var start = this.pos;
        while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) {
          ++this.pos;
        }
        return this.pos > start;
      };
      StringStream.prototype.skipToEnd = function() {
        this.pos = this.string.length;
      };
      StringStream.prototype.skipTo = function(ch) {
        var found = this.string.indexOf(ch, this.pos);
        if (found > -1) {
          this.pos = found;
          return true;
        }
      };
      StringStream.prototype.backUp = function(n) {
        this.pos -= n;
      };
      StringStream.prototype.column = function() {
        if (this.lastColumnPos < this.start) {
          this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
          this.lastColumnPos = this.start;
        }
        return this.lastColumnValue - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
      };
      StringStream.prototype.indentation = function() {
        return countColumn(this.string, null, this.tabSize) - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
      };
      StringStream.prototype.match = function(pattern, consume, caseInsensitive) {
        if (typeof pattern == "string") {
          var cased = function(str) {
            return caseInsensitive ? str.toLowerCase() : str;
          };
          var substr = this.string.substr(this.pos, pattern.length);
          if (cased(substr) == cased(pattern)) {
            if (consume !== false) {
              this.pos += pattern.length;
            }
            return true;
          }
        } else {
          var match = this.string.slice(this.pos).match(pattern);
          if (match && match.index > 0) {
            return null;
          }
          if (match && consume !== false) {
            this.pos += match[0].length;
          }
          return match;
        }
      };
      StringStream.prototype.current = function() {
        return this.string.slice(this.start, this.pos);
      };
      StringStream.prototype.hideFirstChars = function(n, inner) {
        this.lineStart += n;
        try {
          return inner();
        } finally {
          this.lineStart -= n;
        }
      };
      StringStream.prototype.lookAhead = function(n) {
        var oracle = this.lineOracle;
        return oracle && oracle.lookAhead(n);
      };
      StringStream.prototype.baseToken = function() {
        var oracle = this.lineOracle;
        return oracle && oracle.baseToken(this.pos);
      };
      function getLine(doc2, n) {
        n -= doc2.first;
        if (n < 0 || n >= doc2.size) {
          throw new Error("There is no line " + (n + doc2.first) + " in the document.");
        }
        var chunk = doc2;
        while (!chunk.lines) {
          for (var i2 = 0; ; ++i2) {
            var child = chunk.children[i2], sz = child.chunkSize();
            if (n < sz) {
              chunk = child;
              break;
            }
            n -= sz;
          }
        }
        return chunk.lines[n];
      }
      function getBetween(doc2, start, end) {
        var out = [], n = start.line;
        doc2.iter(start.line, end.line + 1, function(line) {
          var text = line.text;
          if (n == end.line) {
            text = text.slice(0, end.ch);
          }
          if (n == start.line) {
            text = text.slice(start.ch);
          }
          out.push(text);
          ++n;
        });
        return out;
      }
      function getLines(doc2, from, to) {
        var out = [];
        doc2.iter(from, to, function(line) {
          out.push(line.text);
        });
        return out;
      }
      function updateLineHeight(line, height) {
        var diff2 = height - line.height;
        if (diff2) {
          for (var n = line; n; n = n.parent) {
            n.height += diff2;
          }
        }
      }
      function lineNo(line) {
        if (line.parent == null) {
          return null;
        }
        var cur = line.parent, no = indexOf(cur.lines, line);
        for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
          for (var i2 = 0; ; ++i2) {
            if (chunk.children[i2] == cur) {
              break;
            }
            no += chunk.children[i2].chunkSize();
          }
        }
        return no + cur.first;
      }
      function lineAtHeight(chunk, h) {
        var n = chunk.first;
        outer: do {
          for (var i$12 = 0; i$12 < chunk.children.length; ++i$12) {
            var child = chunk.children[i$12], ch = child.height;
            if (h < ch) {
              chunk = child;
              continue outer;
            }
            h -= ch;
            n += child.chunkSize();
          }
          return n;
        } while (!chunk.lines);
        var i2 = 0;
        for (; i2 < chunk.lines.length; ++i2) {
          var line = chunk.lines[i2], lh = line.height;
          if (h < lh) {
            break;
          }
          h -= lh;
        }
        return n + i2;
      }
      function isLine(doc2, l) {
        return l >= doc2.first && l < doc2.first + doc2.size;
      }
      function lineNumberFor(options, i2) {
        return String(options.lineNumberFormatter(i2 + options.firstLineNumber));
      }
      function Pos(line, ch, sticky) {
        if (sticky === void 0) sticky = null;
        if (!(this instanceof Pos)) {
          return new Pos(line, ch, sticky);
        }
        this.line = line;
        this.ch = ch;
        this.sticky = sticky;
      }
      function cmp(a, b) {
        return a.line - b.line || a.ch - b.ch;
      }
      function equalCursorPos(a, b) {
        return a.sticky == b.sticky && cmp(a, b) == 0;
      }
      function copyPos(x) {
        return Pos(x.line, x.ch);
      }
      function maxPos(a, b) {
        return cmp(a, b) < 0 ? b : a;
      }
      function minPos(a, b) {
        return cmp(a, b) < 0 ? a : b;
      }
      function clipLine(doc2, n) {
        return Math.max(doc2.first, Math.min(n, doc2.first + doc2.size - 1));
      }
      function clipPos(doc2, pos) {
        if (pos.line < doc2.first) {
          return Pos(doc2.first, 0);
        }
        var last = doc2.first + doc2.size - 1;
        if (pos.line > last) {
          return Pos(last, getLine(doc2, last).text.length);
        }
        return clipToLen(pos, getLine(doc2, pos.line).text.length);
      }
      function clipToLen(pos, linelen) {
        var ch = pos.ch;
        if (ch == null || ch > linelen) {
          return Pos(pos.line, linelen);
        } else if (ch < 0) {
          return Pos(pos.line, 0);
        } else {
          return pos;
        }
      }
      function clipPosArray(doc2, array) {
        var out = [];
        for (var i2 = 0; i2 < array.length; i2++) {
          out[i2] = clipPos(doc2, array[i2]);
        }
        return out;
      }
      var SavedContext = function(state, lookAhead) {
        this.state = state;
        this.lookAhead = lookAhead;
      };
      var Context = function(doc2, state, line, lookAhead) {
        this.state = state;
        this.doc = doc2;
        this.line = line;
        this.maxLookAhead = lookAhead || 0;
        this.baseTokens = null;
        this.baseTokenPos = 1;
      };
      Context.prototype.lookAhead = function(n) {
        var line = this.doc.getLine(this.line + n);
        if (line != null && n > this.maxLookAhead) {
          this.maxLookAhead = n;
        }
        return line;
      };
      Context.prototype.baseToken = function(n) {
        if (!this.baseTokens) {
          return null;
        }
        while (this.baseTokens[this.baseTokenPos] <= n) {
          this.baseTokenPos += 2;
        }
        var type = this.baseTokens[this.baseTokenPos + 1];
        return {
          type: type && type.replace(/( |^)overlay .*/, ""),
          size: this.baseTokens[this.baseTokenPos] - n
        };
      };
      Context.prototype.nextLine = function() {
        this.line++;
        if (this.maxLookAhead > 0) {
          this.maxLookAhead--;
        }
      };
      Context.fromSaved = function(doc2, saved, line) {
        if (saved instanceof SavedContext) {
          return new Context(doc2, copyState(doc2.mode, saved.state), line, saved.lookAhead);
        } else {
          return new Context(doc2, copyState(doc2.mode, saved), line);
        }
      };
      Context.prototype.save = function(copy) {
        var state = copy !== false ? copyState(this.doc.mode, this.state) : this.state;
        return this.maxLookAhead > 0 ? new SavedContext(state, this.maxLookAhead) : state;
      };
      function highlightLine(cm, line, context, forceToEnd) {
        var st = [cm.state.modeGen], lineClasses = {};
        runMode(
          cm,
          line.text,
          cm.doc.mode,
          context,
          function(end, style) {
            return st.push(end, style);
          },
          lineClasses,
          forceToEnd
        );
        var state = context.state;
        var loop = function(o2) {
          context.baseTokens = st;
          var overlay = cm.state.overlays[o2], i2 = 1, at = 0;
          context.state = true;
          runMode(cm, line.text, overlay.mode, context, function(end, style) {
            var start = i2;
            while (at < end) {
              var i_end = st[i2];
              if (i_end > end) {
                st.splice(i2, 1, end, st[i2 + 1], i_end);
              }
              i2 += 2;
              at = Math.min(end, i_end);
            }
            if (!style) {
              return;
            }
            if (overlay.opaque) {
              st.splice(start, i2 - start, end, "overlay " + style);
              i2 = start + 2;
            } else {
              for (; start < i2; start += 2) {
                var cur = st[start + 1];
                st[start + 1] = (cur ? cur + " " : "") + "overlay " + style;
              }
            }
          }, lineClasses);
          context.state = state;
          context.baseTokens = null;
          context.baseTokenPos = 1;
        };
        for (var o = 0; o < cm.state.overlays.length; ++o) loop(o);
        return { styles: st, classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null };
      }
      function getLineStyles(cm, line, updateFrontier) {
        if (!line.styles || line.styles[0] != cm.state.modeGen) {
          var context = getContextBefore(cm, lineNo(line));
          var resetState = line.text.length > cm.options.maxHighlightLength && copyState(cm.doc.mode, context.state);
          var result = highlightLine(cm, line, context);
          if (resetState) {
            context.state = resetState;
          }
          line.stateAfter = context.save(!resetState);
          line.styles = result.styles;
          if (result.classes) {
            line.styleClasses = result.classes;
          } else if (line.styleClasses) {
            line.styleClasses = null;
          }
          if (updateFrontier === cm.doc.highlightFrontier) {
            cm.doc.modeFrontier = Math.max(cm.doc.modeFrontier, ++cm.doc.highlightFrontier);
          }
        }
        return line.styles;
      }
      function getContextBefore(cm, n, precise) {
        var doc2 = cm.doc, display = cm.display;
        if (!doc2.mode.startState) {
          return new Context(doc2, true, n);
        }
        var start = findStartLine(cm, n, precise);
        var saved = start > doc2.first && getLine(doc2, start - 1).stateAfter;
        var context = saved ? Context.fromSaved(doc2, saved, start) : new Context(doc2, startState(doc2.mode), start);
        doc2.iter(start, n, function(line) {
          processLine(cm, line.text, context);
          var pos = context.line;
          line.stateAfter = pos == n - 1 || pos % 5 == 0 || pos >= display.viewFrom && pos < display.viewTo ? context.save() : null;
          context.nextLine();
        });
        if (precise) {
          doc2.modeFrontier = context.line;
        }
        return context;
      }
      function processLine(cm, text, context, startAt) {
        var mode = cm.doc.mode;
        var stream = new StringStream(text, cm.options.tabSize, context);
        stream.start = stream.pos = startAt || 0;
        if (text == "") {
          callBlankLine(mode, context.state);
        }
        while (!stream.eol()) {
          readToken(mode, stream, context.state);
          stream.start = stream.pos;
        }
      }
      function callBlankLine(mode, state) {
        if (mode.blankLine) {
          return mode.blankLine(state);
        }
        if (!mode.innerMode) {
          return;
        }
        var inner = innerMode(mode, state);
        if (inner.mode.blankLine) {
          return inner.mode.blankLine(inner.state);
        }
      }
      function readToken(mode, stream, state, inner) {
        for (var i2 = 0; i2 < 10; i2++) {
          if (inner) {
            inner[0] = innerMode(mode, state).mode;
          }
          var style = mode.token(stream, state);
          if (stream.pos > stream.start) {
            return style;
          }
        }
        throw new Error("Mode " + mode.name + " failed to advance stream.");
      }
      var Token = function(stream, type, state) {
        this.start = stream.start;
        this.end = stream.pos;
        this.string = stream.current();
        this.type = type || null;
        this.state = state;
      };
      function takeToken(cm, pos, precise, asArray) {
        var doc2 = cm.doc, mode = doc2.mode, style;
        pos = clipPos(doc2, pos);
        var line = getLine(doc2, pos.line), context = getContextBefore(cm, pos.line, precise);
        var stream = new StringStream(line.text, cm.options.tabSize, context), tokens;
        if (asArray) {
          tokens = [];
        }
        while ((asArray || stream.pos < pos.ch) && !stream.eol()) {
          stream.start = stream.pos;
          style = readToken(mode, stream, context.state);
          if (asArray) {
            tokens.push(new Token(stream, style, copyState(doc2.mode, context.state)));
          }
        }
        return asArray ? tokens : new Token(stream, style, context.state);
      }
      function extractLineClasses(type, output) {
        if (type) {
          for (; ; ) {
            var lineClass = type.match(/(?:^|\s+)line-(background-)?(\S+)/);
            if (!lineClass) {
              break;
            }
            type = type.slice(0, lineClass.index) + type.slice(lineClass.index + lineClass[0].length);
            var prop2 = lineClass[1] ? "bgClass" : "textClass";
            if (output[prop2] == null) {
              output[prop2] = lineClass[2];
            } else if (!new RegExp("(?:^|\\s)" + lineClass[2] + "(?:$|\\s)").test(output[prop2])) {
              output[prop2] += " " + lineClass[2];
            }
          }
        }
        return type;
      }
      function runMode(cm, text, mode, context, f, lineClasses, forceToEnd) {
        var flattenSpans = mode.flattenSpans;
        if (flattenSpans == null) {
          flattenSpans = cm.options.flattenSpans;
        }
        var curStart = 0, curStyle = null;
        var stream = new StringStream(text, cm.options.tabSize, context), style;
        var inner = cm.options.addModeClass && [null];
        if (text == "") {
          extractLineClasses(callBlankLine(mode, context.state), lineClasses);
        }
        while (!stream.eol()) {
          if (stream.pos > cm.options.maxHighlightLength) {
            flattenSpans = false;
            if (forceToEnd) {
              processLine(cm, text, context, stream.pos);
            }
            stream.pos = text.length;
            style = null;
          } else {
            style = extractLineClasses(readToken(mode, stream, context.state, inner), lineClasses);
          }
          if (inner) {
            var mName = inner[0].name;
            if (mName) {
              style = "m-" + (style ? mName + " " + style : mName);
            }
          }
          if (!flattenSpans || curStyle != style) {
            while (curStart < stream.start) {
              curStart = Math.min(stream.start, curStart + 5e3);
              f(curStart, curStyle);
            }
            curStyle = style;
          }
          stream.start = stream.pos;
        }
        while (curStart < stream.pos) {
          var pos = Math.min(stream.pos, curStart + 5e3);
          f(pos, curStyle);
          curStart = pos;
        }
      }
      function findStartLine(cm, n, precise) {
        var minindent, minline, doc2 = cm.doc;
        var lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1e3 : 100);
        for (var search = n; search > lim; --search) {
          if (search <= doc2.first) {
            return doc2.first;
          }
          var line = getLine(doc2, search - 1), after = line.stateAfter;
          if (after && (!precise || search + (after instanceof SavedContext ? after.lookAhead : 0) <= doc2.modeFrontier)) {
            return search;
          }
          var indented = countColumn(line.text, null, cm.options.tabSize);
          if (minline == null || minindent > indented) {
            minline = search - 1;
            minindent = indented;
          }
        }
        return minline;
      }
      function retreatFrontier(doc2, n) {
        doc2.modeFrontier = Math.min(doc2.modeFrontier, n);
        if (doc2.highlightFrontier < n - 10) {
          return;
        }
        var start = doc2.first;
        for (var line = n - 1; line > start; line--) {
          var saved = getLine(doc2, line).stateAfter;
          if (saved && (!(saved instanceof SavedContext) || line + saved.lookAhead < n)) {
            start = line + 1;
            break;
          }
        }
        doc2.highlightFrontier = Math.min(doc2.highlightFrontier, start);
      }
      var sawReadOnlySpans = false, sawCollapsedSpans = false;
      function seeReadOnlySpans() {
        sawReadOnlySpans = true;
      }
      function seeCollapsedSpans() {
        sawCollapsedSpans = true;
      }
      function MarkedSpan(marker, from, to) {
        this.marker = marker;
        this.from = from;
        this.to = to;
      }
      function getMarkedSpanFor(spans, marker) {
        if (spans) {
          for (var i2 = 0; i2 < spans.length; ++i2) {
            var span = spans[i2];
            if (span.marker == marker) {
              return span;
            }
          }
        }
      }
      function removeMarkedSpan(spans, span) {
        var r;
        for (var i2 = 0; i2 < spans.length; ++i2) {
          if (spans[i2] != span) {
            (r || (r = [])).push(spans[i2]);
          }
        }
        return r;
      }
      function addMarkedSpan(line, span, op) {
        var inThisOp = op && window.WeakSet && (op.markedSpans || (op.markedSpans = /* @__PURE__ */ new WeakSet()));
        if (inThisOp && line.markedSpans && inThisOp.has(line.markedSpans)) {
          line.markedSpans.push(span);
        } else {
          line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
          if (inThisOp) {
            inThisOp.add(line.markedSpans);
          }
        }
        span.marker.attachLine(line);
      }
      function markedSpansBefore(old, startCh, isInsert) {
        var nw;
        if (old) {
          for (var i2 = 0; i2 < old.length; ++i2) {
            var span = old[i2], marker = span.marker;
            var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
            if (startsBefore || span.from == startCh && marker.type == "bookmark" && (!isInsert || !span.marker.insertLeft)) {
              var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
              (nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
            }
          }
        }
        return nw;
      }
      function markedSpansAfter(old, endCh, isInsert) {
        var nw;
        if (old) {
          for (var i2 = 0; i2 < old.length; ++i2) {
            var span = old[i2], marker = span.marker;
            var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
            if (endsAfter || span.from == endCh && marker.type == "bookmark" && (!isInsert || span.marker.insertLeft)) {
              var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
              (nw || (nw = [])).push(new MarkedSpan(
                marker,
                startsBefore ? null : span.from - endCh,
                span.to == null ? null : span.to - endCh
              ));
            }
          }
        }
        return nw;
      }
      function stretchSpansOverChange(doc2, change) {
        if (change.full) {
          return null;
        }
        var oldFirst = isLine(doc2, change.from.line) && getLine(doc2, change.from.line).markedSpans;
        var oldLast = isLine(doc2, change.to.line) && getLine(doc2, change.to.line).markedSpans;
        if (!oldFirst && !oldLast) {
          return null;
        }
        var startCh = change.from.ch, endCh = change.to.ch, isInsert = cmp(change.from, change.to) == 0;
        var first = markedSpansBefore(oldFirst, startCh, isInsert);
        var last = markedSpansAfter(oldLast, endCh, isInsert);
        var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);
        if (first) {
          for (var i2 = 0; i2 < first.length; ++i2) {
            var span = first[i2];
            if (span.to == null) {
              var found = getMarkedSpanFor(last, span.marker);
              if (!found) {
                span.to = startCh;
              } else if (sameLine) {
                span.to = found.to == null ? null : found.to + offset;
              }
            }
          }
        }
        if (last) {
          for (var i$12 = 0; i$12 < last.length; ++i$12) {
            var span$1 = last[i$12];
            if (span$1.to != null) {
              span$1.to += offset;
            }
            if (span$1.from == null) {
              var found$1 = getMarkedSpanFor(first, span$1.marker);
              if (!found$1) {
                span$1.from = offset;
                if (sameLine) {
                  (first || (first = [])).push(span$1);
                }
              }
            } else {
              span$1.from += offset;
              if (sameLine) {
                (first || (first = [])).push(span$1);
              }
            }
          }
        }
        if (first) {
          first = clearEmptySpans(first);
        }
        if (last && last != first) {
          last = clearEmptySpans(last);
        }
        var newMarkers = [first];
        if (!sameLine) {
          var gap = change.text.length - 2, gapMarkers;
          if (gap > 0 && first) {
            for (var i$22 = 0; i$22 < first.length; ++i$22) {
              if (first[i$22].to == null) {
                (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i$22].marker, null, null));
              }
            }
          }
          for (var i$3 = 0; i$3 < gap; ++i$3) {
            newMarkers.push(gapMarkers);
          }
          newMarkers.push(last);
        }
        return newMarkers;
      }
      function clearEmptySpans(spans) {
        for (var i2 = 0; i2 < spans.length; ++i2) {
          var span = spans[i2];
          if (span.from != null && span.from == span.to && span.marker.clearWhenEmpty !== false) {
            spans.splice(i2--, 1);
          }
        }
        if (!spans.length) {
          return null;
        }
        return spans;
      }
      function removeReadOnlyRanges(doc2, from, to) {
        var markers = null;
        doc2.iter(from.line, to.line + 1, function(line) {
          if (line.markedSpans) {
            for (var i3 = 0; i3 < line.markedSpans.length; ++i3) {
              var mark = line.markedSpans[i3].marker;
              if (mark.readOnly && (!markers || indexOf(markers, mark) == -1)) {
                (markers || (markers = [])).push(mark);
              }
            }
          }
        });
        if (!markers) {
          return null;
        }
        var parts = [{ from, to }];
        for (var i2 = 0; i2 < markers.length; ++i2) {
          var mk = markers[i2], m = mk.find(0);
          for (var j = 0; j < parts.length; ++j) {
            var p = parts[j];
            if (cmp(p.to, m.from) < 0 || cmp(p.from, m.to) > 0) {
              continue;
            }
            var newParts = [j, 1], dfrom = cmp(p.from, m.from), dto = cmp(p.to, m.to);
            if (dfrom < 0 || !mk.inclusiveLeft && !dfrom) {
              newParts.push({ from: p.from, to: m.from });
            }
            if (dto > 0 || !mk.inclusiveRight && !dto) {
              newParts.push({ from: m.to, to: p.to });
            }
            parts.splice.apply(parts, newParts);
            j += newParts.length - 3;
          }
        }
        return parts;
      }
      function detachMarkedSpans(line) {
        var spans = line.markedSpans;
        if (!spans) {
          return;
        }
        for (var i2 = 0; i2 < spans.length; ++i2) {
          spans[i2].marker.detachLine(line);
        }
        line.markedSpans = null;
      }
      function attachMarkedSpans(line, spans) {
        if (!spans) {
          return;
        }
        for (var i2 = 0; i2 < spans.length; ++i2) {
          spans[i2].marker.attachLine(line);
        }
        line.markedSpans = spans;
      }
      function extraLeft(marker) {
        return marker.inclusiveLeft ? -1 : 0;
      }
      function extraRight(marker) {
        return marker.inclusiveRight ? 1 : 0;
      }
      function compareCollapsedMarkers(a, b) {
        var lenDiff = a.lines.length - b.lines.length;
        if (lenDiff != 0) {
          return lenDiff;
        }
        var aPos = a.find(), bPos = b.find();
        var fromCmp = cmp(aPos.from, bPos.from) || extraLeft(a) - extraLeft(b);
        if (fromCmp) {
          return -fromCmp;
        }
        var toCmp = cmp(aPos.to, bPos.to) || extraRight(a) - extraRight(b);
        if (toCmp) {
          return toCmp;
        }
        return b.id - a.id;
      }
      function collapsedSpanAtSide(line, start) {
        var sps = sawCollapsedSpans && line.markedSpans, found;
        if (sps) {
          for (var sp = void 0, i2 = 0; i2 < sps.length; ++i2) {
            sp = sps[i2];
            if (sp.marker.collapsed && (start ? sp.from : sp.to) == null && (!found || compareCollapsedMarkers(found, sp.marker) < 0)) {
              found = sp.marker;
            }
          }
        }
        return found;
      }
      function collapsedSpanAtStart(line) {
        return collapsedSpanAtSide(line, true);
      }
      function collapsedSpanAtEnd(line) {
        return collapsedSpanAtSide(line, false);
      }
      function collapsedSpanAround(line, ch) {
        var sps = sawCollapsedSpans && line.markedSpans, found;
        if (sps) {
          for (var i2 = 0; i2 < sps.length; ++i2) {
            var sp = sps[i2];
            if (sp.marker.collapsed && (sp.from == null || sp.from < ch) && (sp.to == null || sp.to > ch) && (!found || compareCollapsedMarkers(found, sp.marker) < 0)) {
              found = sp.marker;
            }
          }
        }
        return found;
      }
      function conflictingCollapsedRange(doc2, lineNo2, from, to, marker) {
        var line = getLine(doc2, lineNo2);
        var sps = sawCollapsedSpans && line.markedSpans;
        if (sps) {
          for (var i2 = 0; i2 < sps.length; ++i2) {
            var sp = sps[i2];
            if (!sp.marker.collapsed) {
              continue;
            }
            var found = sp.marker.find(0);
            var fromCmp = cmp(found.from, from) || extraLeft(sp.marker) - extraLeft(marker);
            var toCmp = cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
            if (fromCmp >= 0 && toCmp <= 0 || fromCmp <= 0 && toCmp >= 0) {
              continue;
            }
            if (fromCmp <= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.to, from) >= 0 : cmp(found.to, from) > 0) || fromCmp >= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.from, to) <= 0 : cmp(found.from, to) < 0)) {
              return true;
            }
          }
        }
      }
      function visualLine(line) {
        var merged;
        while (merged = collapsedSpanAtStart(line)) {
          line = merged.find(-1, true).line;
        }
        return line;
      }
      function visualLineEnd(line) {
        var merged;
        while (merged = collapsedSpanAtEnd(line)) {
          line = merged.find(1, true).line;
        }
        return line;
      }
      function visualLineContinued(line) {
        var merged, lines;
        while (merged = collapsedSpanAtEnd(line)) {
          line = merged.find(1, true).line;
          (lines || (lines = [])).push(line);
        }
        return lines;
      }
      function visualLineNo(doc2, lineN) {
        var line = getLine(doc2, lineN), vis = visualLine(line);
        if (line == vis) {
          return lineN;
        }
        return lineNo(vis);
      }
      function visualLineEndNo(doc2, lineN) {
        if (lineN > doc2.lastLine()) {
          return lineN;
        }
        var line = getLine(doc2, lineN), merged;
        if (!lineIsHidden(doc2, line)) {
          return lineN;
        }
        while (merged = collapsedSpanAtEnd(line)) {
          line = merged.find(1, true).line;
        }
        return lineNo(line) + 1;
      }
      function lineIsHidden(doc2, line) {
        var sps = sawCollapsedSpans && line.markedSpans;
        if (sps) {
          for (var sp = void 0, i2 = 0; i2 < sps.length; ++i2) {
            sp = sps[i2];
            if (!sp.marker.collapsed) {
              continue;
            }
            if (sp.from == null) {
              return true;
            }
            if (sp.marker.widgetNode) {
              continue;
            }
            if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc2, line, sp)) {
              return true;
            }
          }
        }
      }
      function lineIsHiddenInner(doc2, line, span) {
        if (span.to == null) {
          var end = span.marker.find(1, true);
          return lineIsHiddenInner(doc2, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker));
        }
        if (span.marker.inclusiveRight && span.to == line.text.length) {
          return true;
        }
        for (var sp = void 0, i2 = 0; i2 < line.markedSpans.length; ++i2) {
          sp = line.markedSpans[i2];
          if (sp.marker.collapsed && !sp.marker.widgetNode && sp.from == span.to && (sp.to == null || sp.to != span.from) && (sp.marker.inclusiveLeft || span.marker.inclusiveRight) && lineIsHiddenInner(doc2, line, sp)) {
            return true;
          }
        }
      }
      function heightAtLine(lineObj) {
        lineObj = visualLine(lineObj);
        var h = 0, chunk = lineObj.parent;
        for (var i2 = 0; i2 < chunk.lines.length; ++i2) {
          var line = chunk.lines[i2];
          if (line == lineObj) {
            break;
          } else {
            h += line.height;
          }
        }
        for (var p = chunk.parent; p; chunk = p, p = chunk.parent) {
          for (var i$12 = 0; i$12 < p.children.length; ++i$12) {
            var cur = p.children[i$12];
            if (cur == chunk) {
              break;
            } else {
              h += cur.height;
            }
          }
        }
        return h;
      }
      function lineLength(line) {
        if (line.height == 0) {
          return 0;
        }
        var len = line.text.length, merged, cur = line;
        while (merged = collapsedSpanAtStart(cur)) {
          var found = merged.find(0, true);
          cur = found.from.line;
          len += found.from.ch - found.to.ch;
        }
        cur = line;
        while (merged = collapsedSpanAtEnd(cur)) {
          var found$1 = merged.find(0, true);
          len -= cur.text.length - found$1.from.ch;
          cur = found$1.to.line;
          len += cur.text.length - found$1.to.ch;
        }
        return len;
      }
      function findMaxLine(cm) {
        var d = cm.display, doc2 = cm.doc;
        d.maxLine = getLine(doc2, doc2.first);
        d.maxLineLength = lineLength(d.maxLine);
        d.maxLineChanged = true;
        doc2.iter(function(line) {
          var len = lineLength(line);
          if (len > d.maxLineLength) {
            d.maxLineLength = len;
            d.maxLine = line;
          }
        });
      }
      var Line = function(text, markedSpans, estimateHeight2) {
        this.text = text;
        attachMarkedSpans(this, markedSpans);
        this.height = estimateHeight2 ? estimateHeight2(this) : 1;
      };
      Line.prototype.lineNo = function() {
        return lineNo(this);
      };
      eventMixin(Line);
      function updateLine(line, text, markedSpans, estimateHeight2) {
        line.text = text;
        if (line.stateAfter) {
          line.stateAfter = null;
        }
        if (line.styles) {
          line.styles = null;
        }
        if (line.order != null) {
          line.order = null;
        }
        detachMarkedSpans(line);
        attachMarkedSpans(line, markedSpans);
        var estHeight = estimateHeight2 ? estimateHeight2(line) : 1;
        if (estHeight != line.height) {
          updateLineHeight(line, estHeight);
        }
      }
      function cleanUpLine(line) {
        line.parent = null;
        detachMarkedSpans(line);
      }
      var styleToClassCache = {}, styleToClassCacheWithMode = {};
      function interpretTokenStyle(style, options) {
        if (!style || /^\s*$/.test(style)) {
          return null;
        }
        var cache = options.addModeClass ? styleToClassCacheWithMode : styleToClassCache;
        return cache[style] || (cache[style] = style.replace(/\S+/g, "cm-$&"));
      }
      function buildLineContent(cm, lineView) {
        var content = eltP("span", null, null, webkit ? "padding-right: .1px" : null);
        var builder = {
          pre: eltP("pre", [content], "CodeMirror-line"),
          content,
          col: 0,
          pos: 0,
          cm,
          trailingSpace: false,
          splitSpaces: cm.getOption("lineWrapping")
        };
        lineView.measure = {};
        for (var i2 = 0; i2 <= (lineView.rest ? lineView.rest.length : 0); i2++) {
          var line = i2 ? lineView.rest[i2 - 1] : lineView.line, order = void 0;
          builder.pos = 0;
          builder.addToken = buildToken;
          if (hasBadBidiRects(cm.display.measure) && (order = getOrder(line, cm.doc.direction))) {
            builder.addToken = buildTokenBadBidi(builder.addToken, order);
          }
          builder.map = [];
          var allowFrontierUpdate = lineView != cm.display.externalMeasured && lineNo(line);
          insertLineContent(line, builder, getLineStyles(cm, line, allowFrontierUpdate));
          if (line.styleClasses) {
            if (line.styleClasses.bgClass) {
              builder.bgClass = joinClasses(line.styleClasses.bgClass, builder.bgClass || "");
            }
            if (line.styleClasses.textClass) {
              builder.textClass = joinClasses(line.styleClasses.textClass, builder.textClass || "");
            }
          }
          if (builder.map.length == 0) {
            builder.map.push(0, 0, builder.content.appendChild(zeroWidthElement(cm.display.measure)));
          }
          if (i2 == 0) {
            lineView.measure.map = builder.map;
            lineView.measure.cache = {};
          } else {
            (lineView.measure.maps || (lineView.measure.maps = [])).push(builder.map);
            (lineView.measure.caches || (lineView.measure.caches = [])).push({});
          }
        }
        if (webkit) {
          var last = builder.content.lastChild;
          if (/\bcm-tab\b/.test(last.className) || last.querySelector && last.querySelector(".cm-tab")) {
            builder.content.className = "cm-tab-wrap-hack";
          }
        }
        signal(cm, "renderLine", cm, lineView.line, builder.pre);
        if (builder.pre.className) {
          builder.textClass = joinClasses(builder.pre.className, builder.textClass || "");
        }
        return builder;
      }
      function defaultSpecialCharPlaceholder(ch) {
        var token = elt("span", "\u2022", "cm-invalidchar");
        token.title = "\\u" + ch.charCodeAt(0).toString(16);
        token.setAttribute("aria-label", token.title);
        return token;
      }
      function buildToken(builder, text, style, startStyle, endStyle, css, attributes) {
        if (!text) {
          return;
        }
        var displayText = builder.splitSpaces ? splitSpaces(text, builder.trailingSpace) : text;
        var special = builder.cm.state.specialChars, mustWrap = false;
        var content;
        if (!special.test(text)) {
          builder.col += text.length;
          content = document.createTextNode(displayText);
          builder.map.push(builder.pos, builder.pos + text.length, content);
          if (ie && ie_version < 9) {
            mustWrap = true;
          }
          builder.pos += text.length;
        } else {
          content = document.createDocumentFragment();
          var pos = 0;
          while (true) {
            special.lastIndex = pos;
            var m = special.exec(text);
            var skipped = m ? m.index - pos : text.length - pos;
            if (skipped) {
              var txt = document.createTextNode(displayText.slice(pos, pos + skipped));
              if (ie && ie_version < 9) {
                content.appendChild(elt("span", [txt]));
              } else {
                content.appendChild(txt);
              }
              builder.map.push(builder.pos, builder.pos + skipped, txt);
              builder.col += skipped;
              builder.pos += skipped;
            }
            if (!m) {
              break;
            }
            pos += skipped + 1;
            var txt$1 = void 0;
            if (m[0] == "	") {
              var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
              txt$1 = content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));
              txt$1.setAttribute("role", "presentation");
              txt$1.setAttribute("cm-text", "	");
              builder.col += tabWidth;
            } else if (m[0] == "\r" || m[0] == "\n") {
              txt$1 = content.appendChild(elt("span", m[0] == "\r" ? "\u240D" : "\u2424", "cm-invalidchar"));
              txt$1.setAttribute("cm-text", m[0]);
              builder.col += 1;
            } else {
              txt$1 = builder.cm.options.specialCharPlaceholder(m[0]);
              txt$1.setAttribute("cm-text", m[0]);
              if (ie && ie_version < 9) {
                content.appendChild(elt("span", [txt$1]));
              } else {
                content.appendChild(txt$1);
              }
              builder.col += 1;
            }
            builder.map.push(builder.pos, builder.pos + 1, txt$1);
            builder.pos++;
          }
        }
        builder.trailingSpace = displayText.charCodeAt(text.length - 1) == 32;
        if (style || startStyle || endStyle || mustWrap || css || attributes) {
          var fullStyle = style || "";
          if (startStyle) {
            fullStyle += startStyle;
          }
          if (endStyle) {
            fullStyle += endStyle;
          }
          var token = elt("span", [content], fullStyle, css);
          if (attributes) {
            for (var attr in attributes) {
              if (attributes.hasOwnProperty(attr) && attr != "style" && attr != "class") {
                token.setAttribute(attr, attributes[attr]);
              }
            }
          }
          return builder.content.appendChild(token);
        }
        builder.content.appendChild(content);
      }
      function splitSpaces(text, trailingBefore) {
        if (text.length > 1 && !/  /.test(text)) {
          return text;
        }
        var spaceBefore = trailingBefore, result = "";
        for (var i2 = 0; i2 < text.length; i2++) {
          var ch = text.charAt(i2);
          if (ch == " " && spaceBefore && (i2 == text.length - 1 || text.charCodeAt(i2 + 1) == 32)) {
            ch = "\xA0";
          }
          result += ch;
          spaceBefore = ch == " ";
        }
        return result;
      }
      function buildTokenBadBidi(inner, order) {
        return function(builder, text, style, startStyle, endStyle, css, attributes) {
          style = style ? style + " cm-force-border" : "cm-force-border";
          var start = builder.pos, end = start + text.length;
          for (; ; ) {
            var part = void 0;
            for (var i2 = 0; i2 < order.length; i2++) {
              part = order[i2];
              if (part.to > start && part.from <= start) {
                break;
              }
            }
            if (part.to >= end) {
              return inner(builder, text, style, startStyle, endStyle, css, attributes);
            }
            inner(builder, text.slice(0, part.to - start), style, startStyle, null, css, attributes);
            startStyle = null;
            text = text.slice(part.to - start);
            start = part.to;
          }
        };
      }
      function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
        var widget = !ignoreWidget && marker.widgetNode;
        if (widget) {
          builder.map.push(builder.pos, builder.pos + size, widget);
        }
        if (!ignoreWidget && builder.cm.display.input.needsContentAttribute) {
          if (!widget) {
            widget = builder.content.appendChild(document.createElement("span"));
          }
          widget.setAttribute("cm-marker", marker.id);
        }
        if (widget) {
          builder.cm.display.input.setUneditable(widget);
          builder.content.appendChild(widget);
        }
        builder.pos += size;
        builder.trailingSpace = false;
      }
      function insertLineContent(line, builder, styles) {
        var spans = line.markedSpans, allText = line.text, at = 0;
        if (!spans) {
          for (var i$12 = 1; i$12 < styles.length; i$12 += 2) {
            builder.addToken(builder, allText.slice(at, at = styles[i$12]), interpretTokenStyle(styles[i$12 + 1], builder.cm.options));
          }
          return;
        }
        var len = allText.length, pos = 0, i2 = 1, text = "", style, css;
        var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, collapsed, attributes;
        for (; ; ) {
          if (nextChange == pos) {
            spanStyle = spanEndStyle = spanStartStyle = css = "";
            attributes = null;
            collapsed = null;
            nextChange = Infinity;
            var foundBookmarks = [], endStyles = void 0;
            for (var j = 0; j < spans.length; ++j) {
              var sp = spans[j], m = sp.marker;
              if (m.type == "bookmark" && sp.from == pos && m.widgetNode) {
                foundBookmarks.push(m);
              } else if (sp.from <= pos && (sp.to == null || sp.to > pos || m.collapsed && sp.to == pos && sp.from == pos)) {
                if (sp.to != null && sp.to != pos && nextChange > sp.to) {
                  nextChange = sp.to;
                  spanEndStyle = "";
                }
                if (m.className) {
                  spanStyle += " " + m.className;
                }
                if (m.css) {
                  css = (css ? css + ";" : "") + m.css;
                }
                if (m.startStyle && sp.from == pos) {
                  spanStartStyle += " " + m.startStyle;
                }
                if (m.endStyle && sp.to == nextChange) {
                  (endStyles || (endStyles = [])).push(m.endStyle, sp.to);
                }
                if (m.title) {
                  (attributes || (attributes = {})).title = m.title;
                }
                if (m.attributes) {
                  for (var attr in m.attributes) {
                    (attributes || (attributes = {}))[attr] = m.attributes[attr];
                  }
                }
                if (m.collapsed && (!collapsed || compareCollapsedMarkers(collapsed.marker, m) < 0)) {
                  collapsed = sp;
                }
              } else if (sp.from > pos && nextChange > sp.from) {
                nextChange = sp.from;
              }
            }
            if (endStyles) {
              for (var j$1 = 0; j$1 < endStyles.length; j$1 += 2) {
                if (endStyles[j$1 + 1] == nextChange) {
                  spanEndStyle += " " + endStyles[j$1];
                }
              }
            }
            if (!collapsed || collapsed.from == pos) {
              for (var j$2 = 0; j$2 < foundBookmarks.length; ++j$2) {
                buildCollapsedSpan(builder, 0, foundBookmarks[j$2]);
              }
            }
            if (collapsed && (collapsed.from || 0) == pos) {
              buildCollapsedSpan(
                builder,
                (collapsed.to == null ? len + 1 : collapsed.to) - pos,
                collapsed.marker,
                collapsed.from == null
              );
              if (collapsed.to == null) {
                return;
              }
              if (collapsed.to == pos) {
                collapsed = false;
              }
            }
          }
          if (pos >= len) {
            break;
          }
          var upto = Math.min(len, nextChange);
          while (true) {
            if (text) {
              var end = pos + text.length;
              if (!collapsed) {
                var tokenText = end > upto ? text.slice(0, upto - pos) : text;
                builder.addToken(
                  builder,
                  tokenText,
                  style ? style + spanStyle : spanStyle,
                  spanStartStyle,
                  pos + tokenText.length == nextChange ? spanEndStyle : "",
                  css,
                  attributes
                );
              }
              if (end >= upto) {
                text = text.slice(upto - pos);
                pos = upto;
                break;
              }
              pos = end;
              spanStartStyle = "";
            }
            text = allText.slice(at, at = styles[i2++]);
            style = interpretTokenStyle(styles[i2++], builder.cm.options);
          }
        }
      }
      function LineView(doc2, line, lineN) {
        this.line = line;
        this.rest = visualLineContinued(line);
        this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1;
        this.node = this.text = null;
        this.hidden = lineIsHidden(doc2, line);
      }
      function buildViewArray(cm, from, to) {
        var array = [], nextPos;
        for (var pos = from; pos < to; pos = nextPos) {
          var view = new LineView(cm.doc, getLine(cm.doc, pos), pos);
          nextPos = pos + view.size;
          array.push(view);
        }
        return array;
      }
      var operationGroup = null;
      function pushOperation(op) {
        if (operationGroup) {
          operationGroup.ops.push(op);
        } else {
          op.ownsGroup = operationGroup = {
            ops: [op],
            delayedCallbacks: []
          };
        }
      }
      function fireCallbacksForOps(group) {
        var callbacks = group.delayedCallbacks, i2 = 0;
        do {
          for (; i2 < callbacks.length; i2++) {
            callbacks[i2].call(null);
          }
          for (var j = 0; j < group.ops.length; j++) {
            var op = group.ops[j];
            if (op.cursorActivityHandlers) {
              while (op.cursorActivityCalled < op.cursorActivityHandlers.length) {
                op.cursorActivityHandlers[op.cursorActivityCalled++].call(null, op.cm);
              }
            }
          }
        } while (i2 < callbacks.length);
      }
      function finishOperation(op, endCb) {
        var group = op.ownsGroup;
        if (!group) {
          return;
        }
        try {
          fireCallbacksForOps(group);
        } finally {
          operationGroup = null;
          endCb(group);
        }
      }
      var orphanDelayedCallbacks = null;
      function signalLater(emitter, type) {
        var arr = getHandlers(emitter, type);
        if (!arr.length) {
          return;
        }
        var args = Array.prototype.slice.call(arguments, 2), list;
        if (operationGroup) {
          list = operationGroup.delayedCallbacks;
        } else if (orphanDelayedCallbacks) {
          list = orphanDelayedCallbacks;
        } else {
          list = orphanDelayedCallbacks = [];
          setTimeout(fireOrphanDelayed, 0);
        }
        var loop = function(i3) {
          list.push(function() {
            return arr[i3].apply(null, args);
          });
        };
        for (var i2 = 0; i2 < arr.length; ++i2)
          loop(i2);
      }
      function fireOrphanDelayed() {
        var delayed = orphanDelayedCallbacks;
        orphanDelayedCallbacks = null;
        for (var i2 = 0; i2 < delayed.length; ++i2) {
          delayed[i2]();
        }
      }
      function updateLineForChanges(cm, lineView, lineN, dims) {
        for (var j = 0; j < lineView.changes.length; j++) {
          var type = lineView.changes[j];
          if (type == "text") {
            updateLineText(cm, lineView);
          } else if (type == "gutter") {
            updateLineGutter(cm, lineView, lineN, dims);
          } else if (type == "class") {
            updateLineClasses(cm, lineView);
          } else if (type == "widget") {
            updateLineWidgets(cm, lineView, dims);
          }
        }
        lineView.changes = null;
      }
      function ensureLineWrapped(lineView) {
        if (lineView.node == lineView.text) {
          lineView.node = elt("div", null, null, "position: relative");
          if (lineView.text.parentNode) {
            lineView.text.parentNode.replaceChild(lineView.node, lineView.text);
          }
          lineView.node.appendChild(lineView.text);
          if (ie && ie_version < 8) {
            lineView.node.style.zIndex = 2;
          }
        }
        return lineView.node;
      }
      function updateLineBackground(cm, lineView) {
        var cls = lineView.bgClass ? lineView.bgClass + " " + (lineView.line.bgClass || "") : lineView.line.bgClass;
        if (cls) {
          cls += " CodeMirror-linebackground";
        }
        if (lineView.background) {
          if (cls) {
            lineView.background.className = cls;
          } else {
            lineView.background.parentNode.removeChild(lineView.background);
            lineView.background = null;
          }
        } else if (cls) {
          var wrap = ensureLineWrapped(lineView);
          lineView.background = wrap.insertBefore(elt("div", null, cls), wrap.firstChild);
          cm.display.input.setUneditable(lineView.background);
        }
      }
      function getLineContent(cm, lineView) {
        var ext = cm.display.externalMeasured;
        if (ext && ext.line == lineView.line) {
          cm.display.externalMeasured = null;
          lineView.measure = ext.measure;
          return ext.built;
        }
        return buildLineContent(cm, lineView);
      }
      function updateLineText(cm, lineView) {
        var cls = lineView.text.className;
        var built = getLineContent(cm, lineView);
        if (lineView.text == lineView.node) {
          lineView.node = built.pre;
        }
        lineView.text.parentNode.replaceChild(built.pre, lineView.text);
        lineView.text = built.pre;
        if (built.bgClass != lineView.bgClass || built.textClass != lineView.textClass) {
          lineView.bgClass = built.bgClass;
          lineView.textClass = built.textClass;
          updateLineClasses(cm, lineView);
        } else if (cls) {
          lineView.text.className = cls;
        }
      }
      function updateLineClasses(cm, lineView) {
        updateLineBackground(cm, lineView);
        if (lineView.line.wrapClass) {
          ensureLineWrapped(lineView).className = lineView.line.wrapClass;
        } else if (lineView.node != lineView.text) {
          lineView.node.className = "";
        }
        var textClass = lineView.textClass ? lineView.textClass + " " + (lineView.line.textClass || "") : lineView.line.textClass;
        lineView.text.className = textClass || "";
      }
      function updateLineGutter(cm, lineView, lineN, dims) {
        if (lineView.gutter) {
          lineView.node.removeChild(lineView.gutter);
          lineView.gutter = null;
        }
        if (lineView.gutterBackground) {
          lineView.node.removeChild(lineView.gutterBackground);
          lineView.gutterBackground = null;
        }
        if (lineView.line.gutterClass) {
          var wrap = ensureLineWrapped(lineView);
          lineView.gutterBackground = elt(
            "div",
            null,
            "CodeMirror-gutter-background " + lineView.line.gutterClass,
            "left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px; width: " + dims.gutterTotalWidth + "px"
          );
          cm.display.input.setUneditable(lineView.gutterBackground);
          wrap.insertBefore(lineView.gutterBackground, lineView.text);
        }
        var markers = lineView.line.gutterMarkers;
        if (cm.options.lineNumbers || markers) {
          var wrap$1 = ensureLineWrapped(lineView);
          var gutterWrap = lineView.gutter = elt("div", null, "CodeMirror-gutter-wrapper", "left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px");
          gutterWrap.setAttribute("aria-hidden", "true");
          cm.display.input.setUneditable(gutterWrap);
          wrap$1.insertBefore(gutterWrap, lineView.text);
          if (lineView.line.gutterClass) {
            gutterWrap.className += " " + lineView.line.gutterClass;
          }
          if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"])) {
            lineView.lineNumber = gutterWrap.appendChild(
              elt(
                "div",
                lineNumberFor(cm.options, lineN),
                "CodeMirror-linenumber CodeMirror-gutter-elt",
                "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + cm.display.lineNumInnerWidth + "px"
              )
            );
          }
          if (markers) {
            for (var k = 0; k < cm.display.gutterSpecs.length; ++k) {
              var id = cm.display.gutterSpecs[k].className, found = markers.hasOwnProperty(id) && markers[id];
              if (found) {
                gutterWrap.appendChild(elt(
                  "div",
                  [found],
                  "CodeMirror-gutter-elt",
                  "left: " + dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"
                ));
              }
            }
          }
        }
      }
      function updateLineWidgets(cm, lineView, dims) {
        if (lineView.alignable) {
          lineView.alignable = null;
        }
        var isWidget = classTest("CodeMirror-linewidget");
        for (var node = lineView.node.firstChild, next = void 0; node; node = next) {
          next = node.nextSibling;
          if (isWidget.test(node.className)) {
            lineView.node.removeChild(node);
          }
        }
        insertLineWidgets(cm, lineView, dims);
      }
      function buildLineElement(cm, lineView, lineN, dims) {
        var built = getLineContent(cm, lineView);
        lineView.text = lineView.node = built.pre;
        if (built.bgClass) {
          lineView.bgClass = built.bgClass;
        }
        if (built.textClass) {
          lineView.textClass = built.textClass;
        }
        updateLineClasses(cm, lineView);
        updateLineGutter(cm, lineView, lineN, dims);
        insertLineWidgets(cm, lineView, dims);
        return lineView.node;
      }
      function insertLineWidgets(cm, lineView, dims) {
        insertLineWidgetsFor(cm, lineView.line, lineView, dims, true);
        if (lineView.rest) {
          for (var i2 = 0; i2 < lineView.rest.length; i2++) {
            insertLineWidgetsFor(cm, lineView.rest[i2], lineView, dims, false);
          }
        }
      }
      function insertLineWidgetsFor(cm, line, lineView, dims, allowAbove) {
        if (!line.widgets) {
          return;
        }
        var wrap = ensureLineWrapped(lineView);
        for (var i2 = 0, ws = line.widgets; i2 < ws.length; ++i2) {
          var widget = ws[i2], node = elt("div", [widget.node], "CodeMirror-linewidget" + (widget.className ? " " + widget.className : ""));
          if (!widget.handleMouseEvents) {
            node.setAttribute("cm-ignore-events", "true");
          }
          positionLineWidget(widget, node, lineView, dims);
          cm.display.input.setUneditable(node);
          if (allowAbove && widget.above) {
            wrap.insertBefore(node, lineView.gutter || lineView.text);
          } else {
            wrap.appendChild(node);
          }
          signalLater(widget, "redraw");
        }
      }
      function positionLineWidget(widget, node, lineView, dims) {
        if (widget.noHScroll) {
          (lineView.alignable || (lineView.alignable = [])).push(node);
          var width = dims.wrapperWidth;
          node.style.left = dims.fixedPos + "px";
          if (!widget.coverGutter) {
            width -= dims.gutterTotalWidth;
            node.style.paddingLeft = dims.gutterTotalWidth + "px";
          }
          node.style.width = width + "px";
        }
        if (widget.coverGutter) {
          node.style.zIndex = 5;
          node.style.position = "relative";
          if (!widget.noHScroll) {
            node.style.marginLeft = -dims.gutterTotalWidth + "px";
          }
        }
      }
      function widgetHeight(widget) {
        if (widget.height != null) {
          return widget.height;
        }
        var cm = widget.doc.cm;
        if (!cm) {
          return 0;
        }
        if (!contains(document.body, widget.node)) {
          var parentStyle = "position: relative;";
          if (widget.coverGutter) {
            parentStyle += "margin-left: -" + cm.display.gutters.offsetWidth + "px;";
          }
          if (widget.noHScroll) {
            parentStyle += "width: " + cm.display.wrapper.clientWidth + "px;";
          }
          removeChildrenAndAdd(cm.display.measure, elt("div", [widget.node], null, parentStyle));
        }
        return widget.height = widget.node.parentNode.offsetHeight;
      }
      function eventInWidget(display, e) {
        for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {
          if (!n || n.nodeType == 1 && n.getAttribute("cm-ignore-events") == "true" || n.parentNode == display.sizer && n != display.mover) {
            return true;
          }
        }
      }
      function paddingTop(display) {
        return display.lineSpace.offsetTop;
      }
      function paddingVert(display) {
        return display.mover.offsetHeight - display.lineSpace.offsetHeight;
      }
      function paddingH(display) {
        if (display.cachedPaddingH) {
          return display.cachedPaddingH;
        }
        var e = removeChildrenAndAdd(display.measure, elt("pre", "x", "CodeMirror-line-like"));
        var style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
        var data = { left: parseInt(style.paddingLeft), right: parseInt(style.paddingRight) };
        if (!isNaN(data.left) && !isNaN(data.right)) {
          display.cachedPaddingH = data;
        }
        return data;
      }
      function scrollGap(cm) {
        return scrollerGap - cm.display.nativeBarWidth;
      }
      function displayWidth(cm) {
        return cm.display.scroller.clientWidth - scrollGap(cm) - cm.display.barWidth;
      }
      function displayHeight(cm) {
        return cm.display.scroller.clientHeight - scrollGap(cm) - cm.display.barHeight;
      }
      function ensureLineHeights(cm, lineView, rect) {
        var wrapping = cm.options.lineWrapping;
        var curWidth = wrapping && displayWidth(cm);
        if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
          var heights = lineView.measure.heights = [];
          if (wrapping) {
            lineView.measure.width = curWidth;
            var rects = lineView.text.firstChild.getClientRects();
            for (var i2 = 0; i2 < rects.length - 1; i2++) {
              var cur = rects[i2], next = rects[i2 + 1];
              if (Math.abs(cur.bottom - next.bottom) > 2) {
                heights.push((cur.bottom + next.top) / 2 - rect.top);
              }
            }
          }
          heights.push(rect.bottom - rect.top);
        }
      }
      function mapFromLineView(lineView, line, lineN) {
        if (lineView.line == line) {
          return { map: lineView.measure.map, cache: lineView.measure.cache };
        }
        if (lineView.rest) {
          for (var i2 = 0; i2 < lineView.rest.length; i2++) {
            if (lineView.rest[i2] == line) {
              return { map: lineView.measure.maps[i2], cache: lineView.measure.caches[i2] };
            }
          }
          for (var i$12 = 0; i$12 < lineView.rest.length; i$12++) {
            if (lineNo(lineView.rest[i$12]) > lineN) {
              return { map: lineView.measure.maps[i$12], cache: lineView.measure.caches[i$12], before: true };
            }
          }
        }
      }
      function updateExternalMeasurement(cm, line) {
        line = visualLine(line);
        var lineN = lineNo(line);
        var view = cm.display.externalMeasured = new LineView(cm.doc, line, lineN);
        view.lineN = lineN;
        var built = view.built = buildLineContent(cm, view);
        view.text = built.pre;
        removeChildrenAndAdd(cm.display.lineMeasure, built.pre);
        return view;
      }
      function measureChar(cm, line, ch, bias) {
        return measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias);
      }
      function findViewForLine(cm, lineN) {
        if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo) {
          return cm.display.view[findViewIndex(cm, lineN)];
        }
        var ext = cm.display.externalMeasured;
        if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size) {
          return ext;
        }
      }
      function prepareMeasureForLine(cm, line) {
        var lineN = lineNo(line);
        var view = findViewForLine(cm, lineN);
        if (view && !view.text) {
          view = null;
        } else if (view && view.changes) {
          updateLineForChanges(cm, view, lineN, getDimensions(cm));
          cm.curOp.forceUpdate = true;
        }
        if (!view) {
          view = updateExternalMeasurement(cm, line);
        }
        var info = mapFromLineView(view, line, lineN);
        return {
          line,
          view,
          rect: null,
          map: info.map,
          cache: info.cache,
          before: info.before,
          hasHeights: false
        };
      }
      function measureCharPrepared(cm, prepared, ch, bias, varHeight) {
        if (prepared.before) {
          ch = -1;
        }
        var key2 = ch + (bias || ""), found;
        if (prepared.cache.hasOwnProperty(key2)) {
          found = prepared.cache[key2];
        } else {
          if (!prepared.rect) {
            prepared.rect = prepared.view.text.getBoundingClientRect();
          }
          if (!prepared.hasHeights) {
            ensureLineHeights(cm, prepared.view, prepared.rect);
            prepared.hasHeights = true;
          }
          found = measureCharInner(cm, prepared, ch, bias);
          if (!found.bogus) {
            prepared.cache[key2] = found;
          }
        }
        return {
          left: found.left,
          right: found.right,
          top: varHeight ? found.rtop : found.top,
          bottom: varHeight ? found.rbottom : found.bottom
        };
      }
      var nullRect = { left: 0, right: 0, top: 0, bottom: 0 };
      function nodeAndOffsetInLineMap(map2, ch, bias) {
        var node, start, end, collapse, mStart, mEnd;
        for (var i2 = 0; i2 < map2.length; i2 += 3) {
          mStart = map2[i2];
          mEnd = map2[i2 + 1];
          if (ch < mStart) {
            start = 0;
            end = 1;
            collapse = "left";
          } else if (ch < mEnd) {
            start = ch - mStart;
            end = start + 1;
          } else if (i2 == map2.length - 3 || ch == mEnd && map2[i2 + 3] > ch) {
            end = mEnd - mStart;
            start = end - 1;
            if (ch >= mEnd) {
              collapse = "right";
            }
          }
          if (start != null) {
            node = map2[i2 + 2];
            if (mStart == mEnd && bias == (node.insertLeft ? "left" : "right")) {
              collapse = bias;
            }
            if (bias == "left" && start == 0) {
              while (i2 && map2[i2 - 2] == map2[i2 - 3] && map2[i2 - 1].insertLeft) {
                node = map2[(i2 -= 3) + 2];
                collapse = "left";
              }
            }
            if (bias == "right" && start == mEnd - mStart) {
              while (i2 < map2.length - 3 && map2[i2 + 3] == map2[i2 + 4] && !map2[i2 + 5].insertLeft) {
                node = map2[(i2 += 3) + 2];
                collapse = "right";
              }
            }
            break;
          }
        }
        return { node, start, end, collapse, coverStart: mStart, coverEnd: mEnd };
      }
      function getUsefulRect(rects, bias) {
        var rect = nullRect;
        if (bias == "left") {
          for (var i2 = 0; i2 < rects.length; i2++) {
            if ((rect = rects[i2]).left != rect.right) {
              break;
            }
          }
        } else {
          for (var i$12 = rects.length - 1; i$12 >= 0; i$12--) {
            if ((rect = rects[i$12]).left != rect.right) {
              break;
            }
          }
        }
        return rect;
      }
      function measureCharInner(cm, prepared, ch, bias) {
        var place = nodeAndOffsetInLineMap(prepared.map, ch, bias);
        var node = place.node, start = place.start, end = place.end, collapse = place.collapse;
        var rect;
        if (node.nodeType == 3) {
          for (var i$12 = 0; i$12 < 4; i$12++) {
            while (start && isExtendingChar(prepared.line.text.charAt(place.coverStart + start))) {
              --start;
            }
            while (place.coverStart + end < place.coverEnd && isExtendingChar(prepared.line.text.charAt(place.coverStart + end))) {
              ++end;
            }
            if (ie && ie_version < 9 && start == 0 && end == place.coverEnd - place.coverStart) {
              rect = node.parentNode.getBoundingClientRect();
            } else {
              rect = getUsefulRect(range(node, start, end).getClientRects(), bias);
            }
            if (rect.left || rect.right || start == 0) {
              break;
            }
            end = start;
            start = start - 1;
            collapse = "right";
          }
          if (ie && ie_version < 11) {
            rect = maybeUpdateRectForZooming(cm.display.measure, rect);
          }
        } else {
          if (start > 0) {
            collapse = bias = "right";
          }
          var rects;
          if (cm.options.lineWrapping && (rects = node.getClientRects()).length > 1) {
            rect = rects[bias == "right" ? rects.length - 1 : 0];
          } else {
            rect = node.getBoundingClientRect();
          }
        }
        if (ie && ie_version < 9 && !start && (!rect || !rect.left && !rect.right)) {
          var rSpan = node.parentNode.getClientRects()[0];
          if (rSpan) {
            rect = { left: rSpan.left, right: rSpan.left + charWidth(cm.display), top: rSpan.top, bottom: rSpan.bottom };
          } else {
            rect = nullRect;
          }
        }
        var rtop = rect.top - prepared.rect.top, rbot = rect.bottom - prepared.rect.top;
        var mid = (rtop + rbot) / 2;
        var heights = prepared.view.measure.heights;
        var i2 = 0;
        for (; i2 < heights.length - 1; i2++) {
          if (mid < heights[i2]) {
            break;
          }
        }
        var top = i2 ? heights[i2 - 1] : 0, bot = heights[i2];
        var result = {
          left: (collapse == "right" ? rect.right : rect.left) - prepared.rect.left,
          right: (collapse == "left" ? rect.left : rect.right) - prepared.rect.left,
          top,
          bottom: bot
        };
        if (!rect.left && !rect.right) {
          result.bogus = true;
        }
        if (!cm.options.singleCursorHeightPerLine) {
          result.rtop = rtop;
          result.rbottom = rbot;
        }
        return result;
      }
      function maybeUpdateRectForZooming(measure, rect) {
        if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !hasBadZoomedRects(measure)) {
          return rect;
        }
        var scaleX = screen.logicalXDPI / screen.deviceXDPI;
        var scaleY = screen.logicalYDPI / screen.deviceYDPI;
        return {
          left: rect.left * scaleX,
          right: rect.right * scaleX,
          top: rect.top * scaleY,
          bottom: rect.bottom * scaleY
        };
      }
      function clearLineMeasurementCacheFor(lineView) {
        if (lineView.measure) {
          lineView.measure.cache = {};
          lineView.measure.heights = null;
          if (lineView.rest) {
            for (var i2 = 0; i2 < lineView.rest.length; i2++) {
              lineView.measure.caches[i2] = {};
            }
          }
        }
      }
      function clearLineMeasurementCache(cm) {
        cm.display.externalMeasure = null;
        removeChildren(cm.display.lineMeasure);
        for (var i2 = 0; i2 < cm.display.view.length; i2++) {
          clearLineMeasurementCacheFor(cm.display.view[i2]);
        }
      }
      function clearCaches(cm) {
        clearLineMeasurementCache(cm);
        cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null;
        if (!cm.options.lineWrapping) {
          cm.display.maxLineChanged = true;
        }
        cm.display.lineNumChars = null;
      }
      function pageScrollX(doc2) {
        if (chrome && android) {
          return -(doc2.body.getBoundingClientRect().left - parseInt(getComputedStyle(doc2.body).marginLeft));
        }
        return doc2.defaultView.pageXOffset || (doc2.documentElement || doc2.body).scrollLeft;
      }
      function pageScrollY(doc2) {
        if (chrome && android) {
          return -(doc2.body.getBoundingClientRect().top - parseInt(getComputedStyle(doc2.body).marginTop));
        }
        return doc2.defaultView.pageYOffset || (doc2.documentElement || doc2.body).scrollTop;
      }
      function widgetTopHeight(lineObj) {
        var ref2 = visualLine(lineObj);
        var widgets = ref2.widgets;
        var height = 0;
        if (widgets) {
          for (var i2 = 0; i2 < widgets.length; ++i2) {
            if (widgets[i2].above) {
              height += widgetHeight(widgets[i2]);
            }
          }
        }
        return height;
      }
      function intoCoordSystem(cm, lineObj, rect, context, includeWidgets) {
        if (!includeWidgets) {
          var height = widgetTopHeight(lineObj);
          rect.top += height;
          rect.bottom += height;
        }
        if (context == "line") {
          return rect;
        }
        if (!context) {
          context = "local";
        }
        var yOff = heightAtLine(lineObj);
        if (context == "local") {
          yOff += paddingTop(cm.display);
        } else {
          yOff -= cm.display.viewOffset;
        }
        if (context == "page" || context == "window") {
          var lOff = cm.display.lineSpace.getBoundingClientRect();
          yOff += lOff.top + (context == "window" ? 0 : pageScrollY(doc(cm)));
          var xOff = lOff.left + (context == "window" ? 0 : pageScrollX(doc(cm)));
          rect.left += xOff;
          rect.right += xOff;
        }
        rect.top += yOff;
        rect.bottom += yOff;
        return rect;
      }
      function fromCoordSystem(cm, coords, context) {
        if (context == "div") {
          return coords;
        }
        var left = coords.left, top = coords.top;
        if (context == "page") {
          left -= pageScrollX(doc(cm));
          top -= pageScrollY(doc(cm));
        } else if (context == "local" || !context) {
          var localBox = cm.display.sizer.getBoundingClientRect();
          left += localBox.left;
          top += localBox.top;
        }
        var lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
        return { left: left - lineSpaceBox.left, top: top - lineSpaceBox.top };
      }
      function charCoords(cm, pos, context, lineObj, bias) {
        if (!lineObj) {
          lineObj = getLine(cm.doc, pos.line);
        }
        return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, bias), context);
      }
      function cursorCoords(cm, pos, context, lineObj, preparedMeasure, varHeight) {
        lineObj = lineObj || getLine(cm.doc, pos.line);
        if (!preparedMeasure) {
          preparedMeasure = prepareMeasureForLine(cm, lineObj);
        }
        function get(ch2, right) {
          var m = measureCharPrepared(cm, preparedMeasure, ch2, right ? "right" : "left", varHeight);
          if (right) {
            m.left = m.right;
          } else {
            m.right = m.left;
          }
          return intoCoordSystem(cm, lineObj, m, context);
        }
        var order = getOrder(lineObj, cm.doc.direction), ch = pos.ch, sticky = pos.sticky;
        if (ch >= lineObj.text.length) {
          ch = lineObj.text.length;
          sticky = "before";
        } else if (ch <= 0) {
          ch = 0;
          sticky = "after";
        }
        if (!order) {
          return get(sticky == "before" ? ch - 1 : ch, sticky == "before");
        }
        function getBidi(ch2, partPos2, invert) {
          var part = order[partPos2], right = part.level == 1;
          return get(invert ? ch2 - 1 : ch2, right != invert);
        }
        var partPos = getBidiPartAt(order, ch, sticky);
        var other = bidiOther;
        var val = getBidi(ch, partPos, sticky == "before");
        if (other != null) {
          val.other = getBidi(ch, other, sticky != "before");
        }
        return val;
      }
      function estimateCoords(cm, pos) {
        var left = 0;
        pos = clipPos(cm.doc, pos);
        if (!cm.options.lineWrapping) {
          left = charWidth(cm.display) * pos.ch;
        }
        var lineObj = getLine(cm.doc, pos.line);
        var top = heightAtLine(lineObj) + paddingTop(cm.display);
        return { left, right: left, top, bottom: top + lineObj.height };
      }
      function PosWithInfo(line, ch, sticky, outside, xRel) {
        var pos = Pos(line, ch, sticky);
        pos.xRel = xRel;
        if (outside) {
          pos.outside = outside;
        }
        return pos;
      }
      function coordsChar(cm, x, y) {
        var doc2 = cm.doc;
        y += cm.display.viewOffset;
        if (y < 0) {
          return PosWithInfo(doc2.first, 0, null, -1, -1);
        }
        var lineN = lineAtHeight(doc2, y), last = doc2.first + doc2.size - 1;
        if (lineN > last) {
          return PosWithInfo(doc2.first + doc2.size - 1, getLine(doc2, last).text.length, null, 1, 1);
        }
        if (x < 0) {
          x = 0;
        }
        var lineObj = getLine(doc2, lineN);
        for (; ; ) {
          var found = coordsCharInner(cm, lineObj, lineN, x, y);
          var collapsed = collapsedSpanAround(lineObj, found.ch + (found.xRel > 0 || found.outside > 0 ? 1 : 0));
          if (!collapsed) {
            return found;
          }
          var rangeEnd = collapsed.find(1);
          if (rangeEnd.line == lineN) {
            return rangeEnd;
          }
          lineObj = getLine(doc2, lineN = rangeEnd.line);
        }
      }
      function wrappedLineExtent(cm, lineObj, preparedMeasure, y) {
        y -= widgetTopHeight(lineObj);
        var end = lineObj.text.length;
        var begin = findFirst(function(ch) {
          return measureCharPrepared(cm, preparedMeasure, ch - 1).bottom <= y;
        }, end, 0);
        end = findFirst(function(ch) {
          return measureCharPrepared(cm, preparedMeasure, ch).top > y;
        }, begin, end);
        return { begin, end };
      }
      function wrappedLineExtentChar(cm, lineObj, preparedMeasure, target) {
        if (!preparedMeasure) {
          preparedMeasure = prepareMeasureForLine(cm, lineObj);
        }
        var targetTop = intoCoordSystem(cm, lineObj, measureCharPrepared(cm, preparedMeasure, target), "line").top;
        return wrappedLineExtent(cm, lineObj, preparedMeasure, targetTop);
      }
      function boxIsAfter(box, x, y, left) {
        return box.bottom <= y ? false : box.top > y ? true : (left ? box.left : box.right) > x;
      }
      function coordsCharInner(cm, lineObj, lineNo2, x, y) {
        y -= heightAtLine(lineObj);
        var preparedMeasure = prepareMeasureForLine(cm, lineObj);
        var widgetHeight2 = widgetTopHeight(lineObj);
        var begin = 0, end = lineObj.text.length, ltr = true;
        var order = getOrder(lineObj, cm.doc.direction);
        if (order) {
          var part = (cm.options.lineWrapping ? coordsBidiPartWrapped : coordsBidiPart)(cm, lineObj, lineNo2, preparedMeasure, order, x, y);
          ltr = part.level != 1;
          begin = ltr ? part.from : part.to - 1;
          end = ltr ? part.to : part.from - 1;
        }
        var chAround = null, boxAround = null;
        var ch = findFirst(function(ch2) {
          var box = measureCharPrepared(cm, preparedMeasure, ch2);
          box.top += widgetHeight2;
          box.bottom += widgetHeight2;
          if (!boxIsAfter(box, x, y, false)) {
            return false;
          }
          if (box.top <= y && box.left <= x) {
            chAround = ch2;
            boxAround = box;
          }
          return true;
        }, begin, end);
        var baseX, sticky, outside = false;
        if (boxAround) {
          var atLeft = x - boxAround.left < boxAround.right - x, atStart = atLeft == ltr;
          ch = chAround + (atStart ? 0 : 1);
          sticky = atStart ? "after" : "before";
          baseX = atLeft ? boxAround.left : boxAround.right;
        } else {
          if (!ltr && (ch == end || ch == begin)) {
            ch++;
          }
          sticky = ch == 0 ? "after" : ch == lineObj.text.length ? "before" : measureCharPrepared(cm, preparedMeasure, ch - (ltr ? 1 : 0)).bottom + widgetHeight2 <= y == ltr ? "after" : "before";
          var coords = cursorCoords(cm, Pos(lineNo2, ch, sticky), "line", lineObj, preparedMeasure);
          baseX = coords.left;
          outside = y < coords.top ? -1 : y >= coords.bottom ? 1 : 0;
        }
        ch = skipExtendingChars(lineObj.text, ch, 1);
        return PosWithInfo(lineNo2, ch, sticky, outside, x - baseX);
      }
      function coordsBidiPart(cm, lineObj, lineNo2, preparedMeasure, order, x, y) {
        var index2 = findFirst(function(i2) {
          var part2 = order[i2], ltr2 = part2.level != 1;
          return boxIsAfter(cursorCoords(
            cm,
            Pos(lineNo2, ltr2 ? part2.to : part2.from, ltr2 ? "before" : "after"),
            "line",
            lineObj,
            preparedMeasure
          ), x, y, true);
        }, 0, order.length - 1);
        var part = order[index2];
        if (index2 > 0) {
          var ltr = part.level != 1;
          var start = cursorCoords(
            cm,
            Pos(lineNo2, ltr ? part.from : part.to, ltr ? "after" : "before"),
            "line",
            lineObj,
            preparedMeasure
          );
          if (boxIsAfter(start, x, y, true) && start.top > y) {
            part = order[index2 - 1];
          }
        }
        return part;
      }
      function coordsBidiPartWrapped(cm, lineObj, _lineNo, preparedMeasure, order, x, y) {
        var ref2 = wrappedLineExtent(cm, lineObj, preparedMeasure, y);
        var begin = ref2.begin;
        var end = ref2.end;
        if (/\s/.test(lineObj.text.charAt(end - 1))) {
          end--;
        }
        var part = null, closestDist = null;
        for (var i2 = 0; i2 < order.length; i2++) {
          var p = order[i2];
          if (p.from >= end || p.to <= begin) {
            continue;
          }
          var ltr = p.level != 1;
          var endX = measureCharPrepared(cm, preparedMeasure, ltr ? Math.min(end, p.to) - 1 : Math.max(begin, p.from)).right;
          var dist = endX < x ? x - endX + 1e9 : endX - x;
          if (!part || closestDist > dist) {
            part = p;
            closestDist = dist;
          }
        }
        if (!part) {
          part = order[order.length - 1];
        }
        if (part.from < begin) {
          part = { from: begin, to: part.to, level: part.level };
        }
        if (part.to > end) {
          part = { from: part.from, to: end, level: part.level };
        }
        return part;
      }
      var measureText;
      function textHeight(display) {
        if (display.cachedTextHeight != null) {
          return display.cachedTextHeight;
        }
        if (measureText == null) {
          measureText = elt("pre", null, "CodeMirror-line-like");
          for (var i2 = 0; i2 < 49; ++i2) {
            measureText.appendChild(document.createTextNode("x"));
            measureText.appendChild(elt("br"));
          }
          measureText.appendChild(document.createTextNode("x"));
        }
        removeChildrenAndAdd(display.measure, measureText);
        var height = measureText.offsetHeight / 50;
        if (height > 3) {
          display.cachedTextHeight = height;
        }
        removeChildren(display.measure);
        return height || 1;
      }
      function charWidth(display) {
        if (display.cachedCharWidth != null) {
          return display.cachedCharWidth;
        }
        var anchor = elt("span", "xxxxxxxxxx");
        var pre = elt("pre", [anchor], "CodeMirror-line-like");
        removeChildrenAndAdd(display.measure, pre);
        var rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
        if (width > 2) {
          display.cachedCharWidth = width;
        }
        return width || 10;
      }
      function getDimensions(cm) {
        var d = cm.display, left = {}, width = {};
        var gutterLeft = d.gutters.clientLeft;
        for (var n = d.gutters.firstChild, i2 = 0; n; n = n.nextSibling, ++i2) {
          var id = cm.display.gutterSpecs[i2].className;
          left[id] = n.offsetLeft + n.clientLeft + gutterLeft;
          width[id] = n.clientWidth;
        }
        return {
          fixedPos: compensateForHScroll(d),
          gutterTotalWidth: d.gutters.offsetWidth,
          gutterLeft: left,
          gutterWidth: width,
          wrapperWidth: d.wrapper.clientWidth
        };
      }
      function compensateForHScroll(display) {
        return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
      }
      function estimateHeight(cm) {
        var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
        var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
        return function(line) {
          if (lineIsHidden(cm.doc, line)) {
            return 0;
          }
          var widgetsHeight = 0;
          if (line.widgets) {
            for (var i2 = 0; i2 < line.widgets.length; i2++) {
              if (line.widgets[i2].height) {
                widgetsHeight += line.widgets[i2].height;
              }
            }
          }
          if (wrapping) {
            return widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th;
          } else {
            return widgetsHeight + th;
          }
        };
      }
      function estimateLineHeights(cm) {
        var doc2 = cm.doc, est = estimateHeight(cm);
        doc2.iter(function(line) {
          var estHeight = est(line);
          if (estHeight != line.height) {
            updateLineHeight(line, estHeight);
          }
        });
      }
      function posFromMouse(cm, e, liberal, forRect) {
        var display = cm.display;
        if (!liberal && e_target(e).getAttribute("cm-not-content") == "true") {
          return null;
        }
        var x, y, space = display.lineSpace.getBoundingClientRect();
        try {
          x = e.clientX - space.left;
          y = e.clientY - space.top;
        } catch (e$1) {
          return null;
        }
        var coords = coordsChar(cm, x, y), line;
        if (forRect && coords.xRel > 0 && (line = getLine(cm.doc, coords.line).text).length == coords.ch) {
          var colDiff = countColumn(line, line.length, cm.options.tabSize) - line.length;
          coords = Pos(coords.line, Math.max(0, Math.round((x - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
        }
        return coords;
      }
      function findViewIndex(cm, n) {
        if (n >= cm.display.viewTo) {
          return null;
        }
        n -= cm.display.viewFrom;
        if (n < 0) {
          return null;
        }
        var view = cm.display.view;
        for (var i2 = 0; i2 < view.length; i2++) {
          n -= view[i2].size;
          if (n < 0) {
            return i2;
          }
        }
      }
      function regChange(cm, from, to, lendiff) {
        if (from == null) {
          from = cm.doc.first;
        }
        if (to == null) {
          to = cm.doc.first + cm.doc.size;
        }
        if (!lendiff) {
          lendiff = 0;
        }
        var display = cm.display;
        if (lendiff && to < display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers > from)) {
          display.updateLineNumbers = from;
        }
        cm.curOp.viewChanged = true;
        if (from >= display.viewTo) {
          if (sawCollapsedSpans && visualLineNo(cm.doc, from) < display.viewTo) {
            resetView(cm);
          }
        } else if (to <= display.viewFrom) {
          if (sawCollapsedSpans && visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) {
            resetView(cm);
          } else {
            display.viewFrom += lendiff;
            display.viewTo += lendiff;
          }
        } else if (from <= display.viewFrom && to >= display.viewTo) {
          resetView(cm);
        } else if (from <= display.viewFrom) {
          var cut = viewCuttingPoint(cm, to, to + lendiff, 1);
          if (cut) {
            display.view = display.view.slice(cut.index);
            display.viewFrom = cut.lineN;
            display.viewTo += lendiff;
          } else {
            resetView(cm);
          }
        } else if (to >= display.viewTo) {
          var cut$1 = viewCuttingPoint(cm, from, from, -1);
          if (cut$1) {
            display.view = display.view.slice(0, cut$1.index);
            display.viewTo = cut$1.lineN;
          } else {
            resetView(cm);
          }
        } else {
          var cutTop = viewCuttingPoint(cm, from, from, -1);
          var cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);
          if (cutTop && cutBot) {
            display.view = display.view.slice(0, cutTop.index).concat(buildViewArray(cm, cutTop.lineN, cutBot.lineN)).concat(display.view.slice(cutBot.index));
            display.viewTo += lendiff;
          } else {
            resetView(cm);
          }
        }
        var ext = display.externalMeasured;
        if (ext) {
          if (to < ext.lineN) {
            ext.lineN += lendiff;
          } else if (from < ext.lineN + ext.size) {
            display.externalMeasured = null;
          }
        }
      }
      function regLineChange(cm, line, type) {
        cm.curOp.viewChanged = true;
        var display = cm.display, ext = cm.display.externalMeasured;
        if (ext && line >= ext.lineN && line < ext.lineN + ext.size) {
          display.externalMeasured = null;
        }
        if (line < display.viewFrom || line >= display.viewTo) {
          return;
        }
        var lineView = display.view[findViewIndex(cm, line)];
        if (lineView.node == null) {
          return;
        }
        var arr = lineView.changes || (lineView.changes = []);
        if (indexOf(arr, type) == -1) {
          arr.push(type);
        }
      }
      function resetView(cm) {
        cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
        cm.display.view = [];
        cm.display.viewOffset = 0;
      }
      function viewCuttingPoint(cm, oldN, newN, dir) {
        var index2 = findViewIndex(cm, oldN), diff2, view = cm.display.view;
        if (!sawCollapsedSpans || newN == cm.doc.first + cm.doc.size) {
          return { index: index2, lineN: newN };
        }
        var n = cm.display.viewFrom;
        for (var i2 = 0; i2 < index2; i2++) {
          n += view[i2].size;
        }
        if (n != oldN) {
          if (dir > 0) {
            if (index2 == view.length - 1) {
              return null;
            }
            diff2 = n + view[index2].size - oldN;
            index2++;
          } else {
            diff2 = n - oldN;
          }
          oldN += diff2;
          newN += diff2;
        }
        while (visualLineNo(cm.doc, newN) != newN) {
          if (index2 == (dir < 0 ? 0 : view.length - 1)) {
            return null;
          }
          newN += dir * view[index2 - (dir < 0 ? 1 : 0)].size;
          index2 += dir;
        }
        return { index: index2, lineN: newN };
      }
      function adjustView(cm, from, to) {
        var display = cm.display, view = display.view;
        if (view.length == 0 || from >= display.viewTo || to <= display.viewFrom) {
          display.view = buildViewArray(cm, from, to);
          display.viewFrom = from;
        } else {
          if (display.viewFrom > from) {
            display.view = buildViewArray(cm, from, display.viewFrom).concat(display.view);
          } else if (display.viewFrom < from) {
            display.view = display.view.slice(findViewIndex(cm, from));
          }
          display.viewFrom = from;
          if (display.viewTo < to) {
            display.view = display.view.concat(buildViewArray(cm, display.viewTo, to));
          } else if (display.viewTo > to) {
            display.view = display.view.slice(0, findViewIndex(cm, to));
          }
        }
        display.viewTo = to;
      }
      function countDirtyView(cm) {
        var view = cm.display.view, dirty = 0;
        for (var i2 = 0; i2 < view.length; i2++) {
          var lineView = view[i2];
          if (!lineView.hidden && (!lineView.node || lineView.changes)) {
            ++dirty;
          }
        }
        return dirty;
      }
      function updateSelection(cm) {
        cm.display.input.showSelection(cm.display.input.prepareSelection());
      }
      function prepareSelection(cm, primary) {
        if (primary === void 0) primary = true;
        var doc2 = cm.doc, result = {};
        var curFragment = result.cursors = document.createDocumentFragment();
        var selFragment = result.selection = document.createDocumentFragment();
        var customCursor = cm.options.$customCursor;
        if (customCursor) {
          primary = true;
        }
        for (var i2 = 0; i2 < doc2.sel.ranges.length; i2++) {
          if (!primary && i2 == doc2.sel.primIndex) {
            continue;
          }
          var range2 = doc2.sel.ranges[i2];
          if (range2.from().line >= cm.display.viewTo || range2.to().line < cm.display.viewFrom) {
            continue;
          }
          var collapsed = range2.empty();
          if (customCursor) {
            var head = customCursor(cm, range2);
            if (head) {
              drawSelectionCursor(cm, head, curFragment);
            }
          } else if (collapsed || cm.options.showCursorWhenSelecting) {
            drawSelectionCursor(cm, range2.head, curFragment);
          }
          if (!collapsed) {
            drawSelectionRange(cm, range2, selFragment);
          }
        }
        return result;
      }
      function drawSelectionCursor(cm, head, output) {
        var pos = cursorCoords(cm, head, "div", null, null, !cm.options.singleCursorHeightPerLine);
        var cursor = output.appendChild(elt("div", "\xA0", "CodeMirror-cursor"));
        cursor.style.left = pos.left + "px";
        cursor.style.top = pos.top + "px";
        cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";
        if (/\bcm-fat-cursor\b/.test(cm.getWrapperElement().className)) {
          var charPos = charCoords(cm, head, "div", null, null);
          var width = charPos.right - charPos.left;
          cursor.style.width = (width > 0 ? width : cm.defaultCharWidth()) + "px";
        }
        if (pos.other) {
          var otherCursor = output.appendChild(elt("div", "\xA0", "CodeMirror-cursor CodeMirror-secondarycursor"));
          otherCursor.style.display = "";
          otherCursor.style.left = pos.other.left + "px";
          otherCursor.style.top = pos.other.top + "px";
          otherCursor.style.height = (pos.other.bottom - pos.other.top) * 0.85 + "px";
        }
      }
      function cmpCoords(a, b) {
        return a.top - b.top || a.left - b.left;
      }
      function drawSelectionRange(cm, range2, output) {
        var display = cm.display, doc2 = cm.doc;
        var fragment = document.createDocumentFragment();
        var padding = paddingH(cm.display), leftSide = padding.left;
        var rightSide = Math.max(display.sizerWidth, displayWidth(cm) - display.sizer.offsetLeft) - padding.right;
        var docLTR = doc2.direction == "ltr";
        function add(left, top, width, bottom) {
          if (top < 0) {
            top = 0;
          }
          top = Math.round(top);
          bottom = Math.round(bottom);
          fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left + "px;\n                             top: " + top + "px; width: " + (width == null ? rightSide - left : width) + "px;\n                             height: " + (bottom - top) + "px"));
        }
        function drawForLine(line, fromArg, toArg) {
          var lineObj = getLine(doc2, line);
          var lineLen = lineObj.text.length;
          var start, end;
          function coords(ch, bias) {
            return charCoords(cm, Pos(line, ch), "div", lineObj, bias);
          }
          function wrapX(pos, dir, side) {
            var extent = wrappedLineExtentChar(cm, lineObj, null, pos);
            var prop2 = dir == "ltr" == (side == "after") ? "left" : "right";
            var ch = side == "after" ? extent.begin : extent.end - (/\s/.test(lineObj.text.charAt(extent.end - 1)) ? 2 : 1);
            return coords(ch, prop2)[prop2];
          }
          var order = getOrder(lineObj, doc2.direction);
          iterateBidiSections(order, fromArg || 0, toArg == null ? lineLen : toArg, function(from, to, dir, i2) {
            var ltr = dir == "ltr";
            var fromPos = coords(from, ltr ? "left" : "right");
            var toPos = coords(to - 1, ltr ? "right" : "left");
            var openStart = fromArg == null && from == 0, openEnd = toArg == null && to == lineLen;
            var first = i2 == 0, last = !order || i2 == order.length - 1;
            if (toPos.top - fromPos.top <= 3) {
              var openLeft = (docLTR ? openStart : openEnd) && first;
              var openRight = (docLTR ? openEnd : openStart) && last;
              var left = openLeft ? leftSide : (ltr ? fromPos : toPos).left;
              var right = openRight ? rightSide : (ltr ? toPos : fromPos).right;
              add(left, fromPos.top, right - left, fromPos.bottom);
            } else {
              var topLeft, topRight, botLeft, botRight;
              if (ltr) {
                topLeft = docLTR && openStart && first ? leftSide : fromPos.left;
                topRight = docLTR ? rightSide : wrapX(from, dir, "before");
                botLeft = docLTR ? leftSide : wrapX(to, dir, "after");
                botRight = docLTR && openEnd && last ? rightSide : toPos.right;
              } else {
                topLeft = !docLTR ? leftSide : wrapX(from, dir, "before");
                topRight = !docLTR && openStart && first ? rightSide : fromPos.right;
                botLeft = !docLTR && openEnd && last ? leftSide : toPos.left;
                botRight = !docLTR ? rightSide : wrapX(to, dir, "after");
              }
              add(topLeft, fromPos.top, topRight - topLeft, fromPos.bottom);
              if (fromPos.bottom < toPos.top) {
                add(leftSide, fromPos.bottom, null, toPos.top);
              }
              add(botLeft, toPos.top, botRight - botLeft, toPos.bottom);
            }
            if (!start || cmpCoords(fromPos, start) < 0) {
              start = fromPos;
            }
            if (cmpCoords(toPos, start) < 0) {
              start = toPos;
            }
            if (!end || cmpCoords(fromPos, end) < 0) {
              end = fromPos;
            }
            if (cmpCoords(toPos, end) < 0) {
              end = toPos;
            }
          });
          return { start, end };
        }
        var sFrom = range2.from(), sTo = range2.to();
        if (sFrom.line == sTo.line) {
          drawForLine(sFrom.line, sFrom.ch, sTo.ch);
        } else {
          var fromLine = getLine(doc2, sFrom.line), toLine = getLine(doc2, sTo.line);
          var singleVLine = visualLine(fromLine) == visualLine(toLine);
          var leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end;
          var rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;
          if (singleVLine) {
            if (leftEnd.top < rightStart.top - 2) {
              add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
              add(leftSide, rightStart.top, rightStart.left, rightStart.bottom);
            } else {
              add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
            }
          }
          if (leftEnd.bottom < rightStart.top) {
            add(leftSide, leftEnd.bottom, null, rightStart.top);
          }
        }
        output.appendChild(fragment);
      }
      function restartBlink(cm) {
        if (!cm.state.focused) {
          return;
        }
        var display = cm.display;
        clearInterval(display.blinker);
        var on2 = true;
        display.cursorDiv.style.visibility = "";
        if (cm.options.cursorBlinkRate > 0) {
          display.blinker = setInterval(function() {
            if (!cm.hasFocus()) {
              onBlur(cm);
            }
            display.cursorDiv.style.visibility = (on2 = !on2) ? "" : "hidden";
          }, cm.options.cursorBlinkRate);
        } else if (cm.options.cursorBlinkRate < 0) {
          display.cursorDiv.style.visibility = "hidden";
        }
      }
      function ensureFocus(cm) {
        if (!cm.hasFocus()) {
          cm.display.input.focus();
          if (!cm.state.focused) {
            onFocus(cm);
          }
        }
      }
      function delayBlurEvent(cm) {
        cm.state.delayingBlurEvent = true;
        setTimeout(function() {
          if (cm.state.delayingBlurEvent) {
            cm.state.delayingBlurEvent = false;
            if (cm.state.focused) {
              onBlur(cm);
            }
          }
        }, 100);
      }
      function onFocus(cm, e) {
        if (cm.state.delayingBlurEvent && !cm.state.draggingText) {
          cm.state.delayingBlurEvent = false;
        }
        if (cm.options.readOnly == "nocursor") {
          return;
        }
        if (!cm.state.focused) {
          signal(cm, "focus", cm, e);
          cm.state.focused = true;
          addClass(cm.display.wrapper, "CodeMirror-focused");
          if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
            cm.display.input.reset();
            if (webkit) {
              setTimeout(function() {
                return cm.display.input.reset(true);
              }, 20);
            }
          }
          cm.display.input.receivedFocus();
        }
        restartBlink(cm);
      }
      function onBlur(cm, e) {
        if (cm.state.delayingBlurEvent) {
          return;
        }
        if (cm.state.focused) {
          signal(cm, "blur", cm, e);
          cm.state.focused = false;
          rmClass(cm.display.wrapper, "CodeMirror-focused");
        }
        clearInterval(cm.display.blinker);
        setTimeout(function() {
          if (!cm.state.focused) {
            cm.display.shift = false;
          }
        }, 150);
      }
      function updateHeightsInViewport(cm) {
        var display = cm.display;
        var prevBottom = display.lineDiv.offsetTop;
        var viewTop = Math.max(0, display.scroller.getBoundingClientRect().top);
        var oldHeight = display.lineDiv.getBoundingClientRect().top;
        var mustScroll = 0;
        for (var i2 = 0; i2 < display.view.length; i2++) {
          var cur = display.view[i2], wrapping = cm.options.lineWrapping;
          var height = void 0, width = 0;
          if (cur.hidden) {
            continue;
          }
          oldHeight += cur.line.height;
          if (ie && ie_version < 8) {
            var bot = cur.node.offsetTop + cur.node.offsetHeight;
            height = bot - prevBottom;
            prevBottom = bot;
          } else {
            var box = cur.node.getBoundingClientRect();
            height = box.bottom - box.top;
            if (!wrapping && cur.text.firstChild) {
              width = cur.text.firstChild.getBoundingClientRect().right - box.left - 1;
            }
          }
          var diff2 = cur.line.height - height;
          if (diff2 > 5e-3 || diff2 < -5e-3) {
            if (oldHeight < viewTop) {
              mustScroll -= diff2;
            }
            updateLineHeight(cur.line, height);
            updateWidgetHeight(cur.line);
            if (cur.rest) {
              for (var j = 0; j < cur.rest.length; j++) {
                updateWidgetHeight(cur.rest[j]);
              }
            }
          }
          if (width > cm.display.sizerWidth) {
            var chWidth = Math.ceil(width / charWidth(cm.display));
            if (chWidth > cm.display.maxLineLength) {
              cm.display.maxLineLength = chWidth;
              cm.display.maxLine = cur.line;
              cm.display.maxLineChanged = true;
            }
          }
        }
        if (Math.abs(mustScroll) > 2) {
          display.scroller.scrollTop += mustScroll;
        }
      }
      function updateWidgetHeight(line) {
        if (line.widgets) {
          for (var i2 = 0; i2 < line.widgets.length; ++i2) {
            var w = line.widgets[i2], parent = w.node.parentNode;
            if (parent) {
              w.height = parent.offsetHeight;
            }
          }
        }
      }
      function visibleLines(display, doc2, viewport) {
        var top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
        top = Math.floor(top - paddingTop(display));
        var bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;
        var from = lineAtHeight(doc2, top), to = lineAtHeight(doc2, bottom);
        if (viewport && viewport.ensure) {
          var ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
          if (ensureFrom < from) {
            from = ensureFrom;
            to = lineAtHeight(doc2, heightAtLine(getLine(doc2, ensureFrom)) + display.wrapper.clientHeight);
          } else if (Math.min(ensureTo, doc2.lastLine()) >= to) {
            from = lineAtHeight(doc2, heightAtLine(getLine(doc2, ensureTo)) - display.wrapper.clientHeight);
            to = ensureTo;
          }
        }
        return { from, to: Math.max(to, from + 1) };
      }
      function maybeScrollWindow(cm, rect) {
        if (signalDOMEvent(cm, "scrollCursorIntoView")) {
          return;
        }
        var display = cm.display, box = display.sizer.getBoundingClientRect(), doScroll = null;
        var doc2 = display.wrapper.ownerDocument;
        if (rect.top + box.top < 0) {
          doScroll = true;
        } else if (rect.bottom + box.top > (doc2.defaultView.innerHeight || doc2.documentElement.clientHeight)) {
          doScroll = false;
        }
        if (doScroll != null && !phantom) {
          var scrollNode = elt("div", "\u200B", null, "position: absolute;\n                         top: " + (rect.top - display.viewOffset - paddingTop(cm.display)) + "px;\n                         height: " + (rect.bottom - rect.top + scrollGap(cm) + display.barHeight) + "px;\n                         left: " + rect.left + "px; width: " + Math.max(2, rect.right - rect.left) + "px;");
          cm.display.lineSpace.appendChild(scrollNode);
          scrollNode.scrollIntoView(doScroll);
          cm.display.lineSpace.removeChild(scrollNode);
        }
      }
      function scrollPosIntoView(cm, pos, end, margin) {
        if (margin == null) {
          margin = 0;
        }
        var rect;
        if (!cm.options.lineWrapping && pos == end) {
          end = pos.sticky == "before" ? Pos(pos.line, pos.ch + 1, "before") : pos;
          pos = pos.ch ? Pos(pos.line, pos.sticky == "before" ? pos.ch - 1 : pos.ch, "after") : pos;
        }
        for (var limit = 0; limit < 5; limit++) {
          var changed = false;
          var coords = cursorCoords(cm, pos);
          var endCoords = !end || end == pos ? coords : cursorCoords(cm, end);
          rect = {
            left: Math.min(coords.left, endCoords.left),
            top: Math.min(coords.top, endCoords.top) - margin,
            right: Math.max(coords.left, endCoords.left),
            bottom: Math.max(coords.bottom, endCoords.bottom) + margin
          };
          var scrollPos = calculateScrollPos(cm, rect);
          var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
          if (scrollPos.scrollTop != null) {
            updateScrollTop(cm, scrollPos.scrollTop);
            if (Math.abs(cm.doc.scrollTop - startTop) > 1) {
              changed = true;
            }
          }
          if (scrollPos.scrollLeft != null) {
            setScrollLeft(cm, scrollPos.scrollLeft);
            if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) {
              changed = true;
            }
          }
          if (!changed) {
            break;
          }
        }
        return rect;
      }
      function scrollIntoView(cm, rect) {
        var scrollPos = calculateScrollPos(cm, rect);
        if (scrollPos.scrollTop != null) {
          updateScrollTop(cm, scrollPos.scrollTop);
        }
        if (scrollPos.scrollLeft != null) {
          setScrollLeft(cm, scrollPos.scrollLeft);
        }
      }
      function calculateScrollPos(cm, rect) {
        var display = cm.display, snapMargin = textHeight(cm.display);
        if (rect.top < 0) {
          rect.top = 0;
        }
        var screentop = cm.curOp && cm.curOp.scrollTop != null ? cm.curOp.scrollTop : display.scroller.scrollTop;
        var screen2 = displayHeight(cm), result = {};
        if (rect.bottom - rect.top > screen2) {
          rect.bottom = rect.top + screen2;
        }
        var docBottom = cm.doc.height + paddingVert(display);
        var atTop = rect.top < snapMargin, atBottom = rect.bottom > docBottom - snapMargin;
        if (rect.top < screentop) {
          result.scrollTop = atTop ? 0 : rect.top;
        } else if (rect.bottom > screentop + screen2) {
          var newTop = Math.min(rect.top, (atBottom ? docBottom : rect.bottom) - screen2);
          if (newTop != screentop) {
            result.scrollTop = newTop;
          }
        }
        var gutterSpace = cm.options.fixedGutter ? 0 : display.gutters.offsetWidth;
        var screenleft = cm.curOp && cm.curOp.scrollLeft != null ? cm.curOp.scrollLeft : display.scroller.scrollLeft - gutterSpace;
        var screenw = displayWidth(cm) - display.gutters.offsetWidth;
        var tooWide = rect.right - rect.left > screenw;
        if (tooWide) {
          rect.right = rect.left + screenw;
        }
        if (rect.left < 10) {
          result.scrollLeft = 0;
        } else if (rect.left < screenleft) {
          result.scrollLeft = Math.max(0, rect.left + gutterSpace - (tooWide ? 0 : 10));
        } else if (rect.right > screenw + screenleft - 3) {
          result.scrollLeft = rect.right + (tooWide ? 0 : 10) - screenw;
        }
        return result;
      }
      function addToScrollTop(cm, top) {
        if (top == null) {
          return;
        }
        resolveScrollToPos(cm);
        cm.curOp.scrollTop = (cm.curOp.scrollTop == null ? cm.doc.scrollTop : cm.curOp.scrollTop) + top;
      }
      function ensureCursorVisible(cm) {
        resolveScrollToPos(cm);
        var cur = cm.getCursor();
        cm.curOp.scrollToPos = { from: cur, to: cur, margin: cm.options.cursorScrollMargin };
      }
      function scrollToCoords(cm, x, y) {
        if (x != null || y != null) {
          resolveScrollToPos(cm);
        }
        if (x != null) {
          cm.curOp.scrollLeft = x;
        }
        if (y != null) {
          cm.curOp.scrollTop = y;
        }
      }
      function scrollToRange(cm, range2) {
        resolveScrollToPos(cm);
        cm.curOp.scrollToPos = range2;
      }
      function resolveScrollToPos(cm) {
        var range2 = cm.curOp.scrollToPos;
        if (range2) {
          cm.curOp.scrollToPos = null;
          var from = estimateCoords(cm, range2.from), to = estimateCoords(cm, range2.to);
          scrollToCoordsRange(cm, from, to, range2.margin);
        }
      }
      function scrollToCoordsRange(cm, from, to, margin) {
        var sPos = calculateScrollPos(cm, {
          left: Math.min(from.left, to.left),
          top: Math.min(from.top, to.top) - margin,
          right: Math.max(from.right, to.right),
          bottom: Math.max(from.bottom, to.bottom) + margin
        });
        scrollToCoords(cm, sPos.scrollLeft, sPos.scrollTop);
      }
      function updateScrollTop(cm, val) {
        if (Math.abs(cm.doc.scrollTop - val) < 2) {
          return;
        }
        if (!gecko) {
          updateDisplaySimple(cm, { top: val });
        }
        setScrollTop(cm, val, true);
        if (gecko) {
          updateDisplaySimple(cm);
        }
        startWorker(cm, 100);
      }
      function setScrollTop(cm, val, forceScroll) {
        val = Math.max(0, Math.min(cm.display.scroller.scrollHeight - cm.display.scroller.clientHeight, val));
        if (cm.display.scroller.scrollTop == val && !forceScroll) {
          return;
        }
        cm.doc.scrollTop = val;
        cm.display.scrollbars.setScrollTop(val);
        if (cm.display.scroller.scrollTop != val) {
          cm.display.scroller.scrollTop = val;
        }
      }
      function setScrollLeft(cm, val, isScroller, forceScroll) {
        val = Math.max(0, Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth));
        if ((isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) && !forceScroll) {
          return;
        }
        cm.doc.scrollLeft = val;
        alignHorizontally(cm);
        if (cm.display.scroller.scrollLeft != val) {
          cm.display.scroller.scrollLeft = val;
        }
        cm.display.scrollbars.setScrollLeft(val);
      }
      function measureForScrollbars(cm) {
        var d = cm.display, gutterW = d.gutters.offsetWidth;
        var docH = Math.round(cm.doc.height + paddingVert(cm.display));
        return {
          clientHeight: d.scroller.clientHeight,
          viewHeight: d.wrapper.clientHeight,
          scrollWidth: d.scroller.scrollWidth,
          clientWidth: d.scroller.clientWidth,
          viewWidth: d.wrapper.clientWidth,
          barLeft: cm.options.fixedGutter ? gutterW : 0,
          docHeight: docH,
          scrollHeight: docH + scrollGap(cm) + d.barHeight,
          nativeBarWidth: d.nativeBarWidth,
          gutterWidth: gutterW
        };
      }
      var NativeScrollbars = function(place, scroll, cm) {
        this.cm = cm;
        var vert = this.vert = elt("div", [elt("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar");
        var horiz = this.horiz = elt("div", [elt("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
        vert.tabIndex = horiz.tabIndex = -1;
        place(vert);
        place(horiz);
        on(vert, "scroll", function() {
          if (vert.clientHeight) {
            scroll(vert.scrollTop, "vertical");
          }
        });
        on(horiz, "scroll", function() {
          if (horiz.clientWidth) {
            scroll(horiz.scrollLeft, "horizontal");
          }
        });
        this.checkedZeroWidth = false;
        if (ie && ie_version < 8) {
          this.horiz.style.minHeight = this.vert.style.minWidth = "18px";
        }
      };
      NativeScrollbars.prototype.update = function(measure) {
        var needsH = measure.scrollWidth > measure.clientWidth + 1;
        var needsV = measure.scrollHeight > measure.clientHeight + 1;
        var sWidth = measure.nativeBarWidth;
        if (needsV) {
          this.vert.style.display = "block";
          this.vert.style.bottom = needsH ? sWidth + "px" : "0";
          var totalHeight = measure.viewHeight - (needsH ? sWidth : 0);
          this.vert.firstChild.style.height = Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + "px";
        } else {
          this.vert.scrollTop = 0;
          this.vert.style.display = "";
          this.vert.firstChild.style.height = "0";
        }
        if (needsH) {
          this.horiz.style.display = "block";
          this.horiz.style.right = needsV ? sWidth + "px" : "0";
          this.horiz.style.left = measure.barLeft + "px";
          var totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
          this.horiz.firstChild.style.width = Math.max(0, measure.scrollWidth - measure.clientWidth + totalWidth) + "px";
        } else {
          this.horiz.style.display = "";
          this.horiz.firstChild.style.width = "0";
        }
        if (!this.checkedZeroWidth && measure.clientHeight > 0) {
          if (sWidth == 0) {
            this.zeroWidthHack();
          }
          this.checkedZeroWidth = true;
        }
        return { right: needsV ? sWidth : 0, bottom: needsH ? sWidth : 0 };
      };
      NativeScrollbars.prototype.setScrollLeft = function(pos) {
        if (this.horiz.scrollLeft != pos) {
          this.horiz.scrollLeft = pos;
        }
        if (this.disableHoriz) {
          this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
        }
      };
      NativeScrollbars.prototype.setScrollTop = function(pos) {
        if (this.vert.scrollTop != pos) {
          this.vert.scrollTop = pos;
        }
        if (this.disableVert) {
          this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
        }
      };
      NativeScrollbars.prototype.zeroWidthHack = function() {
        var w = mac && !mac_geMountainLion ? "12px" : "18px";
        this.horiz.style.height = this.vert.style.width = w;
        this.horiz.style.visibility = this.vert.style.visibility = "hidden";
        this.disableHoriz = new Delayed();
        this.disableVert = new Delayed();
      };
      NativeScrollbars.prototype.enableZeroWidthBar = function(bar, delay, type) {
        bar.style.visibility = "";
        function maybeDisable() {
          var box = bar.getBoundingClientRect();
          var elt2 = type == "vert" ? document.elementFromPoint(box.right - 1, (box.top + box.bottom) / 2) : document.elementFromPoint((box.right + box.left) / 2, box.bottom - 1);
          if (elt2 != bar) {
            bar.style.visibility = "hidden";
          } else {
            delay.set(1e3, maybeDisable);
          }
        }
        delay.set(1e3, maybeDisable);
      };
      NativeScrollbars.prototype.clear = function() {
        var parent = this.horiz.parentNode;
        parent.removeChild(this.horiz);
        parent.removeChild(this.vert);
      };
      var NullScrollbars = function() {
      };
      NullScrollbars.prototype.update = function() {
        return { bottom: 0, right: 0 };
      };
      NullScrollbars.prototype.setScrollLeft = function() {
      };
      NullScrollbars.prototype.setScrollTop = function() {
      };
      NullScrollbars.prototype.clear = function() {
      };
      function updateScrollbars(cm, measure) {
        if (!measure) {
          measure = measureForScrollbars(cm);
        }
        var startWidth = cm.display.barWidth, startHeight = cm.display.barHeight;
        updateScrollbarsInner(cm, measure);
        for (var i2 = 0; i2 < 4 && startWidth != cm.display.barWidth || startHeight != cm.display.barHeight; i2++) {
          if (startWidth != cm.display.barWidth && cm.options.lineWrapping) {
            updateHeightsInViewport(cm);
          }
          updateScrollbarsInner(cm, measureForScrollbars(cm));
          startWidth = cm.display.barWidth;
          startHeight = cm.display.barHeight;
        }
      }
      function updateScrollbarsInner(cm, measure) {
        var d = cm.display;
        var sizes = d.scrollbars.update(measure);
        d.sizer.style.paddingRight = (d.barWidth = sizes.right) + "px";
        d.sizer.style.paddingBottom = (d.barHeight = sizes.bottom) + "px";
        d.heightForcer.style.borderBottom = sizes.bottom + "px solid transparent";
        if (sizes.right && sizes.bottom) {
          d.scrollbarFiller.style.display = "block";
          d.scrollbarFiller.style.height = sizes.bottom + "px";
          d.scrollbarFiller.style.width = sizes.right + "px";
        } else {
          d.scrollbarFiller.style.display = "";
        }
        if (sizes.bottom && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
          d.gutterFiller.style.display = "block";
          d.gutterFiller.style.height = sizes.bottom + "px";
          d.gutterFiller.style.width = measure.gutterWidth + "px";
        } else {
          d.gutterFiller.style.display = "";
        }
      }
      var scrollbarModel = { "native": NativeScrollbars, "null": NullScrollbars };
      function initScrollbars(cm) {
        if (cm.display.scrollbars) {
          cm.display.scrollbars.clear();
          if (cm.display.scrollbars.addClass) {
            rmClass(cm.display.wrapper, cm.display.scrollbars.addClass);
          }
        }
        cm.display.scrollbars = new scrollbarModel[cm.options.scrollbarStyle](function(node) {
          cm.display.wrapper.insertBefore(node, cm.display.scrollbarFiller);
          on(node, "mousedown", function() {
            if (cm.state.focused) {
              setTimeout(function() {
                return cm.display.input.focus();
              }, 0);
            }
          });
          node.setAttribute("cm-not-content", "true");
        }, function(pos, axis) {
          if (axis == "horizontal") {
            setScrollLeft(cm, pos);
          } else {
            updateScrollTop(cm, pos);
          }
        }, cm);
        if (cm.display.scrollbars.addClass) {
          addClass(cm.display.wrapper, cm.display.scrollbars.addClass);
        }
      }
      var nextOpId = 0;
      function startOperation(cm) {
        cm.curOp = {
          cm,
          viewChanged: false,
          // Flag that indicates that lines might need to be redrawn
          startHeight: cm.doc.height,
          // Used to detect need to update scrollbar
          forceUpdate: false,
          // Used to force a redraw
          updateInput: 0,
          // Whether to reset the input textarea
          typing: false,
          // Whether this reset should be careful to leave existing text (for compositing)
          changeObjs: null,
          // Accumulated changes, for firing change events
          cursorActivityHandlers: null,
          // Set of handlers to fire cursorActivity on
          cursorActivityCalled: 0,
          // Tracks which cursorActivity handlers have been called already
          selectionChanged: false,
          // Whether the selection needs to be redrawn
          updateMaxLine: false,
          // Set when the widest line needs to be determined anew
          scrollLeft: null,
          scrollTop: null,
          // Intermediate scroll position, not pushed to DOM yet
          scrollToPos: null,
          // Used to scroll to a specific position
          focus: false,
          id: ++nextOpId,
          // Unique ID
          markArrays: null
          // Used by addMarkedSpan
        };
        pushOperation(cm.curOp);
      }
      function endOperation(cm) {
        var op = cm.curOp;
        if (op) {
          finishOperation(op, function(group) {
            for (var i2 = 0; i2 < group.ops.length; i2++) {
              group.ops[i2].cm.curOp = null;
            }
            endOperations(group);
          });
        }
      }
      function endOperations(group) {
        var ops = group.ops;
        for (var i2 = 0; i2 < ops.length; i2++) {
          endOperation_R1(ops[i2]);
        }
        for (var i$12 = 0; i$12 < ops.length; i$12++) {
          endOperation_W1(ops[i$12]);
        }
        for (var i$22 = 0; i$22 < ops.length; i$22++) {
          endOperation_R2(ops[i$22]);
        }
        for (var i$3 = 0; i$3 < ops.length; i$3++) {
          endOperation_W2(ops[i$3]);
        }
        for (var i$4 = 0; i$4 < ops.length; i$4++) {
          endOperation_finish(ops[i$4]);
        }
      }
      function endOperation_R1(op) {
        var cm = op.cm, display = cm.display;
        maybeClipScrollbars(cm);
        if (op.updateMaxLine) {
          findMaxLine(cm);
        }
        op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null || op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom || op.scrollToPos.to.line >= display.viewTo) || display.maxLineChanged && cm.options.lineWrapping;
        op.update = op.mustUpdate && new DisplayUpdate(cm, op.mustUpdate && { top: op.scrollTop, ensure: op.scrollToPos }, op.forceUpdate);
      }
      function endOperation_W1(op) {
        op.updatedDisplay = op.mustUpdate && updateDisplayIfNeeded(op.cm, op.update);
      }
      function endOperation_R2(op) {
        var cm = op.cm, display = cm.display;
        if (op.updatedDisplay) {
          updateHeightsInViewport(cm);
        }
        op.barMeasure = measureForScrollbars(cm);
        if (display.maxLineChanged && !cm.options.lineWrapping) {
          op.adjustWidthTo = measureChar(cm, display.maxLine, display.maxLine.text.length).left + 3;
          cm.display.sizerWidth = op.adjustWidthTo;
          op.barMeasure.scrollWidth = Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + scrollGap(cm) + cm.display.barWidth);
          op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - displayWidth(cm));
        }
        if (op.updatedDisplay || op.selectionChanged) {
          op.preparedSelection = display.input.prepareSelection();
        }
      }
      function endOperation_W2(op) {
        var cm = op.cm;
        if (op.adjustWidthTo != null) {
          cm.display.sizer.style.minWidth = op.adjustWidthTo + "px";
          if (op.maxScrollLeft < cm.doc.scrollLeft) {
            setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), true);
          }
          cm.display.maxLineChanged = false;
        }
        var takeFocus = op.focus && op.focus == activeElt(root(cm));
        if (op.preparedSelection) {
          cm.display.input.showSelection(op.preparedSelection, takeFocus);
        }
        if (op.updatedDisplay || op.startHeight != cm.doc.height) {
          updateScrollbars(cm, op.barMeasure);
        }
        if (op.updatedDisplay) {
          setDocumentHeight(cm, op.barMeasure);
        }
        if (op.selectionChanged) {
          restartBlink(cm);
        }
        if (cm.state.focused && op.updateInput) {
          cm.display.input.reset(op.typing);
        }
        if (takeFocus) {
          ensureFocus(op.cm);
        }
      }
      function endOperation_finish(op) {
        var cm = op.cm, display = cm.display, doc2 = cm.doc;
        if (op.updatedDisplay) {
          postUpdateDisplay(cm, op.update);
        }
        if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos)) {
          display.wheelStartX = display.wheelStartY = null;
        }
        if (op.scrollTop != null) {
          setScrollTop(cm, op.scrollTop, op.forceScroll);
        }
        if (op.scrollLeft != null) {
          setScrollLeft(cm, op.scrollLeft, true, true);
        }
        if (op.scrollToPos) {
          var rect = scrollPosIntoView(
            cm,
            clipPos(doc2, op.scrollToPos.from),
            clipPos(doc2, op.scrollToPos.to),
            op.scrollToPos.margin
          );
          maybeScrollWindow(cm, rect);
        }
        var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
        if (hidden) {
          for (var i2 = 0; i2 < hidden.length; ++i2) {
            if (!hidden[i2].lines.length) {
              signal(hidden[i2], "hide");
            }
          }
        }
        if (unhidden) {
          for (var i$12 = 0; i$12 < unhidden.length; ++i$12) {
            if (unhidden[i$12].lines.length) {
              signal(unhidden[i$12], "unhide");
            }
          }
        }
        if (display.wrapper.offsetHeight) {
          doc2.scrollTop = cm.display.scroller.scrollTop;
        }
        if (op.changeObjs) {
          signal(cm, "changes", cm, op.changeObjs);
        }
        if (op.update) {
          op.update.finish();
        }
      }
      function runInOp(cm, f) {
        if (cm.curOp) {
          return f();
        }
        startOperation(cm);
        try {
          return f();
        } finally {
          endOperation(cm);
        }
      }
      function operation(cm, f) {
        return function() {
          if (cm.curOp) {
            return f.apply(cm, arguments);
          }
          startOperation(cm);
          try {
            return f.apply(cm, arguments);
          } finally {
            endOperation(cm);
          }
        };
      }
      function methodOp(f) {
        return function() {
          if (this.curOp) {
            return f.apply(this, arguments);
          }
          startOperation(this);
          try {
            return f.apply(this, arguments);
          } finally {
            endOperation(this);
          }
        };
      }
      function docMethodOp(f) {
        return function() {
          var cm = this.cm;
          if (!cm || cm.curOp) {
            return f.apply(this, arguments);
          }
          startOperation(cm);
          try {
            return f.apply(this, arguments);
          } finally {
            endOperation(cm);
          }
        };
      }
      function startWorker(cm, time) {
        if (cm.doc.highlightFrontier < cm.display.viewTo) {
          cm.state.highlight.set(time, bind(highlightWorker, cm));
        }
      }
      function highlightWorker(cm) {
        var doc2 = cm.doc;
        if (doc2.highlightFrontier >= cm.display.viewTo) {
          return;
        }
        var end = +/* @__PURE__ */ new Date() + cm.options.workTime;
        var context = getContextBefore(cm, doc2.highlightFrontier);
        var changedLines = [];
        doc2.iter(context.line, Math.min(doc2.first + doc2.size, cm.display.viewTo + 500), function(line) {
          if (context.line >= cm.display.viewFrom) {
            var oldStyles = line.styles;
            var resetState = line.text.length > cm.options.maxHighlightLength ? copyState(doc2.mode, context.state) : null;
            var highlighted = highlightLine(cm, line, context, true);
            if (resetState) {
              context.state = resetState;
            }
            line.styles = highlighted.styles;
            var oldCls = line.styleClasses, newCls = highlighted.classes;
            if (newCls) {
              line.styleClasses = newCls;
            } else if (oldCls) {
              line.styleClasses = null;
            }
            var ischange = !oldStyles || oldStyles.length != line.styles.length || oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass);
            for (var i2 = 0; !ischange && i2 < oldStyles.length; ++i2) {
              ischange = oldStyles[i2] != line.styles[i2];
            }
            if (ischange) {
              changedLines.push(context.line);
            }
            line.stateAfter = context.save();
            context.nextLine();
          } else {
            if (line.text.length <= cm.options.maxHighlightLength) {
              processLine(cm, line.text, context);
            }
            line.stateAfter = context.line % 5 == 0 ? context.save() : null;
            context.nextLine();
          }
          if (+/* @__PURE__ */ new Date() > end) {
            startWorker(cm, cm.options.workDelay);
            return true;
          }
        });
        doc2.highlightFrontier = context.line;
        doc2.modeFrontier = Math.max(doc2.modeFrontier, context.line);
        if (changedLines.length) {
          runInOp(cm, function() {
            for (var i2 = 0; i2 < changedLines.length; i2++) {
              regLineChange(cm, changedLines[i2], "text");
            }
          });
        }
      }
      var DisplayUpdate = function(cm, viewport, force) {
        var display = cm.display;
        this.viewport = viewport;
        this.visible = visibleLines(display, cm.doc, viewport);
        this.editorIsHidden = !display.wrapper.offsetWidth;
        this.wrapperHeight = display.wrapper.clientHeight;
        this.wrapperWidth = display.wrapper.clientWidth;
        this.oldDisplayWidth = displayWidth(cm);
        this.force = force;
        this.dims = getDimensions(cm);
        this.events = [];
      };
      DisplayUpdate.prototype.signal = function(emitter, type) {
        if (hasHandler(emitter, type)) {
          this.events.push(arguments);
        }
      };
      DisplayUpdate.prototype.finish = function() {
        for (var i2 = 0; i2 < this.events.length; i2++) {
          signal.apply(null, this.events[i2]);
        }
      };
      function maybeClipScrollbars(cm) {
        var display = cm.display;
        if (!display.scrollbarsClipped && display.scroller.offsetWidth) {
          display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth;
          display.heightForcer.style.height = scrollGap(cm) + "px";
          display.sizer.style.marginBottom = -display.nativeBarWidth + "px";
          display.sizer.style.borderRightWidth = scrollGap(cm) + "px";
          display.scrollbarsClipped = true;
        }
      }
      function selectionSnapshot(cm) {
        if (cm.hasFocus()) {
          return null;
        }
        var active = activeElt(root(cm));
        if (!active || !contains(cm.display.lineDiv, active)) {
          return null;
        }
        var result = { activeElt: active };
        if (window.getSelection) {
          var sel = win(cm).getSelection();
          if (sel.anchorNode && sel.extend && contains(cm.display.lineDiv, sel.anchorNode)) {
            result.anchorNode = sel.anchorNode;
            result.anchorOffset = sel.anchorOffset;
            result.focusNode = sel.focusNode;
            result.focusOffset = sel.focusOffset;
          }
        }
        return result;
      }
      function restoreSelection(snapshot) {
        if (!snapshot || !snapshot.activeElt || snapshot.activeElt == activeElt(rootNode(snapshot.activeElt))) {
          return;
        }
        snapshot.activeElt.focus();
        if (!/^(INPUT|TEXTAREA)$/.test(snapshot.activeElt.nodeName) && snapshot.anchorNode && contains(document.body, snapshot.anchorNode) && contains(document.body, snapshot.focusNode)) {
          var doc2 = snapshot.activeElt.ownerDocument;
          var sel = doc2.defaultView.getSelection(), range2 = doc2.createRange();
          range2.setEnd(snapshot.anchorNode, snapshot.anchorOffset);
          range2.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range2);
          sel.extend(snapshot.focusNode, snapshot.focusOffset);
        }
      }
      function updateDisplayIfNeeded(cm, update) {
        var display = cm.display, doc2 = cm.doc;
        if (update.editorIsHidden) {
          resetView(cm);
          return false;
        }
        if (!update.force && update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) && display.renderedView == display.view && countDirtyView(cm) == 0) {
          return false;
        }
        if (maybeUpdateLineNumberWidth(cm)) {
          resetView(cm);
          update.dims = getDimensions(cm);
        }
        var end = doc2.first + doc2.size;
        var from = Math.max(update.visible.from - cm.options.viewportMargin, doc2.first);
        var to = Math.min(end, update.visible.to + cm.options.viewportMargin);
        if (display.viewFrom < from && from - display.viewFrom < 20) {
          from = Math.max(doc2.first, display.viewFrom);
        }
        if (display.viewTo > to && display.viewTo - to < 20) {
          to = Math.min(end, display.viewTo);
        }
        if (sawCollapsedSpans) {
          from = visualLineNo(cm.doc, from);
          to = visualLineEndNo(cm.doc, to);
        }
        var different = from != display.viewFrom || to != display.viewTo || display.lastWrapHeight != update.wrapperHeight || display.lastWrapWidth != update.wrapperWidth;
        adjustView(cm, from, to);
        display.viewOffset = heightAtLine(getLine(cm.doc, display.viewFrom));
        cm.display.mover.style.top = display.viewOffset + "px";
        var toUpdate = countDirtyView(cm);
        if (!different && toUpdate == 0 && !update.force && display.renderedView == display.view && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo)) {
          return false;
        }
        var selSnapshot = selectionSnapshot(cm);
        if (toUpdate > 4) {
          display.lineDiv.style.display = "none";
        }
        patchDisplay(cm, display.updateLineNumbers, update.dims);
        if (toUpdate > 4) {
          display.lineDiv.style.display = "";
        }
        display.renderedView = display.view;
        restoreSelection(selSnapshot);
        removeChildren(display.cursorDiv);
        removeChildren(display.selectionDiv);
        display.gutters.style.height = display.sizer.style.minHeight = 0;
        if (different) {
          display.lastWrapHeight = update.wrapperHeight;
          display.lastWrapWidth = update.wrapperWidth;
          startWorker(cm, 400);
        }
        display.updateLineNumbers = null;
        return true;
      }
      function postUpdateDisplay(cm, update) {
        var viewport = update.viewport;
        for (var first = true; ; first = false) {
          if (!first || !cm.options.lineWrapping || update.oldDisplayWidth == displayWidth(cm)) {
            if (viewport && viewport.top != null) {
              viewport = { top: Math.min(cm.doc.height + paddingVert(cm.display) - displayHeight(cm), viewport.top) };
            }
            update.visible = visibleLines(cm.display, cm.doc, viewport);
            if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo) {
              break;
            }
          } else if (first) {
            update.visible = visibleLines(cm.display, cm.doc, viewport);
          }
          if (!updateDisplayIfNeeded(cm, update)) {
            break;
          }
          updateHeightsInViewport(cm);
          var barMeasure = measureForScrollbars(cm);
          updateSelection(cm);
          updateScrollbars(cm, barMeasure);
          setDocumentHeight(cm, barMeasure);
          update.force = false;
        }
        update.signal(cm, "update", cm);
        if (cm.display.viewFrom != cm.display.reportedViewFrom || cm.display.viewTo != cm.display.reportedViewTo) {
          update.signal(cm, "viewportChange", cm, cm.display.viewFrom, cm.display.viewTo);
          cm.display.reportedViewFrom = cm.display.viewFrom;
          cm.display.reportedViewTo = cm.display.viewTo;
        }
      }
      function updateDisplaySimple(cm, viewport) {
        var update = new DisplayUpdate(cm, viewport);
        if (updateDisplayIfNeeded(cm, update)) {
          updateHeightsInViewport(cm);
          postUpdateDisplay(cm, update);
          var barMeasure = measureForScrollbars(cm);
          updateSelection(cm);
          updateScrollbars(cm, barMeasure);
          setDocumentHeight(cm, barMeasure);
          update.finish();
        }
      }
      function patchDisplay(cm, updateNumbersFrom, dims) {
        var display = cm.display, lineNumbers = cm.options.lineNumbers;
        var container = display.lineDiv, cur = container.firstChild;
        function rm(node2) {
          var next = node2.nextSibling;
          if (webkit && mac && cm.display.currentWheelTarget == node2) {
            node2.style.display = "none";
          } else {
            node2.parentNode.removeChild(node2);
          }
          return next;
        }
        var view = display.view, lineN = display.viewFrom;
        for (var i2 = 0; i2 < view.length; i2++) {
          var lineView = view[i2];
          if (lineView.hidden) ;
          else if (!lineView.node || lineView.node.parentNode != container) {
            var node = buildLineElement(cm, lineView, lineN, dims);
            container.insertBefore(node, cur);
          } else {
            while (cur != lineView.node) {
              cur = rm(cur);
            }
            var updateNumber = lineNumbers && updateNumbersFrom != null && updateNumbersFrom <= lineN && lineView.lineNumber;
            if (lineView.changes) {
              if (indexOf(lineView.changes, "gutter") > -1) {
                updateNumber = false;
              }
              updateLineForChanges(cm, lineView, lineN, dims);
            }
            if (updateNumber) {
              removeChildren(lineView.lineNumber);
              lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options, lineN)));
            }
            cur = lineView.node.nextSibling;
          }
          lineN += lineView.size;
        }
        while (cur) {
          cur = rm(cur);
        }
      }
      function updateGutterSpace(display) {
        var width = display.gutters.offsetWidth;
        display.sizer.style.marginLeft = width + "px";
        signalLater(display, "gutterChanged", display);
      }
      function setDocumentHeight(cm, measure) {
        cm.display.sizer.style.minHeight = measure.docHeight + "px";
        cm.display.heightForcer.style.top = measure.docHeight + "px";
        cm.display.gutters.style.height = measure.docHeight + cm.display.barHeight + scrollGap(cm) + "px";
      }
      function alignHorizontally(cm) {
        var display = cm.display, view = display.view;
        if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) {
          return;
        }
        var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
        var gutterW = display.gutters.offsetWidth, left = comp + "px";
        for (var i2 = 0; i2 < view.length; i2++) {
          if (!view[i2].hidden) {
            if (cm.options.fixedGutter) {
              if (view[i2].gutter) {
                view[i2].gutter.style.left = left;
              }
              if (view[i2].gutterBackground) {
                view[i2].gutterBackground.style.left = left;
              }
            }
            var align = view[i2].alignable;
            if (align) {
              for (var j = 0; j < align.length; j++) {
                align[j].style.left = left;
              }
            }
          }
        }
        if (cm.options.fixedGutter) {
          display.gutters.style.left = comp + gutterW + "px";
        }
      }
      function maybeUpdateLineNumberWidth(cm) {
        if (!cm.options.lineNumbers) {
          return false;
        }
        var doc2 = cm.doc, last = lineNumberFor(cm.options, doc2.first + doc2.size - 1), display = cm.display;
        if (last.length != display.lineNumChars) {
          var test = display.measure.appendChild(elt(
            "div",
            [elt("div", last)],
            "CodeMirror-linenumber CodeMirror-gutter-elt"
          ));
          var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
          display.lineGutter.style.width = "";
          display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1;
          display.lineNumWidth = display.lineNumInnerWidth + padding;
          display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
          display.lineGutter.style.width = display.lineNumWidth + "px";
          updateGutterSpace(cm.display);
          return true;
        }
        return false;
      }
      function getGutters(gutters, lineNumbers) {
        var result = [], sawLineNumbers = false;
        for (var i2 = 0; i2 < gutters.length; i2++) {
          var name = gutters[i2], style = null;
          if (typeof name != "string") {
            style = name.style;
            name = name.className;
          }
          if (name == "CodeMirror-linenumbers") {
            if (!lineNumbers) {
              continue;
            } else {
              sawLineNumbers = true;
            }
          }
          result.push({ className: name, style });
        }
        if (lineNumbers && !sawLineNumbers) {
          result.push({ className: "CodeMirror-linenumbers", style: null });
        }
        return result;
      }
      function renderGutters(display) {
        var gutters = display.gutters, specs = display.gutterSpecs;
        removeChildren(gutters);
        display.lineGutter = null;
        for (var i2 = 0; i2 < specs.length; ++i2) {
          var ref2 = specs[i2];
          var className = ref2.className;
          var style = ref2.style;
          var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + className));
          if (style) {
            gElt.style.cssText = style;
          }
          if (className == "CodeMirror-linenumbers") {
            display.lineGutter = gElt;
            gElt.style.width = (display.lineNumWidth || 1) + "px";
          }
        }
        gutters.style.display = specs.length ? "" : "none";
        updateGutterSpace(display);
      }
      function updateGutters(cm) {
        renderGutters(cm.display);
        regChange(cm);
        alignHorizontally(cm);
      }
      function Display(place, doc2, input, options) {
        var d = this;
        this.input = input;
        d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");
        d.scrollbarFiller.setAttribute("cm-not-content", "true");
        d.gutterFiller = elt("div", null, "CodeMirror-gutter-filler");
        d.gutterFiller.setAttribute("cm-not-content", "true");
        d.lineDiv = eltP("div", null, "CodeMirror-code");
        d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");
        d.cursorDiv = elt("div", null, "CodeMirror-cursors");
        d.measure = elt("div", null, "CodeMirror-measure");
        d.lineMeasure = elt("div", null, "CodeMirror-measure");
        d.lineSpace = eltP(
          "div",
          [d.measure, d.lineMeasure, d.selectionDiv, d.cursorDiv, d.lineDiv],
          null,
          "position: relative; outline: none"
        );
        var lines = eltP("div", [d.lineSpace], "CodeMirror-lines");
        d.mover = elt("div", [lines], null, "position: relative");
        d.sizer = elt("div", [d.mover], "CodeMirror-sizer");
        d.sizerWidth = null;
        d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerGap + "px; width: 1px;");
        d.gutters = elt("div", null, "CodeMirror-gutters");
        d.lineGutter = null;
        d.scroller = elt("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll");
        d.scroller.setAttribute("tabIndex", "-1");
        d.wrapper = elt("div", [d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror");
        if (chrome && chrome_version === 105) {
          d.wrapper.style.clipPath = "inset(0px)";
        }
        d.wrapper.setAttribute("translate", "no");
        if (ie && ie_version < 8) {
          d.gutters.style.zIndex = -1;
          d.scroller.style.paddingRight = 0;
        }
        if (!webkit && !(gecko && mobile)) {
          d.scroller.draggable = true;
        }
        if (place) {
          if (place.appendChild) {
            place.appendChild(d.wrapper);
          } else {
            place(d.wrapper);
          }
        }
        d.viewFrom = d.viewTo = doc2.first;
        d.reportedViewFrom = d.reportedViewTo = doc2.first;
        d.view = [];
        d.renderedView = null;
        d.externalMeasured = null;
        d.viewOffset = 0;
        d.lastWrapHeight = d.lastWrapWidth = 0;
        d.updateLineNumbers = null;
        d.nativeBarWidth = d.barHeight = d.barWidth = 0;
        d.scrollbarsClipped = false;
        d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
        d.alignWidgets = false;
        d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
        d.maxLine = null;
        d.maxLineLength = 0;
        d.maxLineChanged = false;
        d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;
        d.shift = false;
        d.selForContextMenu = null;
        d.activeTouch = null;
        d.gutterSpecs = getGutters(options.gutters, options.lineNumbers);
        renderGutters(d);
        input.init(d);
      }
      var wheelSamples = 0, wheelPixelsPerUnit = null;
      if (ie) {
        wheelPixelsPerUnit = -0.53;
      } else if (gecko) {
        wheelPixelsPerUnit = 15;
      } else if (chrome) {
        wheelPixelsPerUnit = -0.7;
      } else if (safari) {
        wheelPixelsPerUnit = -1 / 3;
      }
      function wheelEventDelta(e) {
        var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
        if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) {
          dx = e.detail;
        }
        if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) {
          dy = e.detail;
        } else if (dy == null) {
          dy = e.wheelDelta;
        }
        return { x: dx, y: dy };
      }
      function wheelEventPixels(e) {
        var delta = wheelEventDelta(e);
        delta.x *= wheelPixelsPerUnit;
        delta.y *= wheelPixelsPerUnit;
        return delta;
      }
      function onScrollWheel(cm, e) {
        if (chrome && chrome_version == 102) {
          if (cm.display.chromeScrollHack == null) {
            cm.display.sizer.style.pointerEvents = "none";
          } else {
            clearTimeout(cm.display.chromeScrollHack);
          }
          cm.display.chromeScrollHack = setTimeout(function() {
            cm.display.chromeScrollHack = null;
            cm.display.sizer.style.pointerEvents = "";
          }, 100);
        }
        var delta = wheelEventDelta(e), dx = delta.x, dy = delta.y;
        var pixelsPerUnit = wheelPixelsPerUnit;
        if (e.deltaMode === 0) {
          dx = e.deltaX;
          dy = e.deltaY;
          pixelsPerUnit = 1;
        }
        var display = cm.display, scroll = display.scroller;
        var canScrollX = scroll.scrollWidth > scroll.clientWidth;
        var canScrollY = scroll.scrollHeight > scroll.clientHeight;
        if (!(dx && canScrollX || dy && canScrollY)) {
          return;
        }
        if (dy && mac && webkit) {
          outer: for (var cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode) {
            for (var i2 = 0; i2 < view.length; i2++) {
              if (view[i2].node == cur) {
                cm.display.currentWheelTarget = cur;
                break outer;
              }
            }
          }
        }
        if (dx && !gecko && !presto && pixelsPerUnit != null) {
          if (dy && canScrollY) {
            updateScrollTop(cm, Math.max(0, scroll.scrollTop + dy * pixelsPerUnit));
          }
          setScrollLeft(cm, Math.max(0, scroll.scrollLeft + dx * pixelsPerUnit));
          if (!dy || dy && canScrollY) {
            e_preventDefault(e);
          }
          display.wheelStartX = null;
          return;
        }
        if (dy && pixelsPerUnit != null) {
          var pixels = dy * pixelsPerUnit;
          var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
          if (pixels < 0) {
            top = Math.max(0, top + pixels - 50);
          } else {
            bot = Math.min(cm.doc.height, bot + pixels + 50);
          }
          updateDisplaySimple(cm, { top, bottom: bot });
        }
        if (wheelSamples < 20 && e.deltaMode !== 0) {
          if (display.wheelStartX == null) {
            display.wheelStartX = scroll.scrollLeft;
            display.wheelStartY = scroll.scrollTop;
            display.wheelDX = dx;
            display.wheelDY = dy;
            setTimeout(function() {
              if (display.wheelStartX == null) {
                return;
              }
              var movedX = scroll.scrollLeft - display.wheelStartX;
              var movedY = scroll.scrollTop - display.wheelStartY;
              var sample = movedY && display.wheelDY && movedY / display.wheelDY || movedX && display.wheelDX && movedX / display.wheelDX;
              display.wheelStartX = display.wheelStartY = null;
              if (!sample) {
                return;
              }
              wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
              ++wheelSamples;
            }, 200);
          } else {
            display.wheelDX += dx;
            display.wheelDY += dy;
          }
        }
      }
      var Selection = function(ranges, primIndex) {
        this.ranges = ranges;
        this.primIndex = primIndex;
      };
      Selection.prototype.primary = function() {
        return this.ranges[this.primIndex];
      };
      Selection.prototype.equals = function(other) {
        if (other == this) {
          return true;
        }
        if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length) {
          return false;
        }
        for (var i2 = 0; i2 < this.ranges.length; i2++) {
          var here = this.ranges[i2], there = other.ranges[i2];
          if (!equalCursorPos(here.anchor, there.anchor) || !equalCursorPos(here.head, there.head)) {
            return false;
          }
        }
        return true;
      };
      Selection.prototype.deepCopy = function() {
        var out = [];
        for (var i2 = 0; i2 < this.ranges.length; i2++) {
          out[i2] = new Range(copyPos(this.ranges[i2].anchor), copyPos(this.ranges[i2].head));
        }
        return new Selection(out, this.primIndex);
      };
      Selection.prototype.somethingSelected = function() {
        for (var i2 = 0; i2 < this.ranges.length; i2++) {
          if (!this.ranges[i2].empty()) {
            return true;
          }
        }
        return false;
      };
      Selection.prototype.contains = function(pos, end) {
        if (!end) {
          end = pos;
        }
        for (var i2 = 0; i2 < this.ranges.length; i2++) {
          var range2 = this.ranges[i2];
          if (cmp(end, range2.from()) >= 0 && cmp(pos, range2.to()) <= 0) {
            return i2;
          }
        }
        return -1;
      };
      var Range = function(anchor, head) {
        this.anchor = anchor;
        this.head = head;
      };
      Range.prototype.from = function() {
        return minPos(this.anchor, this.head);
      };
      Range.prototype.to = function() {
        return maxPos(this.anchor, this.head);
      };
      Range.prototype.empty = function() {
        return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
      };
      function normalizeSelection(cm, ranges, primIndex) {
        var mayTouch = cm && cm.options.selectionsMayTouch;
        var prim = ranges[primIndex];
        ranges.sort(function(a, b) {
          return cmp(a.from(), b.from());
        });
        primIndex = indexOf(ranges, prim);
        for (var i2 = 1; i2 < ranges.length; i2++) {
          var cur = ranges[i2], prev = ranges[i2 - 1];
          var diff2 = cmp(prev.to(), cur.from());
          if (mayTouch && !cur.empty() ? diff2 > 0 : diff2 >= 0) {
            var from = minPos(prev.from(), cur.from()), to = maxPos(prev.to(), cur.to());
            var inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
            if (i2 <= primIndex) {
              --primIndex;
            }
            ranges.splice(--i2, 2, new Range(inv ? to : from, inv ? from : to));
          }
        }
        return new Selection(ranges, primIndex);
      }
      function simpleSelection(anchor, head) {
        return new Selection([new Range(anchor, head || anchor)], 0);
      }
      function changeEnd(change) {
        if (!change.text) {
          return change.to;
        }
        return Pos(
          change.from.line + change.text.length - 1,
          lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0)
        );
      }
      function adjustForChange(pos, change) {
        if (cmp(pos, change.from) < 0) {
          return pos;
        }
        if (cmp(pos, change.to) <= 0) {
          return changeEnd(change);
        }
        var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
        if (pos.line == change.to.line) {
          ch += changeEnd(change).ch - change.to.ch;
        }
        return Pos(line, ch);
      }
      function computeSelAfterChange(doc2, change) {
        var out = [];
        for (var i2 = 0; i2 < doc2.sel.ranges.length; i2++) {
          var range2 = doc2.sel.ranges[i2];
          out.push(new Range(
            adjustForChange(range2.anchor, change),
            adjustForChange(range2.head, change)
          ));
        }
        return normalizeSelection(doc2.cm, out, doc2.sel.primIndex);
      }
      function offsetPos(pos, old, nw) {
        if (pos.line == old.line) {
          return Pos(nw.line, pos.ch - old.ch + nw.ch);
        } else {
          return Pos(nw.line + (pos.line - old.line), pos.ch);
        }
      }
      function computeReplacedSel(doc2, changes, hint) {
        var out = [];
        var oldPrev = Pos(doc2.first, 0), newPrev = oldPrev;
        for (var i2 = 0; i2 < changes.length; i2++) {
          var change = changes[i2];
          var from = offsetPos(change.from, oldPrev, newPrev);
          var to = offsetPos(changeEnd(change), oldPrev, newPrev);
          oldPrev = change.to;
          newPrev = to;
          if (hint == "around") {
            var range2 = doc2.sel.ranges[i2], inv = cmp(range2.head, range2.anchor) < 0;
            out[i2] = new Range(inv ? to : from, inv ? from : to);
          } else {
            out[i2] = new Range(from, from);
          }
        }
        return new Selection(out, doc2.sel.primIndex);
      }
      function loadMode(cm) {
        cm.doc.mode = getMode(cm.options, cm.doc.modeOption);
        resetModeState(cm);
      }
      function resetModeState(cm) {
        cm.doc.iter(function(line) {
          if (line.stateAfter) {
            line.stateAfter = null;
          }
          if (line.styles) {
            line.styles = null;
          }
        });
        cm.doc.modeFrontier = cm.doc.highlightFrontier = cm.doc.first;
        startWorker(cm, 100);
        cm.state.modeGen++;
        if (cm.curOp) {
          regChange(cm);
        }
      }
      function isWholeLineUpdate(doc2, change) {
        return change.from.ch == 0 && change.to.ch == 0 && lst(change.text) == "" && (!doc2.cm || doc2.cm.options.wholeLineUpdateBefore);
      }
      function updateDoc(doc2, change, markedSpans, estimateHeight2) {
        function spansFor(n) {
          return markedSpans ? markedSpans[n] : null;
        }
        function update(line, text2, spans) {
          updateLine(line, text2, spans, estimateHeight2);
          signalLater(line, "change", line, change);
        }
        function linesFor(start, end) {
          var result = [];
          for (var i2 = start; i2 < end; ++i2) {
            result.push(new Line(text[i2], spansFor(i2), estimateHeight2));
          }
          return result;
        }
        var from = change.from, to = change.to, text = change.text;
        var firstLine = getLine(doc2, from.line), lastLine = getLine(doc2, to.line);
        var lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;
        if (change.full) {
          doc2.insert(0, linesFor(0, text.length));
          doc2.remove(text.length, doc2.size - text.length);
        } else if (isWholeLineUpdate(doc2, change)) {
          var added = linesFor(0, text.length - 1);
          update(lastLine, lastLine.text, lastSpans);
          if (nlines) {
            doc2.remove(from.line, nlines);
          }
          if (added.length) {
            doc2.insert(from.line, added);
          }
        } else if (firstLine == lastLine) {
          if (text.length == 1) {
            update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
          } else {
            var added$1 = linesFor(1, text.length - 1);
            added$1.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight2));
            update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
            doc2.insert(from.line + 1, added$1);
          }
        } else if (text.length == 1) {
          update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
          doc2.remove(from.line + 1, nlines);
        } else {
          update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
          update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
          var added$2 = linesFor(1, text.length - 1);
          if (nlines > 1) {
            doc2.remove(from.line + 1, nlines - 1);
          }
          doc2.insert(from.line + 1, added$2);
        }
        signalLater(doc2, "change", doc2, change);
      }
      function linkedDocs(doc2, f, sharedHistOnly) {
        function propagate(doc3, skip, sharedHist) {
          if (doc3.linked) {
            for (var i2 = 0; i2 < doc3.linked.length; ++i2) {
              var rel = doc3.linked[i2];
              if (rel.doc == skip) {
                continue;
              }
              var shared = sharedHist && rel.sharedHist;
              if (sharedHistOnly && !shared) {
                continue;
              }
              f(rel.doc, shared);
              propagate(rel.doc, doc3, shared);
            }
          }
        }
        propagate(doc2, null, true);
      }
      function attachDoc(cm, doc2) {
        if (doc2.cm) {
          throw new Error("This document is already in use.");
        }
        cm.doc = doc2;
        doc2.cm = cm;
        estimateLineHeights(cm);
        loadMode(cm);
        setDirectionClass(cm);
        cm.options.direction = doc2.direction;
        if (!cm.options.lineWrapping) {
          findMaxLine(cm);
        }
        cm.options.mode = doc2.modeOption;
        regChange(cm);
      }
      function setDirectionClass(cm) {
        (cm.doc.direction == "rtl" ? addClass : rmClass)(cm.display.lineDiv, "CodeMirror-rtl");
      }
      function directionChanged(cm) {
        runInOp(cm, function() {
          setDirectionClass(cm);
          regChange(cm);
        });
      }
      function History(prev) {
        this.done = [];
        this.undone = [];
        this.undoDepth = prev ? prev.undoDepth : Infinity;
        this.lastModTime = this.lastSelTime = 0;
        this.lastOp = this.lastSelOp = null;
        this.lastOrigin = this.lastSelOrigin = null;
        this.generation = this.maxGeneration = prev ? prev.maxGeneration : 1;
      }
      function historyChangeFromChange(doc2, change) {
        var histChange = { from: copyPos(change.from), to: changeEnd(change), text: getBetween(doc2, change.from, change.to) };
        attachLocalSpans(doc2, histChange, change.from.line, change.to.line + 1);
        linkedDocs(doc2, function(doc3) {
          return attachLocalSpans(doc3, histChange, change.from.line, change.to.line + 1);
        }, true);
        return histChange;
      }
      function clearSelectionEvents(array) {
        while (array.length) {
          var last = lst(array);
          if (last.ranges) {
            array.pop();
          } else {
            break;
          }
        }
      }
      function lastChangeEvent(hist, force) {
        if (force) {
          clearSelectionEvents(hist.done);
          return lst(hist.done);
        } else if (hist.done.length && !lst(hist.done).ranges) {
          return lst(hist.done);
        } else if (hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges) {
          hist.done.pop();
          return lst(hist.done);
        }
      }
      function addChangeToHistory(doc2, change, selAfter, opId) {
        var hist = doc2.history;
        hist.undone.length = 0;
        var time = +/* @__PURE__ */ new Date(), cur;
        var last;
        if ((hist.lastOp == opId || hist.lastOrigin == change.origin && change.origin && (change.origin.charAt(0) == "+" && hist.lastModTime > time - (doc2.cm ? doc2.cm.options.historyEventDelay : 500) || change.origin.charAt(0) == "*")) && (cur = lastChangeEvent(hist, hist.lastOp == opId))) {
          last = lst(cur.changes);
          if (cmp(change.from, change.to) == 0 && cmp(change.from, last.to) == 0) {
            last.to = changeEnd(change);
          } else {
            cur.changes.push(historyChangeFromChange(doc2, change));
          }
        } else {
          var before = lst(hist.done);
          if (!before || !before.ranges) {
            pushSelectionToHistory(doc2.sel, hist.done);
          }
          cur = {
            changes: [historyChangeFromChange(doc2, change)],
            generation: hist.generation
          };
          hist.done.push(cur);
          while (hist.done.length > hist.undoDepth) {
            hist.done.shift();
            if (!hist.done[0].ranges) {
              hist.done.shift();
            }
          }
        }
        hist.done.push(selAfter);
        hist.generation = ++hist.maxGeneration;
        hist.lastModTime = hist.lastSelTime = time;
        hist.lastOp = hist.lastSelOp = opId;
        hist.lastOrigin = hist.lastSelOrigin = change.origin;
        if (!last) {
          signal(doc2, "historyAdded");
        }
      }
      function selectionEventCanBeMerged(doc2, origin, prev, sel) {
        var ch = origin.charAt(0);
        return ch == "*" || ch == "+" && prev.ranges.length == sel.ranges.length && prev.somethingSelected() == sel.somethingSelected() && /* @__PURE__ */ new Date() - doc2.history.lastSelTime <= (doc2.cm ? doc2.cm.options.historyEventDelay : 500);
      }
      function addSelectionToHistory(doc2, sel, opId, options) {
        var hist = doc2.history, origin = options && options.origin;
        if (opId == hist.lastSelOp || origin && hist.lastSelOrigin == origin && (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin || selectionEventCanBeMerged(doc2, origin, lst(hist.done), sel))) {
          hist.done[hist.done.length - 1] = sel;
        } else {
          pushSelectionToHistory(sel, hist.done);
        }
        hist.lastSelTime = +/* @__PURE__ */ new Date();
        hist.lastSelOrigin = origin;
        hist.lastSelOp = opId;
        if (options && options.clearRedo !== false) {
          clearSelectionEvents(hist.undone);
        }
      }
      function pushSelectionToHistory(sel, dest) {
        var top = lst(dest);
        if (!(top && top.ranges && top.equals(sel))) {
          dest.push(sel);
        }
      }
      function attachLocalSpans(doc2, change, from, to) {
        var existing = change["spans_" + doc2.id], n = 0;
        doc2.iter(Math.max(doc2.first, from), Math.min(doc2.first + doc2.size, to), function(line) {
          if (line.markedSpans) {
            (existing || (existing = change["spans_" + doc2.id] = {}))[n] = line.markedSpans;
          }
          ++n;
        });
      }
      function removeClearedSpans(spans) {
        if (!spans) {
          return null;
        }
        var out;
        for (var i2 = 0; i2 < spans.length; ++i2) {
          if (spans[i2].marker.explicitlyCleared) {
            if (!out) {
              out = spans.slice(0, i2);
            }
          } else if (out) {
            out.push(spans[i2]);
          }
        }
        return !out ? spans : out.length ? out : null;
      }
      function getOldSpans(doc2, change) {
        var found = change["spans_" + doc2.id];
        if (!found) {
          return null;
        }
        var nw = [];
        for (var i2 = 0; i2 < change.text.length; ++i2) {
          nw.push(removeClearedSpans(found[i2]));
        }
        return nw;
      }
      function mergeOldSpans(doc2, change) {
        var old = getOldSpans(doc2, change);
        var stretched = stretchSpansOverChange(doc2, change);
        if (!old) {
          return stretched;
        }
        if (!stretched) {
          return old;
        }
        for (var i2 = 0; i2 < old.length; ++i2) {
          var oldCur = old[i2], stretchCur = stretched[i2];
          if (oldCur && stretchCur) {
            spans: for (var j = 0; j < stretchCur.length; ++j) {
              var span = stretchCur[j];
              for (var k = 0; k < oldCur.length; ++k) {
                if (oldCur[k].marker == span.marker) {
                  continue spans;
                }
              }
              oldCur.push(span);
            }
          } else if (stretchCur) {
            old[i2] = stretchCur;
          }
        }
        return old;
      }
      function copyHistoryArray(events, newGroup, instantiateSel) {
        var copy = [];
        for (var i2 = 0; i2 < events.length; ++i2) {
          var event = events[i2];
          if (event.ranges) {
            copy.push(instantiateSel ? Selection.prototype.deepCopy.call(event) : event);
            continue;
          }
          var changes = event.changes, newChanges = [];
          copy.push({ changes: newChanges });
          for (var j = 0; j < changes.length; ++j) {
            var change = changes[j], m = void 0;
            newChanges.push({ from: change.from, to: change.to, text: change.text });
            if (newGroup) {
              for (var prop2 in change) {
                if (m = prop2.match(/^spans_(\d+)$/)) {
                  if (indexOf(newGroup, Number(m[1])) > -1) {
                    lst(newChanges)[prop2] = change[prop2];
                    delete change[prop2];
                  }
                }
              }
            }
          }
        }
        return copy;
      }
      function extendRange(range2, head, other, extend) {
        if (extend) {
          var anchor = range2.anchor;
          if (other) {
            var posBefore = cmp(head, anchor) < 0;
            if (posBefore != cmp(other, anchor) < 0) {
              anchor = head;
              head = other;
            } else if (posBefore != cmp(head, other) < 0) {
              head = other;
            }
          }
          return new Range(anchor, head);
        } else {
          return new Range(other || head, head);
        }
      }
      function extendSelection(doc2, head, other, options, extend) {
        if (extend == null) {
          extend = doc2.cm && (doc2.cm.display.shift || doc2.extend);
        }
        setSelection(doc2, new Selection([extendRange(doc2.sel.primary(), head, other, extend)], 0), options);
      }
      function extendSelections(doc2, heads, options) {
        var out = [];
        var extend = doc2.cm && (doc2.cm.display.shift || doc2.extend);
        for (var i2 = 0; i2 < doc2.sel.ranges.length; i2++) {
          out[i2] = extendRange(doc2.sel.ranges[i2], heads[i2], null, extend);
        }
        var newSel = normalizeSelection(doc2.cm, out, doc2.sel.primIndex);
        setSelection(doc2, newSel, options);
      }
      function replaceOneSelection(doc2, i2, range2, options) {
        var ranges = doc2.sel.ranges.slice(0);
        ranges[i2] = range2;
        setSelection(doc2, normalizeSelection(doc2.cm, ranges, doc2.sel.primIndex), options);
      }
      function setSimpleSelection(doc2, anchor, head, options) {
        setSelection(doc2, simpleSelection(anchor, head), options);
      }
      function filterSelectionChange(doc2, sel, options) {
        var obj = {
          ranges: sel.ranges,
          update: function(ranges) {
            this.ranges = [];
            for (var i2 = 0; i2 < ranges.length; i2++) {
              this.ranges[i2] = new Range(
                clipPos(doc2, ranges[i2].anchor),
                clipPos(doc2, ranges[i2].head)
              );
            }
          },
          origin: options && options.origin
        };
        signal(doc2, "beforeSelectionChange", doc2, obj);
        if (doc2.cm) {
          signal(doc2.cm, "beforeSelectionChange", doc2.cm, obj);
        }
        if (obj.ranges != sel.ranges) {
          return normalizeSelection(doc2.cm, obj.ranges, obj.ranges.length - 1);
        } else {
          return sel;
        }
      }
      function setSelectionReplaceHistory(doc2, sel, options) {
        var done = doc2.history.done, last = lst(done);
        if (last && last.ranges) {
          done[done.length - 1] = sel;
          setSelectionNoUndo(doc2, sel, options);
        } else {
          setSelection(doc2, sel, options);
        }
      }
      function setSelection(doc2, sel, options) {
        setSelectionNoUndo(doc2, sel, options);
        addSelectionToHistory(doc2, doc2.sel, doc2.cm ? doc2.cm.curOp.id : NaN, options);
      }
      function setSelectionNoUndo(doc2, sel, options) {
        if (hasHandler(doc2, "beforeSelectionChange") || doc2.cm && hasHandler(doc2.cm, "beforeSelectionChange")) {
          sel = filterSelectionChange(doc2, sel, options);
        }
        var bias = options && options.bias || (cmp(sel.primary().head, doc2.sel.primary().head) < 0 ? -1 : 1);
        setSelectionInner(doc2, skipAtomicInSelection(doc2, sel, bias, true));
        if (!(options && options.scroll === false) && doc2.cm && doc2.cm.getOption("readOnly") != "nocursor") {
          ensureCursorVisible(doc2.cm);
        }
      }
      function setSelectionInner(doc2, sel) {
        if (sel.equals(doc2.sel)) {
          return;
        }
        doc2.sel = sel;
        if (doc2.cm) {
          doc2.cm.curOp.updateInput = 1;
          doc2.cm.curOp.selectionChanged = true;
          signalCursorActivity(doc2.cm);
        }
        signalLater(doc2, "cursorActivity", doc2);
      }
      function reCheckSelection(doc2) {
        setSelectionInner(doc2, skipAtomicInSelection(doc2, doc2.sel, null, false));
      }
      function skipAtomicInSelection(doc2, sel, bias, mayClear) {
        var out;
        for (var i2 = 0; i2 < sel.ranges.length; i2++) {
          var range2 = sel.ranges[i2];
          var old = sel.ranges.length == doc2.sel.ranges.length && doc2.sel.ranges[i2];
          var newAnchor = skipAtomic(doc2, range2.anchor, old && old.anchor, bias, mayClear);
          var newHead = range2.head == range2.anchor ? newAnchor : skipAtomic(doc2, range2.head, old && old.head, bias, mayClear);
          if (out || newAnchor != range2.anchor || newHead != range2.head) {
            if (!out) {
              out = sel.ranges.slice(0, i2);
            }
            out[i2] = new Range(newAnchor, newHead);
          }
        }
        return out ? normalizeSelection(doc2.cm, out, sel.primIndex) : sel;
      }
      function skipAtomicInner(doc2, pos, oldPos, dir, mayClear) {
        var line = getLine(doc2, pos.line);
        if (line.markedSpans) {
          for (var i2 = 0; i2 < line.markedSpans.length; ++i2) {
            var sp = line.markedSpans[i2], m = sp.marker;
            var preventCursorLeft = "selectLeft" in m ? !m.selectLeft : m.inclusiveLeft;
            var preventCursorRight = "selectRight" in m ? !m.selectRight : m.inclusiveRight;
            if ((sp.from == null || (preventCursorLeft ? sp.from <= pos.ch : sp.from < pos.ch)) && (sp.to == null || (preventCursorRight ? sp.to >= pos.ch : sp.to > pos.ch))) {
              if (mayClear) {
                signal(m, "beforeCursorEnter");
                if (m.explicitlyCleared) {
                  if (!line.markedSpans) {
                    break;
                  } else {
                    --i2;
                    continue;
                  }
                }
              }
              if (!m.atomic) {
                continue;
              }
              if (oldPos) {
                var near = m.find(dir < 0 ? 1 : -1), diff2 = void 0;
                if (dir < 0 ? preventCursorRight : preventCursorLeft) {
                  near = movePos(doc2, near, -dir, near && near.line == pos.line ? line : null);
                }
                if (near && near.line == pos.line && (diff2 = cmp(near, oldPos)) && (dir < 0 ? diff2 < 0 : diff2 > 0)) {
                  return skipAtomicInner(doc2, near, pos, dir, mayClear);
                }
              }
              var far = m.find(dir < 0 ? -1 : 1);
              if (dir < 0 ? preventCursorLeft : preventCursorRight) {
                far = movePos(doc2, far, dir, far.line == pos.line ? line : null);
              }
              return far ? skipAtomicInner(doc2, far, pos, dir, mayClear) : null;
            }
          }
        }
        return pos;
      }
      function skipAtomic(doc2, pos, oldPos, bias, mayClear) {
        var dir = bias || 1;
        var found = skipAtomicInner(doc2, pos, oldPos, dir, mayClear) || !mayClear && skipAtomicInner(doc2, pos, oldPos, dir, true) || skipAtomicInner(doc2, pos, oldPos, -dir, mayClear) || !mayClear && skipAtomicInner(doc2, pos, oldPos, -dir, true);
        if (!found) {
          doc2.cantEdit = true;
          return Pos(doc2.first, 0);
        }
        return found;
      }
      function movePos(doc2, pos, dir, line) {
        if (dir < 0 && pos.ch == 0) {
          if (pos.line > doc2.first) {
            return clipPos(doc2, Pos(pos.line - 1));
          } else {
            return null;
          }
        } else if (dir > 0 && pos.ch == (line || getLine(doc2, pos.line)).text.length) {
          if (pos.line < doc2.first + doc2.size - 1) {
            return Pos(pos.line + 1, 0);
          } else {
            return null;
          }
        } else {
          return new Pos(pos.line, pos.ch + dir);
        }
      }
      function selectAll(cm) {
        cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()), sel_dontScroll);
      }
      function filterChange(doc2, change, update) {
        var obj = {
          canceled: false,
          from: change.from,
          to: change.to,
          text: change.text,
          origin: change.origin,
          cancel: function() {
            return obj.canceled = true;
          }
        };
        if (update) {
          obj.update = function(from, to, text, origin) {
            if (from) {
              obj.from = clipPos(doc2, from);
            }
            if (to) {
              obj.to = clipPos(doc2, to);
            }
            if (text) {
              obj.text = text;
            }
            if (origin !== void 0) {
              obj.origin = origin;
            }
          };
        }
        signal(doc2, "beforeChange", doc2, obj);
        if (doc2.cm) {
          signal(doc2.cm, "beforeChange", doc2.cm, obj);
        }
        if (obj.canceled) {
          if (doc2.cm) {
            doc2.cm.curOp.updateInput = 2;
          }
          return null;
        }
        return { from: obj.from, to: obj.to, text: obj.text, origin: obj.origin };
      }
      function makeChange(doc2, change, ignoreReadOnly) {
        if (doc2.cm) {
          if (!doc2.cm.curOp) {
            return operation(doc2.cm, makeChange)(doc2, change, ignoreReadOnly);
          }
          if (doc2.cm.state.suppressEdits) {
            return;
          }
        }
        if (hasHandler(doc2, "beforeChange") || doc2.cm && hasHandler(doc2.cm, "beforeChange")) {
          change = filterChange(doc2, change, true);
          if (!change) {
            return;
          }
        }
        var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc2, change.from, change.to);
        if (split) {
          for (var i2 = split.length - 1; i2 >= 0; --i2) {
            makeChangeInner(doc2, { from: split[i2].from, to: split[i2].to, text: i2 ? [""] : change.text, origin: change.origin });
          }
        } else {
          makeChangeInner(doc2, change);
        }
      }
      function makeChangeInner(doc2, change) {
        if (change.text.length == 1 && change.text[0] == "" && cmp(change.from, change.to) == 0) {
          return;
        }
        var selAfter = computeSelAfterChange(doc2, change);
        addChangeToHistory(doc2, change, selAfter, doc2.cm ? doc2.cm.curOp.id : NaN);
        makeChangeSingleDoc(doc2, change, selAfter, stretchSpansOverChange(doc2, change));
        var rebased = [];
        linkedDocs(doc2, function(doc3, sharedHist) {
          if (!sharedHist && indexOf(rebased, doc3.history) == -1) {
            rebaseHist(doc3.history, change);
            rebased.push(doc3.history);
          }
          makeChangeSingleDoc(doc3, change, null, stretchSpansOverChange(doc3, change));
        });
      }
      function makeChangeFromHistory(doc2, type, allowSelectionOnly) {
        var suppress = doc2.cm && doc2.cm.state.suppressEdits;
        if (suppress && !allowSelectionOnly) {
          return;
        }
        var hist = doc2.history, event, selAfter = doc2.sel;
        var source = type == "undo" ? hist.done : hist.undone, dest = type == "undo" ? hist.undone : hist.done;
        var i2 = 0;
        for (; i2 < source.length; i2++) {
          event = source[i2];
          if (allowSelectionOnly ? event.ranges && !event.equals(doc2.sel) : !event.ranges) {
            break;
          }
        }
        if (i2 == source.length) {
          return;
        }
        hist.lastOrigin = hist.lastSelOrigin = null;
        for (; ; ) {
          event = source.pop();
          if (event.ranges) {
            pushSelectionToHistory(event, dest);
            if (allowSelectionOnly && !event.equals(doc2.sel)) {
              setSelection(doc2, event, { clearRedo: false });
              return;
            }
            selAfter = event;
          } else if (suppress) {
            source.push(event);
            return;
          } else {
            break;
          }
        }
        var antiChanges = [];
        pushSelectionToHistory(selAfter, dest);
        dest.push({ changes: antiChanges, generation: hist.generation });
        hist.generation = event.generation || ++hist.maxGeneration;
        var filter = hasHandler(doc2, "beforeChange") || doc2.cm && hasHandler(doc2.cm, "beforeChange");
        var loop = function(i3) {
          var change = event.changes[i3];
          change.origin = type;
          if (filter && !filterChange(doc2, change, false)) {
            source.length = 0;
            return {};
          }
          antiChanges.push(historyChangeFromChange(doc2, change));
          var after = i3 ? computeSelAfterChange(doc2, change) : lst(source);
          makeChangeSingleDoc(doc2, change, after, mergeOldSpans(doc2, change));
          if (!i3 && doc2.cm) {
            doc2.cm.scrollIntoView({ from: change.from, to: changeEnd(change) });
          }
          var rebased = [];
          linkedDocs(doc2, function(doc3, sharedHist) {
            if (!sharedHist && indexOf(rebased, doc3.history) == -1) {
              rebaseHist(doc3.history, change);
              rebased.push(doc3.history);
            }
            makeChangeSingleDoc(doc3, change, null, mergeOldSpans(doc3, change));
          });
        };
        for (var i$12 = event.changes.length - 1; i$12 >= 0; --i$12) {
          var returned = loop(i$12);
          if (returned) return returned.v;
        }
      }
      function shiftDoc(doc2, distance2) {
        if (distance2 == 0) {
          return;
        }
        doc2.first += distance2;
        doc2.sel = new Selection(map(doc2.sel.ranges, function(range2) {
          return new Range(
            Pos(range2.anchor.line + distance2, range2.anchor.ch),
            Pos(range2.head.line + distance2, range2.head.ch)
          );
        }), doc2.sel.primIndex);
        if (doc2.cm) {
          regChange(doc2.cm, doc2.first, doc2.first - distance2, distance2);
          for (var d = doc2.cm.display, l = d.viewFrom; l < d.viewTo; l++) {
            regLineChange(doc2.cm, l, "gutter");
          }
        }
      }
      function makeChangeSingleDoc(doc2, change, selAfter, spans) {
        if (doc2.cm && !doc2.cm.curOp) {
          return operation(doc2.cm, makeChangeSingleDoc)(doc2, change, selAfter, spans);
        }
        if (change.to.line < doc2.first) {
          shiftDoc(doc2, change.text.length - 1 - (change.to.line - change.from.line));
          return;
        }
        if (change.from.line > doc2.lastLine()) {
          return;
        }
        if (change.from.line < doc2.first) {
          var shift = change.text.length - 1 - (doc2.first - change.from.line);
          shiftDoc(doc2, shift);
          change = {
            from: Pos(doc2.first, 0),
            to: Pos(change.to.line + shift, change.to.ch),
            text: [lst(change.text)],
            origin: change.origin
          };
        }
        var last = doc2.lastLine();
        if (change.to.line > last) {
          change = {
            from: change.from,
            to: Pos(last, getLine(doc2, last).text.length),
            text: [change.text[0]],
            origin: change.origin
          };
        }
        change.removed = getBetween(doc2, change.from, change.to);
        if (!selAfter) {
          selAfter = computeSelAfterChange(doc2, change);
        }
        if (doc2.cm) {
          makeChangeSingleDocInEditor(doc2.cm, change, spans);
        } else {
          updateDoc(doc2, change, spans);
        }
        setSelectionNoUndo(doc2, selAfter, sel_dontScroll);
        if (doc2.cantEdit && skipAtomic(doc2, Pos(doc2.firstLine(), 0))) {
          doc2.cantEdit = false;
        }
      }
      function makeChangeSingleDocInEditor(cm, change, spans) {
        var doc2 = cm.doc, display = cm.display, from = change.from, to = change.to;
        var recomputeMaxLength = false, checkWidthStart = from.line;
        if (!cm.options.lineWrapping) {
          checkWidthStart = lineNo(visualLine(getLine(doc2, from.line)));
          doc2.iter(checkWidthStart, to.line + 1, function(line) {
            if (line == display.maxLine) {
              recomputeMaxLength = true;
              return true;
            }
          });
        }
        if (doc2.sel.contains(change.from, change.to) > -1) {
          signalCursorActivity(cm);
        }
        updateDoc(doc2, change, spans, estimateHeight(cm));
        if (!cm.options.lineWrapping) {
          doc2.iter(checkWidthStart, from.line + change.text.length, function(line) {
            var len = lineLength(line);
            if (len > display.maxLineLength) {
              display.maxLine = line;
              display.maxLineLength = len;
              display.maxLineChanged = true;
              recomputeMaxLength = false;
            }
          });
          if (recomputeMaxLength) {
            cm.curOp.updateMaxLine = true;
          }
        }
        retreatFrontier(doc2, from.line);
        startWorker(cm, 400);
        var lendiff = change.text.length - (to.line - from.line) - 1;
        if (change.full) {
          regChange(cm);
        } else if (from.line == to.line && change.text.length == 1 && !isWholeLineUpdate(cm.doc, change)) {
          regLineChange(cm, from.line, "text");
        } else {
          regChange(cm, from.line, to.line + 1, lendiff);
        }
        var changesHandler = hasHandler(cm, "changes"), changeHandler = hasHandler(cm, "change");
        if (changeHandler || changesHandler) {
          var obj = {
            from,
            to,
            text: change.text,
            removed: change.removed,
            origin: change.origin
          };
          if (changeHandler) {
            signalLater(cm, "change", cm, obj);
          }
          if (changesHandler) {
            (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj);
          }
        }
        cm.display.selForContextMenu = null;
      }
      function replaceRange(doc2, code, from, to, origin) {
        var assign;
        if (!to) {
          to = from;
        }
        if (cmp(to, from) < 0) {
          assign = [to, from], from = assign[0], to = assign[1];
        }
        if (typeof code == "string") {
          code = doc2.splitLines(code);
        }
        makeChange(doc2, { from, to, text: code, origin });
      }
      function rebaseHistSelSingle(pos, from, to, diff2) {
        if (to < pos.line) {
          pos.line += diff2;
        } else if (from < pos.line) {
          pos.line = from;
          pos.ch = 0;
        }
      }
      function rebaseHistArray(array, from, to, diff2) {
        for (var i2 = 0; i2 < array.length; ++i2) {
          var sub = array[i2], ok = true;
          if (sub.ranges) {
            if (!sub.copied) {
              sub = array[i2] = sub.deepCopy();
              sub.copied = true;
            }
            for (var j = 0; j < sub.ranges.length; j++) {
              rebaseHistSelSingle(sub.ranges[j].anchor, from, to, diff2);
              rebaseHistSelSingle(sub.ranges[j].head, from, to, diff2);
            }
            continue;
          }
          for (var j$1 = 0; j$1 < sub.changes.length; ++j$1) {
            var cur = sub.changes[j$1];
            if (to < cur.from.line) {
              cur.from = Pos(cur.from.line + diff2, cur.from.ch);
              cur.to = Pos(cur.to.line + diff2, cur.to.ch);
            } else if (from <= cur.to.line) {
              ok = false;
              break;
            }
          }
          if (!ok) {
            array.splice(0, i2 + 1);
            i2 = 0;
          }
        }
      }
      function rebaseHist(hist, change) {
        var from = change.from.line, to = change.to.line, diff2 = change.text.length - (to - from) - 1;
        rebaseHistArray(hist.done, from, to, diff2);
        rebaseHistArray(hist.undone, from, to, diff2);
      }
      function changeLine(doc2, handle, changeType, op) {
        var no = handle, line = handle;
        if (typeof handle == "number") {
          line = getLine(doc2, clipLine(doc2, handle));
        } else {
          no = lineNo(handle);
        }
        if (no == null) {
          return null;
        }
        if (op(line, no) && doc2.cm) {
          regLineChange(doc2.cm, no, changeType);
        }
        return line;
      }
      function LeafChunk(lines) {
        this.lines = lines;
        this.parent = null;
        var height = 0;
        for (var i2 = 0; i2 < lines.length; ++i2) {
          lines[i2].parent = this;
          height += lines[i2].height;
        }
        this.height = height;
      }
      LeafChunk.prototype = {
        chunkSize: function() {
          return this.lines.length;
        },
        // Remove the n lines at offset 'at'.
        removeInner: function(at, n) {
          for (var i2 = at, e = at + n; i2 < e; ++i2) {
            var line = this.lines[i2];
            this.height -= line.height;
            cleanUpLine(line);
            signalLater(line, "delete");
          }
          this.lines.splice(at, n);
        },
        // Helper used to collapse a small branch into a single leaf.
        collapse: function(lines) {
          lines.push.apply(lines, this.lines);
        },
        // Insert the given array of lines at offset 'at', count them as
        // having the given height.
        insertInner: function(at, lines, height) {
          this.height += height;
          this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
          for (var i2 = 0; i2 < lines.length; ++i2) {
            lines[i2].parent = this;
          }
        },
        // Used to iterate over a part of the tree.
        iterN: function(at, n, op) {
          for (var e = at + n; at < e; ++at) {
            if (op(this.lines[at])) {
              return true;
            }
          }
        }
      };
      function BranchChunk(children) {
        this.children = children;
        var size = 0, height = 0;
        for (var i2 = 0; i2 < children.length; ++i2) {
          var ch = children[i2];
          size += ch.chunkSize();
          height += ch.height;
          ch.parent = this;
        }
        this.size = size;
        this.height = height;
        this.parent = null;
      }
      BranchChunk.prototype = {
        chunkSize: function() {
          return this.size;
        },
        removeInner: function(at, n) {
          this.size -= n;
          for (var i2 = 0; i2 < this.children.length; ++i2) {
            var child = this.children[i2], sz = child.chunkSize();
            if (at < sz) {
              var rm = Math.min(n, sz - at), oldHeight = child.height;
              child.removeInner(at, rm);
              this.height -= oldHeight - child.height;
              if (sz == rm) {
                this.children.splice(i2--, 1);
                child.parent = null;
              }
              if ((n -= rm) == 0) {
                break;
              }
              at = 0;
            } else {
              at -= sz;
            }
          }
          if (this.size - n < 25 && (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
            var lines = [];
            this.collapse(lines);
            this.children = [new LeafChunk(lines)];
            this.children[0].parent = this;
          }
        },
        collapse: function(lines) {
          for (var i2 = 0; i2 < this.children.length; ++i2) {
            this.children[i2].collapse(lines);
          }
        },
        insertInner: function(at, lines, height) {
          this.size += lines.length;
          this.height += height;
          for (var i2 = 0; i2 < this.children.length; ++i2) {
            var child = this.children[i2], sz = child.chunkSize();
            if (at <= sz) {
              child.insertInner(at, lines, height);
              if (child.lines && child.lines.length > 50) {
                var remaining = child.lines.length % 25 + 25;
                for (var pos = remaining; pos < child.lines.length; ) {
                  var leaf = new LeafChunk(child.lines.slice(pos, pos += 25));
                  child.height -= leaf.height;
                  this.children.splice(++i2, 0, leaf);
                  leaf.parent = this;
                }
                child.lines = child.lines.slice(0, remaining);
                this.maybeSpill();
              }
              break;
            }
            at -= sz;
          }
        },
        // When a node has grown, check whether it should be split.
        maybeSpill: function() {
          if (this.children.length <= 10) {
            return;
          }
          var me = this;
          do {
            var spilled = me.children.splice(me.children.length - 5, 5);
            var sibling = new BranchChunk(spilled);
            if (!me.parent) {
              var copy = new BranchChunk(me.children);
              copy.parent = me;
              me.children = [copy, sibling];
              me = copy;
            } else {
              me.size -= sibling.size;
              me.height -= sibling.height;
              var myIndex = indexOf(me.parent.children, me);
              me.parent.children.splice(myIndex + 1, 0, sibling);
            }
            sibling.parent = me.parent;
          } while (me.children.length > 10);
          me.parent.maybeSpill();
        },
        iterN: function(at, n, op) {
          for (var i2 = 0; i2 < this.children.length; ++i2) {
            var child = this.children[i2], sz = child.chunkSize();
            if (at < sz) {
              var used = Math.min(n, sz - at);
              if (child.iterN(at, used, op)) {
                return true;
              }
              if ((n -= used) == 0) {
                break;
              }
              at = 0;
            } else {
              at -= sz;
            }
          }
        }
      };
      var LineWidget = function(doc2, node, options) {
        if (options) {
          for (var opt in options) {
            if (options.hasOwnProperty(opt)) {
              this[opt] = options[opt];
            }
          }
        }
        this.doc = doc2;
        this.node = node;
      };
      LineWidget.prototype.clear = function() {
        var cm = this.doc.cm, ws = this.line.widgets, line = this.line, no = lineNo(line);
        if (no == null || !ws) {
          return;
        }
        for (var i2 = 0; i2 < ws.length; ++i2) {
          if (ws[i2] == this) {
            ws.splice(i2--, 1);
          }
        }
        if (!ws.length) {
          line.widgets = null;
        }
        var height = widgetHeight(this);
        updateLineHeight(line, Math.max(0, line.height - height));
        if (cm) {
          runInOp(cm, function() {
            adjustScrollWhenAboveVisible(cm, line, -height);
            regLineChange(cm, no, "widget");
          });
          signalLater(cm, "lineWidgetCleared", cm, this, no);
        }
      };
      LineWidget.prototype.changed = function() {
        var this$1$1 = this;
        var oldH = this.height, cm = this.doc.cm, line = this.line;
        this.height = null;
        var diff2 = widgetHeight(this) - oldH;
        if (!diff2) {
          return;
        }
        if (!lineIsHidden(this.doc, line)) {
          updateLineHeight(line, line.height + diff2);
        }
        if (cm) {
          runInOp(cm, function() {
            cm.curOp.forceUpdate = true;
            adjustScrollWhenAboveVisible(cm, line, diff2);
            signalLater(cm, "lineWidgetChanged", cm, this$1$1, lineNo(line));
          });
        }
      };
      eventMixin(LineWidget);
      function adjustScrollWhenAboveVisible(cm, line, diff2) {
        if (heightAtLine(line) < (cm.curOp && cm.curOp.scrollTop || cm.doc.scrollTop)) {
          addToScrollTop(cm, diff2);
        }
      }
      function addLineWidget(doc2, handle, node, options) {
        var widget = new LineWidget(doc2, node, options);
        var cm = doc2.cm;
        if (cm && widget.noHScroll) {
          cm.display.alignWidgets = true;
        }
        changeLine(doc2, handle, "widget", function(line) {
          var widgets = line.widgets || (line.widgets = []);
          if (widget.insertAt == null) {
            widgets.push(widget);
          } else {
            widgets.splice(Math.min(widgets.length, Math.max(0, widget.insertAt)), 0, widget);
          }
          widget.line = line;
          if (cm && !lineIsHidden(doc2, line)) {
            var aboveVisible = heightAtLine(line) < doc2.scrollTop;
            updateLineHeight(line, line.height + widgetHeight(widget));
            if (aboveVisible) {
              addToScrollTop(cm, widget.height);
            }
            cm.curOp.forceUpdate = true;
          }
          return true;
        });
        if (cm) {
          signalLater(cm, "lineWidgetAdded", cm, widget, typeof handle == "number" ? handle : lineNo(handle));
        }
        return widget;
      }
      var nextMarkerId = 0;
      var TextMarker = function(doc2, type) {
        this.lines = [];
        this.type = type;
        this.doc = doc2;
        this.id = ++nextMarkerId;
      };
      TextMarker.prototype.clear = function() {
        if (this.explicitlyCleared) {
          return;
        }
        var cm = this.doc.cm, withOp = cm && !cm.curOp;
        if (withOp) {
          startOperation(cm);
        }
        if (hasHandler(this, "clear")) {
          var found = this.find();
          if (found) {
            signalLater(this, "clear", found.from, found.to);
          }
        }
        var min = null, max2 = null;
        for (var i2 = 0; i2 < this.lines.length; ++i2) {
          var line = this.lines[i2];
          var span = getMarkedSpanFor(line.markedSpans, this);
          if (cm && !this.collapsed) {
            regLineChange(cm, lineNo(line), "text");
          } else if (cm) {
            if (span.to != null) {
              max2 = lineNo(line);
            }
            if (span.from != null) {
              min = lineNo(line);
            }
          }
          line.markedSpans = removeMarkedSpan(line.markedSpans, span);
          if (span.from == null && this.collapsed && !lineIsHidden(this.doc, line) && cm) {
            updateLineHeight(line, textHeight(cm.display));
          }
        }
        if (cm && this.collapsed && !cm.options.lineWrapping) {
          for (var i$12 = 0; i$12 < this.lines.length; ++i$12) {
            var visual = visualLine(this.lines[i$12]), len = lineLength(visual);
            if (len > cm.display.maxLineLength) {
              cm.display.maxLine = visual;
              cm.display.maxLineLength = len;
              cm.display.maxLineChanged = true;
            }
          }
        }
        if (min != null && cm && this.collapsed) {
          regChange(cm, min, max2 + 1);
        }
        this.lines.length = 0;
        this.explicitlyCleared = true;
        if (this.atomic && this.doc.cantEdit) {
          this.doc.cantEdit = false;
          if (cm) {
            reCheckSelection(cm.doc);
          }
        }
        if (cm) {
          signalLater(cm, "markerCleared", cm, this, min, max2);
        }
        if (withOp) {
          endOperation(cm);
        }
        if (this.parent) {
          this.parent.clear();
        }
      };
      TextMarker.prototype.find = function(side, lineObj) {
        if (side == null && this.type == "bookmark") {
          side = 1;
        }
        var from, to;
        for (var i2 = 0; i2 < this.lines.length; ++i2) {
          var line = this.lines[i2];
          var span = getMarkedSpanFor(line.markedSpans, this);
          if (span.from != null) {
            from = Pos(lineObj ? line : lineNo(line), span.from);
            if (side == -1) {
              return from;
            }
          }
          if (span.to != null) {
            to = Pos(lineObj ? line : lineNo(line), span.to);
            if (side == 1) {
              return to;
            }
          }
        }
        return from && { from, to };
      };
      TextMarker.prototype.changed = function() {
        var this$1$1 = this;
        var pos = this.find(-1, true), widget = this, cm = this.doc.cm;
        if (!pos || !cm) {
          return;
        }
        runInOp(cm, function() {
          var line = pos.line, lineN = lineNo(pos.line);
          var view = findViewForLine(cm, lineN);
          if (view) {
            clearLineMeasurementCacheFor(view);
            cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
          }
          cm.curOp.updateMaxLine = true;
          if (!lineIsHidden(widget.doc, line) && widget.height != null) {
            var oldHeight = widget.height;
            widget.height = null;
            var dHeight = widgetHeight(widget) - oldHeight;
            if (dHeight) {
              updateLineHeight(line, line.height + dHeight);
            }
          }
          signalLater(cm, "markerChanged", cm, this$1$1);
        });
      };
      TextMarker.prototype.attachLine = function(line) {
        if (!this.lines.length && this.doc.cm) {
          var op = this.doc.cm.curOp;
          if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1) {
            (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
          }
        }
        this.lines.push(line);
      };
      TextMarker.prototype.detachLine = function(line) {
        this.lines.splice(indexOf(this.lines, line), 1);
        if (!this.lines.length && this.doc.cm) {
          var op = this.doc.cm.curOp;
          (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
        }
      };
      eventMixin(TextMarker);
      function markText(doc2, from, to, options, type) {
        if (options && options.shared) {
          return markTextShared(doc2, from, to, options, type);
        }
        if (doc2.cm && !doc2.cm.curOp) {
          return operation(doc2.cm, markText)(doc2, from, to, options, type);
        }
        var marker = new TextMarker(doc2, type), diff2 = cmp(from, to);
        if (options) {
          copyObj(options, marker, false);
        }
        if (diff2 > 0 || diff2 == 0 && marker.clearWhenEmpty !== false) {
          return marker;
        }
        if (marker.replacedWith) {
          marker.collapsed = true;
          marker.widgetNode = eltP("span", [marker.replacedWith], "CodeMirror-widget");
          if (!options.handleMouseEvents) {
            marker.widgetNode.setAttribute("cm-ignore-events", "true");
          }
          if (options.insertLeft) {
            marker.widgetNode.insertLeft = true;
          }
        }
        if (marker.collapsed) {
          if (conflictingCollapsedRange(doc2, from.line, from, to, marker) || from.line != to.line && conflictingCollapsedRange(doc2, to.line, from, to, marker)) {
            throw new Error("Inserting collapsed marker partially overlapping an existing one");
          }
          seeCollapsedSpans();
        }
        if (marker.addToHistory) {
          addChangeToHistory(doc2, { from, to, origin: "markText" }, doc2.sel, NaN);
        }
        var curLine = from.line, cm = doc2.cm, updateMaxLine;
        doc2.iter(curLine, to.line + 1, function(line) {
          if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(line) == cm.display.maxLine) {
            updateMaxLine = true;
          }
          if (marker.collapsed && curLine != from.line) {
            updateLineHeight(line, 0);
          }
          addMarkedSpan(line, new MarkedSpan(
            marker,
            curLine == from.line ? from.ch : null,
            curLine == to.line ? to.ch : null
          ), doc2.cm && doc2.cm.curOp);
          ++curLine;
        });
        if (marker.collapsed) {
          doc2.iter(from.line, to.line + 1, function(line) {
            if (lineIsHidden(doc2, line)) {
              updateLineHeight(line, 0);
            }
          });
        }
        if (marker.clearOnEnter) {
          on(marker, "beforeCursorEnter", function() {
            return marker.clear();
          });
        }
        if (marker.readOnly) {
          seeReadOnlySpans();
          if (doc2.history.done.length || doc2.history.undone.length) {
            doc2.clearHistory();
          }
        }
        if (marker.collapsed) {
          marker.id = ++nextMarkerId;
          marker.atomic = true;
        }
        if (cm) {
          if (updateMaxLine) {
            cm.curOp.updateMaxLine = true;
          }
          if (marker.collapsed) {
            regChange(cm, from.line, to.line + 1);
          } else if (marker.className || marker.startStyle || marker.endStyle || marker.css || marker.attributes || marker.title) {
            for (var i2 = from.line; i2 <= to.line; i2++) {
              regLineChange(cm, i2, "text");
            }
          }
          if (marker.atomic) {
            reCheckSelection(cm.doc);
          }
          signalLater(cm, "markerAdded", cm, marker);
        }
        return marker;
      }
      var SharedTextMarker = function(markers, primary) {
        this.markers = markers;
        this.primary = primary;
        for (var i2 = 0; i2 < markers.length; ++i2) {
          markers[i2].parent = this;
        }
      };
      SharedTextMarker.prototype.clear = function() {
        if (this.explicitlyCleared) {
          return;
        }
        this.explicitlyCleared = true;
        for (var i2 = 0; i2 < this.markers.length; ++i2) {
          this.markers[i2].clear();
        }
        signalLater(this, "clear");
      };
      SharedTextMarker.prototype.find = function(side, lineObj) {
        return this.primary.find(side, lineObj);
      };
      eventMixin(SharedTextMarker);
      function markTextShared(doc2, from, to, options, type) {
        options = copyObj(options);
        options.shared = false;
        var markers = [markText(doc2, from, to, options, type)], primary = markers[0];
        var widget = options.widgetNode;
        linkedDocs(doc2, function(doc3) {
          if (widget) {
            options.widgetNode = widget.cloneNode(true);
          }
          markers.push(markText(doc3, clipPos(doc3, from), clipPos(doc3, to), options, type));
          for (var i2 = 0; i2 < doc3.linked.length; ++i2) {
            if (doc3.linked[i2].isParent) {
              return;
            }
          }
          primary = lst(markers);
        });
        return new SharedTextMarker(markers, primary);
      }
      function findSharedMarkers(doc2) {
        return doc2.findMarks(Pos(doc2.first, 0), doc2.clipPos(Pos(doc2.lastLine())), function(m) {
          return m.parent;
        });
      }
      function copySharedMarkers(doc2, markers) {
        for (var i2 = 0; i2 < markers.length; i2++) {
          var marker = markers[i2], pos = marker.find();
          var mFrom = doc2.clipPos(pos.from), mTo = doc2.clipPos(pos.to);
          if (cmp(mFrom, mTo)) {
            var subMark = markText(doc2, mFrom, mTo, marker.primary, marker.primary.type);
            marker.markers.push(subMark);
            subMark.parent = marker;
          }
        }
      }
      function detachSharedMarkers(markers) {
        var loop = function(i3) {
          var marker = markers[i3], linked = [marker.primary.doc];
          linkedDocs(marker.primary.doc, function(d) {
            return linked.push(d);
          });
          for (var j = 0; j < marker.markers.length; j++) {
            var subMarker = marker.markers[j];
            if (indexOf(linked, subMarker.doc) == -1) {
              subMarker.parent = null;
              marker.markers.splice(j--, 1);
            }
          }
        };
        for (var i2 = 0; i2 < markers.length; i2++) loop(i2);
      }
      var nextDocId = 0;
      var Doc = function(text, mode, firstLine, lineSep, direction) {
        if (!(this instanceof Doc)) {
          return new Doc(text, mode, firstLine, lineSep, direction);
        }
        if (firstLine == null) {
          firstLine = 0;
        }
        BranchChunk.call(this, [new LeafChunk([new Line("", null)])]);
        this.first = firstLine;
        this.scrollTop = this.scrollLeft = 0;
        this.cantEdit = false;
        this.cleanGeneration = 1;
        this.modeFrontier = this.highlightFrontier = firstLine;
        var start = Pos(firstLine, 0);
        this.sel = simpleSelection(start);
        this.history = new History(null);
        this.id = ++nextDocId;
        this.modeOption = mode;
        this.lineSep = lineSep;
        this.direction = direction == "rtl" ? "rtl" : "ltr";
        this.extend = false;
        if (typeof text == "string") {
          text = this.splitLines(text);
        }
        updateDoc(this, { from: start, to: start, text });
        setSelection(this, simpleSelection(start), sel_dontScroll);
      };
      Doc.prototype = createObj(BranchChunk.prototype, {
        constructor: Doc,
        // Iterate over the document. Supports two forms -- with only one
        // argument, it calls that for each line in the document. With
        // three, it iterates over the range given by the first two (with
        // the second being non-inclusive).
        iter: function(from, to, op) {
          if (op) {
            this.iterN(from - this.first, to - from, op);
          } else {
            this.iterN(this.first, this.first + this.size, from);
          }
        },
        // Non-public interface for adding and removing lines.
        insert: function(at, lines) {
          var height = 0;
          for (var i2 = 0; i2 < lines.length; ++i2) {
            height += lines[i2].height;
          }
          this.insertInner(at - this.first, lines, height);
        },
        remove: function(at, n) {
          this.removeInner(at - this.first, n);
        },
        // From here, the methods are part of the public interface. Most
        // are also available from CodeMirror (editor) instances.
        getValue: function(lineSep) {
          var lines = getLines(this, this.first, this.first + this.size);
          if (lineSep === false) {
            return lines;
          }
          return lines.join(lineSep || this.lineSeparator());
        },
        setValue: docMethodOp(function(code) {
          var top = Pos(this.first, 0), last = this.first + this.size - 1;
          makeChange(this, {
            from: top,
            to: Pos(last, getLine(this, last).text.length),
            text: this.splitLines(code),
            origin: "setValue",
            full: true
          }, true);
          if (this.cm) {
            scrollToCoords(this.cm, 0, 0);
          }
          setSelection(this, simpleSelection(top), sel_dontScroll);
        }),
        replaceRange: function(code, from, to, origin) {
          from = clipPos(this, from);
          to = to ? clipPos(this, to) : from;
          replaceRange(this, code, from, to, origin);
        },
        getRange: function(from, to, lineSep) {
          var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
          if (lineSep === false) {
            return lines;
          }
          if (lineSep === "") {
            return lines.join("");
          }
          return lines.join(lineSep || this.lineSeparator());
        },
        getLine: function(line) {
          var l = this.getLineHandle(line);
          return l && l.text;
        },
        getLineHandle: function(line) {
          if (isLine(this, line)) {
            return getLine(this, line);
          }
        },
        getLineNumber: function(line) {
          return lineNo(line);
        },
        getLineHandleVisualStart: function(line) {
          if (typeof line == "number") {
            line = getLine(this, line);
          }
          return visualLine(line);
        },
        lineCount: function() {
          return this.size;
        },
        firstLine: function() {
          return this.first;
        },
        lastLine: function() {
          return this.first + this.size - 1;
        },
        clipPos: function(pos) {
          return clipPos(this, pos);
        },
        getCursor: function(start) {
          var range2 = this.sel.primary(), pos;
          if (start == null || start == "head") {
            pos = range2.head;
          } else if (start == "anchor") {
            pos = range2.anchor;
          } else if (start == "end" || start == "to" || start === false) {
            pos = range2.to();
          } else {
            pos = range2.from();
          }
          return pos;
        },
        listSelections: function() {
          return this.sel.ranges;
        },
        somethingSelected: function() {
          return this.sel.somethingSelected();
        },
        setCursor: docMethodOp(function(line, ch, options) {
          setSimpleSelection(this, clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line), null, options);
        }),
        setSelection: docMethodOp(function(anchor, head, options) {
          setSimpleSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), options);
        }),
        extendSelection: docMethodOp(function(head, other, options) {
          extendSelection(this, clipPos(this, head), other && clipPos(this, other), options);
        }),
        extendSelections: docMethodOp(function(heads, options) {
          extendSelections(this, clipPosArray(this, heads), options);
        }),
        extendSelectionsBy: docMethodOp(function(f, options) {
          var heads = map(this.sel.ranges, f);
          extendSelections(this, clipPosArray(this, heads), options);
        }),
        setSelections: docMethodOp(function(ranges, primary, options) {
          if (!ranges.length) {
            return;
          }
          var out = [];
          for (var i2 = 0; i2 < ranges.length; i2++) {
            out[i2] = new Range(
              clipPos(this, ranges[i2].anchor),
              clipPos(this, ranges[i2].head || ranges[i2].anchor)
            );
          }
          if (primary == null) {
            primary = Math.min(ranges.length - 1, this.sel.primIndex);
          }
          setSelection(this, normalizeSelection(this.cm, out, primary), options);
        }),
        addSelection: docMethodOp(function(anchor, head, options) {
          var ranges = this.sel.ranges.slice(0);
          ranges.push(new Range(clipPos(this, anchor), clipPos(this, head || anchor)));
          setSelection(this, normalizeSelection(this.cm, ranges, ranges.length - 1), options);
        }),
        getSelection: function(lineSep) {
          var ranges = this.sel.ranges, lines;
          for (var i2 = 0; i2 < ranges.length; i2++) {
            var sel = getBetween(this, ranges[i2].from(), ranges[i2].to());
            lines = lines ? lines.concat(sel) : sel;
          }
          if (lineSep === false) {
            return lines;
          } else {
            return lines.join(lineSep || this.lineSeparator());
          }
        },
        getSelections: function(lineSep) {
          var parts = [], ranges = this.sel.ranges;
          for (var i2 = 0; i2 < ranges.length; i2++) {
            var sel = getBetween(this, ranges[i2].from(), ranges[i2].to());
            if (lineSep !== false) {
              sel = sel.join(lineSep || this.lineSeparator());
            }
            parts[i2] = sel;
          }
          return parts;
        },
        replaceSelection: function(code, collapse, origin) {
          var dup = [];
          for (var i2 = 0; i2 < this.sel.ranges.length; i2++) {
            dup[i2] = code;
          }
          this.replaceSelections(dup, collapse, origin || "+input");
        },
        replaceSelections: docMethodOp(function(code, collapse, origin) {
          var changes = [], sel = this.sel;
          for (var i2 = 0; i2 < sel.ranges.length; i2++) {
            var range2 = sel.ranges[i2];
            changes[i2] = { from: range2.from(), to: range2.to(), text: this.splitLines(code[i2]), origin };
          }
          var newSel = collapse && collapse != "end" && computeReplacedSel(this, changes, collapse);
          for (var i$12 = changes.length - 1; i$12 >= 0; i$12--) {
            makeChange(this, changes[i$12]);
          }
          if (newSel) {
            setSelectionReplaceHistory(this, newSel);
          } else if (this.cm) {
            ensureCursorVisible(this.cm);
          }
        }),
        undo: docMethodOp(function() {
          makeChangeFromHistory(this, "undo");
        }),
        redo: docMethodOp(function() {
          makeChangeFromHistory(this, "redo");
        }),
        undoSelection: docMethodOp(function() {
          makeChangeFromHistory(this, "undo", true);
        }),
        redoSelection: docMethodOp(function() {
          makeChangeFromHistory(this, "redo", true);
        }),
        setExtending: function(val) {
          this.extend = val;
        },
        getExtending: function() {
          return this.extend;
        },
        historySize: function() {
          var hist = this.history, done = 0, undone = 0;
          for (var i2 = 0; i2 < hist.done.length; i2++) {
            if (!hist.done[i2].ranges) {
              ++done;
            }
          }
          for (var i$12 = 0; i$12 < hist.undone.length; i$12++) {
            if (!hist.undone[i$12].ranges) {
              ++undone;
            }
          }
          return { undo: done, redo: undone };
        },
        clearHistory: function() {
          var this$1$1 = this;
          this.history = new History(this.history);
          linkedDocs(this, function(doc2) {
            return doc2.history = this$1$1.history;
          }, true);
        },
        markClean: function() {
          this.cleanGeneration = this.changeGeneration(true);
        },
        changeGeneration: function(forceSplit) {
          if (forceSplit) {
            this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
          }
          return this.history.generation;
        },
        isClean: function(gen) {
          return this.history.generation == (gen || this.cleanGeneration);
        },
        getHistory: function() {
          return {
            done: copyHistoryArray(this.history.done),
            undone: copyHistoryArray(this.history.undone)
          };
        },
        setHistory: function(histData) {
          var hist = this.history = new History(this.history);
          hist.done = copyHistoryArray(histData.done.slice(0), null, true);
          hist.undone = copyHistoryArray(histData.undone.slice(0), null, true);
        },
        setGutterMarker: docMethodOp(function(line, gutterID, value) {
          return changeLine(this, line, "gutter", function(line2) {
            var markers = line2.gutterMarkers || (line2.gutterMarkers = {});
            markers[gutterID] = value;
            if (!value && isEmpty(markers)) {
              line2.gutterMarkers = null;
            }
            return true;
          });
        }),
        clearGutter: docMethodOp(function(gutterID) {
          var this$1$1 = this;
          this.iter(function(line) {
            if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
              changeLine(this$1$1, line, "gutter", function() {
                line.gutterMarkers[gutterID] = null;
                if (isEmpty(line.gutterMarkers)) {
                  line.gutterMarkers = null;
                }
                return true;
              });
            }
          });
        }),
        lineInfo: function(line) {
          var n;
          if (typeof line == "number") {
            if (!isLine(this, line)) {
              return null;
            }
            n = line;
            line = getLine(this, line);
            if (!line) {
              return null;
            }
          } else {
            n = lineNo(line);
            if (n == null) {
              return null;
            }
          }
          return {
            line: n,
            handle: line,
            text: line.text,
            gutterMarkers: line.gutterMarkers,
            textClass: line.textClass,
            bgClass: line.bgClass,
            wrapClass: line.wrapClass,
            widgets: line.widgets
          };
        },
        addLineClass: docMethodOp(function(handle, where, cls) {
          return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
            var prop2 = where == "text" ? "textClass" : where == "background" ? "bgClass" : where == "gutter" ? "gutterClass" : "wrapClass";
            if (!line[prop2]) {
              line[prop2] = cls;
            } else if (classTest(cls).test(line[prop2])) {
              return false;
            } else {
              line[prop2] += " " + cls;
            }
            return true;
          });
        }),
        removeLineClass: docMethodOp(function(handle, where, cls) {
          return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
            var prop2 = where == "text" ? "textClass" : where == "background" ? "bgClass" : where == "gutter" ? "gutterClass" : "wrapClass";
            var cur = line[prop2];
            if (!cur) {
              return false;
            } else if (cls == null) {
              line[prop2] = null;
            } else {
              var found = cur.match(classTest(cls));
              if (!found) {
                return false;
              }
              var end = found.index + found[0].length;
              line[prop2] = cur.slice(0, found.index) + (!found.index || end == cur.length ? "" : " ") + cur.slice(end) || null;
            }
            return true;
          });
        }),
        addLineWidget: docMethodOp(function(handle, node, options) {
          return addLineWidget(this, handle, node, options);
        }),
        removeLineWidget: function(widget) {
          widget.clear();
        },
        markText: function(from, to, options) {
          return markText(this, clipPos(this, from), clipPos(this, to), options, options && options.type || "range");
        },
        setBookmark: function(pos, options) {
          var realOpts = {
            replacedWith: options && (options.nodeType == null ? options.widget : options),
            insertLeft: options && options.insertLeft,
            clearWhenEmpty: false,
            shared: options && options.shared,
            handleMouseEvents: options && options.handleMouseEvents
          };
          pos = clipPos(this, pos);
          return markText(this, pos, pos, realOpts, "bookmark");
        },
        findMarksAt: function(pos) {
          pos = clipPos(this, pos);
          var markers = [], spans = getLine(this, pos.line).markedSpans;
          if (spans) {
            for (var i2 = 0; i2 < spans.length; ++i2) {
              var span = spans[i2];
              if ((span.from == null || span.from <= pos.ch) && (span.to == null || span.to >= pos.ch)) {
                markers.push(span.marker.parent || span.marker);
              }
            }
          }
          return markers;
        },
        findMarks: function(from, to, filter) {
          from = clipPos(this, from);
          to = clipPos(this, to);
          var found = [], lineNo2 = from.line;
          this.iter(from.line, to.line + 1, function(line) {
            var spans = line.markedSpans;
            if (spans) {
              for (var i2 = 0; i2 < spans.length; i2++) {
                var span = spans[i2];
                if (!(span.to != null && lineNo2 == from.line && from.ch >= span.to || span.from == null && lineNo2 != from.line || span.from != null && lineNo2 == to.line && span.from >= to.ch) && (!filter || filter(span.marker))) {
                  found.push(span.marker.parent || span.marker);
                }
              }
            }
            ++lineNo2;
          });
          return found;
        },
        getAllMarks: function() {
          var markers = [];
          this.iter(function(line) {
            var sps = line.markedSpans;
            if (sps) {
              for (var i2 = 0; i2 < sps.length; ++i2) {
                if (sps[i2].from != null) {
                  markers.push(sps[i2].marker);
                }
              }
            }
          });
          return markers;
        },
        posFromIndex: function(off2) {
          var ch, lineNo2 = this.first, sepSize = this.lineSeparator().length;
          this.iter(function(line) {
            var sz = line.text.length + sepSize;
            if (sz > off2) {
              ch = off2;
              return true;
            }
            off2 -= sz;
            ++lineNo2;
          });
          return clipPos(this, Pos(lineNo2, ch));
        },
        indexFromPos: function(coords) {
          coords = clipPos(this, coords);
          var index2 = coords.ch;
          if (coords.line < this.first || coords.ch < 0) {
            return 0;
          }
          var sepSize = this.lineSeparator().length;
          this.iter(this.first, coords.line, function(line) {
            index2 += line.text.length + sepSize;
          });
          return index2;
        },
        copy: function(copyHistory) {
          var doc2 = new Doc(
            getLines(this, this.first, this.first + this.size),
            this.modeOption,
            this.first,
            this.lineSep,
            this.direction
          );
          doc2.scrollTop = this.scrollTop;
          doc2.scrollLeft = this.scrollLeft;
          doc2.sel = this.sel;
          doc2.extend = false;
          if (copyHistory) {
            doc2.history.undoDepth = this.history.undoDepth;
            doc2.setHistory(this.getHistory());
          }
          return doc2;
        },
        linkedDoc: function(options) {
          if (!options) {
            options = {};
          }
          var from = this.first, to = this.first + this.size;
          if (options.from != null && options.from > from) {
            from = options.from;
          }
          if (options.to != null && options.to < to) {
            to = options.to;
          }
          var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from, this.lineSep, this.direction);
          if (options.sharedHist) {
            copy.history = this.history;
          }
          (this.linked || (this.linked = [])).push({ doc: copy, sharedHist: options.sharedHist });
          copy.linked = [{ doc: this, isParent: true, sharedHist: options.sharedHist }];
          copySharedMarkers(copy, findSharedMarkers(this));
          return copy;
        },
        unlinkDoc: function(other) {
          if (other instanceof CodeMirror2) {
            other = other.doc;
          }
          if (this.linked) {
            for (var i2 = 0; i2 < this.linked.length; ++i2) {
              var link = this.linked[i2];
              if (link.doc != other) {
                continue;
              }
              this.linked.splice(i2, 1);
              other.unlinkDoc(this);
              detachSharedMarkers(findSharedMarkers(this));
              break;
            }
          }
          if (other.history == this.history) {
            var splitIds = [other.id];
            linkedDocs(other, function(doc2) {
              return splitIds.push(doc2.id);
            }, true);
            other.history = new History(null);
            other.history.done = copyHistoryArray(this.history.done, splitIds);
            other.history.undone = copyHistoryArray(this.history.undone, splitIds);
          }
        },
        iterLinkedDocs: function(f) {
          linkedDocs(this, f);
        },
        getMode: function() {
          return this.mode;
        },
        getEditor: function() {
          return this.cm;
        },
        splitLines: function(str) {
          if (this.lineSep) {
            return str.split(this.lineSep);
          }
          return splitLinesAuto(str);
        },
        lineSeparator: function() {
          return this.lineSep || "\n";
        },
        setDirection: docMethodOp(function(dir) {
          if (dir != "rtl") {
            dir = "ltr";
          }
          if (dir == this.direction) {
            return;
          }
          this.direction = dir;
          this.iter(function(line) {
            return line.order = null;
          });
          if (this.cm) {
            directionChanged(this.cm);
          }
        })
      });
      Doc.prototype.eachLine = Doc.prototype.iter;
      var lastDrop = 0;
      function onDrop(e) {
        var cm = this;
        clearDragCursor(cm);
        if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) {
          return;
        }
        e_preventDefault(e);
        if (ie) {
          lastDrop = +/* @__PURE__ */ new Date();
        }
        var pos = posFromMouse(cm, e, true), files = e.dataTransfer.files;
        if (!pos || cm.isReadOnly()) {
          return;
        }
        if (files && files.length && window.FileReader && window.File) {
          var n = files.length, text = Array(n), read = 0;
          var markAsReadAndPasteIfAllFilesAreRead = function() {
            if (++read == n) {
              operation(cm, function() {
                pos = clipPos(cm.doc, pos);
                var change = {
                  from: pos,
                  to: pos,
                  text: cm.doc.splitLines(
                    text.filter(function(t) {
                      return t != null;
                    }).join(cm.doc.lineSeparator())
                  ),
                  origin: "paste"
                };
                makeChange(cm.doc, change);
                setSelectionReplaceHistory(cm.doc, simpleSelection(clipPos(cm.doc, pos), clipPos(cm.doc, changeEnd(change))));
              })();
            }
          };
          var readTextFromFile = function(file, i3) {
            if (cm.options.allowDropFileTypes && indexOf(cm.options.allowDropFileTypes, file.type) == -1) {
              markAsReadAndPasteIfAllFilesAreRead();
              return;
            }
            var reader = new FileReader();
            reader.onerror = function() {
              return markAsReadAndPasteIfAllFilesAreRead();
            };
            reader.onload = function() {
              var content = reader.result;
              if (/[\x00-\x08\x0e-\x1f]{2}/.test(content)) {
                markAsReadAndPasteIfAllFilesAreRead();
                return;
              }
              text[i3] = content;
              markAsReadAndPasteIfAllFilesAreRead();
            };
            reader.readAsText(file);
          };
          for (var i2 = 0; i2 < files.length; i2++) {
            readTextFromFile(files[i2], i2);
          }
        } else {
          if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
            cm.state.draggingText(e);
            setTimeout(function() {
              return cm.display.input.focus();
            }, 20);
            return;
          }
          try {
            var text$1 = e.dataTransfer.getData("Text");
            if (text$1) {
              var selected;
              if (cm.state.draggingText && !cm.state.draggingText.copy) {
                selected = cm.listSelections();
              }
              setSelectionNoUndo(cm.doc, simpleSelection(pos, pos));
              if (selected) {
                for (var i$12 = 0; i$12 < selected.length; ++i$12) {
                  replaceRange(cm.doc, "", selected[i$12].anchor, selected[i$12].head, "drag");
                }
              }
              cm.replaceSelection(text$1, "around", "paste");
              cm.display.input.focus();
            }
          } catch (e$1) {
          }
        }
      }
      function onDragStart(cm, e) {
        if (ie && (!cm.state.draggingText || +/* @__PURE__ */ new Date() - lastDrop < 100)) {
          e_stop(e);
          return;
        }
        if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) {
          return;
        }
        e.dataTransfer.setData("Text", cm.getSelection());
        e.dataTransfer.effectAllowed = "copyMove";
        if (e.dataTransfer.setDragImage && !safari) {
          var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
          img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
          if (presto) {
            img.width = img.height = 1;
            cm.display.wrapper.appendChild(img);
            img._top = img.offsetTop;
          }
          e.dataTransfer.setDragImage(img, 0, 0);
          if (presto) {
            img.parentNode.removeChild(img);
          }
        }
      }
      function onDragOver(cm, e) {
        var pos = posFromMouse(cm, e);
        if (!pos) {
          return;
        }
        var frag = document.createDocumentFragment();
        drawSelectionCursor(cm, pos, frag);
        if (!cm.display.dragCursor) {
          cm.display.dragCursor = elt("div", null, "CodeMirror-cursors CodeMirror-dragcursors");
          cm.display.lineSpace.insertBefore(cm.display.dragCursor, cm.display.cursorDiv);
        }
        removeChildrenAndAdd(cm.display.dragCursor, frag);
      }
      function clearDragCursor(cm) {
        if (cm.display.dragCursor) {
          cm.display.lineSpace.removeChild(cm.display.dragCursor);
          cm.display.dragCursor = null;
        }
      }
      function forEachCodeMirror(f) {
        if (!document.getElementsByClassName) {
          return;
        }
        var byClass = document.getElementsByClassName("CodeMirror"), editors = [];
        for (var i2 = 0; i2 < byClass.length; i2++) {
          var cm = byClass[i2].CodeMirror;
          if (cm) {
            editors.push(cm);
          }
        }
        if (editors.length) {
          editors[0].operation(function() {
            for (var i3 = 0; i3 < editors.length; i3++) {
              f(editors[i3]);
            }
          });
        }
      }
      var globalsRegistered = false;
      function ensureGlobalHandlers() {
        if (globalsRegistered) {
          return;
        }
        registerGlobalHandlers();
        globalsRegistered = true;
      }
      function registerGlobalHandlers() {
        var resizeTimer;
        on(window, "resize", function() {
          if (resizeTimer == null) {
            resizeTimer = setTimeout(function() {
              resizeTimer = null;
              forEachCodeMirror(onResize);
            }, 100);
          }
        });
        on(window, "blur", function() {
          return forEachCodeMirror(onBlur);
        });
      }
      function onResize(cm) {
        var d = cm.display;
        d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
        d.scrollbarsClipped = false;
        cm.setSize();
      }
      var keyNames = {
        3: "Pause",
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Ctrl",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Esc",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        44: "PrintScrn",
        45: "Insert",
        46: "Delete",
        59: ";",
        61: "=",
        91: "Mod",
        92: "Mod",
        93: "Mod",
        106: "*",
        107: "=",
        109: "-",
        110: ".",
        111: "/",
        145: "ScrollLock",
        173: "-",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'",
        224: "Mod",
        63232: "Up",
        63233: "Down",
        63234: "Left",
        63235: "Right",
        63272: "Delete",
        63273: "Home",
        63275: "End",
        63276: "PageUp",
        63277: "PageDown",
        63302: "Insert"
      };
      for (var i = 0; i < 10; i++) {
        keyNames[i + 48] = keyNames[i + 96] = String(i);
      }
      for (var i$1 = 65; i$1 <= 90; i$1++) {
        keyNames[i$1] = String.fromCharCode(i$1);
      }
      for (var i$2 = 1; i$2 <= 12; i$2++) {
        keyNames[i$2 + 111] = keyNames[i$2 + 63235] = "F" + i$2;
      }
      var keyMap = {};
      keyMap.basic = {
        "Left": "goCharLeft",
        "Right": "goCharRight",
        "Up": "goLineUp",
        "Down": "goLineDown",
        "End": "goLineEnd",
        "Home": "goLineStartSmart",
        "PageUp": "goPageUp",
        "PageDown": "goPageDown",
        "Delete": "delCharAfter",
        "Backspace": "delCharBefore",
        "Shift-Backspace": "delCharBefore",
        "Tab": "defaultTab",
        "Shift-Tab": "indentAuto",
        "Enter": "newlineAndIndent",
        "Insert": "toggleOverwrite",
        "Esc": "singleSelection"
      };
      keyMap.pcDefault = {
        "Ctrl-A": "selectAll",
        "Ctrl-D": "deleteLine",
        "Ctrl-Z": "undo",
        "Shift-Ctrl-Z": "redo",
        "Ctrl-Y": "redo",
        "Ctrl-Home": "goDocStart",
        "Ctrl-End": "goDocEnd",
        "Ctrl-Up": "goLineUp",
        "Ctrl-Down": "goLineDown",
        "Ctrl-Left": "goGroupLeft",
        "Ctrl-Right": "goGroupRight",
        "Alt-Left": "goLineStart",
        "Alt-Right": "goLineEnd",
        "Ctrl-Backspace": "delGroupBefore",
        "Ctrl-Delete": "delGroupAfter",
        "Ctrl-S": "save",
        "Ctrl-F": "find",
        "Ctrl-G": "findNext",
        "Shift-Ctrl-G": "findPrev",
        "Shift-Ctrl-F": "replace",
        "Shift-Ctrl-R": "replaceAll",
        "Ctrl-[": "indentLess",
        "Ctrl-]": "indentMore",
        "Ctrl-U": "undoSelection",
        "Shift-Ctrl-U": "redoSelection",
        "Alt-U": "redoSelection",
        "fallthrough": "basic"
      };
      keyMap.emacsy = {
        "Ctrl-F": "goCharRight",
        "Ctrl-B": "goCharLeft",
        "Ctrl-P": "goLineUp",
        "Ctrl-N": "goLineDown",
        "Ctrl-A": "goLineStart",
        "Ctrl-E": "goLineEnd",
        "Ctrl-V": "goPageDown",
        "Shift-Ctrl-V": "goPageUp",
        "Ctrl-D": "delCharAfter",
        "Ctrl-H": "delCharBefore",
        "Alt-Backspace": "delWordBefore",
        "Ctrl-K": "killLine",
        "Ctrl-T": "transposeChars",
        "Ctrl-O": "openLine"
      };
      keyMap.macDefault = {
        "Cmd-A": "selectAll",
        "Cmd-D": "deleteLine",
        "Cmd-Z": "undo",
        "Shift-Cmd-Z": "redo",
        "Cmd-Y": "redo",
        "Cmd-Home": "goDocStart",
        "Cmd-Up": "goDocStart",
        "Cmd-End": "goDocEnd",
        "Cmd-Down": "goDocEnd",
        "Alt-Left": "goGroupLeft",
        "Alt-Right": "goGroupRight",
        "Cmd-Left": "goLineLeft",
        "Cmd-Right": "goLineRight",
        "Alt-Backspace": "delGroupBefore",
        "Ctrl-Alt-Backspace": "delGroupAfter",
        "Alt-Delete": "delGroupAfter",
        "Cmd-S": "save",
        "Cmd-F": "find",
        "Cmd-G": "findNext",
        "Shift-Cmd-G": "findPrev",
        "Cmd-Alt-F": "replace",
        "Shift-Cmd-Alt-F": "replaceAll",
        "Cmd-[": "indentLess",
        "Cmd-]": "indentMore",
        "Cmd-Backspace": "delWrappedLineLeft",
        "Cmd-Delete": "delWrappedLineRight",
        "Cmd-U": "undoSelection",
        "Shift-Cmd-U": "redoSelection",
        "Ctrl-Up": "goDocStart",
        "Ctrl-Down": "goDocEnd",
        "fallthrough": ["basic", "emacsy"]
      };
      keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;
      function normalizeKeyName(name) {
        var parts = name.split(/-(?!$)/);
        name = parts[parts.length - 1];
        var alt, ctrl, shift, cmd;
        for (var i2 = 0; i2 < parts.length - 1; i2++) {
          var mod = parts[i2];
          if (/^(cmd|meta|m)$/i.test(mod)) {
            cmd = true;
          } else if (/^a(lt)?$/i.test(mod)) {
            alt = true;
          } else if (/^(c|ctrl|control)$/i.test(mod)) {
            ctrl = true;
          } else if (/^s(hift)?$/i.test(mod)) {
            shift = true;
          } else {
            throw new Error("Unrecognized modifier name: " + mod);
          }
        }
        if (alt) {
          name = "Alt-" + name;
        }
        if (ctrl) {
          name = "Ctrl-" + name;
        }
        if (cmd) {
          name = "Cmd-" + name;
        }
        if (shift) {
          name = "Shift-" + name;
        }
        return name;
      }
      function normalizeKeyMap(keymap) {
        var copy = {};
        for (var keyname in keymap) {
          if (keymap.hasOwnProperty(keyname)) {
            var value = keymap[keyname];
            if (/^(name|fallthrough|(de|at)tach)$/.test(keyname)) {
              continue;
            }
            if (value == "...") {
              delete keymap[keyname];
              continue;
            }
            var keys = map(keyname.split(" "), normalizeKeyName);
            for (var i2 = 0; i2 < keys.length; i2++) {
              var val = void 0, name = void 0;
              if (i2 == keys.length - 1) {
                name = keys.join(" ");
                val = value;
              } else {
                name = keys.slice(0, i2 + 1).join(" ");
                val = "...";
              }
              var prev = copy[name];
              if (!prev) {
                copy[name] = val;
              } else if (prev != val) {
                throw new Error("Inconsistent bindings for " + name);
              }
            }
            delete keymap[keyname];
          }
        }
        for (var prop2 in copy) {
          keymap[prop2] = copy[prop2];
        }
        return keymap;
      }
      function lookupKey(key2, map2, handle, context) {
        map2 = getKeyMap(map2);
        var found = map2.call ? map2.call(key2, context) : map2[key2];
        if (found === false) {
          return "nothing";
        }
        if (found === "...") {
          return "multi";
        }
        if (found != null && handle(found)) {
          return "handled";
        }
        if (map2.fallthrough) {
          if (Object.prototype.toString.call(map2.fallthrough) != "[object Array]") {
            return lookupKey(key2, map2.fallthrough, handle, context);
          }
          for (var i2 = 0; i2 < map2.fallthrough.length; i2++) {
            var result = lookupKey(key2, map2.fallthrough[i2], handle, context);
            if (result) {
              return result;
            }
          }
        }
      }
      function isModifierKey(value) {
        var name = typeof value == "string" ? value : keyNames[value.keyCode];
        return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
      }
      function addModifierNames(name, event, noShift) {
        var base = name;
        if (event.altKey && base != "Alt") {
          name = "Alt-" + name;
        }
        if ((flipCtrlCmd ? event.metaKey : event.ctrlKey) && base != "Ctrl") {
          name = "Ctrl-" + name;
        }
        if ((flipCtrlCmd ? event.ctrlKey : event.metaKey) && base != "Mod") {
          name = "Cmd-" + name;
        }
        if (!noShift && event.shiftKey && base != "Shift") {
          name = "Shift-" + name;
        }
        return name;
      }
      function keyName(event, noShift) {
        if (presto && event.keyCode == 34 && event["char"]) {
          return false;
        }
        var name = keyNames[event.keyCode];
        if (name == null || event.altGraphKey) {
          return false;
        }
        if (event.keyCode == 3 && event.code) {
          name = event.code;
        }
        return addModifierNames(name, event, noShift);
      }
      function getKeyMap(val) {
        return typeof val == "string" ? keyMap[val] : val;
      }
      function deleteNearSelection(cm, compute) {
        var ranges = cm.doc.sel.ranges, kill = [];
        for (var i2 = 0; i2 < ranges.length; i2++) {
          var toKill = compute(ranges[i2]);
          while (kill.length && cmp(toKill.from, lst(kill).to) <= 0) {
            var replaced = kill.pop();
            if (cmp(replaced.from, toKill.from) < 0) {
              toKill.from = replaced.from;
              break;
            }
          }
          kill.push(toKill);
        }
        runInOp(cm, function() {
          for (var i3 = kill.length - 1; i3 >= 0; i3--) {
            replaceRange(cm.doc, "", kill[i3].from, kill[i3].to, "+delete");
          }
          ensureCursorVisible(cm);
        });
      }
      function moveCharLogically(line, ch, dir) {
        var target = skipExtendingChars(line.text, ch + dir, dir);
        return target < 0 || target > line.text.length ? null : target;
      }
      function moveLogically(line, start, dir) {
        var ch = moveCharLogically(line, start.ch, dir);
        return ch == null ? null : new Pos(start.line, ch, dir < 0 ? "after" : "before");
      }
      function endOfLine(visually, cm, lineObj, lineNo2, dir) {
        if (visually) {
          if (cm.doc.direction == "rtl") {
            dir = -dir;
          }
          var order = getOrder(lineObj, cm.doc.direction);
          if (order) {
            var part = dir < 0 ? lst(order) : order[0];
            var moveInStorageOrder = dir < 0 == (part.level == 1);
            var sticky = moveInStorageOrder ? "after" : "before";
            var ch;
            if (part.level > 0 || cm.doc.direction == "rtl") {
              var prep = prepareMeasureForLine(cm, lineObj);
              ch = dir < 0 ? lineObj.text.length - 1 : 0;
              var targetTop = measureCharPrepared(cm, prep, ch).top;
              ch = findFirst(function(ch2) {
                return measureCharPrepared(cm, prep, ch2).top == targetTop;
              }, dir < 0 == (part.level == 1) ? part.from : part.to - 1, ch);
              if (sticky == "before") {
                ch = moveCharLogically(lineObj, ch, 1);
              }
            } else {
              ch = dir < 0 ? part.to : part.from;
            }
            return new Pos(lineNo2, ch, sticky);
          }
        }
        return new Pos(lineNo2, dir < 0 ? lineObj.text.length : 0, dir < 0 ? "before" : "after");
      }
      function moveVisually(cm, line, start, dir) {
        var bidi = getOrder(line, cm.doc.direction);
        if (!bidi) {
          return moveLogically(line, start, dir);
        }
        if (start.ch >= line.text.length) {
          start.ch = line.text.length;
          start.sticky = "before";
        } else if (start.ch <= 0) {
          start.ch = 0;
          start.sticky = "after";
        }
        var partPos = getBidiPartAt(bidi, start.ch, start.sticky), part = bidi[partPos];
        if (cm.doc.direction == "ltr" && part.level % 2 == 0 && (dir > 0 ? part.to > start.ch : part.from < start.ch)) {
          return moveLogically(line, start, dir);
        }
        var mv = function(pos, dir2) {
          return moveCharLogically(line, pos instanceof Pos ? pos.ch : pos, dir2);
        };
        var prep;
        var getWrappedLineExtent = function(ch2) {
          if (!cm.options.lineWrapping) {
            return { begin: 0, end: line.text.length };
          }
          prep = prep || prepareMeasureForLine(cm, line);
          return wrappedLineExtentChar(cm, line, prep, ch2);
        };
        var wrappedLineExtent2 = getWrappedLineExtent(start.sticky == "before" ? mv(start, -1) : start.ch);
        if (cm.doc.direction == "rtl" || part.level == 1) {
          var moveInStorageOrder = part.level == 1 == dir < 0;
          var ch = mv(start, moveInStorageOrder ? 1 : -1);
          if (ch != null && (!moveInStorageOrder ? ch >= part.from && ch >= wrappedLineExtent2.begin : ch <= part.to && ch <= wrappedLineExtent2.end)) {
            var sticky = moveInStorageOrder ? "before" : "after";
            return new Pos(start.line, ch, sticky);
          }
        }
        var searchInVisualLine = function(partPos2, dir2, wrappedLineExtent3) {
          var getRes = function(ch3, moveInStorageOrder3) {
            return moveInStorageOrder3 ? new Pos(start.line, mv(ch3, 1), "before") : new Pos(start.line, ch3, "after");
          };
          for (; partPos2 >= 0 && partPos2 < bidi.length; partPos2 += dir2) {
            var part2 = bidi[partPos2];
            var moveInStorageOrder2 = dir2 > 0 == (part2.level != 1);
            var ch2 = moveInStorageOrder2 ? wrappedLineExtent3.begin : mv(wrappedLineExtent3.end, -1);
            if (part2.from <= ch2 && ch2 < part2.to) {
              return getRes(ch2, moveInStorageOrder2);
            }
            ch2 = moveInStorageOrder2 ? part2.from : mv(part2.to, -1);
            if (wrappedLineExtent3.begin <= ch2 && ch2 < wrappedLineExtent3.end) {
              return getRes(ch2, moveInStorageOrder2);
            }
          }
        };
        var res = searchInVisualLine(partPos + dir, dir, wrappedLineExtent2);
        if (res) {
          return res;
        }
        var nextCh = dir > 0 ? wrappedLineExtent2.end : mv(wrappedLineExtent2.begin, -1);
        if (nextCh != null && !(dir > 0 && nextCh == line.text.length)) {
          res = searchInVisualLine(dir > 0 ? 0 : bidi.length - 1, dir, getWrappedLineExtent(nextCh));
          if (res) {
            return res;
          }
        }
        return null;
      }
      var commands = {
        selectAll,
        singleSelection: function(cm) {
          return cm.setSelection(cm.getCursor("anchor"), cm.getCursor("head"), sel_dontScroll);
        },
        killLine: function(cm) {
          return deleteNearSelection(cm, function(range2) {
            if (range2.empty()) {
              var len = getLine(cm.doc, range2.head.line).text.length;
              if (range2.head.ch == len && range2.head.line < cm.lastLine()) {
                return { from: range2.head, to: Pos(range2.head.line + 1, 0) };
              } else {
                return { from: range2.head, to: Pos(range2.head.line, len) };
              }
            } else {
              return { from: range2.from(), to: range2.to() };
            }
          });
        },
        deleteLine: function(cm) {
          return deleteNearSelection(cm, function(range2) {
            return {
              from: Pos(range2.from().line, 0),
              to: clipPos(cm.doc, Pos(range2.to().line + 1, 0))
            };
          });
        },
        delLineLeft: function(cm) {
          return deleteNearSelection(cm, function(range2) {
            return {
              from: Pos(range2.from().line, 0),
              to: range2.from()
            };
          });
        },
        delWrappedLineLeft: function(cm) {
          return deleteNearSelection(cm, function(range2) {
            var top = cm.charCoords(range2.head, "div").top + 5;
            var leftPos = cm.coordsChar({ left: 0, top }, "div");
            return { from: leftPos, to: range2.from() };
          });
        },
        delWrappedLineRight: function(cm) {
          return deleteNearSelection(cm, function(range2) {
            var top = cm.charCoords(range2.head, "div").top + 5;
            var rightPos = cm.coordsChar({ left: cm.display.lineDiv.offsetWidth + 100, top }, "div");
            return { from: range2.from(), to: rightPos };
          });
        },
        undo: function(cm) {
          return cm.undo();
        },
        redo: function(cm) {
          return cm.redo();
        },
        undoSelection: function(cm) {
          return cm.undoSelection();
        },
        redoSelection: function(cm) {
          return cm.redoSelection();
        },
        goDocStart: function(cm) {
          return cm.extendSelection(Pos(cm.firstLine(), 0));
        },
        goDocEnd: function(cm) {
          return cm.extendSelection(Pos(cm.lastLine()));
        },
        goLineStart: function(cm) {
          return cm.extendSelectionsBy(
            function(range2) {
              return lineStart(cm, range2.head.line);
            },
            { origin: "+move", bias: 1 }
          );
        },
        goLineStartSmart: function(cm) {
          return cm.extendSelectionsBy(
            function(range2) {
              return lineStartSmart(cm, range2.head);
            },
            { origin: "+move", bias: 1 }
          );
        },
        goLineEnd: function(cm) {
          return cm.extendSelectionsBy(
            function(range2) {
              return lineEnd(cm, range2.head.line);
            },
            { origin: "+move", bias: -1 }
          );
        },
        goLineRight: function(cm) {
          return cm.extendSelectionsBy(function(range2) {
            var top = cm.cursorCoords(range2.head, "div").top + 5;
            return cm.coordsChar({ left: cm.display.lineDiv.offsetWidth + 100, top }, "div");
          }, sel_move);
        },
        goLineLeft: function(cm) {
          return cm.extendSelectionsBy(function(range2) {
            var top = cm.cursorCoords(range2.head, "div").top + 5;
            return cm.coordsChar({ left: 0, top }, "div");
          }, sel_move);
        },
        goLineLeftSmart: function(cm) {
          return cm.extendSelectionsBy(function(range2) {
            var top = cm.cursorCoords(range2.head, "div").top + 5;
            var pos = cm.coordsChar({ left: 0, top }, "div");
            if (pos.ch < cm.getLine(pos.line).search(/\S/)) {
              return lineStartSmart(cm, range2.head);
            }
            return pos;
          }, sel_move);
        },
        goLineUp: function(cm) {
          return cm.moveV(-1, "line");
        },
        goLineDown: function(cm) {
          return cm.moveV(1, "line");
        },
        goPageUp: function(cm) {
          return cm.moveV(-1, "page");
        },
        goPageDown: function(cm) {
          return cm.moveV(1, "page");
        },
        goCharLeft: function(cm) {
          return cm.moveH(-1, "char");
        },
        goCharRight: function(cm) {
          return cm.moveH(1, "char");
        },
        goColumnLeft: function(cm) {
          return cm.moveH(-1, "column");
        },
        goColumnRight: function(cm) {
          return cm.moveH(1, "column");
        },
        goWordLeft: function(cm) {
          return cm.moveH(-1, "word");
        },
        goGroupRight: function(cm) {
          return cm.moveH(1, "group");
        },
        goGroupLeft: function(cm) {
          return cm.moveH(-1, "group");
        },
        goWordRight: function(cm) {
          return cm.moveH(1, "word");
        },
        delCharBefore: function(cm) {
          return cm.deleteH(-1, "codepoint");
        },
        delCharAfter: function(cm) {
          return cm.deleteH(1, "char");
        },
        delWordBefore: function(cm) {
          return cm.deleteH(-1, "word");
        },
        delWordAfter: function(cm) {
          return cm.deleteH(1, "word");
        },
        delGroupBefore: function(cm) {
          return cm.deleteH(-1, "group");
        },
        delGroupAfter: function(cm) {
          return cm.deleteH(1, "group");
        },
        indentAuto: function(cm) {
          return cm.indentSelection("smart");
        },
        indentMore: function(cm) {
          return cm.indentSelection("add");
        },
        indentLess: function(cm) {
          return cm.indentSelection("subtract");
        },
        insertTab: function(cm) {
          return cm.replaceSelection("	");
        },
        insertSoftTab: function(cm) {
          var spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize;
          for (var i2 = 0; i2 < ranges.length; i2++) {
            var pos = ranges[i2].from();
            var col = countColumn(cm.getLine(pos.line), pos.ch, tabSize);
            spaces.push(spaceStr(tabSize - col % tabSize));
          }
          cm.replaceSelections(spaces);
        },
        defaultTab: function(cm) {
          if (cm.somethingSelected()) {
            cm.indentSelection("add");
          } else {
            cm.execCommand("insertTab");
          }
        },
        // Swap the two chars left and right of each selection's head.
        // Move cursor behind the two swapped characters afterwards.
        //
        // Doesn't consider line feeds a character.
        // Doesn't scan more than one line above to find a character.
        // Doesn't do anything on an empty line.
        // Doesn't do anything with non-empty selections.
        transposeChars: function(cm) {
          return runInOp(cm, function() {
            var ranges = cm.listSelections(), newSel = [];
            for (var i2 = 0; i2 < ranges.length; i2++) {
              if (!ranges[i2].empty()) {
                continue;
              }
              var cur = ranges[i2].head, line = getLine(cm.doc, cur.line).text;
              if (line) {
                if (cur.ch == line.length) {
                  cur = new Pos(cur.line, cur.ch - 1);
                }
                if (cur.ch > 0) {
                  cur = new Pos(cur.line, cur.ch + 1);
                  cm.replaceRange(
                    line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2),
                    Pos(cur.line, cur.ch - 2),
                    cur,
                    "+transpose"
                  );
                } else if (cur.line > cm.doc.first) {
                  var prev = getLine(cm.doc, cur.line - 1).text;
                  if (prev) {
                    cur = new Pos(cur.line, 1);
                    cm.replaceRange(
                      line.charAt(0) + cm.doc.lineSeparator() + prev.charAt(prev.length - 1),
                      Pos(cur.line - 1, prev.length - 1),
                      cur,
                      "+transpose"
                    );
                  }
                }
              }
              newSel.push(new Range(cur, cur));
            }
            cm.setSelections(newSel);
          });
        },
        newlineAndIndent: function(cm) {
          return runInOp(cm, function() {
            var sels = cm.listSelections();
            for (var i2 = sels.length - 1; i2 >= 0; i2--) {
              cm.replaceRange(cm.doc.lineSeparator(), sels[i2].anchor, sels[i2].head, "+input");
            }
            sels = cm.listSelections();
            for (var i$12 = 0; i$12 < sels.length; i$12++) {
              cm.indentLine(sels[i$12].from().line, null, true);
            }
            ensureCursorVisible(cm);
          });
        },
        openLine: function(cm) {
          return cm.replaceSelection("\n", "start");
        },
        toggleOverwrite: function(cm) {
          return cm.toggleOverwrite();
        }
      };
      function lineStart(cm, lineN) {
        var line = getLine(cm.doc, lineN);
        var visual = visualLine(line);
        if (visual != line) {
          lineN = lineNo(visual);
        }
        return endOfLine(true, cm, visual, lineN, 1);
      }
      function lineEnd(cm, lineN) {
        var line = getLine(cm.doc, lineN);
        var visual = visualLineEnd(line);
        if (visual != line) {
          lineN = lineNo(visual);
        }
        return endOfLine(true, cm, line, lineN, -1);
      }
      function lineStartSmart(cm, pos) {
        var start = lineStart(cm, pos.line);
        var line = getLine(cm.doc, start.line);
        var order = getOrder(line, cm.doc.direction);
        if (!order || order[0].level == 0) {
          var firstNonWS = Math.max(start.ch, line.text.search(/\S/));
          var inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
          return Pos(start.line, inWS ? 0 : firstNonWS, start.sticky);
        }
        return start;
      }
      function doHandleBinding(cm, bound, dropShift) {
        if (typeof bound == "string") {
          bound = commands[bound];
          if (!bound) {
            return false;
          }
        }
        cm.display.input.ensurePolled();
        var prevShift = cm.display.shift, done = false;
        try {
          if (cm.isReadOnly()) {
            cm.state.suppressEdits = true;
          }
          if (dropShift) {
            cm.display.shift = false;
          }
          done = bound(cm) != Pass;
        } finally {
          cm.display.shift = prevShift;
          cm.state.suppressEdits = false;
        }
        return done;
      }
      function lookupKeyForEditor(cm, name, handle) {
        for (var i2 = 0; i2 < cm.state.keyMaps.length; i2++) {
          var result = lookupKey(name, cm.state.keyMaps[i2], handle, cm);
          if (result) {
            return result;
          }
        }
        return cm.options.extraKeys && lookupKey(name, cm.options.extraKeys, handle, cm) || lookupKey(name, cm.options.keyMap, handle, cm);
      }
      var stopSeq = new Delayed();
      function dispatchKey(cm, name, e, handle) {
        var seq = cm.state.keySeq;
        if (seq) {
          if (isModifierKey(name)) {
            return "handled";
          }
          if (/\'$/.test(name)) {
            cm.state.keySeq = null;
          } else {
            stopSeq.set(50, function() {
              if (cm.state.keySeq == seq) {
                cm.state.keySeq = null;
                cm.display.input.reset();
              }
            });
          }
          if (dispatchKeyInner(cm, seq + " " + name, e, handle)) {
            return true;
          }
        }
        return dispatchKeyInner(cm, name, e, handle);
      }
      function dispatchKeyInner(cm, name, e, handle) {
        var result = lookupKeyForEditor(cm, name, handle);
        if (result == "multi") {
          cm.state.keySeq = name;
        }
        if (result == "handled") {
          signalLater(cm, "keyHandled", cm, name, e);
        }
        if (result == "handled" || result == "multi") {
          e_preventDefault(e);
          restartBlink(cm);
        }
        return !!result;
      }
      function handleKeyBinding(cm, e) {
        var name = keyName(e, true);
        if (!name) {
          return false;
        }
        if (e.shiftKey && !cm.state.keySeq) {
          return dispatchKey(cm, "Shift-" + name, e, function(b) {
            return doHandleBinding(cm, b, true);
          }) || dispatchKey(cm, name, e, function(b) {
            if (typeof b == "string" ? /^go[A-Z]/.test(b) : b.motion) {
              return doHandleBinding(cm, b);
            }
          });
        } else {
          return dispatchKey(cm, name, e, function(b) {
            return doHandleBinding(cm, b);
          });
        }
      }
      function handleCharBinding(cm, e, ch) {
        return dispatchKey(cm, "'" + ch + "'", e, function(b) {
          return doHandleBinding(cm, b, true);
        });
      }
      var lastStoppedKey = null;
      function onKeyDown(e) {
        var cm = this;
        if (e.target && e.target != cm.display.input.getField()) {
          return;
        }
        cm.curOp.focus = activeElt(root(cm));
        if (signalDOMEvent(cm, e)) {
          return;
        }
        if (ie && ie_version < 11 && e.keyCode == 27) {
          e.returnValue = false;
        }
        var code = e.keyCode;
        cm.display.shift = code == 16 || e.shiftKey;
        var handled = handleKeyBinding(cm, e);
        if (presto) {
          lastStoppedKey = handled ? code : null;
          if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey)) {
            cm.replaceSelection("", null, "cut");
          }
        }
        if (gecko && !mac && !handled && code == 46 && e.shiftKey && !e.ctrlKey && document.execCommand) {
          document.execCommand("cut");
        }
        if (code == 18 && !/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className)) {
          showCrossHair(cm);
        }
      }
      function showCrossHair(cm) {
        var lineDiv = cm.display.lineDiv;
        addClass(lineDiv, "CodeMirror-crosshair");
        function up(e) {
          if (e.keyCode == 18 || !e.altKey) {
            rmClass(lineDiv, "CodeMirror-crosshair");
            off(document, "keyup", up);
            off(document, "mouseover", up);
          }
        }
        on(document, "keyup", up);
        on(document, "mouseover", up);
      }
      function onKeyUp(e) {
        if (e.keyCode == 16) {
          this.doc.sel.shift = false;
        }
        signalDOMEvent(this, e);
      }
      function onKeyPress(e) {
        var cm = this;
        if (e.target && e.target != cm.display.input.getField()) {
          return;
        }
        if (eventInWidget(cm.display, e) || signalDOMEvent(cm, e) || e.ctrlKey && !e.altKey || mac && e.metaKey) {
          return;
        }
        var keyCode = e.keyCode, charCode = e.charCode;
        if (presto && keyCode == lastStoppedKey) {
          lastStoppedKey = null;
          e_preventDefault(e);
          return;
        }
        if (presto && (!e.which || e.which < 10) && handleKeyBinding(cm, e)) {
          return;
        }
        var ch = String.fromCharCode(charCode == null ? keyCode : charCode);
        if (ch == "\b") {
          return;
        }
        if (handleCharBinding(cm, e, ch)) {
          return;
        }
        cm.display.input.onKeyPress(e);
      }
      var DOUBLECLICK_DELAY = 400;
      var PastClick = function(time, pos, button) {
        this.time = time;
        this.pos = pos;
        this.button = button;
      };
      PastClick.prototype.compare = function(time, pos, button) {
        return this.time + DOUBLECLICK_DELAY > time && cmp(pos, this.pos) == 0 && button == this.button;
      };
      var lastClick, lastDoubleClick;
      function clickRepeat(pos, button) {
        var now = +/* @__PURE__ */ new Date();
        if (lastDoubleClick && lastDoubleClick.compare(now, pos, button)) {
          lastClick = lastDoubleClick = null;
          return "triple";
        } else if (lastClick && lastClick.compare(now, pos, button)) {
          lastDoubleClick = new PastClick(now, pos, button);
          lastClick = null;
          return "double";
        } else {
          lastClick = new PastClick(now, pos, button);
          lastDoubleClick = null;
          return "single";
        }
      }
      function onMouseDown(e) {
        var cm = this, display = cm.display;
        if (signalDOMEvent(cm, e) || display.activeTouch && display.input.supportsTouch()) {
          return;
        }
        display.input.ensurePolled();
        display.shift = e.shiftKey;
        if (eventInWidget(display, e)) {
          if (!webkit) {
            display.scroller.draggable = false;
            setTimeout(function() {
              return display.scroller.draggable = true;
            }, 100);
          }
          return;
        }
        if (clickInGutter(cm, e)) {
          return;
        }
        var pos = posFromMouse(cm, e), button = e_button(e), repeat = pos ? clickRepeat(pos, button) : "single";
        win(cm).focus();
        if (button == 1 && cm.state.selectingText) {
          cm.state.selectingText(e);
        }
        if (pos && handleMappedButton(cm, button, pos, repeat, e)) {
          return;
        }
        if (button == 1) {
          if (pos) {
            leftButtonDown(cm, pos, repeat, e);
          } else if (e_target(e) == display.scroller) {
            e_preventDefault(e);
          }
        } else if (button == 2) {
          if (pos) {
            extendSelection(cm.doc, pos);
          }
          setTimeout(function() {
            return display.input.focus();
          }, 20);
        } else if (button == 3) {
          if (captureRightClick) {
            cm.display.input.onContextMenu(e);
          } else {
            delayBlurEvent(cm);
          }
        }
      }
      function handleMappedButton(cm, button, pos, repeat, event) {
        var name = "Click";
        if (repeat == "double") {
          name = "Double" + name;
        } else if (repeat == "triple") {
          name = "Triple" + name;
        }
        name = (button == 1 ? "Left" : button == 2 ? "Middle" : "Right") + name;
        return dispatchKey(cm, addModifierNames(name, event), event, function(bound) {
          if (typeof bound == "string") {
            bound = commands[bound];
          }
          if (!bound) {
            return false;
          }
          var done = false;
          try {
            if (cm.isReadOnly()) {
              cm.state.suppressEdits = true;
            }
            done = bound(cm, pos) != Pass;
          } finally {
            cm.state.suppressEdits = false;
          }
          return done;
        });
      }
      function configureMouse(cm, repeat, event) {
        var option = cm.getOption("configureMouse");
        var value = option ? option(cm, repeat, event) : {};
        if (value.unit == null) {
          var rect = chromeOS ? event.shiftKey && event.metaKey : event.altKey;
          value.unit = rect ? "rectangle" : repeat == "single" ? "char" : repeat == "double" ? "word" : "line";
        }
        if (value.extend == null || cm.doc.extend) {
          value.extend = cm.doc.extend || event.shiftKey;
        }
        if (value.addNew == null) {
          value.addNew = mac ? event.metaKey : event.ctrlKey;
        }
        if (value.moveOnDrag == null) {
          value.moveOnDrag = !(mac ? event.altKey : event.ctrlKey);
        }
        return value;
      }
      function leftButtonDown(cm, pos, repeat, event) {
        if (ie) {
          setTimeout(bind(ensureFocus, cm), 0);
        } else {
          cm.curOp.focus = activeElt(root(cm));
        }
        var behavior = configureMouse(cm, repeat, event);
        var sel = cm.doc.sel, contained;
        if (cm.options.dragDrop && dragAndDrop && !cm.isReadOnly() && repeat == "single" && (contained = sel.contains(pos)) > -1 && (cmp((contained = sel.ranges[contained]).from(), pos) < 0 || pos.xRel > 0) && (cmp(contained.to(), pos) > 0 || pos.xRel < 0)) {
          leftButtonStartDrag(cm, event, pos, behavior);
        } else {
          leftButtonSelect(cm, event, pos, behavior);
        }
      }
      function leftButtonStartDrag(cm, event, pos, behavior) {
        var display = cm.display, moved = false;
        var dragEnd = operation(cm, function(e) {
          if (webkit) {
            display.scroller.draggable = false;
          }
          cm.state.draggingText = false;
          if (cm.state.delayingBlurEvent) {
            if (cm.hasFocus()) {
              cm.state.delayingBlurEvent = false;
            } else {
              delayBlurEvent(cm);
            }
          }
          off(display.wrapper.ownerDocument, "mouseup", dragEnd);
          off(display.wrapper.ownerDocument, "mousemove", mouseMove);
          off(display.scroller, "dragstart", dragStart);
          off(display.scroller, "drop", dragEnd);
          if (!moved) {
            e_preventDefault(e);
            if (!behavior.addNew) {
              extendSelection(cm.doc, pos, null, null, behavior.extend);
            }
            if (webkit && !safari || ie && ie_version == 9) {
              setTimeout(function() {
                display.wrapper.ownerDocument.body.focus({ preventScroll: true });
                display.input.focus();
              }, 20);
            } else {
              display.input.focus();
            }
          }
        });
        var mouseMove = function(e2) {
          moved = moved || Math.abs(event.clientX - e2.clientX) + Math.abs(event.clientY - e2.clientY) >= 10;
        };
        var dragStart = function() {
          return moved = true;
        };
        if (webkit) {
          display.scroller.draggable = true;
        }
        cm.state.draggingText = dragEnd;
        dragEnd.copy = !behavior.moveOnDrag;
        on(display.wrapper.ownerDocument, "mouseup", dragEnd);
        on(display.wrapper.ownerDocument, "mousemove", mouseMove);
        on(display.scroller, "dragstart", dragStart);
        on(display.scroller, "drop", dragEnd);
        cm.state.delayingBlurEvent = true;
        setTimeout(function() {
          return display.input.focus();
        }, 20);
        if (display.scroller.dragDrop) {
          display.scroller.dragDrop();
        }
      }
      function rangeForUnit(cm, pos, unit) {
        if (unit == "char") {
          return new Range(pos, pos);
        }
        if (unit == "word") {
          return cm.findWordAt(pos);
        }
        if (unit == "line") {
          return new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
        }
        var result = unit(cm, pos);
        return new Range(result.from, result.to);
      }
      function leftButtonSelect(cm, event, start, behavior) {
        if (ie) {
          delayBlurEvent(cm);
        }
        var display = cm.display, doc2 = cm.doc;
        e_preventDefault(event);
        var ourRange, ourIndex, startSel = doc2.sel, ranges = startSel.ranges;
        if (behavior.addNew && !behavior.extend) {
          ourIndex = doc2.sel.contains(start);
          if (ourIndex > -1) {
            ourRange = ranges[ourIndex];
          } else {
            ourRange = new Range(start, start);
          }
        } else {
          ourRange = doc2.sel.primary();
          ourIndex = doc2.sel.primIndex;
        }
        if (behavior.unit == "rectangle") {
          if (!behavior.addNew) {
            ourRange = new Range(start, start);
          }
          start = posFromMouse(cm, event, true, true);
          ourIndex = -1;
        } else {
          var range2 = rangeForUnit(cm, start, behavior.unit);
          if (behavior.extend) {
            ourRange = extendRange(ourRange, range2.anchor, range2.head, behavior.extend);
          } else {
            ourRange = range2;
          }
        }
        if (!behavior.addNew) {
          ourIndex = 0;
          setSelection(doc2, new Selection([ourRange], 0), sel_mouse);
          startSel = doc2.sel;
        } else if (ourIndex == -1) {
          ourIndex = ranges.length;
          setSelection(
            doc2,
            normalizeSelection(cm, ranges.concat([ourRange]), ourIndex),
            { scroll: false, origin: "*mouse" }
          );
        } else if (ranges.length > 1 && ranges[ourIndex].empty() && behavior.unit == "char" && !behavior.extend) {
          setSelection(
            doc2,
            normalizeSelection(cm, ranges.slice(0, ourIndex).concat(ranges.slice(ourIndex + 1)), 0),
            { scroll: false, origin: "*mouse" }
          );
          startSel = doc2.sel;
        } else {
          replaceOneSelection(doc2, ourIndex, ourRange, sel_mouse);
        }
        var lastPos = start;
        function extendTo(pos) {
          if (cmp(lastPos, pos) == 0) {
            return;
          }
          lastPos = pos;
          if (behavior.unit == "rectangle") {
            var ranges2 = [], tabSize = cm.options.tabSize;
            var startCol = countColumn(getLine(doc2, start.line).text, start.ch, tabSize);
            var posCol = countColumn(getLine(doc2, pos.line).text, pos.ch, tabSize);
            var left = Math.min(startCol, posCol), right = Math.max(startCol, posCol);
            for (var line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line)); line <= end; line++) {
              var text = getLine(doc2, line).text, leftPos = findColumn(text, left, tabSize);
              if (left == right) {
                ranges2.push(new Range(Pos(line, leftPos), Pos(line, leftPos)));
              } else if (text.length > leftPos) {
                ranges2.push(new Range(Pos(line, leftPos), Pos(line, findColumn(text, right, tabSize))));
              }
            }
            if (!ranges2.length) {
              ranges2.push(new Range(start, start));
            }
            setSelection(
              doc2,
              normalizeSelection(cm, startSel.ranges.slice(0, ourIndex).concat(ranges2), ourIndex),
              { origin: "*mouse", scroll: false }
            );
            cm.scrollIntoView(pos);
          } else {
            var oldRange = ourRange;
            var range3 = rangeForUnit(cm, pos, behavior.unit);
            var anchor = oldRange.anchor, head;
            if (cmp(range3.anchor, anchor) > 0) {
              head = range3.head;
              anchor = minPos(oldRange.from(), range3.anchor);
            } else {
              head = range3.anchor;
              anchor = maxPos(oldRange.to(), range3.head);
            }
            var ranges$1 = startSel.ranges.slice(0);
            ranges$1[ourIndex] = bidiSimplify(cm, new Range(clipPos(doc2, anchor), head));
            setSelection(doc2, normalizeSelection(cm, ranges$1, ourIndex), sel_mouse);
          }
        }
        var editorSize = display.wrapper.getBoundingClientRect();
        var counter = 0;
        function extend(e) {
          var curCount = ++counter;
          var cur = posFromMouse(cm, e, true, behavior.unit == "rectangle");
          if (!cur) {
            return;
          }
          if (cmp(cur, lastPos) != 0) {
            cm.curOp.focus = activeElt(root(cm));
            extendTo(cur);
            var visible = visibleLines(display, doc2);
            if (cur.line >= visible.to || cur.line < visible.from) {
              setTimeout(operation(cm, function() {
                if (counter == curCount) {
                  extend(e);
                }
              }), 150);
            }
          } else {
            var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
            if (outside) {
              setTimeout(operation(cm, function() {
                if (counter != curCount) {
                  return;
                }
                display.scroller.scrollTop += outside;
                extend(e);
              }), 50);
            }
          }
        }
        function done(e) {
          cm.state.selectingText = false;
          counter = Infinity;
          if (e) {
            e_preventDefault(e);
            display.input.focus();
          }
          off(display.wrapper.ownerDocument, "mousemove", move);
          off(display.wrapper.ownerDocument, "mouseup", up);
          doc2.history.lastSelOrigin = null;
        }
        var move = operation(cm, function(e) {
          if (e.buttons === 0 || !e_button(e)) {
            done(e);
          } else {
            extend(e);
          }
        });
        var up = operation(cm, done);
        cm.state.selectingText = up;
        on(display.wrapper.ownerDocument, "mousemove", move);
        on(display.wrapper.ownerDocument, "mouseup", up);
      }
      function bidiSimplify(cm, range2) {
        var anchor = range2.anchor;
        var head = range2.head;
        var anchorLine = getLine(cm.doc, anchor.line);
        if (cmp(anchor, head) == 0 && anchor.sticky == head.sticky) {
          return range2;
        }
        var order = getOrder(anchorLine);
        if (!order) {
          return range2;
        }
        var index2 = getBidiPartAt(order, anchor.ch, anchor.sticky), part = order[index2];
        if (part.from != anchor.ch && part.to != anchor.ch) {
          return range2;
        }
        var boundary = index2 + (part.from == anchor.ch == (part.level != 1) ? 0 : 1);
        if (boundary == 0 || boundary == order.length) {
          return range2;
        }
        var leftSide;
        if (head.line != anchor.line) {
          leftSide = (head.line - anchor.line) * (cm.doc.direction == "ltr" ? 1 : -1) > 0;
        } else {
          var headIndex = getBidiPartAt(order, head.ch, head.sticky);
          var dir = headIndex - index2 || (head.ch - anchor.ch) * (part.level == 1 ? -1 : 1);
          if (headIndex == boundary - 1 || headIndex == boundary) {
            leftSide = dir < 0;
          } else {
            leftSide = dir > 0;
          }
        }
        var usePart = order[boundary + (leftSide ? -1 : 0)];
        var from = leftSide == (usePart.level == 1);
        var ch = from ? usePart.from : usePart.to, sticky = from ? "after" : "before";
        return anchor.ch == ch && anchor.sticky == sticky ? range2 : new Range(new Pos(anchor.line, ch, sticky), head);
      }
      function gutterEvent(cm, e, type, prevent) {
        var mX, mY;
        if (e.touches) {
          mX = e.touches[0].clientX;
          mY = e.touches[0].clientY;
        } else {
          try {
            mX = e.clientX;
            mY = e.clientY;
          } catch (e$1) {
            return false;
          }
        }
        if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right)) {
          return false;
        }
        if (prevent) {
          e_preventDefault(e);
        }
        var display = cm.display;
        var lineBox = display.lineDiv.getBoundingClientRect();
        if (mY > lineBox.bottom || !hasHandler(cm, type)) {
          return e_defaultPrevented(e);
        }
        mY -= lineBox.top - display.viewOffset;
        for (var i2 = 0; i2 < cm.display.gutterSpecs.length; ++i2) {
          var g = display.gutters.childNodes[i2];
          if (g && g.getBoundingClientRect().right >= mX) {
            var line = lineAtHeight(cm.doc, mY);
            var gutter = cm.display.gutterSpecs[i2];
            signal(cm, type, cm, line, gutter.className, e);
            return e_defaultPrevented(e);
          }
        }
      }
      function clickInGutter(cm, e) {
        return gutterEvent(cm, e, "gutterClick", true);
      }
      function onContextMenu(cm, e) {
        if (eventInWidget(cm.display, e) || contextMenuInGutter(cm, e)) {
          return;
        }
        if (signalDOMEvent(cm, e, "contextmenu")) {
          return;
        }
        if (!captureRightClick) {
          cm.display.input.onContextMenu(e);
        }
      }
      function contextMenuInGutter(cm, e) {
        if (!hasHandler(cm, "gutterContextMenu")) {
          return false;
        }
        return gutterEvent(cm, e, "gutterContextMenu", false);
      }
      function themeChanged(cm) {
        cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
        clearCaches(cm);
      }
      var Init = { toString: function() {
        return "CodeMirror.Init";
      } };
      var defaults = {};
      var optionHandlers = {};
      function defineOptions(CodeMirror3) {
        var optionHandlers2 = CodeMirror3.optionHandlers;
        function option(name, deflt, handle, notOnInit) {
          CodeMirror3.defaults[name] = deflt;
          if (handle) {
            optionHandlers2[name] = notOnInit ? function(cm, val, old) {
              if (old != Init) {
                handle(cm, val, old);
              }
            } : handle;
          }
        }
        CodeMirror3.defineOption = option;
        CodeMirror3.Init = Init;
        option("value", "", function(cm, val) {
          return cm.setValue(val);
        }, true);
        option("mode", null, function(cm, val) {
          cm.doc.modeOption = val;
          loadMode(cm);
        }, true);
        option("indentUnit", 2, loadMode, true);
        option("indentWithTabs", false);
        option("smartIndent", true);
        option("tabSize", 4, function(cm) {
          resetModeState(cm);
          clearCaches(cm);
          regChange(cm);
        }, true);
        option("lineSeparator", null, function(cm, val) {
          cm.doc.lineSep = val;
          if (!val) {
            return;
          }
          var newBreaks = [], lineNo2 = cm.doc.first;
          cm.doc.iter(function(line) {
            for (var pos = 0; ; ) {
              var found = line.text.indexOf(val, pos);
              if (found == -1) {
                break;
              }
              pos = found + val.length;
              newBreaks.push(Pos(lineNo2, found));
            }
            lineNo2++;
          });
          for (var i2 = newBreaks.length - 1; i2 >= 0; i2--) {
            replaceRange(cm.doc, val, newBreaks[i2], Pos(newBreaks[i2].line, newBreaks[i2].ch + val.length));
          }
        });
        option("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\u202d\u202e\u2066\u2067\u2069\ufeff\ufff9-\ufffc]/g, function(cm, val, old) {
          cm.state.specialChars = new RegExp(val.source + (val.test("	") ? "" : "|	"), "g");
          if (old != Init) {
            cm.refresh();
          }
        });
        option("specialCharPlaceholder", defaultSpecialCharPlaceholder, function(cm) {
          return cm.refresh();
        }, true);
        option("electricChars", true);
        option("inputStyle", mobile ? "contenteditable" : "textarea", function() {
          throw new Error("inputStyle can not (yet) be changed in a running editor");
        }, true);
        option("spellcheck", false, function(cm, val) {
          return cm.getInputField().spellcheck = val;
        }, true);
        option("autocorrect", false, function(cm, val) {
          return cm.getInputField().autocorrect = val;
        }, true);
        option("autocapitalize", false, function(cm, val) {
          return cm.getInputField().autocapitalize = val;
        }, true);
        option("rtlMoveVisually", !windows);
        option("wholeLineUpdateBefore", true);
        option("theme", "default", function(cm) {
          themeChanged(cm);
          updateGutters(cm);
        }, true);
        option("keyMap", "default", function(cm, val, old) {
          var next = getKeyMap(val);
          var prev = old != Init && getKeyMap(old);
          if (prev && prev.detach) {
            prev.detach(cm, next);
          }
          if (next.attach) {
            next.attach(cm, prev || null);
          }
        });
        option("extraKeys", null);
        option("configureMouse", null);
        option("lineWrapping", false, wrappingChanged, true);
        option("gutters", [], function(cm, val) {
          cm.display.gutterSpecs = getGutters(val, cm.options.lineNumbers);
          updateGutters(cm);
        }, true);
        option("fixedGutter", true, function(cm, val) {
          cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
          cm.refresh();
        }, true);
        option("coverGutterNextToScrollbar", false, function(cm) {
          return updateScrollbars(cm);
        }, true);
        option("scrollbarStyle", "native", function(cm) {
          initScrollbars(cm);
          updateScrollbars(cm);
          cm.display.scrollbars.setScrollTop(cm.doc.scrollTop);
          cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft);
        }, true);
        option("lineNumbers", false, function(cm, val) {
          cm.display.gutterSpecs = getGutters(cm.options.gutters, val);
          updateGutters(cm);
        }, true);
        option("firstLineNumber", 1, updateGutters, true);
        option("lineNumberFormatter", function(integer) {
          return integer;
        }, updateGutters, true);
        option("showCursorWhenSelecting", false, updateSelection, true);
        option("resetSelectionOnContextMenu", true);
        option("lineWiseCopyCut", true);
        option("pasteLinesPerSelection", true);
        option("selectionsMayTouch", false);
        option("readOnly", false, function(cm, val) {
          if (val == "nocursor") {
            onBlur(cm);
            cm.display.input.blur();
          }
          cm.display.input.readOnlyChanged(val);
        });
        option("screenReaderLabel", null, function(cm, val) {
          val = val === "" ? null : val;
          cm.display.input.screenReaderLabelChanged(val);
        });
        option("disableInput", false, function(cm, val) {
          if (!val) {
            cm.display.input.reset();
          }
        }, true);
        option("dragDrop", true, dragDropChanged);
        option("allowDropFileTypes", null);
        option("cursorBlinkRate", 530);
        option("cursorScrollMargin", 0);
        option("cursorHeight", 1, updateSelection, true);
        option("singleCursorHeightPerLine", true, updateSelection, true);
        option("workTime", 100);
        option("workDelay", 100);
        option("flattenSpans", true, resetModeState, true);
        option("addModeClass", false, resetModeState, true);
        option("pollInterval", 100);
        option("undoDepth", 200, function(cm, val) {
          return cm.doc.history.undoDepth = val;
        });
        option("historyEventDelay", 1250);
        option("viewportMargin", 10, function(cm) {
          return cm.refresh();
        }, true);
        option("maxHighlightLength", 1e4, resetModeState, true);
        option("moveInputWithCursor", true, function(cm, val) {
          if (!val) {
            cm.display.input.resetPosition();
          }
        });
        option("tabindex", null, function(cm, val) {
          return cm.display.input.getField().tabIndex = val || "";
        });
        option("autofocus", null);
        option("direction", "ltr", function(cm, val) {
          return cm.doc.setDirection(val);
        }, true);
        option("phrases", null);
      }
      function dragDropChanged(cm, value, old) {
        var wasOn = old && old != Init;
        if (!value != !wasOn) {
          var funcs = cm.display.dragFunctions;
          var toggle = value ? on : off;
          toggle(cm.display.scroller, "dragstart", funcs.start);
          toggle(cm.display.scroller, "dragenter", funcs.enter);
          toggle(cm.display.scroller, "dragover", funcs.over);
          toggle(cm.display.scroller, "dragleave", funcs.leave);
          toggle(cm.display.scroller, "drop", funcs.drop);
        }
      }
      function wrappingChanged(cm) {
        if (cm.options.lineWrapping) {
          addClass(cm.display.wrapper, "CodeMirror-wrap");
          cm.display.sizer.style.minWidth = "";
          cm.display.sizerWidth = null;
        } else {
          rmClass(cm.display.wrapper, "CodeMirror-wrap");
          findMaxLine(cm);
        }
        estimateLineHeights(cm);
        regChange(cm);
        clearCaches(cm);
        setTimeout(function() {
          return updateScrollbars(cm);
        }, 100);
      }
      function CodeMirror2(place, options) {
        var this$1$1 = this;
        if (!(this instanceof CodeMirror2)) {
          return new CodeMirror2(place, options);
        }
        this.options = options = options ? copyObj(options) : {};
        copyObj(defaults, options, false);
        var doc2 = options.value;
        if (typeof doc2 == "string") {
          doc2 = new Doc(doc2, options.mode, null, options.lineSeparator, options.direction);
        } else if (options.mode) {
          doc2.modeOption = options.mode;
        }
        this.doc = doc2;
        var input = new CodeMirror2.inputStyles[options.inputStyle](this);
        var display = this.display = new Display(place, doc2, input, options);
        display.wrapper.CodeMirror = this;
        themeChanged(this);
        if (options.lineWrapping) {
          this.display.wrapper.className += " CodeMirror-wrap";
        }
        initScrollbars(this);
        this.state = {
          keyMaps: [],
          // stores maps added by addKeyMap
          overlays: [],
          // highlighting overlays, as added by addOverlay
          modeGen: 0,
          // bumped when mode/overlay changes, used to invalidate highlighting info
          overwrite: false,
          delayingBlurEvent: false,
          focused: false,
          suppressEdits: false,
          // used to disable editing during key handlers when in readOnly mode
          pasteIncoming: -1,
          cutIncoming: -1,
          // help recognize paste/cut edits in input.poll
          selectingText: false,
          draggingText: false,
          highlight: new Delayed(),
          // stores highlight worker timeout
          keySeq: null,
          // Unfinished key sequence
          specialChars: null
        };
        if (options.autofocus && !mobile) {
          display.input.focus();
        }
        if (ie && ie_version < 11) {
          setTimeout(function() {
            return this$1$1.display.input.reset(true);
          }, 20);
        }
        registerEventHandlers(this);
        ensureGlobalHandlers();
        startOperation(this);
        this.curOp.forceUpdate = true;
        attachDoc(this, doc2);
        if (options.autofocus && !mobile || this.hasFocus()) {
          setTimeout(function() {
            if (this$1$1.hasFocus() && !this$1$1.state.focused) {
              onFocus(this$1$1);
            }
          }, 20);
        } else {
          onBlur(this);
        }
        for (var opt in optionHandlers) {
          if (optionHandlers.hasOwnProperty(opt)) {
            optionHandlers[opt](this, options[opt], Init);
          }
        }
        maybeUpdateLineNumberWidth(this);
        if (options.finishInit) {
          options.finishInit(this);
        }
        for (var i2 = 0; i2 < initHooks.length; ++i2) {
          initHooks[i2](this);
        }
        endOperation(this);
        if (webkit && options.lineWrapping && getComputedStyle(display.lineDiv).textRendering == "optimizelegibility") {
          display.lineDiv.style.textRendering = "auto";
        }
      }
      CodeMirror2.defaults = defaults;
      CodeMirror2.optionHandlers = optionHandlers;
      function registerEventHandlers(cm) {
        var d = cm.display;
        on(d.scroller, "mousedown", operation(cm, onMouseDown));
        if (ie && ie_version < 11) {
          on(d.scroller, "dblclick", operation(cm, function(e) {
            if (signalDOMEvent(cm, e)) {
              return;
            }
            var pos = posFromMouse(cm, e);
            if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) {
              return;
            }
            e_preventDefault(e);
            var word = cm.findWordAt(pos);
            extendSelection(cm.doc, word.anchor, word.head);
          }));
        } else {
          on(d.scroller, "dblclick", function(e) {
            return signalDOMEvent(cm, e) || e_preventDefault(e);
          });
        }
        on(d.scroller, "contextmenu", function(e) {
          return onContextMenu(cm, e);
        });
        on(d.input.getField(), "contextmenu", function(e) {
          if (!d.scroller.contains(e.target)) {
            onContextMenu(cm, e);
          }
        });
        var touchFinished, prevTouch = { end: 0 };
        function finishTouch() {
          if (d.activeTouch) {
            touchFinished = setTimeout(function() {
              return d.activeTouch = null;
            }, 1e3);
            prevTouch = d.activeTouch;
            prevTouch.end = +/* @__PURE__ */ new Date();
          }
        }
        function isMouseLikeTouchEvent(e) {
          if (e.touches.length != 1) {
            return false;
          }
          var touch = e.touches[0];
          return touch.radiusX <= 1 && touch.radiusY <= 1;
        }
        function farAway(touch, other) {
          if (other.left == null) {
            return true;
          }
          var dx = other.left - touch.left, dy = other.top - touch.top;
          return dx * dx + dy * dy > 20 * 20;
        }
        on(d.scroller, "touchstart", function(e) {
          if (!signalDOMEvent(cm, e) && !isMouseLikeTouchEvent(e) && !clickInGutter(cm, e)) {
            d.input.ensurePolled();
            clearTimeout(touchFinished);
            var now = +/* @__PURE__ */ new Date();
            d.activeTouch = {
              start: now,
              moved: false,
              prev: now - prevTouch.end <= 300 ? prevTouch : null
            };
            if (e.touches.length == 1) {
              d.activeTouch.left = e.touches[0].pageX;
              d.activeTouch.top = e.touches[0].pageY;
            }
          }
        });
        on(d.scroller, "touchmove", function() {
          if (d.activeTouch) {
            d.activeTouch.moved = true;
          }
        });
        on(d.scroller, "touchend", function(e) {
          var touch = d.activeTouch;
          if (touch && !eventInWidget(d, e) && touch.left != null && !touch.moved && /* @__PURE__ */ new Date() - touch.start < 300) {
            var pos = cm.coordsChar(d.activeTouch, "page"), range2;
            if (!touch.prev || farAway(touch, touch.prev)) {
              range2 = new Range(pos, pos);
            } else if (!touch.prev.prev || farAway(touch, touch.prev.prev)) {
              range2 = cm.findWordAt(pos);
            } else {
              range2 = new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
            }
            cm.setSelection(range2.anchor, range2.head);
            cm.focus();
            e_preventDefault(e);
          }
          finishTouch();
        });
        on(d.scroller, "touchcancel", finishTouch);
        on(d.scroller, "scroll", function() {
          if (d.scroller.clientHeight) {
            updateScrollTop(cm, d.scroller.scrollTop);
            setScrollLeft(cm, d.scroller.scrollLeft, true);
            signal(cm, "scroll", cm);
          }
        });
        on(d.scroller, "mousewheel", function(e) {
          return onScrollWheel(cm, e);
        });
        on(d.scroller, "DOMMouseScroll", function(e) {
          return onScrollWheel(cm, e);
        });
        on(d.wrapper, "scroll", function() {
          return d.wrapper.scrollTop = d.wrapper.scrollLeft = 0;
        });
        d.dragFunctions = {
          enter: function(e) {
            if (!signalDOMEvent(cm, e)) {
              e_stop(e);
            }
          },
          over: function(e) {
            if (!signalDOMEvent(cm, e)) {
              onDragOver(cm, e);
              e_stop(e);
            }
          },
          start: function(e) {
            return onDragStart(cm, e);
          },
          drop: operation(cm, onDrop),
          leave: function(e) {
            if (!signalDOMEvent(cm, e)) {
              clearDragCursor(cm);
            }
          }
        };
        var inp = d.input.getField();
        on(inp, "keyup", function(e) {
          return onKeyUp.call(cm, e);
        });
        on(inp, "keydown", operation(cm, onKeyDown));
        on(inp, "keypress", operation(cm, onKeyPress));
        on(inp, "focus", function(e) {
          return onFocus(cm, e);
        });
        on(inp, "blur", function(e) {
          return onBlur(cm, e);
        });
      }
      var initHooks = [];
      CodeMirror2.defineInitHook = function(f) {
        return initHooks.push(f);
      };
      function indentLine(cm, n, how, aggressive) {
        var doc2 = cm.doc, state;
        if (how == null) {
          how = "add";
        }
        if (how == "smart") {
          if (!doc2.mode.indent) {
            how = "prev";
          } else {
            state = getContextBefore(cm, n).state;
          }
        }
        var tabSize = cm.options.tabSize;
        var line = getLine(doc2, n), curSpace = countColumn(line.text, null, tabSize);
        if (line.stateAfter) {
          line.stateAfter = null;
        }
        var curSpaceString = line.text.match(/^\s*/)[0], indentation;
        if (!aggressive && !/\S/.test(line.text)) {
          indentation = 0;
          how = "not";
        } else if (how == "smart") {
          indentation = doc2.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
          if (indentation == Pass || indentation > 150) {
            if (!aggressive) {
              return;
            }
            how = "prev";
          }
        }
        if (how == "prev") {
          if (n > doc2.first) {
            indentation = countColumn(getLine(doc2, n - 1).text, null, tabSize);
          } else {
            indentation = 0;
          }
        } else if (how == "add") {
          indentation = curSpace + cm.options.indentUnit;
        } else if (how == "subtract") {
          indentation = curSpace - cm.options.indentUnit;
        } else if (typeof how == "number") {
          indentation = curSpace + how;
        }
        indentation = Math.max(0, indentation);
        var indentString = "", pos = 0;
        if (cm.options.indentWithTabs) {
          for (var i2 = Math.floor(indentation / tabSize); i2; --i2) {
            pos += tabSize;
            indentString += "	";
          }
        }
        if (pos < indentation) {
          indentString += spaceStr(indentation - pos);
        }
        if (indentString != curSpaceString) {
          replaceRange(doc2, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input");
          line.stateAfter = null;
          return true;
        } else {
          for (var i$12 = 0; i$12 < doc2.sel.ranges.length; i$12++) {
            var range2 = doc2.sel.ranges[i$12];
            if (range2.head.line == n && range2.head.ch < curSpaceString.length) {
              var pos$1 = Pos(n, curSpaceString.length);
              replaceOneSelection(doc2, i$12, new Range(pos$1, pos$1));
              break;
            }
          }
        }
      }
      var lastCopied = null;
      function setLastCopied(newLastCopied) {
        lastCopied = newLastCopied;
      }
      function applyTextInput(cm, inserted, deleted, sel, origin) {
        var doc2 = cm.doc;
        cm.display.shift = false;
        if (!sel) {
          sel = doc2.sel;
        }
        var recent = +/* @__PURE__ */ new Date() - 200;
        var paste = origin == "paste" || cm.state.pasteIncoming > recent;
        var textLines = splitLinesAuto(inserted), multiPaste = null;
        if (paste && sel.ranges.length > 1) {
          if (lastCopied && lastCopied.text.join("\n") == inserted) {
            if (sel.ranges.length % lastCopied.text.length == 0) {
              multiPaste = [];
              for (var i2 = 0; i2 < lastCopied.text.length; i2++) {
                multiPaste.push(doc2.splitLines(lastCopied.text[i2]));
              }
            }
          } else if (textLines.length == sel.ranges.length && cm.options.pasteLinesPerSelection) {
            multiPaste = map(textLines, function(l) {
              return [l];
            });
          }
        }
        var updateInput = cm.curOp.updateInput;
        for (var i$12 = sel.ranges.length - 1; i$12 >= 0; i$12--) {
          var range2 = sel.ranges[i$12];
          var from = range2.from(), to = range2.to();
          if (range2.empty()) {
            if (deleted && deleted > 0) {
              from = Pos(from.line, from.ch - deleted);
            } else if (cm.state.overwrite && !paste) {
              to = Pos(to.line, Math.min(getLine(doc2, to.line).text.length, to.ch + lst(textLines).length));
            } else if (paste && lastCopied && lastCopied.lineWise && lastCopied.text.join("\n") == textLines.join("\n")) {
              from = to = Pos(from.line, 0);
            }
          }
          var changeEvent = {
            from,
            to,
            text: multiPaste ? multiPaste[i$12 % multiPaste.length] : textLines,
            origin: origin || (paste ? "paste" : cm.state.cutIncoming > recent ? "cut" : "+input")
          };
          makeChange(cm.doc, changeEvent);
          signalLater(cm, "inputRead", cm, changeEvent);
        }
        if (inserted && !paste) {
          triggerElectric(cm, inserted);
        }
        ensureCursorVisible(cm);
        if (cm.curOp.updateInput < 2) {
          cm.curOp.updateInput = updateInput;
        }
        cm.curOp.typing = true;
        cm.state.pasteIncoming = cm.state.cutIncoming = -1;
      }
      function handlePaste(e, cm) {
        var pasted = e.clipboardData && e.clipboardData.getData("Text");
        if (pasted) {
          e.preventDefault();
          if (!cm.isReadOnly() && !cm.options.disableInput && cm.hasFocus()) {
            runInOp(cm, function() {
              return applyTextInput(cm, pasted, 0, null, "paste");
            });
          }
          return true;
        }
      }
      function triggerElectric(cm, inserted) {
        if (!cm.options.electricChars || !cm.options.smartIndent) {
          return;
        }
        var sel = cm.doc.sel;
        for (var i2 = sel.ranges.length - 1; i2 >= 0; i2--) {
          var range2 = sel.ranges[i2];
          if (range2.head.ch > 100 || i2 && sel.ranges[i2 - 1].head.line == range2.head.line) {
            continue;
          }
          var mode = cm.getModeAt(range2.head);
          var indented = false;
          if (mode.electricChars) {
            for (var j = 0; j < mode.electricChars.length; j++) {
              if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
                indented = indentLine(cm, range2.head.line, "smart");
                break;
              }
            }
          } else if (mode.electricInput) {
            if (mode.electricInput.test(getLine(cm.doc, range2.head.line).text.slice(0, range2.head.ch))) {
              indented = indentLine(cm, range2.head.line, "smart");
            }
          }
          if (indented) {
            signalLater(cm, "electricInput", cm, range2.head.line);
          }
        }
      }
      function copyableRanges(cm) {
        var text = [], ranges = [];
        for (var i2 = 0; i2 < cm.doc.sel.ranges.length; i2++) {
          var line = cm.doc.sel.ranges[i2].head.line;
          var lineRange = { anchor: Pos(line, 0), head: Pos(line + 1, 0) };
          ranges.push(lineRange);
          text.push(cm.getRange(lineRange.anchor, lineRange.head));
        }
        return { text, ranges };
      }
      function disableBrowserMagic(field, spellcheck, autocorrect, autocapitalize) {
        field.setAttribute("autocorrect", autocorrect ? "on" : "off");
        field.setAttribute("autocapitalize", autocapitalize ? "on" : "off");
        field.setAttribute("spellcheck", !!spellcheck);
      }
      function hiddenTextarea() {
        var te = elt("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; min-height: 1em; outline: none");
        var div = elt("div", [te], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
        if (webkit) {
          te.style.width = "1000px";
        } else {
          te.setAttribute("wrap", "off");
        }
        if (ios) {
          te.style.border = "1px solid black";
        }
        return div;
      }
      function addEditorMethods(CodeMirror3) {
        var optionHandlers2 = CodeMirror3.optionHandlers;
        var helpers = CodeMirror3.helpers = {};
        CodeMirror3.prototype = {
          constructor: CodeMirror3,
          focus: function() {
            win(this).focus();
            this.display.input.focus();
          },
          setOption: function(option, value) {
            var options = this.options, old = options[option];
            if (options[option] == value && option != "mode") {
              return;
            }
            options[option] = value;
            if (optionHandlers2.hasOwnProperty(option)) {
              operation(this, optionHandlers2[option])(this, value, old);
            }
            signal(this, "optionChange", this, option);
          },
          getOption: function(option) {
            return this.options[option];
          },
          getDoc: function() {
            return this.doc;
          },
          addKeyMap: function(map2, bottom) {
            this.state.keyMaps[bottom ? "push" : "unshift"](getKeyMap(map2));
          },
          removeKeyMap: function(map2) {
            var maps = this.state.keyMaps;
            for (var i2 = 0; i2 < maps.length; ++i2) {
              if (maps[i2] == map2 || maps[i2].name == map2) {
                maps.splice(i2, 1);
                return true;
              }
            }
          },
          addOverlay: methodOp(function(spec, options) {
            var mode = spec.token ? spec : CodeMirror3.getMode(this.options, spec);
            if (mode.startState) {
              throw new Error("Overlays may not be stateful.");
            }
            insertSorted(
              this.state.overlays,
              {
                mode,
                modeSpec: spec,
                opaque: options && options.opaque,
                priority: options && options.priority || 0
              },
              function(overlay) {
                return overlay.priority;
              }
            );
            this.state.modeGen++;
            regChange(this);
          }),
          removeOverlay: methodOp(function(spec) {
            var overlays = this.state.overlays;
            for (var i2 = 0; i2 < overlays.length; ++i2) {
              var cur = overlays[i2].modeSpec;
              if (cur == spec || typeof spec == "string" && cur.name == spec) {
                overlays.splice(i2, 1);
                this.state.modeGen++;
                regChange(this);
                return;
              }
            }
          }),
          indentLine: methodOp(function(n, dir, aggressive) {
            if (typeof dir != "string" && typeof dir != "number") {
              if (dir == null) {
                dir = this.options.smartIndent ? "smart" : "prev";
              } else {
                dir = dir ? "add" : "subtract";
              }
            }
            if (isLine(this.doc, n)) {
              indentLine(this, n, dir, aggressive);
            }
          }),
          indentSelection: methodOp(function(how) {
            var ranges = this.doc.sel.ranges, end = -1;
            for (var i2 = 0; i2 < ranges.length; i2++) {
              var range2 = ranges[i2];
              if (!range2.empty()) {
                var from = range2.from(), to = range2.to();
                var start = Math.max(end, from.line);
                end = Math.min(this.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;
                for (var j = start; j < end; ++j) {
                  indentLine(this, j, how);
                }
                var newRanges = this.doc.sel.ranges;
                if (from.ch == 0 && ranges.length == newRanges.length && newRanges[i2].from().ch > 0) {
                  replaceOneSelection(this.doc, i2, new Range(from, newRanges[i2].to()), sel_dontScroll);
                }
              } else if (range2.head.line > end) {
                indentLine(this, range2.head.line, how, true);
                end = range2.head.line;
                if (i2 == this.doc.sel.primIndex) {
                  ensureCursorVisible(this);
                }
              }
            }
          }),
          // Fetch the parser token for a given character. Useful for hacks
          // that want to inspect the mode state (say, for completion).
          getTokenAt: function(pos, precise) {
            return takeToken(this, pos, precise);
          },
          getLineTokens: function(line, precise) {
            return takeToken(this, Pos(line), precise, true);
          },
          getTokenTypeAt: function(pos) {
            pos = clipPos(this.doc, pos);
            var styles = getLineStyles(this, getLine(this.doc, pos.line));
            var before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
            var type;
            if (ch == 0) {
              type = styles[2];
            } else {
              for (; ; ) {
                var mid = before + after >> 1;
                if ((mid ? styles[mid * 2 - 1] : 0) >= ch) {
                  after = mid;
                } else if (styles[mid * 2 + 1] < ch) {
                  before = mid + 1;
                } else {
                  type = styles[mid * 2 + 2];
                  break;
                }
              }
            }
            var cut = type ? type.indexOf("overlay ") : -1;
            return cut < 0 ? type : cut == 0 ? null : type.slice(0, cut - 1);
          },
          getModeAt: function(pos) {
            var mode = this.doc.mode;
            if (!mode.innerMode) {
              return mode;
            }
            return CodeMirror3.innerMode(mode, this.getTokenAt(pos).state).mode;
          },
          getHelper: function(pos, type) {
            return this.getHelpers(pos, type)[0];
          },
          getHelpers: function(pos, type) {
            var found = [];
            if (!helpers.hasOwnProperty(type)) {
              return found;
            }
            var help = helpers[type], mode = this.getModeAt(pos);
            if (typeof mode[type] == "string") {
              if (help[mode[type]]) {
                found.push(help[mode[type]]);
              }
            } else if (mode[type]) {
              for (var i2 = 0; i2 < mode[type].length; i2++) {
                var val = help[mode[type][i2]];
                if (val) {
                  found.push(val);
                }
              }
            } else if (mode.helperType && help[mode.helperType]) {
              found.push(help[mode.helperType]);
            } else if (help[mode.name]) {
              found.push(help[mode.name]);
            }
            for (var i$12 = 0; i$12 < help._global.length; i$12++) {
              var cur = help._global[i$12];
              if (cur.pred(mode, this) && indexOf(found, cur.val) == -1) {
                found.push(cur.val);
              }
            }
            return found;
          },
          getStateAfter: function(line, precise) {
            var doc2 = this.doc;
            line = clipLine(doc2, line == null ? doc2.first + doc2.size - 1 : line);
            return getContextBefore(this, line + 1, precise).state;
          },
          cursorCoords: function(start, mode) {
            var pos, range2 = this.doc.sel.primary();
            if (start == null) {
              pos = range2.head;
            } else if (typeof start == "object") {
              pos = clipPos(this.doc, start);
            } else {
              pos = start ? range2.from() : range2.to();
            }
            return cursorCoords(this, pos, mode || "page");
          },
          charCoords: function(pos, mode) {
            return charCoords(this, clipPos(this.doc, pos), mode || "page");
          },
          coordsChar: function(coords, mode) {
            coords = fromCoordSystem(this, coords, mode || "page");
            return coordsChar(this, coords.left, coords.top);
          },
          lineAtHeight: function(height, mode) {
            height = fromCoordSystem(this, { top: height, left: 0 }, mode || "page").top;
            return lineAtHeight(this.doc, height + this.display.viewOffset);
          },
          heightAtLine: function(line, mode, includeWidgets) {
            var end = false, lineObj;
            if (typeof line == "number") {
              var last = this.doc.first + this.doc.size - 1;
              if (line < this.doc.first) {
                line = this.doc.first;
              } else if (line > last) {
                line = last;
                end = true;
              }
              lineObj = getLine(this.doc, line);
            } else {
              lineObj = line;
            }
            return intoCoordSystem(this, lineObj, { top: 0, left: 0 }, mode || "page", includeWidgets || end).top + (end ? this.doc.height - heightAtLine(lineObj) : 0);
          },
          defaultTextHeight: function() {
            return textHeight(this.display);
          },
          defaultCharWidth: function() {
            return charWidth(this.display);
          },
          getViewport: function() {
            return { from: this.display.viewFrom, to: this.display.viewTo };
          },
          addWidget: function(pos, node, scroll, vert, horiz) {
            var display = this.display;
            pos = cursorCoords(this, clipPos(this.doc, pos));
            var top = pos.bottom, left = pos.left;
            node.style.position = "absolute";
            node.setAttribute("cm-ignore-events", "true");
            this.display.input.setUneditable(node);
            display.sizer.appendChild(node);
            if (vert == "over") {
              top = pos.top;
            } else if (vert == "above" || vert == "near") {
              var vspace = Math.max(display.wrapper.clientHeight, this.doc.height), hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
              if ((vert == "above" || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight) {
                top = pos.top - node.offsetHeight;
              } else if (pos.bottom + node.offsetHeight <= vspace) {
                top = pos.bottom;
              }
              if (left + node.offsetWidth > hspace) {
                left = hspace - node.offsetWidth;
              }
            }
            node.style.top = top + "px";
            node.style.left = node.style.right = "";
            if (horiz == "right") {
              left = display.sizer.clientWidth - node.offsetWidth;
              node.style.right = "0px";
            } else {
              if (horiz == "left") {
                left = 0;
              } else if (horiz == "middle") {
                left = (display.sizer.clientWidth - node.offsetWidth) / 2;
              }
              node.style.left = left + "px";
            }
            if (scroll) {
              scrollIntoView(this, { left, top, right: left + node.offsetWidth, bottom: top + node.offsetHeight });
            }
          },
          triggerOnKeyDown: methodOp(onKeyDown),
          triggerOnKeyPress: methodOp(onKeyPress),
          triggerOnKeyUp: onKeyUp,
          triggerOnMouseDown: methodOp(onMouseDown),
          execCommand: function(cmd) {
            if (commands.hasOwnProperty(cmd)) {
              return commands[cmd].call(null, this);
            }
          },
          triggerElectric: methodOp(function(text) {
            triggerElectric(this, text);
          }),
          findPosH: function(from, amount, unit, visually) {
            var dir = 1;
            if (amount < 0) {
              dir = -1;
              amount = -amount;
            }
            var cur = clipPos(this.doc, from);
            for (var i2 = 0; i2 < amount; ++i2) {
              cur = findPosH(this.doc, cur, dir, unit, visually);
              if (cur.hitSide) {
                break;
              }
            }
            return cur;
          },
          moveH: methodOp(function(dir, unit) {
            var this$1$1 = this;
            this.extendSelectionsBy(function(range2) {
              if (this$1$1.display.shift || this$1$1.doc.extend || range2.empty()) {
                return findPosH(this$1$1.doc, range2.head, dir, unit, this$1$1.options.rtlMoveVisually);
              } else {
                return dir < 0 ? range2.from() : range2.to();
              }
            }, sel_move);
          }),
          deleteH: methodOp(function(dir, unit) {
            var sel = this.doc.sel, doc2 = this.doc;
            if (sel.somethingSelected()) {
              doc2.replaceSelection("", null, "+delete");
            } else {
              deleteNearSelection(this, function(range2) {
                var other = findPosH(doc2, range2.head, dir, unit, false);
                return dir < 0 ? { from: other, to: range2.head } : { from: range2.head, to: other };
              });
            }
          }),
          findPosV: function(from, amount, unit, goalColumn) {
            var dir = 1, x = goalColumn;
            if (amount < 0) {
              dir = -1;
              amount = -amount;
            }
            var cur = clipPos(this.doc, from);
            for (var i2 = 0; i2 < amount; ++i2) {
              var coords = cursorCoords(this, cur, "div");
              if (x == null) {
                x = coords.left;
              } else {
                coords.left = x;
              }
              cur = findPosV(this, coords, dir, unit);
              if (cur.hitSide) {
                break;
              }
            }
            return cur;
          },
          moveV: methodOp(function(dir, unit) {
            var this$1$1 = this;
            var doc2 = this.doc, goals = [];
            var collapse = !this.display.shift && !doc2.extend && doc2.sel.somethingSelected();
            doc2.extendSelectionsBy(function(range2) {
              if (collapse) {
                return dir < 0 ? range2.from() : range2.to();
              }
              var headPos = cursorCoords(this$1$1, range2.head, "div");
              if (range2.goalColumn != null) {
                headPos.left = range2.goalColumn;
              }
              goals.push(headPos.left);
              var pos = findPosV(this$1$1, headPos, dir, unit);
              if (unit == "page" && range2 == doc2.sel.primary()) {
                addToScrollTop(this$1$1, charCoords(this$1$1, pos, "div").top - headPos.top);
              }
              return pos;
            }, sel_move);
            if (goals.length) {
              for (var i2 = 0; i2 < doc2.sel.ranges.length; i2++) {
                doc2.sel.ranges[i2].goalColumn = goals[i2];
              }
            }
          }),
          // Find the word at the given position (as returned by coordsChar).
          findWordAt: function(pos) {
            var doc2 = this.doc, line = getLine(doc2, pos.line).text;
            var start = pos.ch, end = pos.ch;
            if (line) {
              var helper = this.getHelper(pos, "wordChars");
              if ((pos.sticky == "before" || end == line.length) && start) {
                --start;
              } else {
                ++end;
              }
              var startChar = line.charAt(start);
              var check = isWordChar(startChar, helper) ? function(ch) {
                return isWordChar(ch, helper);
              } : /\s/.test(startChar) ? function(ch) {
                return /\s/.test(ch);
              } : function(ch) {
                return !/\s/.test(ch) && !isWordChar(ch);
              };
              while (start > 0 && check(line.charAt(start - 1))) {
                --start;
              }
              while (end < line.length && check(line.charAt(end))) {
                ++end;
              }
            }
            return new Range(Pos(pos.line, start), Pos(pos.line, end));
          },
          toggleOverwrite: function(value) {
            if (value != null && value == this.state.overwrite) {
              return;
            }
            if (this.state.overwrite = !this.state.overwrite) {
              addClass(this.display.cursorDiv, "CodeMirror-overwrite");
            } else {
              rmClass(this.display.cursorDiv, "CodeMirror-overwrite");
            }
            signal(this, "overwriteToggle", this, this.state.overwrite);
          },
          hasFocus: function() {
            return this.display.input.getField() == activeElt(root(this));
          },
          isReadOnly: function() {
            return !!(this.options.readOnly || this.doc.cantEdit);
          },
          scrollTo: methodOp(function(x, y) {
            scrollToCoords(this, x, y);
          }),
          getScrollInfo: function() {
            var scroller = this.display.scroller;
            return {
              left: scroller.scrollLeft,
              top: scroller.scrollTop,
              height: scroller.scrollHeight - scrollGap(this) - this.display.barHeight,
              width: scroller.scrollWidth - scrollGap(this) - this.display.barWidth,
              clientHeight: displayHeight(this),
              clientWidth: displayWidth(this)
            };
          },
          scrollIntoView: methodOp(function(range2, margin) {
            if (range2 == null) {
              range2 = { from: this.doc.sel.primary().head, to: null };
              if (margin == null) {
                margin = this.options.cursorScrollMargin;
              }
            } else if (typeof range2 == "number") {
              range2 = { from: Pos(range2, 0), to: null };
            } else if (range2.from == null) {
              range2 = { from: range2, to: null };
            }
            if (!range2.to) {
              range2.to = range2.from;
            }
            range2.margin = margin || 0;
            if (range2.from.line != null) {
              scrollToRange(this, range2);
            } else {
              scrollToCoordsRange(this, range2.from, range2.to, range2.margin);
            }
          }),
          setSize: methodOp(function(width, height) {
            var this$1$1 = this;
            var interpret = function(val) {
              return typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val;
            };
            if (width != null) {
              this.display.wrapper.style.width = interpret(width);
            }
            if (height != null) {
              this.display.wrapper.style.height = interpret(height);
            }
            if (this.options.lineWrapping) {
              clearLineMeasurementCache(this);
            }
            var lineNo2 = this.display.viewFrom;
            this.doc.iter(lineNo2, this.display.viewTo, function(line) {
              if (line.widgets) {
                for (var i2 = 0; i2 < line.widgets.length; i2++) {
                  if (line.widgets[i2].noHScroll) {
                    regLineChange(this$1$1, lineNo2, "widget");
                    break;
                  }
                }
              }
              ++lineNo2;
            });
            this.curOp.forceUpdate = true;
            signal(this, "refresh", this);
          }),
          operation: function(f) {
            return runInOp(this, f);
          },
          startOperation: function() {
            return startOperation(this);
          },
          endOperation: function() {
            return endOperation(this);
          },
          refresh: methodOp(function() {
            var oldHeight = this.display.cachedTextHeight;
            regChange(this);
            this.curOp.forceUpdate = true;
            clearCaches(this);
            scrollToCoords(this, this.doc.scrollLeft, this.doc.scrollTop);
            updateGutterSpace(this.display);
            if (oldHeight == null || Math.abs(oldHeight - textHeight(this.display)) > 0.5 || this.options.lineWrapping) {
              estimateLineHeights(this);
            }
            signal(this, "refresh", this);
          }),
          swapDoc: methodOp(function(doc2) {
            var old = this.doc;
            old.cm = null;
            if (this.state.selectingText) {
              this.state.selectingText();
            }
            attachDoc(this, doc2);
            clearCaches(this);
            this.display.input.reset();
            scrollToCoords(this, doc2.scrollLeft, doc2.scrollTop);
            this.curOp.forceScroll = true;
            signalLater(this, "swapDoc", this, old);
            return old;
          }),
          phrase: function(phraseText) {
            var phrases = this.options.phrases;
            return phrases && Object.prototype.hasOwnProperty.call(phrases, phraseText) ? phrases[phraseText] : phraseText;
          },
          getInputField: function() {
            return this.display.input.getField();
          },
          getWrapperElement: function() {
            return this.display.wrapper;
          },
          getScrollerElement: function() {
            return this.display.scroller;
          },
          getGutterElement: function() {
            return this.display.gutters;
          }
        };
        eventMixin(CodeMirror3);
        CodeMirror3.registerHelper = function(type, name, value) {
          if (!helpers.hasOwnProperty(type)) {
            helpers[type] = CodeMirror3[type] = { _global: [] };
          }
          helpers[type][name] = value;
        };
        CodeMirror3.registerGlobalHelper = function(type, name, predicate, value) {
          CodeMirror3.registerHelper(type, name, value);
          helpers[type]._global.push({ pred: predicate, val: value });
        };
      }
      function findPosH(doc2, pos, dir, unit, visually) {
        var oldPos = pos;
        var origDir = dir;
        var lineObj = getLine(doc2, pos.line);
        var lineDir = visually && doc2.direction == "rtl" ? -dir : dir;
        function findNextLine() {
          var l = pos.line + lineDir;
          if (l < doc2.first || l >= doc2.first + doc2.size) {
            return false;
          }
          pos = new Pos(l, pos.ch, pos.sticky);
          return lineObj = getLine(doc2, l);
        }
        function moveOnce(boundToLine) {
          var next;
          if (unit == "codepoint") {
            var ch = lineObj.text.charCodeAt(pos.ch + (dir > 0 ? 0 : -1));
            if (isNaN(ch)) {
              next = null;
            } else {
              var astral = dir > 0 ? ch >= 55296 && ch < 56320 : ch >= 56320 && ch < 57343;
              next = new Pos(pos.line, Math.max(0, Math.min(lineObj.text.length, pos.ch + dir * (astral ? 2 : 1))), -dir);
            }
          } else if (visually) {
            next = moveVisually(doc2.cm, lineObj, pos, dir);
          } else {
            next = moveLogically(lineObj, pos, dir);
          }
          if (next == null) {
            if (!boundToLine && findNextLine()) {
              pos = endOfLine(visually, doc2.cm, lineObj, pos.line, lineDir);
            } else {
              return false;
            }
          } else {
            pos = next;
          }
          return true;
        }
        if (unit == "char" || unit == "codepoint") {
          moveOnce();
        } else if (unit == "column") {
          moveOnce(true);
        } else if (unit == "word" || unit == "group") {
          var sawType = null, group = unit == "group";
          var helper = doc2.cm && doc2.cm.getHelper(pos, "wordChars");
          for (var first = true; ; first = false) {
            if (dir < 0 && !moveOnce(!first)) {
              break;
            }
            var cur = lineObj.text.charAt(pos.ch) || "\n";
            var type = isWordChar(cur, helper) ? "w" : group && cur == "\n" ? "n" : !group || /\s/.test(cur) ? null : "p";
            if (group && !first && !type) {
              type = "s";
            }
            if (sawType && sawType != type) {
              if (dir < 0) {
                dir = 1;
                moveOnce();
                pos.sticky = "after";
              }
              break;
            }
            if (type) {
              sawType = type;
            }
            if (dir > 0 && !moveOnce(!first)) {
              break;
            }
          }
        }
        var result = skipAtomic(doc2, pos, oldPos, origDir, true);
        if (equalCursorPos(oldPos, result)) {
          result.hitSide = true;
        }
        return result;
      }
      function findPosV(cm, pos, dir, unit) {
        var doc2 = cm.doc, x = pos.left, y;
        if (unit == "page") {
          var pageSize = Math.min(cm.display.wrapper.clientHeight, win(cm).innerHeight || doc2(cm).documentElement.clientHeight);
          var moveAmount = Math.max(pageSize - 0.5 * textHeight(cm.display), 3);
          y = (dir > 0 ? pos.bottom : pos.top) + dir * moveAmount;
        } else if (unit == "line") {
          y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
        }
        var target;
        for (; ; ) {
          target = coordsChar(cm, x, y);
          if (!target.outside) {
            break;
          }
          if (dir < 0 ? y <= 0 : y >= doc2.height) {
            target.hitSide = true;
            break;
          }
          y += dir * 5;
        }
        return target;
      }
      var ContentEditableInput = function(cm) {
        this.cm = cm;
        this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
        this.polling = new Delayed();
        this.composing = null;
        this.gracePeriod = false;
        this.readDOMTimeout = null;
      };
      ContentEditableInput.prototype.init = function(display) {
        var this$1$1 = this;
        var input = this, cm = input.cm;
        var div = input.div = display.lineDiv;
        div.contentEditable = true;
        disableBrowserMagic(div, cm.options.spellcheck, cm.options.autocorrect, cm.options.autocapitalize);
        function belongsToInput(e) {
          for (var t = e.target; t; t = t.parentNode) {
            if (t == div) {
              return true;
            }
            if (/\bCodeMirror-(?:line)?widget\b/.test(t.className)) {
              break;
            }
          }
          return false;
        }
        on(div, "paste", function(e) {
          if (!belongsToInput(e) || signalDOMEvent(cm, e) || handlePaste(e, cm)) {
            return;
          }
          if (ie_version <= 11) {
            setTimeout(operation(cm, function() {
              return this$1$1.updateFromDOM();
            }), 20);
          }
        });
        on(div, "compositionstart", function(e) {
          this$1$1.composing = { data: e.data, done: false };
        });
        on(div, "compositionupdate", function(e) {
          if (!this$1$1.composing) {
            this$1$1.composing = { data: e.data, done: false };
          }
        });
        on(div, "compositionend", function(e) {
          if (this$1$1.composing) {
            if (e.data != this$1$1.composing.data) {
              this$1$1.readFromDOMSoon();
            }
            this$1$1.composing.done = true;
          }
        });
        on(div, "touchstart", function() {
          return input.forceCompositionEnd();
        });
        on(div, "input", function() {
          if (!this$1$1.composing) {
            this$1$1.readFromDOMSoon();
          }
        });
        function onCopyCut(e) {
          if (!belongsToInput(e) || signalDOMEvent(cm, e)) {
            return;
          }
          if (cm.somethingSelected()) {
            setLastCopied({ lineWise: false, text: cm.getSelections() });
            if (e.type == "cut") {
              cm.replaceSelection("", null, "cut");
            }
          } else if (!cm.options.lineWiseCopyCut) {
            return;
          } else {
            var ranges = copyableRanges(cm);
            setLastCopied({ lineWise: true, text: ranges.text });
            if (e.type == "cut") {
              cm.operation(function() {
                cm.setSelections(ranges.ranges, 0, sel_dontScroll);
                cm.replaceSelection("", null, "cut");
              });
            }
          }
          if (e.clipboardData) {
            e.clipboardData.clearData();
            var content = lastCopied.text.join("\n");
            e.clipboardData.setData("Text", content);
            if (e.clipboardData.getData("Text") == content) {
              e.preventDefault();
              return;
            }
          }
          var kludge = hiddenTextarea(), te = kludge.firstChild;
          disableBrowserMagic(te);
          cm.display.lineSpace.insertBefore(kludge, cm.display.lineSpace.firstChild);
          te.value = lastCopied.text.join("\n");
          var hadFocus = activeElt(rootNode(div));
          selectInput(te);
          setTimeout(function() {
            cm.display.lineSpace.removeChild(kludge);
            hadFocus.focus();
            if (hadFocus == div) {
              input.showPrimarySelection();
            }
          }, 50);
        }
        on(div, "copy", onCopyCut);
        on(div, "cut", onCopyCut);
      };
      ContentEditableInput.prototype.screenReaderLabelChanged = function(label) {
        if (label) {
          this.div.setAttribute("aria-label", label);
        } else {
          this.div.removeAttribute("aria-label");
        }
      };
      ContentEditableInput.prototype.prepareSelection = function() {
        var result = prepareSelection(this.cm, false);
        result.focus = activeElt(rootNode(this.div)) == this.div;
        return result;
      };
      ContentEditableInput.prototype.showSelection = function(info, takeFocus) {
        if (!info || !this.cm.display.view.length) {
          return;
        }
        if (info.focus || takeFocus) {
          this.showPrimarySelection();
        }
        this.showMultipleSelections(info);
      };
      ContentEditableInput.prototype.getSelection = function() {
        return this.cm.display.wrapper.ownerDocument.getSelection();
      };
      ContentEditableInput.prototype.showPrimarySelection = function() {
        var sel = this.getSelection(), cm = this.cm, prim = cm.doc.sel.primary();
        var from = prim.from(), to = prim.to();
        if (cm.display.viewTo == cm.display.viewFrom || from.line >= cm.display.viewTo || to.line < cm.display.viewFrom) {
          sel.removeAllRanges();
          return;
        }
        var curAnchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
        var curFocus = domToPos(cm, sel.focusNode, sel.focusOffset);
        if (curAnchor && !curAnchor.bad && curFocus && !curFocus.bad && cmp(minPos(curAnchor, curFocus), from) == 0 && cmp(maxPos(curAnchor, curFocus), to) == 0) {
          return;
        }
        var view = cm.display.view;
        var start = from.line >= cm.display.viewFrom && posToDOM(cm, from) || { node: view[0].measure.map[2], offset: 0 };
        var end = to.line < cm.display.viewTo && posToDOM(cm, to);
        if (!end) {
          var measure = view[view.length - 1].measure;
          var map2 = measure.maps ? measure.maps[measure.maps.length - 1] : measure.map;
          end = { node: map2[map2.length - 1], offset: map2[map2.length - 2] - map2[map2.length - 3] };
        }
        if (!start || !end) {
          sel.removeAllRanges();
          return;
        }
        var old = sel.rangeCount && sel.getRangeAt(0), rng;
        try {
          rng = range(start.node, start.offset, end.offset, end.node);
        } catch (e) {
        }
        if (rng) {
          if (!gecko && cm.state.focused) {
            sel.collapse(start.node, start.offset);
            if (!rng.collapsed) {
              sel.removeAllRanges();
              sel.addRange(rng);
            }
          } else {
            sel.removeAllRanges();
            sel.addRange(rng);
          }
          if (old && sel.anchorNode == null) {
            sel.addRange(old);
          } else if (gecko) {
            this.startGracePeriod();
          }
        }
        this.rememberSelection();
      };
      ContentEditableInput.prototype.startGracePeriod = function() {
        var this$1$1 = this;
        clearTimeout(this.gracePeriod);
        this.gracePeriod = setTimeout(function() {
          this$1$1.gracePeriod = false;
          if (this$1$1.selectionChanged()) {
            this$1$1.cm.operation(function() {
              return this$1$1.cm.curOp.selectionChanged = true;
            });
          }
        }, 20);
      };
      ContentEditableInput.prototype.showMultipleSelections = function(info) {
        removeChildrenAndAdd(this.cm.display.cursorDiv, info.cursors);
        removeChildrenAndAdd(this.cm.display.selectionDiv, info.selection);
      };
      ContentEditableInput.prototype.rememberSelection = function() {
        var sel = this.getSelection();
        this.lastAnchorNode = sel.anchorNode;
        this.lastAnchorOffset = sel.anchorOffset;
        this.lastFocusNode = sel.focusNode;
        this.lastFocusOffset = sel.focusOffset;
      };
      ContentEditableInput.prototype.selectionInEditor = function() {
        var sel = this.getSelection();
        if (!sel.rangeCount) {
          return false;
        }
        var node = sel.getRangeAt(0).commonAncestorContainer;
        return contains(this.div, node);
      };
      ContentEditableInput.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor") {
          if (!this.selectionInEditor() || activeElt(rootNode(this.div)) != this.div) {
            this.showSelection(this.prepareSelection(), true);
          }
          this.div.focus();
        }
      };
      ContentEditableInput.prototype.blur = function() {
        this.div.blur();
      };
      ContentEditableInput.prototype.getField = function() {
        return this.div;
      };
      ContentEditableInput.prototype.supportsTouch = function() {
        return true;
      };
      ContentEditableInput.prototype.receivedFocus = function() {
        var this$1$1 = this;
        var input = this;
        if (this.selectionInEditor()) {
          setTimeout(function() {
            return this$1$1.pollSelection();
          }, 20);
        } else {
          runInOp(this.cm, function() {
            return input.cm.curOp.selectionChanged = true;
          });
        }
        function poll() {
          if (input.cm.state.focused) {
            input.pollSelection();
            input.polling.set(input.cm.options.pollInterval, poll);
          }
        }
        this.polling.set(this.cm.options.pollInterval, poll);
      };
      ContentEditableInput.prototype.selectionChanged = function() {
        var sel = this.getSelection();
        return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset || sel.focusNode != this.lastFocusNode || sel.focusOffset != this.lastFocusOffset;
      };
      ContentEditableInput.prototype.pollSelection = function() {
        if (this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged()) {
          return;
        }
        var sel = this.getSelection(), cm = this.cm;
        if (android && chrome && this.cm.display.gutterSpecs.length && isInGutter(sel.anchorNode)) {
          this.cm.triggerOnKeyDown({ type: "keydown", keyCode: 8, preventDefault: Math.abs });
          this.blur();
          this.focus();
          return;
        }
        if (this.composing) {
          return;
        }
        this.rememberSelection();
        var anchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
        var head = domToPos(cm, sel.focusNode, sel.focusOffset);
        if (anchor && head) {
          runInOp(cm, function() {
            setSelection(cm.doc, simpleSelection(anchor, head), sel_dontScroll);
            if (anchor.bad || head.bad) {
              cm.curOp.selectionChanged = true;
            }
          });
        }
      };
      ContentEditableInput.prototype.pollContent = function() {
        if (this.readDOMTimeout != null) {
          clearTimeout(this.readDOMTimeout);
          this.readDOMTimeout = null;
        }
        var cm = this.cm, display = cm.display, sel = cm.doc.sel.primary();
        var from = sel.from(), to = sel.to();
        if (from.ch == 0 && from.line > cm.firstLine()) {
          from = Pos(from.line - 1, getLine(cm.doc, from.line - 1).length);
        }
        if (to.ch == getLine(cm.doc, to.line).text.length && to.line < cm.lastLine()) {
          to = Pos(to.line + 1, 0);
        }
        if (from.line < display.viewFrom || to.line > display.viewTo - 1) {
          return false;
        }
        var fromIndex, fromLine, fromNode;
        if (from.line == display.viewFrom || (fromIndex = findViewIndex(cm, from.line)) == 0) {
          fromLine = lineNo(display.view[0].line);
          fromNode = display.view[0].node;
        } else {
          fromLine = lineNo(display.view[fromIndex].line);
          fromNode = display.view[fromIndex - 1].node.nextSibling;
        }
        var toIndex = findViewIndex(cm, to.line);
        var toLine, toNode;
        if (toIndex == display.view.length - 1) {
          toLine = display.viewTo - 1;
          toNode = display.lineDiv.lastChild;
        } else {
          toLine = lineNo(display.view[toIndex + 1].line) - 1;
          toNode = display.view[toIndex + 1].node.previousSibling;
        }
        if (!fromNode) {
          return false;
        }
        var newText = cm.doc.splitLines(domTextBetween(cm, fromNode, toNode, fromLine, toLine));
        var oldText = getBetween(cm.doc, Pos(fromLine, 0), Pos(toLine, getLine(cm.doc, toLine).text.length));
        while (newText.length > 1 && oldText.length > 1) {
          if (lst(newText) == lst(oldText)) {
            newText.pop();
            oldText.pop();
            toLine--;
          } else if (newText[0] == oldText[0]) {
            newText.shift();
            oldText.shift();
            fromLine++;
          } else {
            break;
          }
        }
        var cutFront = 0, cutEnd = 0;
        var newTop = newText[0], oldTop = oldText[0], maxCutFront = Math.min(newTop.length, oldTop.length);
        while (cutFront < maxCutFront && newTop.charCodeAt(cutFront) == oldTop.charCodeAt(cutFront)) {
          ++cutFront;
        }
        var newBot = lst(newText), oldBot = lst(oldText);
        var maxCutEnd = Math.min(
          newBot.length - (newText.length == 1 ? cutFront : 0),
          oldBot.length - (oldText.length == 1 ? cutFront : 0)
        );
        while (cutEnd < maxCutEnd && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1)) {
          ++cutEnd;
        }
        if (newText.length == 1 && oldText.length == 1 && fromLine == from.line) {
          while (cutFront && cutFront > from.ch && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1)) {
            cutFront--;
            cutEnd++;
          }
        }
        newText[newText.length - 1] = newBot.slice(0, newBot.length - cutEnd).replace(/^\u200b+/, "");
        newText[0] = newText[0].slice(cutFront).replace(/\u200b+$/, "");
        var chFrom = Pos(fromLine, cutFront);
        var chTo = Pos(toLine, oldText.length ? lst(oldText).length - cutEnd : 0);
        if (newText.length > 1 || newText[0] || cmp(chFrom, chTo)) {
          replaceRange(cm.doc, newText, chFrom, chTo, "+input");
          return true;
        }
      };
      ContentEditableInput.prototype.ensurePolled = function() {
        this.forceCompositionEnd();
      };
      ContentEditableInput.prototype.reset = function() {
        this.forceCompositionEnd();
      };
      ContentEditableInput.prototype.forceCompositionEnd = function() {
        if (!this.composing) {
          return;
        }
        clearTimeout(this.readDOMTimeout);
        this.composing = null;
        this.updateFromDOM();
        this.div.blur();
        this.div.focus();
      };
      ContentEditableInput.prototype.readFromDOMSoon = function() {
        var this$1$1 = this;
        if (this.readDOMTimeout != null) {
          return;
        }
        this.readDOMTimeout = setTimeout(function() {
          this$1$1.readDOMTimeout = null;
          if (this$1$1.composing) {
            if (this$1$1.composing.done) {
              this$1$1.composing = null;
            } else {
              return;
            }
          }
          this$1$1.updateFromDOM();
        }, 80);
      };
      ContentEditableInput.prototype.updateFromDOM = function() {
        var this$1$1 = this;
        if (this.cm.isReadOnly() || !this.pollContent()) {
          runInOp(this.cm, function() {
            return regChange(this$1$1.cm);
          });
        }
      };
      ContentEditableInput.prototype.setUneditable = function(node) {
        node.contentEditable = "false";
      };
      ContentEditableInput.prototype.onKeyPress = function(e) {
        if (e.charCode == 0 || this.composing) {
          return;
        }
        e.preventDefault();
        if (!this.cm.isReadOnly()) {
          operation(this.cm, applyTextInput)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0);
        }
      };
      ContentEditableInput.prototype.readOnlyChanged = function(val) {
        this.div.contentEditable = String(val != "nocursor");
      };
      ContentEditableInput.prototype.onContextMenu = function() {
      };
      ContentEditableInput.prototype.resetPosition = function() {
      };
      ContentEditableInput.prototype.needsContentAttribute = true;
      function posToDOM(cm, pos) {
        var view = findViewForLine(cm, pos.line);
        if (!view || view.hidden) {
          return null;
        }
        var line = getLine(cm.doc, pos.line);
        var info = mapFromLineView(view, line, pos.line);
        var order = getOrder(line, cm.doc.direction), side = "left";
        if (order) {
          var partPos = getBidiPartAt(order, pos.ch);
          side = partPos % 2 ? "right" : "left";
        }
        var result = nodeAndOffsetInLineMap(info.map, pos.ch, side);
        result.offset = result.collapse == "right" ? result.end : result.start;
        return result;
      }
      function isInGutter(node) {
        for (var scan = node; scan; scan = scan.parentNode) {
          if (/CodeMirror-gutter-wrapper/.test(scan.className)) {
            return true;
          }
        }
        return false;
      }
      function badPos(pos, bad) {
        if (bad) {
          pos.bad = true;
        }
        return pos;
      }
      function domTextBetween(cm, from, to, fromLine, toLine) {
        var text = "", closing = false, lineSep = cm.doc.lineSeparator(), extraLinebreak = false;
        function recognizeMarker(id) {
          return function(marker) {
            return marker.id == id;
          };
        }
        function close() {
          if (closing) {
            text += lineSep;
            if (extraLinebreak) {
              text += lineSep;
            }
            closing = extraLinebreak = false;
          }
        }
        function addText(str) {
          if (str) {
            close();
            text += str;
          }
        }
        function walk(node) {
          if (node.nodeType == 1) {
            var cmText = node.getAttribute("cm-text");
            if (cmText) {
              addText(cmText);
              return;
            }
            var markerID = node.getAttribute("cm-marker"), range2;
            if (markerID) {
              var found = cm.findMarks(Pos(fromLine, 0), Pos(toLine + 1, 0), recognizeMarker(+markerID));
              if (found.length && (range2 = found[0].find(0))) {
                addText(getBetween(cm.doc, range2.from, range2.to).join(lineSep));
              }
              return;
            }
            if (node.getAttribute("contenteditable") == "false") {
              return;
            }
            var isBlock = /^(pre|div|p|li|table|br)$/i.test(node.nodeName);
            if (!/^br$/i.test(node.nodeName) && node.textContent.length == 0) {
              return;
            }
            if (isBlock) {
              close();
            }
            for (var i2 = 0; i2 < node.childNodes.length; i2++) {
              walk(node.childNodes[i2]);
            }
            if (/^(pre|p)$/i.test(node.nodeName)) {
              extraLinebreak = true;
            }
            if (isBlock) {
              closing = true;
            }
          } else if (node.nodeType == 3) {
            addText(node.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
          }
        }
        for (; ; ) {
          walk(from);
          if (from == to) {
            break;
          }
          from = from.nextSibling;
          extraLinebreak = false;
        }
        return text;
      }
      function domToPos(cm, node, offset) {
        var lineNode;
        if (node == cm.display.lineDiv) {
          lineNode = cm.display.lineDiv.childNodes[offset];
          if (!lineNode) {
            return badPos(cm.clipPos(Pos(cm.display.viewTo - 1)), true);
          }
          node = null;
          offset = 0;
        } else {
          for (lineNode = node; ; lineNode = lineNode.parentNode) {
            if (!lineNode || lineNode == cm.display.lineDiv) {
              return null;
            }
            if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv) {
              break;
            }
          }
        }
        for (var i2 = 0; i2 < cm.display.view.length; i2++) {
          var lineView = cm.display.view[i2];
          if (lineView.node == lineNode) {
            return locateNodeInLineView(lineView, node, offset);
          }
        }
      }
      function locateNodeInLineView(lineView, node, offset) {
        var wrapper = lineView.text.firstChild, bad = false;
        if (!node || !contains(wrapper, node)) {
          return badPos(Pos(lineNo(lineView.line), 0), true);
        }
        if (node == wrapper) {
          bad = true;
          node = wrapper.childNodes[offset];
          offset = 0;
          if (!node) {
            var line = lineView.rest ? lst(lineView.rest) : lineView.line;
            return badPos(Pos(lineNo(line), line.text.length), bad);
          }
        }
        var textNode = node.nodeType == 3 ? node : null, topNode = node;
        if (!textNode && node.childNodes.length == 1 && node.firstChild.nodeType == 3) {
          textNode = node.firstChild;
          if (offset) {
            offset = textNode.nodeValue.length;
          }
        }
        while (topNode.parentNode != wrapper) {
          topNode = topNode.parentNode;
        }
        var measure = lineView.measure, maps = measure.maps;
        function find(textNode2, topNode2, offset2) {
          for (var i2 = -1; i2 < (maps ? maps.length : 0); i2++) {
            var map2 = i2 < 0 ? measure.map : maps[i2];
            for (var j = 0; j < map2.length; j += 3) {
              var curNode = map2[j + 2];
              if (curNode == textNode2 || curNode == topNode2) {
                var line2 = lineNo(i2 < 0 ? lineView.line : lineView.rest[i2]);
                var ch = map2[j] + offset2;
                if (offset2 < 0 || curNode != textNode2) {
                  ch = map2[j + (offset2 ? 1 : 0)];
                }
                return Pos(line2, ch);
              }
            }
          }
        }
        var found = find(textNode, topNode, offset);
        if (found) {
          return badPos(found, bad);
        }
        for (var after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling) {
          found = find(after, after.firstChild, 0);
          if (found) {
            return badPos(Pos(found.line, found.ch - dist), bad);
          } else {
            dist += after.textContent.length;
          }
        }
        for (var before = topNode.previousSibling, dist$1 = offset; before; before = before.previousSibling) {
          found = find(before, before.firstChild, -1);
          if (found) {
            return badPos(Pos(found.line, found.ch + dist$1), bad);
          } else {
            dist$1 += before.textContent.length;
          }
        }
      }
      var TextareaInput = function(cm) {
        this.cm = cm;
        this.prevInput = "";
        this.pollingFast = false;
        this.polling = new Delayed();
        this.hasSelection = false;
        this.composing = null;
        this.resetting = false;
      };
      TextareaInput.prototype.init = function(display) {
        var this$1$1 = this;
        var input = this, cm = this.cm;
        this.createField(display);
        var te = this.textarea;
        display.wrapper.insertBefore(this.wrapper, display.wrapper.firstChild);
        if (ios) {
          te.style.width = "0px";
        }
        on(te, "input", function() {
          if (ie && ie_version >= 9 && this$1$1.hasSelection) {
            this$1$1.hasSelection = null;
          }
          input.poll();
        });
        on(te, "paste", function(e) {
          if (signalDOMEvent(cm, e) || handlePaste(e, cm)) {
            return;
          }
          cm.state.pasteIncoming = +/* @__PURE__ */ new Date();
          input.fastPoll();
        });
        function prepareCopyCut(e) {
          if (signalDOMEvent(cm, e)) {
            return;
          }
          if (cm.somethingSelected()) {
            setLastCopied({ lineWise: false, text: cm.getSelections() });
          } else if (!cm.options.lineWiseCopyCut) {
            return;
          } else {
            var ranges = copyableRanges(cm);
            setLastCopied({ lineWise: true, text: ranges.text });
            if (e.type == "cut") {
              cm.setSelections(ranges.ranges, null, sel_dontScroll);
            } else {
              input.prevInput = "";
              te.value = ranges.text.join("\n");
              selectInput(te);
            }
          }
          if (e.type == "cut") {
            cm.state.cutIncoming = +/* @__PURE__ */ new Date();
          }
        }
        on(te, "cut", prepareCopyCut);
        on(te, "copy", prepareCopyCut);
        on(display.scroller, "paste", function(e) {
          if (eventInWidget(display, e) || signalDOMEvent(cm, e)) {
            return;
          }
          if (!te.dispatchEvent) {
            cm.state.pasteIncoming = +/* @__PURE__ */ new Date();
            input.focus();
            return;
          }
          var event = new Event("paste");
          event.clipboardData = e.clipboardData;
          te.dispatchEvent(event);
        });
        on(display.lineSpace, "selectstart", function(e) {
          if (!eventInWidget(display, e)) {
            e_preventDefault(e);
          }
        });
        on(te, "compositionstart", function() {
          var start = cm.getCursor("from");
          if (input.composing) {
            input.composing.range.clear();
          }
          input.composing = {
            start,
            range: cm.markText(start, cm.getCursor("to"), { className: "CodeMirror-composing" })
          };
        });
        on(te, "compositionend", function() {
          if (input.composing) {
            input.poll();
            input.composing.range.clear();
            input.composing = null;
          }
        });
      };
      TextareaInput.prototype.createField = function(_display) {
        this.wrapper = hiddenTextarea();
        this.textarea = this.wrapper.firstChild;
        var opts = this.cm.options;
        disableBrowserMagic(this.textarea, opts.spellcheck, opts.autocorrect, opts.autocapitalize);
      };
      TextareaInput.prototype.screenReaderLabelChanged = function(label) {
        if (label) {
          this.textarea.setAttribute("aria-label", label);
        } else {
          this.textarea.removeAttribute("aria-label");
        }
      };
      TextareaInput.prototype.prepareSelection = function() {
        var cm = this.cm, display = cm.display, doc2 = cm.doc;
        var result = prepareSelection(cm);
        if (cm.options.moveInputWithCursor) {
          var headPos = cursorCoords(cm, doc2.sel.primary().head, "div");
          var wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
          result.teTop = Math.max(0, Math.min(
            display.wrapper.clientHeight - 10,
            headPos.top + lineOff.top - wrapOff.top
          ));
          result.teLeft = Math.max(0, Math.min(
            display.wrapper.clientWidth - 10,
            headPos.left + lineOff.left - wrapOff.left
          ));
        }
        return result;
      };
      TextareaInput.prototype.showSelection = function(drawn) {
        var cm = this.cm, display = cm.display;
        removeChildrenAndAdd(display.cursorDiv, drawn.cursors);
        removeChildrenAndAdd(display.selectionDiv, drawn.selection);
        if (drawn.teTop != null) {
          this.wrapper.style.top = drawn.teTop + "px";
          this.wrapper.style.left = drawn.teLeft + "px";
        }
      };
      TextareaInput.prototype.reset = function(typing) {
        if (this.contextMenuPending || this.composing && typing) {
          return;
        }
        var cm = this.cm;
        this.resetting = true;
        if (cm.somethingSelected()) {
          this.prevInput = "";
          var content = cm.getSelection();
          this.textarea.value = content;
          if (cm.state.focused) {
            selectInput(this.textarea);
          }
          if (ie && ie_version >= 9) {
            this.hasSelection = content;
          }
        } else if (!typing) {
          this.prevInput = this.textarea.value = "";
          if (ie && ie_version >= 9) {
            this.hasSelection = null;
          }
        }
        this.resetting = false;
      };
      TextareaInput.prototype.getField = function() {
        return this.textarea;
      };
      TextareaInput.prototype.supportsTouch = function() {
        return false;
      };
      TextareaInput.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor" && (!mobile || activeElt(rootNode(this.textarea)) != this.textarea)) {
          try {
            this.textarea.focus();
          } catch (e) {
          }
        }
      };
      TextareaInput.prototype.blur = function() {
        this.textarea.blur();
      };
      TextareaInput.prototype.resetPosition = function() {
        this.wrapper.style.top = this.wrapper.style.left = 0;
      };
      TextareaInput.prototype.receivedFocus = function() {
        this.slowPoll();
      };
      TextareaInput.prototype.slowPoll = function() {
        var this$1$1 = this;
        if (this.pollingFast) {
          return;
        }
        this.polling.set(this.cm.options.pollInterval, function() {
          this$1$1.poll();
          if (this$1$1.cm.state.focused) {
            this$1$1.slowPoll();
          }
        });
      };
      TextareaInput.prototype.fastPoll = function() {
        var missed = false, input = this;
        input.pollingFast = true;
        function p() {
          var changed = input.poll();
          if (!changed && !missed) {
            missed = true;
            input.polling.set(60, p);
          } else {
            input.pollingFast = false;
            input.slowPoll();
          }
        }
        input.polling.set(20, p);
      };
      TextareaInput.prototype.poll = function() {
        var this$1$1 = this;
        var cm = this.cm, input = this.textarea, prevInput = this.prevInput;
        if (this.contextMenuPending || this.resetting || !cm.state.focused || hasSelection(input) && !prevInput && !this.composing || cm.isReadOnly() || cm.options.disableInput || cm.state.keySeq) {
          return false;
        }
        var text = input.value;
        if (text == prevInput && !cm.somethingSelected()) {
          return false;
        }
        if (ie && ie_version >= 9 && this.hasSelection === text || mac && /[\uf700-\uf7ff]/.test(text)) {
          cm.display.input.reset();
          return false;
        }
        if (cm.doc.sel == cm.display.selForContextMenu) {
          var first = text.charCodeAt(0);
          if (first == 8203 && !prevInput) {
            prevInput = "\u200B";
          }
          if (first == 8666) {
            this.reset();
            return this.cm.execCommand("undo");
          }
        }
        var same = 0, l = Math.min(prevInput.length, text.length);
        while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same)) {
          ++same;
        }
        runInOp(cm, function() {
          applyTextInput(
            cm,
            text.slice(same),
            prevInput.length - same,
            null,
            this$1$1.composing ? "*compose" : null
          );
          if (text.length > 1e3 || text.indexOf("\n") > -1) {
            input.value = this$1$1.prevInput = "";
          } else {
            this$1$1.prevInput = text;
          }
          if (this$1$1.composing) {
            this$1$1.composing.range.clear();
            this$1$1.composing.range = cm.markText(
              this$1$1.composing.start,
              cm.getCursor("to"),
              { className: "CodeMirror-composing" }
            );
          }
        });
        return true;
      };
      TextareaInput.prototype.ensurePolled = function() {
        if (this.pollingFast && this.poll()) {
          this.pollingFast = false;
        }
      };
      TextareaInput.prototype.onKeyPress = function() {
        if (ie && ie_version >= 9) {
          this.hasSelection = null;
        }
        this.fastPoll();
      };
      TextareaInput.prototype.onContextMenu = function(e) {
        var input = this, cm = input.cm, display = cm.display, te = input.textarea;
        if (input.contextMenuPending) {
          input.contextMenuPending();
        }
        var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
        if (!pos || presto) {
          return;
        }
        var reset = cm.options.resetSelectionOnContextMenu;
        if (reset && cm.doc.sel.contains(pos) == -1) {
          operation(cm, setSelection)(cm.doc, simpleSelection(pos), sel_dontScroll);
        }
        var oldCSS = te.style.cssText, oldWrapperCSS = input.wrapper.style.cssText;
        var wrapperBox = input.wrapper.offsetParent.getBoundingClientRect();
        input.wrapper.style.cssText = "position: static";
        te.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (e.clientY - wrapperBox.top - 5) + "px; left: " + (e.clientX - wrapperBox.left - 5) + "px;\n      z-index: 1000; background: " + (ie ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
        var oldScrollY;
        if (webkit) {
          oldScrollY = te.ownerDocument.defaultView.scrollY;
        }
        display.input.focus();
        if (webkit) {
          te.ownerDocument.defaultView.scrollTo(null, oldScrollY);
        }
        display.input.reset();
        if (!cm.somethingSelected()) {
          te.value = input.prevInput = " ";
        }
        input.contextMenuPending = rehide;
        display.selForContextMenu = cm.doc.sel;
        clearTimeout(display.detectingSelectAll);
        function prepareSelectAllHack() {
          if (te.selectionStart != null) {
            var selected = cm.somethingSelected();
            var extval = "\u200B" + (selected ? te.value : "");
            te.value = "\u21DA";
            te.value = extval;
            input.prevInput = selected ? "" : "\u200B";
            te.selectionStart = 1;
            te.selectionEnd = extval.length;
            display.selForContextMenu = cm.doc.sel;
          }
        }
        function rehide() {
          if (input.contextMenuPending != rehide) {
            return;
          }
          input.contextMenuPending = false;
          input.wrapper.style.cssText = oldWrapperCSS;
          te.style.cssText = oldCSS;
          if (ie && ie_version < 9) {
            display.scrollbars.setScrollTop(display.scroller.scrollTop = scrollPos);
          }
          if (te.selectionStart != null) {
            if (!ie || ie && ie_version < 9) {
              prepareSelectAllHack();
            }
            var i2 = 0, poll = function() {
              if (display.selForContextMenu == cm.doc.sel && te.selectionStart == 0 && te.selectionEnd > 0 && input.prevInput == "\u200B") {
                operation(cm, selectAll)(cm);
              } else if (i2++ < 10) {
                display.detectingSelectAll = setTimeout(poll, 500);
              } else {
                display.selForContextMenu = null;
                display.input.reset();
              }
            };
            display.detectingSelectAll = setTimeout(poll, 200);
          }
        }
        if (ie && ie_version >= 9) {
          prepareSelectAllHack();
        }
        if (captureRightClick) {
          e_stop(e);
          var mouseup = function() {
            off(window, "mouseup", mouseup);
            setTimeout(rehide, 20);
          };
          on(window, "mouseup", mouseup);
        } else {
          setTimeout(rehide, 50);
        }
      };
      TextareaInput.prototype.readOnlyChanged = function(val) {
        if (!val) {
          this.reset();
        }
        this.textarea.disabled = val == "nocursor";
        this.textarea.readOnly = !!val;
      };
      TextareaInput.prototype.setUneditable = function() {
      };
      TextareaInput.prototype.needsContentAttribute = false;
      function fromTextArea(textarea, options) {
        options = options ? copyObj(options) : {};
        options.value = textarea.value;
        if (!options.tabindex && textarea.tabIndex) {
          options.tabindex = textarea.tabIndex;
        }
        if (!options.placeholder && textarea.placeholder) {
          options.placeholder = textarea.placeholder;
        }
        if (options.autofocus == null) {
          var hasFocus = activeElt(rootNode(textarea));
          options.autofocus = hasFocus == textarea || textarea.getAttribute("autofocus") != null && hasFocus == document.body;
        }
        function save() {
          textarea.value = cm.getValue();
        }
        var realSubmit;
        if (textarea.form) {
          on(textarea.form, "submit", save);
          if (!options.leaveSubmitMethodAlone) {
            var form = textarea.form;
            realSubmit = form.submit;
            try {
              var wrappedSubmit = form.submit = function() {
                save();
                form.submit = realSubmit;
                form.submit();
                form.submit = wrappedSubmit;
              };
            } catch (e) {
            }
          }
        }
        options.finishInit = function(cm2) {
          cm2.save = save;
          cm2.getTextArea = function() {
            return textarea;
          };
          cm2.toTextArea = function() {
            cm2.toTextArea = isNaN;
            save();
            textarea.parentNode.removeChild(cm2.getWrapperElement());
            textarea.style.display = "";
            if (textarea.form) {
              off(textarea.form, "submit", save);
              if (!options.leaveSubmitMethodAlone && typeof textarea.form.submit == "function") {
                textarea.form.submit = realSubmit;
              }
            }
          };
        };
        textarea.style.display = "none";
        var cm = CodeMirror2(
          function(node) {
            return textarea.parentNode.insertBefore(node, textarea.nextSibling);
          },
          options
        );
        return cm;
      }
      function addLegacyProps(CodeMirror3) {
        CodeMirror3.off = off;
        CodeMirror3.on = on;
        CodeMirror3.wheelEventPixels = wheelEventPixels;
        CodeMirror3.Doc = Doc;
        CodeMirror3.splitLines = splitLinesAuto;
        CodeMirror3.countColumn = countColumn;
        CodeMirror3.findColumn = findColumn;
        CodeMirror3.isWordChar = isWordCharBasic;
        CodeMirror3.Pass = Pass;
        CodeMirror3.signal = signal;
        CodeMirror3.Line = Line;
        CodeMirror3.changeEnd = changeEnd;
        CodeMirror3.scrollbarModel = scrollbarModel;
        CodeMirror3.Pos = Pos;
        CodeMirror3.cmpPos = cmp;
        CodeMirror3.modes = modes;
        CodeMirror3.mimeModes = mimeModes;
        CodeMirror3.resolveMode = resolveMode;
        CodeMirror3.getMode = getMode;
        CodeMirror3.modeExtensions = modeExtensions;
        CodeMirror3.extendMode = extendMode;
        CodeMirror3.copyState = copyState;
        CodeMirror3.startState = startState;
        CodeMirror3.innerMode = innerMode;
        CodeMirror3.commands = commands;
        CodeMirror3.keyMap = keyMap;
        CodeMirror3.keyName = keyName;
        CodeMirror3.isModifierKey = isModifierKey;
        CodeMirror3.lookupKey = lookupKey;
        CodeMirror3.normalizeKeyMap = normalizeKeyMap;
        CodeMirror3.StringStream = StringStream;
        CodeMirror3.SharedTextMarker = SharedTextMarker;
        CodeMirror3.TextMarker = TextMarker;
        CodeMirror3.LineWidget = LineWidget;
        CodeMirror3.e_preventDefault = e_preventDefault;
        CodeMirror3.e_stopPropagation = e_stopPropagation;
        CodeMirror3.e_stop = e_stop;
        CodeMirror3.addClass = addClass;
        CodeMirror3.contains = contains;
        CodeMirror3.rmClass = rmClass;
        CodeMirror3.keyNames = keyNames;
      }
      defineOptions(CodeMirror2);
      addEditorMethods(CodeMirror2);
      var dontDelegate = "iter insert remove copy getEditor constructor".split(" ");
      for (var prop in Doc.prototype) {
        if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0) {
          CodeMirror2.prototype[prop] = /* @__PURE__ */ (function(method) {
            return function() {
              return method.apply(this.doc, arguments);
            };
          })(Doc.prototype[prop]);
        }
      }
      eventMixin(Doc);
      CodeMirror2.inputStyles = { "textarea": TextareaInput, "contenteditable": ContentEditableInput };
      CodeMirror2.defineMode = function(name) {
        if (!CodeMirror2.defaults.mode && name != "null") {
          CodeMirror2.defaults.mode = name;
        }
        defineMode.apply(this, arguments);
      };
      CodeMirror2.defineMIME = defineMIME;
      CodeMirror2.defineMode("null", function() {
        return { token: function(stream) {
          return stream.skipToEnd();
        } };
      });
      CodeMirror2.defineMIME("text/plain", "null");
      CodeMirror2.defineExtension = function(name, func) {
        CodeMirror2.prototype[name] = func;
      };
      CodeMirror2.defineDocExtension = function(name, func) {
        Doc.prototype[name] = func;
      };
      CodeMirror2.fromTextArea = fromTextArea;
      addLegacyProps(CodeMirror2);
      CodeMirror2.version = "5.65.20";
      return CodeMirror2;
    }));
  })(codemirror$1);
  return codemirror$1.exports;
}
var codemirrorExports = requireCodemirror();
const CodeMirror = /* @__PURE__ */ getDefaultExportFromCjs(codemirrorExports);
var autorefresh = { exports: {} };
var hasRequiredAutorefresh;
function requireAutorefresh() {
  if (hasRequiredAutorefresh) return autorefresh.exports;
  hasRequiredAutorefresh = 1;
  (function(module, exports) {
    (function(mod) {
      mod(requireCodemirror());
    })(function(CodeMirror2) {
      CodeMirror2.defineOption("autoRefresh", false, function(cm, val) {
        if (cm.state.autoRefresh) {
          stopListening(cm, cm.state.autoRefresh);
          cm.state.autoRefresh = null;
        }
        if (val && cm.display.wrapper.offsetHeight == 0)
          startListening(cm, cm.state.autoRefresh = { delay: val.delay || 250 });
      });
      function startListening(cm, state) {
        function check() {
          if (cm.display.wrapper.offsetHeight) {
            stopListening(cm, state);
            if (cm.display.lastWrapHeight != cm.display.wrapper.clientHeight)
              cm.refresh();
          } else {
            state.timeout = setTimeout(check, state.delay);
          }
        }
        state.timeout = setTimeout(check, state.delay);
        state.hurry = function() {
          clearTimeout(state.timeout);
          state.timeout = setTimeout(check, 50);
        };
        CodeMirror2.on(window, "mouseup", state.hurry);
        CodeMirror2.on(window, "keyup", state.hurry);
      }
      function stopListening(_cm, state) {
        clearTimeout(state.timeout);
        CodeMirror2.off(window, "mouseup", state.hurry);
        CodeMirror2.off(window, "keyup", state.hurry);
      }
    });
  })();
  return autorefresh.exports;
}
requireAutorefresh();
var activeLine = { exports: {} };
var hasRequiredActiveLine;
function requireActiveLine() {
  if (hasRequiredActiveLine) return activeLine.exports;
  hasRequiredActiveLine = 1;
  (function(module, exports) {
    (function(mod) {
      mod(requireCodemirror());
    })(function(CodeMirror2) {
      var WRAP_CLASS = "CodeMirror-activeline";
      var BACK_CLASS = "CodeMirror-activeline-background";
      var GUTT_CLASS = "CodeMirror-activeline-gutter";
      CodeMirror2.defineOption("styleActiveLine", false, function(cm, val, old) {
        var prev = old == CodeMirror2.Init ? false : old;
        if (val == prev) return;
        if (prev) {
          cm.off("beforeSelectionChange", selectionChange);
          clearActiveLines(cm);
          delete cm.state.activeLines;
        }
        if (val) {
          cm.state.activeLines = [];
          updateActiveLines(cm, cm.listSelections());
          cm.on("beforeSelectionChange", selectionChange);
        }
      });
      function clearActiveLines(cm) {
        for (var i = 0; i < cm.state.activeLines.length; i++) {
          cm.removeLineClass(cm.state.activeLines[i], "wrap", WRAP_CLASS);
          cm.removeLineClass(cm.state.activeLines[i], "background", BACK_CLASS);
          cm.removeLineClass(cm.state.activeLines[i], "gutter", GUTT_CLASS);
        }
      }
      function sameArray(a, b) {
        if (a.length != b.length) return false;
        for (var i = 0; i < a.length; i++)
          if (a[i] != b[i]) return false;
        return true;
      }
      function updateActiveLines(cm, ranges) {
        var active = [];
        for (var i = 0; i < ranges.length; i++) {
          var range = ranges[i];
          var option = cm.getOption("styleActiveLine");
          if (typeof option == "object" && option.nonEmpty ? range.anchor.line != range.head.line : !range.empty())
            continue;
          var line = cm.getLineHandleVisualStart(range.head.line);
          if (active[active.length - 1] != line) active.push(line);
        }
        if (sameArray(cm.state.activeLines, active)) return;
        cm.operation(function() {
          clearActiveLines(cm);
          for (var i2 = 0; i2 < active.length; i2++) {
            cm.addLineClass(active[i2], "wrap", WRAP_CLASS);
            cm.addLineClass(active[i2], "background", BACK_CLASS);
            cm.addLineClass(active[i2], "gutter", GUTT_CLASS);
          }
          cm.state.activeLines = active;
        });
      }
      function selectionChange(cm, sel) {
        updateActiveLines(cm, sel.ranges);
      }
    });
  })();
  return activeLine.exports;
}
requireActiveLine();
var showHint = { exports: {} };
var hasRequiredShowHint;
function requireShowHint() {
  if (hasRequiredShowHint) return showHint.exports;
  hasRequiredShowHint = 1;
  (function(module, exports) {
    (function(mod) {
      mod(requireCodemirror());
    })(function(CodeMirror2) {
      var HINT_ELEMENT_CLASS = "CodeMirror-hint";
      var ACTIVE_HINT_ELEMENT_CLASS = "CodeMirror-hint-active";
      CodeMirror2.showHint = function(cm, getHints, options) {
        if (!getHints) return cm.showHint(options);
        if (options && options.async) getHints.async = true;
        var newOpts = { hint: getHints };
        if (options) for (var prop in options) newOpts[prop] = options[prop];
        return cm.showHint(newOpts);
      };
      CodeMirror2.defineExtension("showHint", function(options) {
        options = parseOptions(this, this.getCursor("start"), options);
        var selections = this.listSelections();
        if (selections.length > 1) return;
        if (this.somethingSelected()) {
          if (!options.hint.supportsSelection) return;
          for (var i = 0; i < selections.length; i++)
            if (selections[i].head.line != selections[i].anchor.line) return;
        }
        if (this.state.completionActive) this.state.completionActive.close();
        var completion = this.state.completionActive = new Completion(this, options);
        if (!completion.options.hint) return;
        CodeMirror2.signal(this, "startCompletion", this);
        completion.update(true);
      });
      CodeMirror2.defineExtension("closeHint", function() {
        if (this.state.completionActive) this.state.completionActive.close();
      });
      function Completion(cm, options) {
        this.cm = cm;
        this.options = options;
        this.widget = null;
        this.debounce = 0;
        this.tick = 0;
        this.startPos = this.cm.getCursor("start");
        this.startLen = this.cm.getLine(this.startPos.line).length - this.cm.getSelection().length;
        if (this.options.updateOnCursorActivity) {
          var self = this;
          cm.on("cursorActivity", this.activityFunc = function() {
            self.cursorActivity();
          });
        }
      }
      var requestAnimationFrame = window.requestAnimationFrame || function(fn) {
        return setTimeout(fn, 1e3 / 60);
      };
      var cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
      Completion.prototype = {
        close: function() {
          if (!this.active()) return;
          this.cm.state.completionActive = null;
          this.tick = null;
          if (this.options.updateOnCursorActivity) {
            this.cm.off("cursorActivity", this.activityFunc);
          }
          if (this.widget && this.data) CodeMirror2.signal(this.data, "close");
          if (this.widget) this.widget.close();
          CodeMirror2.signal(this.cm, "endCompletion", this.cm);
        },
        active: function() {
          return this.cm.state.completionActive == this;
        },
        pick: function(data, i) {
          var completion = data.list[i], self = this;
          this.cm.operation(function() {
            if (completion.hint)
              completion.hint(self.cm, data, completion);
            else
              self.cm.replaceRange(
                getText(completion),
                completion.from || data.from,
                completion.to || data.to,
                "complete"
              );
            CodeMirror2.signal(data, "pick", completion);
            self.cm.scrollIntoView();
          });
          if (this.options.closeOnPick) {
            this.close();
          }
        },
        cursorActivity: function() {
          if (this.debounce) {
            cancelAnimationFrame(this.debounce);
            this.debounce = 0;
          }
          var identStart = this.startPos;
          if (this.data) {
            identStart = this.data.from;
          }
          var pos = this.cm.getCursor(), line = this.cm.getLine(pos.line);
          if (pos.line != this.startPos.line || line.length - pos.ch != this.startLen - this.startPos.ch || pos.ch < identStart.ch || this.cm.somethingSelected() || (!pos.ch || this.options.closeCharacters.test(line.charAt(pos.ch - 1)))) {
            this.close();
          } else {
            var self = this;
            this.debounce = requestAnimationFrame(function() {
              self.update();
            });
            if (this.widget) this.widget.disable();
          }
        },
        update: function(first) {
          if (this.tick == null) return;
          var self = this, myTick = ++this.tick;
          fetchHints(this.options.hint, this.cm, this.options, function(data) {
            if (self.tick == myTick) self.finishUpdate(data, first);
          });
        },
        finishUpdate: function(data, first) {
          if (this.data) CodeMirror2.signal(this.data, "update");
          var picked = this.widget && this.widget.picked || first && this.options.completeSingle;
          if (this.widget) this.widget.close();
          this.data = data;
          if (data && data.list.length) {
            if (picked && data.list.length == 1) {
              this.pick(data, 0);
            } else {
              this.widget = new Widget(this, data);
              CodeMirror2.signal(data, "shown");
            }
          }
        }
      };
      function parseOptions(cm, pos, options) {
        var editor = cm.options.hintOptions;
        var out = {};
        for (var prop in defaultOptions) out[prop] = defaultOptions[prop];
        if (editor) {
          for (var prop in editor)
            if (editor[prop] !== void 0) out[prop] = editor[prop];
        }
        if (options) {
          for (var prop in options)
            if (options[prop] !== void 0) out[prop] = options[prop];
        }
        if (out.hint.resolve) out.hint = out.hint.resolve(cm, pos);
        return out;
      }
      function getText(completion) {
        if (typeof completion == "string") return completion;
        else return completion.text;
      }
      function buildKeyMap(completion, handle) {
        var baseMap = {
          Up: function() {
            handle.moveFocus(-1);
          },
          Down: function() {
            handle.moveFocus(1);
          },
          PageUp: function() {
            handle.moveFocus(-handle.menuSize() + 1, true);
          },
          PageDown: function() {
            handle.moveFocus(handle.menuSize() - 1, true);
          },
          Home: function() {
            handle.setFocus(0);
          },
          End: function() {
            handle.setFocus(handle.length - 1);
          },
          Enter: handle.pick,
          Tab: handle.pick,
          Esc: handle.close
        };
        var mac = /Mac/.test(navigator.platform);
        if (mac) {
          baseMap["Ctrl-P"] = function() {
            handle.moveFocus(-1);
          };
          baseMap["Ctrl-N"] = function() {
            handle.moveFocus(1);
          };
        }
        var custom = completion.options.customKeys;
        var ourMap = custom ? {} : baseMap;
        function addBinding(key3, val) {
          var bound;
          if (typeof val != "string")
            bound = function(cm) {
              return val(cm, handle);
            };
          else if (baseMap.hasOwnProperty(val))
            bound = baseMap[val];
          else
            bound = val;
          ourMap[key3] = bound;
        }
        if (custom) {
          for (var key2 in custom) if (custom.hasOwnProperty(key2))
            addBinding(key2, custom[key2]);
        }
        var extra = completion.options.extraKeys;
        if (extra) {
          for (var key2 in extra) if (extra.hasOwnProperty(key2))
            addBinding(key2, extra[key2]);
        }
        return ourMap;
      }
      function getHintElement(hintsElement, el) {
        while (el && el != hintsElement) {
          if (el.nodeName.toUpperCase() === "LI" && el.parentNode == hintsElement) return el;
          el = el.parentNode;
        }
      }
      function Widget(completion, data) {
        this.id = "cm-complete-" + Math.floor(Math.random(1e6));
        this.completion = completion;
        this.data = data;
        this.picked = false;
        var widget = this, cm = completion.cm;
        var ownerDocument = cm.getInputField().ownerDocument;
        var parentWindow = ownerDocument.defaultView || ownerDocument.parentWindow;
        var hints = this.hints = ownerDocument.createElement("ul");
        hints.setAttribute("role", "listbox");
        hints.setAttribute("aria-expanded", "true");
        hints.id = this.id;
        var theme = completion.cm.options.theme;
        hints.className = "CodeMirror-hints " + theme;
        this.selectedHint = data.selectedHint || 0;
        var completions = data.list;
        for (var i = 0; i < completions.length; ++i) {
          var elt = hints.appendChild(ownerDocument.createElement("li")), cur = completions[i];
          var className = HINT_ELEMENT_CLASS + (i != this.selectedHint ? "" : " " + ACTIVE_HINT_ELEMENT_CLASS);
          if (cur.className != null) className = cur.className + " " + className;
          elt.className = className;
          if (i == this.selectedHint) elt.setAttribute("aria-selected", "true");
          elt.id = this.id + "-" + i;
          elt.setAttribute("role", "option");
          if (cur.render) cur.render(elt, data, cur);
          else elt.appendChild(ownerDocument.createTextNode(cur.displayText || getText(cur)));
          elt.hintId = i;
        }
        var container = completion.options.container || ownerDocument.body;
        var pos = cm.cursorCoords(completion.options.alignWithWord ? data.from : null);
        var left = pos.left, top = pos.bottom, below = true;
        var offsetLeft = 0, offsetTop = 0;
        if (container !== ownerDocument.body) {
          var isContainerPositioned = ["absolute", "relative", "fixed"].indexOf(parentWindow.getComputedStyle(container).position) !== -1;
          var offsetParent = isContainerPositioned ? container : container.offsetParent;
          var offsetParentPosition = offsetParent.getBoundingClientRect();
          var bodyPosition = ownerDocument.body.getBoundingClientRect();
          offsetLeft = offsetParentPosition.left - bodyPosition.left - offsetParent.scrollLeft;
          offsetTop = offsetParentPosition.top - bodyPosition.top - offsetParent.scrollTop;
        }
        hints.style.left = left - offsetLeft + "px";
        hints.style.top = top - offsetTop + "px";
        var winW = parentWindow.innerWidth || Math.max(ownerDocument.body.offsetWidth, ownerDocument.documentElement.offsetWidth);
        var winH = parentWindow.innerHeight || Math.max(ownerDocument.body.offsetHeight, ownerDocument.documentElement.offsetHeight);
        container.appendChild(hints);
        cm.getInputField().setAttribute("aria-autocomplete", "list");
        cm.getInputField().setAttribute("aria-owns", this.id);
        cm.getInputField().setAttribute("aria-activedescendant", this.id + "-" + this.selectedHint);
        var box = completion.options.moveOnOverlap ? hints.getBoundingClientRect() : new DOMRect();
        var scrolls = completion.options.paddingForScrollbar ? hints.scrollHeight > hints.clientHeight + 1 : false;
        var startScroll;
        setTimeout(function() {
          startScroll = cm.getScrollInfo();
        });
        var overlapY = box.bottom - winH;
        if (overlapY > 0) {
          var height = box.bottom - box.top, spaceAbove = box.top - (pos.bottom - pos.top) - 2;
          if (winH - box.top < spaceAbove) {
            if (height > spaceAbove) hints.style.height = (height = spaceAbove) + "px";
            hints.style.top = (top = pos.top - height) - offsetTop + "px";
            below = false;
          } else {
            hints.style.height = winH - box.top - 2 + "px";
          }
        }
        var overlapX = box.right - winW;
        if (scrolls) overlapX += cm.display.nativeBarWidth;
        if (overlapX > 0) {
          if (box.right - box.left > winW) {
            hints.style.width = winW - 5 + "px";
            overlapX -= box.right - box.left - winW;
          }
          hints.style.left = (left = Math.max(pos.left - overlapX - offsetLeft, 0)) + "px";
        }
        if (scrolls) for (var node = hints.firstChild; node; node = node.nextSibling)
          node.style.paddingRight = cm.display.nativeBarWidth + "px";
        cm.addKeyMap(this.keyMap = buildKeyMap(completion, {
          moveFocus: function(n, avoidWrap) {
            widget.changeActive(widget.selectedHint + n, avoidWrap);
          },
          setFocus: function(n) {
            widget.changeActive(n);
          },
          menuSize: function() {
            return widget.screenAmount();
          },
          length: completions.length,
          close: function() {
            completion.close();
          },
          pick: function() {
            widget.pick();
          },
          data
        }));
        if (completion.options.closeOnUnfocus) {
          var closingOnBlur;
          cm.on("blur", this.onBlur = function() {
            closingOnBlur = setTimeout(function() {
              completion.close();
            }, 100);
          });
          cm.on("focus", this.onFocus = function() {
            clearTimeout(closingOnBlur);
          });
        }
        cm.on("scroll", this.onScroll = function() {
          var curScroll = cm.getScrollInfo(), editor = cm.getWrapperElement().getBoundingClientRect();
          if (!startScroll) startScroll = cm.getScrollInfo();
          var newTop = top + startScroll.top - curScroll.top;
          var point = newTop - (parentWindow.pageYOffset || (ownerDocument.documentElement || ownerDocument.body).scrollTop);
          if (!below) point += hints.offsetHeight;
          if (point <= editor.top || point >= editor.bottom) return completion.close();
          hints.style.top = newTop + "px";
          hints.style.left = left + startScroll.left - curScroll.left + "px";
        });
        CodeMirror2.on(hints, "dblclick", function(e) {
          var t = getHintElement(hints, e.target || e.srcElement);
          if (t && t.hintId != null) {
            widget.changeActive(t.hintId);
            widget.pick();
          }
        });
        CodeMirror2.on(hints, "click", function(e) {
          var t = getHintElement(hints, e.target || e.srcElement);
          if (t && t.hintId != null) {
            widget.changeActive(t.hintId);
            if (completion.options.completeOnSingleClick) widget.pick();
          }
        });
        CodeMirror2.on(hints, "mousedown", function() {
          setTimeout(function() {
            cm.focus();
          }, 20);
        });
        var selectedHintRange = this.getSelectedHintRange();
        if (selectedHintRange.from !== 0 || selectedHintRange.to !== 0) {
          this.scrollToActive();
        }
        CodeMirror2.signal(data, "select", completions[this.selectedHint], hints.childNodes[this.selectedHint]);
        return true;
      }
      Widget.prototype = {
        close: function() {
          if (this.completion.widget != this) return;
          this.completion.widget = null;
          if (this.hints.parentNode) this.hints.parentNode.removeChild(this.hints);
          this.completion.cm.removeKeyMap(this.keyMap);
          var input = this.completion.cm.getInputField();
          input.removeAttribute("aria-activedescendant");
          input.removeAttribute("aria-owns");
          var cm = this.completion.cm;
          if (this.completion.options.closeOnUnfocus) {
            cm.off("blur", this.onBlur);
            cm.off("focus", this.onFocus);
          }
          cm.off("scroll", this.onScroll);
        },
        disable: function() {
          this.completion.cm.removeKeyMap(this.keyMap);
          var widget = this;
          this.keyMap = { Enter: function() {
            widget.picked = true;
          } };
          this.completion.cm.addKeyMap(this.keyMap);
        },
        pick: function() {
          this.completion.pick(this.data, this.selectedHint);
        },
        changeActive: function(i, avoidWrap) {
          if (i >= this.data.list.length)
            i = avoidWrap ? this.data.list.length - 1 : 0;
          else if (i < 0)
            i = avoidWrap ? 0 : this.data.list.length - 1;
          if (this.selectedHint == i) return;
          var node = this.hints.childNodes[this.selectedHint];
          if (node) {
            node.className = node.className.replace(" " + ACTIVE_HINT_ELEMENT_CLASS, "");
            node.removeAttribute("aria-selected");
          }
          node = this.hints.childNodes[this.selectedHint = i];
          node.className += " " + ACTIVE_HINT_ELEMENT_CLASS;
          node.setAttribute("aria-selected", "true");
          this.completion.cm.getInputField().setAttribute("aria-activedescendant", node.id);
          this.scrollToActive();
          CodeMirror2.signal(this.data, "select", this.data.list[this.selectedHint], node);
        },
        scrollToActive: function() {
          var selectedHintRange = this.getSelectedHintRange();
          var node1 = this.hints.childNodes[selectedHintRange.from];
          var node2 = this.hints.childNodes[selectedHintRange.to];
          var firstNode = this.hints.firstChild;
          if (node1.offsetTop < this.hints.scrollTop)
            this.hints.scrollTop = node1.offsetTop - firstNode.offsetTop;
          else if (node2.offsetTop + node2.offsetHeight > this.hints.scrollTop + this.hints.clientHeight)
            this.hints.scrollTop = node2.offsetTop + node2.offsetHeight - this.hints.clientHeight + firstNode.offsetTop;
        },
        screenAmount: function() {
          return Math.floor(this.hints.clientHeight / this.hints.firstChild.offsetHeight) || 1;
        },
        getSelectedHintRange: function() {
          var margin = this.completion.options.scrollMargin || 0;
          return {
            from: Math.max(0, this.selectedHint - margin),
            to: Math.min(this.data.list.length - 1, this.selectedHint + margin)
          };
        }
      };
      function applicableHelpers(cm, helpers) {
        if (!cm.somethingSelected()) return helpers;
        var result = [];
        for (var i = 0; i < helpers.length; i++)
          if (helpers[i].supportsSelection) result.push(helpers[i]);
        return result;
      }
      function fetchHints(hint, cm, options, callback) {
        if (hint.async) {
          hint(cm, callback, options);
        } else {
          var result = hint(cm, options);
          if (result && result.then) result.then(callback);
          else callback(result);
        }
      }
      function resolveAutoHints(cm, pos) {
        var helpers = cm.getHelpers(pos, "hint"), words;
        if (helpers.length) {
          var resolved = function(cm2, callback, options) {
            var app = applicableHelpers(cm2, helpers);
            function run(i) {
              if (i == app.length) return callback(null);
              fetchHints(app[i], cm2, options, function(result) {
                if (result && result.list.length > 0) callback(result);
                else run(i + 1);
              });
            }
            run(0);
          };
          resolved.async = true;
          resolved.supportsSelection = true;
          return resolved;
        } else if (words = cm.getHelper(cm.getCursor(), "hintWords")) {
          return function(cm2) {
            return CodeMirror2.hint.fromList(cm2, { words });
          };
        } else if (CodeMirror2.hint.anyword) {
          return function(cm2, options) {
            return CodeMirror2.hint.anyword(cm2, options);
          };
        } else {
          return function() {
          };
        }
      }
      CodeMirror2.registerHelper("hint", "auto", {
        resolve: resolveAutoHints
      });
      CodeMirror2.registerHelper("hint", "fromList", function(cm, options) {
        var cur = cm.getCursor(), token = cm.getTokenAt(cur);
        var term, from = CodeMirror2.Pos(cur.line, token.start), to = cur;
        if (token.start < cur.ch && /\w/.test(token.string.charAt(cur.ch - token.start - 1))) {
          term = token.string.substr(0, cur.ch - token.start);
        } else {
          term = "";
          from = cur;
        }
        var found = [];
        for (var i = 0; i < options.words.length; i++) {
          var word = options.words[i];
          if (word.slice(0, term.length) == term)
            found.push(word);
        }
        if (found.length) return { list: found, from, to };
      });
      CodeMirror2.commands.autocomplete = CodeMirror2.showHint;
      var defaultOptions = {
        hint: CodeMirror2.hint.auto,
        completeSingle: true,
        alignWithWord: true,
        closeCharacters: /[\s()\[\]{};:>,]/,
        closeOnPick: true,
        closeOnUnfocus: true,
        updateOnCursorActivity: true,
        completeOnSingleClick: true,
        container: null,
        customKeys: null,
        extraKeys: null,
        paddingForScrollbar: true,
        moveOnOverlap: true
      };
      CodeMirror2.defineOption("hintOptions", null);
    });
  })();
  return showHint.exports;
}
requireShowHint();
var sqlHint = { exports: {} };
var sql = { exports: {} };
var hasRequiredSql;
function requireSql() {
  if (hasRequiredSql) return sql.exports;
  hasRequiredSql = 1;
  (function(module, exports) {
    (function(mod) {
      mod(requireCodemirror());
    })(function(CodeMirror2) {
      CodeMirror2.defineMode("sql", function(config, parserConfig) {
        var client = parserConfig.client || {}, atoms = parserConfig.atoms || { "false": true, "true": true, "null": true }, builtin = parserConfig.builtin || set(defaultBuiltin), keywords = parserConfig.keywords || set(sqlKeywords), operatorChars = parserConfig.operatorChars || /^[*+\-%<>!=&|~^\/]/, support = parserConfig.support || {}, hooks = parserConfig.hooks || {}, dateSQL = parserConfig.dateSQL || { "date": true, "time": true, "timestamp": true }, backslashStringEscapes = parserConfig.backslashStringEscapes !== false, brackets = parserConfig.brackets || /^[\{}\(\)\[\]]/, punctuation = parserConfig.punctuation || /^[;.,:]/;
        function tokenBase(stream, state) {
          var ch = stream.next();
          if (hooks[ch]) {
            var result = hooks[ch](stream, state);
            if (result !== false) return result;
          }
          if (support.hexNumber && (ch == "0" && stream.match(/^[xX][0-9a-fA-F]+/) || (ch == "x" || ch == "X") && stream.match(/^'[0-9a-fA-F]*'/))) {
            return "number";
          } else if (support.binaryNumber && ((ch == "b" || ch == "B") && stream.match(/^'[01]*'/) || ch == "0" && stream.match(/^b[01]+/))) {
            return "number";
          } else if (ch.charCodeAt(0) > 47 && ch.charCodeAt(0) < 58) {
            stream.match(/^[0-9]*(\.[0-9]+)?([eE][-+]?[0-9]+)?/);
            support.decimallessFloat && stream.match(/^\.(?!\.)/);
            return "number";
          } else if (ch == "?" && (stream.eatSpace() || stream.eol() || stream.eat(";"))) {
            return "variable-3";
          } else if (ch == "'" || ch == '"' && support.doubleQuote) {
            state.tokenize = tokenLiteral(ch);
            return state.tokenize(stream, state);
          } else if ((support.nCharCast && (ch == "n" || ch == "N") || support.charsetCast && ch == "_" && stream.match(/[a-z][a-z0-9]*/i)) && (stream.peek() == "'" || stream.peek() == '"')) {
            return "keyword";
          } else if (support.escapeConstant && (ch == "e" || ch == "E") && (stream.peek() == "'" || stream.peek() == '"' && support.doubleQuote)) {
            state.tokenize = function(stream2, state2) {
              return (state2.tokenize = tokenLiteral(stream2.next(), true))(stream2, state2);
            };
            return "keyword";
          } else if (support.commentSlashSlash && ch == "/" && stream.eat("/")) {
            stream.skipToEnd();
            return "comment";
          } else if (support.commentHash && ch == "#" || ch == "-" && stream.eat("-") && (!support.commentSpaceRequired || stream.eat(" "))) {
            stream.skipToEnd();
            return "comment";
          } else if (ch == "/" && stream.eat("*")) {
            state.tokenize = tokenComment(1);
            return state.tokenize(stream, state);
          } else if (ch == ".") {
            if (support.zerolessFloat && stream.match(/^(?:\d+(?:e[+-]?\d+)?)/i))
              return "number";
            if (stream.match(/^\.+/))
              return null;
            if (stream.match(/^[\w\d_$#]+/))
              return "variable-2";
          } else if (operatorChars.test(ch)) {
            stream.eatWhile(operatorChars);
            return "operator";
          } else if (brackets.test(ch)) {
            return "bracket";
          } else if (punctuation.test(ch)) {
            stream.eatWhile(punctuation);
            return "punctuation";
          } else if (ch == "{" && (stream.match(/^( )*(d|D|t|T|ts|TS)( )*'[^']*'( )*}/) || stream.match(/^( )*(d|D|t|T|ts|TS)( )*"[^"]*"( )*}/))) {
            return "number";
          } else {
            stream.eatWhile(/^[_\w\d]/);
            var word = stream.current().toLowerCase();
            if (dateSQL.hasOwnProperty(word) && (stream.match(/^( )+'[^']*'/) || stream.match(/^( )+"[^"]*"/)))
              return "number";
            if (atoms.hasOwnProperty(word)) return "atom";
            if (builtin.hasOwnProperty(word)) return "type";
            if (keywords.hasOwnProperty(word)) return "keyword";
            if (client.hasOwnProperty(word)) return "builtin";
            return null;
          }
        }
        function tokenLiteral(quote, backslashEscapes) {
          return function(stream, state) {
            var escaped = false, ch;
            while ((ch = stream.next()) != null) {
              if (ch == quote && !escaped) {
                state.tokenize = tokenBase;
                break;
              }
              escaped = (backslashStringEscapes || backslashEscapes) && !escaped && ch == "\\";
            }
            return "string";
          };
        }
        function tokenComment(depth) {
          return function(stream, state) {
            var m = stream.match(/^.*?(\/\*|\*\/)/);
            if (!m) stream.skipToEnd();
            else if (m[1] == "/*") state.tokenize = tokenComment(depth + 1);
            else if (depth > 1) state.tokenize = tokenComment(depth - 1);
            else state.tokenize = tokenBase;
            return "comment";
          };
        }
        function pushContext(stream, state, type) {
          state.context = {
            prev: state.context,
            indent: stream.indentation(),
            col: stream.column(),
            type
          };
        }
        function popContext(state) {
          state.indent = state.context.indent;
          state.context = state.context.prev;
        }
        return {
          startState: function() {
            return { tokenize: tokenBase, context: null };
          },
          token: function(stream, state) {
            if (stream.sol()) {
              if (state.context && state.context.align == null)
                state.context.align = false;
            }
            if (state.tokenize == tokenBase && stream.eatSpace()) return null;
            var style = state.tokenize(stream, state);
            if (style == "comment") return style;
            if (state.context && state.context.align == null)
              state.context.align = true;
            var tok = stream.current();
            if (tok == "(")
              pushContext(stream, state, ")");
            else if (tok == "[")
              pushContext(stream, state, "]");
            else if (state.context && state.context.type == tok)
              popContext(state);
            return style;
          },
          indent: function(state, textAfter) {
            var cx = state.context;
            if (!cx) return CodeMirror2.Pass;
            var closing = textAfter.charAt(0) == cx.type;
            if (cx.align) return cx.col + (closing ? 0 : 1);
            else return cx.indent + (closing ? 0 : config.indentUnit);
          },
          blockCommentStart: "/*",
          blockCommentEnd: "*/",
          lineComment: support.commentSlashSlash ? "//" : support.commentHash ? "#" : "--",
          closeBrackets: "()[]{}''\"\"``",
          config: parserConfig
        };
      });
      function hookIdentifier(stream) {
        var ch;
        while ((ch = stream.next()) != null) {
          if (ch == "`" && !stream.eat("`")) return "variable-2";
        }
        stream.backUp(stream.current().length - 1);
        return stream.eatWhile(/\w/) ? "variable-2" : null;
      }
      function hookIdentifierDoublequote(stream) {
        var ch;
        while ((ch = stream.next()) != null) {
          if (ch == '"' && !stream.eat('"')) return "variable-2";
        }
        stream.backUp(stream.current().length - 1);
        return stream.eatWhile(/\w/) ? "variable-2" : null;
      }
      function hookVar(stream) {
        if (stream.eat("@")) {
          stream.match("session.");
          stream.match("local.");
          stream.match("global.");
        }
        if (stream.eat("'")) {
          stream.match(/^.*'/);
          return "variable-2";
        } else if (stream.eat('"')) {
          stream.match(/^.*"/);
          return "variable-2";
        } else if (stream.eat("`")) {
          stream.match(/^.*`/);
          return "variable-2";
        } else if (stream.match(/^[0-9a-zA-Z$\.\_]+/)) {
          return "variable-2";
        }
        return null;
      }
      function hookClient(stream) {
        if (stream.eat("N")) {
          return "atom";
        }
        return stream.match(/^[a-zA-Z.#!?]/) ? "variable-2" : null;
      }
      var sqlKeywords = "alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit ";
      function set(str) {
        var obj = {}, words = str.split(" ");
        for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
        return obj;
      }
      var defaultBuiltin = "bool boolean bit blob enum long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision real date datetime year unsigned signed decimal numeric";
      CodeMirror2.defineMIME("text/x-sql", {
        name: "sql",
        keywords: set(sqlKeywords + "begin"),
        builtin: set(defaultBuiltin),
        atoms: set("false true null unknown"),
        dateSQL: set("date time timestamp"),
        support: set("doubleQuote binaryNumber hexNumber")
      });
      CodeMirror2.defineMIME("text/x-mssql", {
        name: "sql",
        client: set("$partition binary_checksum checksum connectionproperty context_info current_request_id error_line error_message error_number error_procedure error_severity error_state formatmessage get_filestream_transaction_context getansinull host_id host_name isnull isnumeric min_active_rowversion newid newsequentialid rowcount_big xact_state object_id"),
        keywords: set(sqlKeywords + "begin trigger proc view index for add constraint key primary foreign collate clustered nonclustered declare exec go if use index holdlock nolock nowait paglock readcommitted readcommittedlock readpast readuncommitted repeatableread rowlock serializable snapshot tablock tablockx updlock with"),
        builtin: set("bigint numeric bit smallint decimal smallmoney int tinyint money float real char varchar text nchar nvarchar ntext binary varbinary image cursor timestamp hierarchyid uniqueidentifier sql_variant xml table "),
        atoms: set("is not null like and or in left right between inner outer join all any some cross unpivot pivot exists"),
        operatorChars: /^[*+\-%<>!=^\&|\/]/,
        brackets: /^[\{}\(\)]/,
        punctuation: /^[;.,:/]/,
        backslashStringEscapes: false,
        dateSQL: set("date datetimeoffset datetime2 smalldatetime datetime time"),
        hooks: {
          "@": hookVar
        }
      });
      CodeMirror2.defineMIME("text/x-mysql", {
        name: "sql",
        client: set("charset clear connect edit ego exit go help nopager notee nowarning pager print prompt quit rehash source status system tee"),
        keywords: set(sqlKeywords + "accessible action add after algorithm all analyze asensitive at authors auto_increment autocommit avg avg_row_length before binary binlog both btree cache call cascade cascaded case catalog_name chain change changed character check checkpoint checksum class_origin client_statistics close coalesce code collate collation collations column columns comment commit committed completion concurrent condition connection consistent constraint contains continue contributors convert cross current current_date current_time current_timestamp current_user cursor data database databases day_hour day_microsecond day_minute day_second deallocate dec declare default delay_key_write delayed delimiter des_key_file describe deterministic dev_pop dev_samp deviance diagnostics directory disable discard distinctrow div dual dumpfile each elseif enable enclosed end ends engine engines enum errors escape escaped even event events every execute exists exit explain extended fast fetch field fields first flush for force foreign found_rows full fulltext function general get global grant grants group group_concat handler hash help high_priority hosts hour_microsecond hour_minute hour_second if ignore ignore_server_ids import index index_statistics infile inner innodb inout insensitive insert_method install interval invoker isolation iterate key keys kill language last leading leave left level limit linear lines list load local localtime localtimestamp lock logs low_priority master master_heartbeat_period master_ssl_verify_server_cert masters match max max_rows maxvalue message_text middleint migrate min min_rows minute_microsecond minute_second mod mode modifies modify mutex mysql_errno natural next no no_write_to_binlog offline offset one online open optimize option optionally out outer outfile pack_keys parser partition partitions password phase plugin plugins prepare preserve prev primary privileges procedure processlist profile profiles purge query quick range read read_write reads real rebuild recover references regexp relaylog release remove rename reorganize repair repeatable replace require resignal restrict resume return returns revoke right rlike rollback rollup row row_format rtree savepoint schedule schema schema_name schemas second_microsecond security sensitive separator serializable server session share show signal slave slow smallint snapshot soname spatial specific sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result sqlexception sqlstate sqlwarning ssl start starting starts status std stddev stddev_pop stddev_samp storage straight_join subclass_origin sum suspend table_name table_statistics tables tablespace temporary terminated to trailing transaction trigger triggers truncate uncommitted undo uninstall unique unlock upgrade usage use use_frm user user_resources user_statistics using utc_date utc_time utc_timestamp value variables varying view views warnings when while with work write xa xor year_month zerofill begin do then else loop repeat"),
        builtin: set("bool boolean bit blob decimal double float long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision date datetime year unsigned signed numeric"),
        atoms: set("false true null unknown"),
        operatorChars: /^[*+\-%<>!=&|^]/,
        dateSQL: set("date time timestamp"),
        support: set("decimallessFloat zerolessFloat binaryNumber hexNumber doubleQuote nCharCast charsetCast commentHash commentSpaceRequired"),
        hooks: {
          "@": hookVar,
          "`": hookIdentifier,
          "\\": hookClient
        }
      });
      CodeMirror2.defineMIME("text/x-mariadb", {
        name: "sql",
        client: set("charset clear connect edit ego exit go help nopager notee nowarning pager print prompt quit rehash source status system tee"),
        keywords: set(sqlKeywords + "accessible action add after algorithm all always analyze asensitive at authors auto_increment autocommit avg avg_row_length before binary binlog both btree cache call cascade cascaded case catalog_name chain change changed character check checkpoint checksum class_origin client_statistics close coalesce code collate collation collations column columns comment commit committed completion concurrent condition connection consistent constraint contains continue contributors convert cross current current_date current_time current_timestamp current_user cursor data database databases day_hour day_microsecond day_minute day_second deallocate dec declare default delay_key_write delayed delimiter des_key_file describe deterministic dev_pop dev_samp deviance diagnostics directory disable discard distinctrow div dual dumpfile each elseif enable enclosed end ends engine engines enum errors escape escaped even event events every execute exists exit explain extended fast fetch field fields first flush for force foreign found_rows full fulltext function general generated get global grant grants group group_concat handler hard hash help high_priority hosts hour_microsecond hour_minute hour_second if ignore ignore_server_ids import index index_statistics infile inner innodb inout insensitive insert_method install interval invoker isolation iterate key keys kill language last leading leave left level limit linear lines list load local localtime localtimestamp lock logs low_priority master master_heartbeat_period master_ssl_verify_server_cert masters match max max_rows maxvalue message_text middleint migrate min min_rows minute_microsecond minute_second mod mode modifies modify mutex mysql_errno natural next no no_write_to_binlog offline offset one online open optimize option optionally out outer outfile pack_keys parser partition partitions password persistent phase plugin plugins prepare preserve prev primary privileges procedure processlist profile profiles purge query quick range read read_write reads real rebuild recover references regexp relaylog release remove rename reorganize repair repeatable replace require resignal restrict resume return returns revoke right rlike rollback rollup row row_format rtree savepoint schedule schema schema_name schemas second_microsecond security sensitive separator serializable server session share show shutdown signal slave slow smallint snapshot soft soname spatial specific sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result sqlexception sqlstate sqlwarning ssl start starting starts status std stddev stddev_pop stddev_samp storage straight_join subclass_origin sum suspend table_name table_statistics tables tablespace temporary terminated to trailing transaction trigger triggers truncate uncommitted undo uninstall unique unlock upgrade usage use use_frm user user_resources user_statistics using utc_date utc_time utc_timestamp value variables varying view views virtual warnings when while with work write xa xor year_month zerofill begin do then else loop repeat"),
        builtin: set("bool boolean bit blob decimal double float long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision date datetime year unsigned signed numeric"),
        atoms: set("false true null unknown"),
        operatorChars: /^[*+\-%<>!=&|^]/,
        dateSQL: set("date time timestamp"),
        support: set("decimallessFloat zerolessFloat binaryNumber hexNumber doubleQuote nCharCast charsetCast commentHash commentSpaceRequired"),
        hooks: {
          "@": hookVar,
          "`": hookIdentifier,
          "\\": hookClient
        }
      });
      CodeMirror2.defineMIME("text/x-sqlite", {
        name: "sql",
        // commands of the official SQLite client, ref: https://www.sqlite.org/cli.html#dotcmd
        client: set("auth backup bail binary changes check clone databases dbinfo dump echo eqp exit explain fullschema headers help import imposter indexes iotrace limit lint load log mode nullvalue once open output print prompt quit read restore save scanstats schema separator session shell show stats system tables testcase timeout timer trace vfsinfo vfslist vfsname width"),
        // ref: http://sqlite.org/lang_keywords.html
        keywords: set(sqlKeywords + "abort action add after all analyze attach autoincrement before begin cascade case cast check collate column commit conflict constraint cross current_date current_time current_timestamp database default deferrable deferred detach each else end escape except exclusive exists explain fail for foreign full glob if ignore immediate index indexed initially inner instead intersect isnull key left limit match natural no notnull null of offset outer plan pragma primary query raise recursive references regexp reindex release rename replace restrict right rollback row savepoint temp temporary then to transaction trigger unique using vacuum view virtual when with without"),
        // SQLite is weakly typed, ref: http://sqlite.org/datatype3.html. This is just a list of some common types.
        builtin: set("bool boolean bit blob decimal double float long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text clob bigint int int2 int8 integer float double char varchar date datetime year unsigned signed numeric real"),
        // ref: http://sqlite.org/syntax/literal-value.html
        atoms: set("null current_date current_time current_timestamp"),
        // ref: http://sqlite.org/lang_expr.html#binaryops
        operatorChars: /^[*+\-%<>!=&|/~]/,
        // SQLite is weakly typed, ref: http://sqlite.org/datatype3.html. This is just a list of some common types.
        dateSQL: set("date time timestamp datetime"),
        support: set("decimallessFloat zerolessFloat"),
        identifierQuote: '"',
        //ref: http://sqlite.org/lang_keywords.html
        hooks: {
          // bind-parameters ref:http://sqlite.org/lang_expr.html#varparam
          "@": hookVar,
          ":": hookVar,
          "?": hookVar,
          "$": hookVar,
          // The preferred way to escape Identifiers is using double quotes, ref: http://sqlite.org/lang_keywords.html
          '"': hookIdentifierDoublequote,
          // there is also support for backticks, ref: http://sqlite.org/lang_keywords.html
          "`": hookIdentifier
        }
      });
      CodeMirror2.defineMIME("text/x-cassandra", {
        name: "sql",
        client: {},
        keywords: set("add all allow alter and any apply as asc authorize batch begin by clustering columnfamily compact consistency count create custom delete desc distinct drop each_quorum exists filtering from grant if in index insert into key keyspace keyspaces level limit local_one local_quorum modify nan norecursive nosuperuser not of on one order password permission permissions primary quorum rename revoke schema select set storage superuser table three to token truncate ttl two type unlogged update use user users using values where with writetime"),
        builtin: set("ascii bigint blob boolean counter decimal double float frozen inet int list map static text timestamp timeuuid tuple uuid varchar varint"),
        atoms: set("false true infinity NaN"),
        operatorChars: /^[<>=]/,
        dateSQL: {},
        support: set("commentSlashSlash decimallessFloat"),
        hooks: {}
      });
      CodeMirror2.defineMIME("text/x-plsql", {
        name: "sql",
        client: set("appinfo arraysize autocommit autoprint autorecovery autotrace blockterminator break btitle cmdsep colsep compatibility compute concat copycommit copytypecheck define describe echo editfile embedded escape exec execute feedback flagger flush heading headsep instance linesize lno loboffset logsource long longchunksize markup native newpage numformat numwidth pagesize pause pno recsep recsepchar release repfooter repheader serveroutput shiftinout show showmode size spool sqlblanklines sqlcase sqlcode sqlcontinue sqlnumber sqlpluscompatibility sqlprefix sqlprompt sqlterminator suffix tab term termout time timing trimout trimspool ttitle underline verify version wrap"),
        keywords: set("abort accept access add all alter and any array arraylen as asc assert assign at attributes audit authorization avg base_table begin between binary_integer body boolean by case cast char char_base check close cluster clusters colauth column comment commit compress connect connected constant constraint crash create current currval cursor data_base database date dba deallocate debugoff debugon decimal declare default definition delay delete desc digits dispose distinct do drop else elseif elsif enable end entry escape exception exception_init exchange exclusive exists exit external fast fetch file for force form from function generic goto grant group having identified if immediate in increment index indexes indicator initial initrans insert interface intersect into is key level library like limited local lock log logging long loop master maxextents maxtrans member minextents minus mislabel mode modify multiset new next no noaudit nocompress nologging noparallel not nowait number_base object of off offline on online only open option or order out package parallel partition pctfree pctincrease pctused pls_integer positive positiven pragma primary prior private privileges procedure public raise range raw read rebuild record ref references refresh release rename replace resource restrict return returning returns reverse revoke rollback row rowid rowlabel rownum rows run savepoint schema segment select separate session set share snapshot some space split sql start statement storage subtype successful synonym tabauth table tables tablespace task terminate then to trigger truncate type union unique unlimited unrecoverable unusable update use using validate value values variable view views when whenever where while with work"),
        builtin: set("abs acos add_months ascii asin atan atan2 average bfile bfilename bigserial bit blob ceil character chartorowid chr clob concat convert cos cosh count dec decode deref dual dump dup_val_on_index empty error exp false float floor found glb greatest hextoraw initcap instr instrb int integer isopen last_day least length lengthb ln lower lpad ltrim lub make_ref max min mlslabel mod months_between natural naturaln nchar nclob new_time next_day nextval nls_charset_decl_len nls_charset_id nls_charset_name nls_initcap nls_lower nls_sort nls_upper nlssort no_data_found notfound null number numeric nvarchar2 nvl others power rawtohex real reftohex round rowcount rowidtochar rowtype rpad rtrim serial sign signtype sin sinh smallint soundex sqlcode sqlerrm sqrt stddev string substr substrb sum sysdate tan tanh to_char text to_date to_label to_multi_byte to_number to_single_byte translate true trunc uid unlogged upper user userenv varchar varchar2 variance varying vsize xml"),
        operatorChars: /^[*\/+\-%<>!=~]/,
        dateSQL: set("date time timestamp"),
        support: set("doubleQuote nCharCast zerolessFloat binaryNumber hexNumber")
      });
      CodeMirror2.defineMIME("text/x-hive", {
        name: "sql",
        keywords: set("select alter $elem$ $key$ $value$ add after all analyze and archive as asc before between binary both bucket buckets by cascade case cast change cluster clustered clusterstatus collection column columns comment compute concatenate continue create cross cursor data database databases dbproperties deferred delete delimited desc describe directory disable distinct distribute drop else enable end escaped exclusive exists explain export extended external fetch fields fileformat first format formatted from full function functions grant group having hold_ddltime idxproperties if import in index indexes inpath inputdriver inputformat insert intersect into is items join keys lateral left like limit lines load local location lock locks mapjoin materialized minus msck no_drop nocompress not of offline on option or order out outer outputdriver outputformat overwrite partition partitioned partitions percent plus preserve procedure purge range rcfile read readonly reads rebuild recordreader recordwriter recover reduce regexp rename repair replace restrict revoke right rlike row schema schemas semi sequencefile serde serdeproperties set shared show show_database sort sorted ssl statistics stored streamtable table tables tablesample tblproperties temporary terminated textfile then tmp to touch transform trigger unarchive undo union uniquejoin unlock update use using utc utc_tmestamp view when where while with admin authorization char compact compactions conf cube current current_date current_timestamp day decimal defined dependency directories elem_type exchange file following for grouping hour ignore inner interval jar less logical macro minute month more none noscan over owner partialscan preceding pretty principals protection reload rewrite role roles rollup rows second server sets skewed transactions truncate unbounded unset uri user values window year"),
        builtin: set("bool boolean long timestamp tinyint smallint bigint int float double date datetime unsigned string array struct map uniontype key_type utctimestamp value_type varchar"),
        atoms: set("false true null unknown"),
        operatorChars: /^[*+\-%<>!=]/,
        dateSQL: set("date timestamp"),
        support: set("doubleQuote binaryNumber hexNumber")
      });
      CodeMirror2.defineMIME("text/x-pgsql", {
        name: "sql",
        client: set("source"),
        // For PostgreSQL - https://www.postgresql.org/docs/11/sql-keywords-appendix.html
        // For pl/pgsql lang - https://github.com/postgres/postgres/blob/REL_11_2/src/pl/plpgsql/src/pl_scanner.c
        keywords: set(sqlKeywords + "a abort abs absent absolute access according action ada add admin after aggregate alias all allocate also alter always analyse analyze and any are array array_agg array_max_cardinality as asc asensitive assert assertion assignment asymmetric at atomic attach attribute attributes authorization avg backward base64 before begin begin_frame begin_partition bernoulli between bigint binary bit bit_length blob blocked bom boolean both breadth by c cache call called cardinality cascade cascaded case cast catalog catalog_name ceil ceiling chain char char_length character character_length character_set_catalog character_set_name character_set_schema characteristics characters check checkpoint class class_origin clob close cluster coalesce cobol collate collation collation_catalog collation_name collation_schema collect column column_name columns command_function command_function_code comment comments commit committed concurrently condition condition_number configuration conflict connect connection connection_name constant constraint constraint_catalog constraint_name constraint_schema constraints constructor contains content continue control conversion convert copy corr corresponding cost count covar_pop covar_samp create cross csv cube cume_dist current current_catalog current_date current_default_transform_group current_path current_role current_row current_schema current_time current_timestamp current_transform_group_for_type current_user cursor cursor_name cycle data database datalink datatype date datetime_interval_code datetime_interval_precision day db deallocate debug dec decimal declare default defaults deferrable deferred defined definer degree delete delimiter delimiters dense_rank depends depth deref derived desc describe descriptor detach detail deterministic diagnostics dictionary disable discard disconnect dispatch distinct dlnewcopy dlpreviouscopy dlurlcomplete dlurlcompleteonly dlurlcompletewrite dlurlpath dlurlpathonly dlurlpathwrite dlurlscheme dlurlserver dlvalue do document domain double drop dump dynamic dynamic_function dynamic_function_code each element else elseif elsif empty enable encoding encrypted end end_frame end_partition endexec enforced enum equals errcode error escape event every except exception exclude excluding exclusive exec execute exists exit exp explain expression extension external extract false family fetch file filter final first first_value flag float floor following for force foreach foreign fortran forward found frame_row free freeze from fs full function functions fusion g general generated get global go goto grant granted greatest group grouping groups handler having header hex hierarchy hint hold hour id identity if ignore ilike immediate immediately immutable implementation implicit import in include including increment indent index indexes indicator info inherit inherits initially inline inner inout input insensitive insert instance instantiable instead int integer integrity intersect intersection interval into invoker is isnull isolation join k key key_member key_type label lag language large last last_value lateral lead leading leakproof least left length level library like like_regex limit link listen ln load local localtime localtimestamp location locator lock locked log logged loop lower m map mapping match matched materialized max max_cardinality maxvalue member merge message message_length message_octet_length message_text method min minute minvalue mod mode modifies module month more move multiset mumps name names namespace national natural nchar nclob nesting new next nfc nfd nfkc nfkd nil no none normalize normalized not nothing notice notify notnull nowait nth_value ntile null nullable nullif nulls number numeric object occurrences_regex octet_length octets of off offset oids old on only open operator option options or order ordering ordinality others out outer output over overlaps overlay overriding owned owner p pad parallel parameter parameter_mode parameter_name parameter_ordinal_position parameter_specific_catalog parameter_specific_name parameter_specific_schema parser partial partition pascal passing passthrough password path percent percent_rank percentile_cont percentile_disc perform period permission pg_context pg_datatype_name pg_exception_context pg_exception_detail pg_exception_hint placing plans pli policy portion position position_regex power precedes preceding precision prepare prepared preserve primary print_strict_params prior privileges procedural procedure procedures program public publication query quote raise range rank read reads real reassign recheck recovery recursive ref references referencing refresh regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy regr_syy reindex relative release rename repeatable replace replica requiring reset respect restart restore restrict result result_oid return returned_cardinality returned_length returned_octet_length returned_sqlstate returning returns reverse revoke right role rollback rollup routine routine_catalog routine_name routine_schema routines row row_count row_number rows rowtype rule savepoint scale schema schema_name schemas scope scope_catalog scope_name scope_schema scroll search second section security select selective self sensitive sequence sequences serializable server server_name session session_user set setof sets share show similar simple size skip slice smallint snapshot some source space specific specific_name specifictype sql sqlcode sqlerror sqlexception sqlstate sqlwarning sqrt stable stacked standalone start state statement static statistics stddev_pop stddev_samp stdin stdout storage strict strip structure style subclass_origin submultiset subscription substring substring_regex succeeds sum symmetric sysid system system_time system_user t table table_name tables tablesample tablespace temp template temporary text then ties time timestamp timezone_hour timezone_minute to token top_level_count trailing transaction transaction_active transactions_committed transactions_rolled_back transform transforms translate translate_regex translation treat trigger trigger_catalog trigger_name trigger_schema trim trim_array true truncate trusted type types uescape unbounded uncommitted under unencrypted union unique unknown unlink unlisten unlogged unnamed unnest until untyped update upper uri usage use_column use_variable user user_defined_type_catalog user_defined_type_code user_defined_type_name user_defined_type_schema using vacuum valid validate validator value value_of values var_pop var_samp varbinary varchar variable_conflict variadic varying verbose version versioning view views volatile warning when whenever where while whitespace width_bucket window with within without work wrapper write xml xmlagg xmlattributes xmlbinary xmlcast xmlcomment xmlconcat xmldeclaration xmldocument xmlelement xmlexists xmlforest xmliterate xmlnamespaces xmlparse xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltext xmlvalidate year yes zone"),
        // https://www.postgresql.org/docs/11/datatype.html
        builtin: set("bigint int8 bigserial serial8 bit varying varbit boolean bool box bytea character char varchar cidr circle date double precision float8 inet integer int int4 interval json jsonb line lseg macaddr macaddr8 money numeric decimal path pg_lsn point polygon real float4 smallint int2 smallserial serial2 serial serial4 text time zone timetz timestamp timestamptz tsquery tsvector txid_snapshot uuid xml"),
        atoms: set("false true null unknown"),
        operatorChars: /^[*\/+\-%<>!=&|^\/#@?~]/,
        backslashStringEscapes: false,
        identifierQuote: '"',
        // https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS
        hooks: {
          '"': hookIdentifierDoublequote
        },
        dateSQL: set("date time timestamp"),
        support: set("decimallessFloat zerolessFloat binaryNumber hexNumber nCharCast charsetCast escapeConstant")
      });
      CodeMirror2.defineMIME("text/x-gql", {
        name: "sql",
        keywords: set("ancestor and asc by contains desc descendant distinct from group has in is limit offset on order select superset where"),
        atoms: set("false true"),
        builtin: set("blob datetime first key __key__ string integer double boolean null"),
        operatorChars: /^[*+\-%<>!=]/
      });
      CodeMirror2.defineMIME("text/x-gpsql", {
        name: "sql",
        client: set("source"),
        //https://github.com/greenplum-db/gpdb/blob/master/src/include/parser/kwlist.h
        keywords: set("abort absolute access action active add admin after aggregate all also alter always analyse analyze and any array as asc assertion assignment asymmetric at authorization backward before begin between bigint binary bit boolean both by cache called cascade cascaded case cast chain char character characteristics check checkpoint class close cluster coalesce codegen collate column comment commit committed concurrency concurrently configuration connection constraint constraints contains content continue conversion copy cost cpu_rate_limit create createdb createexttable createrole createuser cross csv cube current current_catalog current_date current_role current_schema current_time current_timestamp current_user cursor cycle data database day deallocate dec decimal declare decode default defaults deferrable deferred definer delete delimiter delimiters deny desc dictionary disable discard distinct distributed do document domain double drop dxl each else enable encoding encrypted end enum errors escape every except exchange exclude excluding exclusive execute exists explain extension external extract false family fetch fields filespace fill filter first float following for force foreign format forward freeze from full function global grant granted greatest group group_id grouping handler hash having header hold host hour identity if ignore ilike immediate immutable implicit in including inclusive increment index indexes inherit inherits initially inline inner inout input insensitive insert instead int integer intersect interval into invoker is isnull isolation join key language large last leading least left level like limit list listen load local localtime localtimestamp location lock log login mapping master match maxvalue median merge minute minvalue missing mode modifies modify month move name names national natural nchar new newline next no nocreatedb nocreateexttable nocreaterole nocreateuser noinherit nologin none noovercommit nosuperuser not nothing notify notnull nowait null nullif nulls numeric object of off offset oids old on only operator option options or order ordered others out outer over overcommit overlaps overlay owned owner parser partial partition partitions passing password percent percentile_cont percentile_disc placing plans position preceding precision prepare prepared preserve primary prior privileges procedural procedure protocol queue quote randomly range read readable reads real reassign recheck recursive ref references reindex reject relative release rename repeatable replace replica reset resource restart restrict returning returns revoke right role rollback rollup rootpartition row rows rule savepoint scatter schema scroll search second security segment select sequence serializable session session_user set setof sets share show similar simple smallint some split sql stable standalone start statement statistics stdin stdout storage strict strip subpartition subpartitions substring superuser symmetric sysid system table tablespace temp template temporary text then threshold ties time timestamp to trailing transaction treat trigger trim true truncate trusted type unbounded uncommitted unencrypted union unique unknown unlisten until update user using vacuum valid validation validator value values varchar variadic varying verbose version view volatile web when where whitespace window with within without work writable write xml xmlattributes xmlconcat xmlelement xmlexists xmlforest xmlparse xmlpi xmlroot xmlserialize year yes zone"),
        builtin: set("bigint int8 bigserial serial8 bit varying varbit boolean bool box bytea character char varchar cidr circle date double precision float float8 inet integer int int4 interval json jsonb line lseg macaddr macaddr8 money numeric decimal path pg_lsn point polygon real float4 smallint int2 smallserial serial2 serial serial4 text time without zone with timetz timestamp timestamptz tsquery tsvector txid_snapshot uuid xml"),
        atoms: set("false true null unknown"),
        operatorChars: /^[*+\-%<>!=&|^\/#@?~]/,
        dateSQL: set("date time timestamp"),
        support: set("decimallessFloat zerolessFloat binaryNumber hexNumber nCharCast charsetCast")
      });
      CodeMirror2.defineMIME("text/x-sparksql", {
        name: "sql",
        keywords: set("add after all alter analyze and anti archive array as asc at between bucket buckets by cache cascade case cast change clear cluster clustered codegen collection column columns comment commit compact compactions compute concatenate cost create cross cube current current_date current_timestamp database databases data dbproperties defined delete delimited deny desc describe dfs directories distinct distribute drop else end escaped except exchange exists explain export extended external false fields fileformat first following for format formatted from full function functions global grant group grouping having if ignore import in index indexes inner inpath inputformat insert intersect interval into is items join keys last lateral lazy left like limit lines list load local location lock locks logical macro map minus msck natural no not null nulls of on optimize option options or order out outer outputformat over overwrite partition partitioned partitions percent preceding principals purge range recordreader recordwriter recover reduce refresh regexp rename repair replace reset restrict revoke right rlike role roles rollback rollup row rows schema schemas select semi separated serde serdeproperties set sets show skewed sort sorted start statistics stored stratify struct table tables tablesample tblproperties temp temporary terminated then to touch transaction transactions transform true truncate unarchive unbounded uncache union unlock unset use using values view when where window with"),
        builtin: set("abs acos acosh add_months aggregate and any approx_count_distinct approx_percentile array array_contains array_distinct array_except array_intersect array_join array_max array_min array_position array_remove array_repeat array_sort array_union arrays_overlap arrays_zip ascii asin asinh assert_true atan atan2 atanh avg base64 between bigint bin binary bit_and bit_count bit_get bit_length bit_or bit_xor bool_and bool_or boolean bround btrim cardinality case cast cbrt ceil ceiling char char_length character_length chr coalesce collect_list collect_set concat concat_ws conv corr cos cosh cot count count_if count_min_sketch covar_pop covar_samp crc32 cume_dist current_catalog current_database current_date current_timestamp current_timezone current_user date date_add date_format date_from_unix_date date_part date_sub date_trunc datediff day dayofmonth dayofweek dayofyear decimal decode degrees delimited dense_rank div double e element_at elt encode every exists exp explode explode_outer expm1 extract factorial filter find_in_set first first_value flatten float floor forall format_number format_string from_csv from_json from_unixtime from_utc_timestamp get_json_object getbit greatest grouping grouping_id hash hex hour hypot if ifnull in initcap inline inline_outer input_file_block_length input_file_block_start input_file_name inputformat instr int isnan isnotnull isnull java_method json_array_length json_object_keys json_tuple kurtosis lag last last_day last_value lcase lead least left length levenshtein like ln locate log log10 log1p log2 lower lpad ltrim make_date make_dt_interval make_interval make_timestamp make_ym_interval map map_concat map_entries map_filter map_from_arrays map_from_entries map_keys map_values map_zip_with max max_by md5 mean min min_by minute mod monotonically_increasing_id month months_between named_struct nanvl negative next_day not now nth_value ntile nullif nvl nvl2 octet_length or outputformat overlay parse_url percent_rank percentile percentile_approx pi pmod posexplode posexplode_outer position positive pow power printf quarter radians raise_error rand randn random rank rcfile reflect regexp regexp_extract regexp_extract_all regexp_like regexp_replace repeat replace reverse right rint rlike round row_number rpad rtrim schema_of_csv schema_of_json second sentences sequence sequencefile serde session_window sha sha1 sha2 shiftleft shiftright shiftrightunsigned shuffle sign signum sin sinh size skewness slice smallint some sort_array soundex space spark_partition_id split sqrt stack std stddev stddev_pop stddev_samp str_to_map string struct substr substring substring_index sum tan tanh textfile timestamp timestamp_micros timestamp_millis timestamp_seconds tinyint to_csv to_date to_json to_timestamp to_unix_timestamp to_utc_timestamp transform transform_keys transform_values translate trim trunc try_add try_divide typeof ucase unbase64 unhex uniontype unix_date unix_micros unix_millis unix_seconds unix_timestamp upper uuid var_pop var_samp variance version weekday weekofyear when width_bucket window xpath xpath_boolean xpath_double xpath_float xpath_int xpath_long xpath_number xpath_short xpath_string xxhash64 year zip_with"),
        atoms: set("false true null"),
        operatorChars: /^[*\/+\-%<>!=~&|^]/,
        dateSQL: set("date time timestamp"),
        support: set("doubleQuote zerolessFloat")
      });
      CodeMirror2.defineMIME("text/x-esper", {
        name: "sql",
        client: set("source"),
        // http://www.espertech.com/esper/release-5.5.0/esper-reference/html/appendix_keywords.html
        keywords: set("alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit after all and as at asc avedev avg between by case cast coalesce count create current_timestamp day days delete define desc distinct else end escape events every exists false first from full group having hour hours in inner insert instanceof into irstream is istream join last lastweekday left limit like max match_recognize matches median measures metadatasql min minute minutes msec millisecond milliseconds not null offset on or order outer output partition pattern prev prior regexp retain-union retain-intersection right rstream sec second seconds select set some snapshot sql stddev sum then true unidirectional until update variable weekday when where window"),
        builtin: {},
        atoms: set("false true null"),
        operatorChars: /^[*+\-%<>!=&|^\/#@?~]/,
        dateSQL: set("time"),
        support: set("decimallessFloat zerolessFloat binaryNumber hexNumber")
      });
      CodeMirror2.defineMIME("text/x-trino", {
        name: "sql",
        // https://github.com/trinodb/trino/blob/bc7a4eeedde28684c7ae6f74cefcaf7c6e782174/core/trino-parser/src/main/antlr4/io/trino/sql/parser/SqlBase.g4#L859-L1129
        // https://github.com/trinodb/trino/blob/bc7a4eeedde28684c7ae6f74cefcaf7c6e782174/docs/src/main/sphinx/functions/list.rst
        keywords: set("abs absent acos add admin after all all_match alter analyze and any any_match approx_distinct approx_most_frequent approx_percentile approx_set arbitrary array_agg array_distinct array_except array_intersect array_join array_max array_min array_position array_remove array_sort array_union arrays_overlap as asc asin at at_timezone atan atan2 authorization avg bar bernoulli beta_cdf between bing_tile bing_tile_at bing_tile_coordinates bing_tile_polygon bing_tile_quadkey bing_tile_zoom_level bing_tiles_around bit_count bitwise_and bitwise_and_agg bitwise_left_shift bitwise_not bitwise_or bitwise_or_agg bitwise_right_shift bitwise_right_shift_arithmetic bitwise_xor bool_and bool_or both by call cardinality cascade case cast catalogs cbrt ceil ceiling char2hexint checksum chr classify coalesce codepoint column columns combinations comment commit committed concat concat_ws conditional constraint contains contains_sequence convex_hull_agg copartition corr cos cosh cosine_similarity count count_if covar_pop covar_samp crc32 create cross cube cume_dist current current_catalog current_date current_groups current_path current_role current_schema current_time current_timestamp current_timezone current_user data date_add date_diff date_format date_parse date_trunc day day_of_month day_of_week day_of_year deallocate default define definer degrees delete dense_rank deny desc describe descriptor distinct distributed dow doy drop e element_at else empty empty_approx_set encoding end error escape evaluate_classifier_predictions every except excluding execute exists exp explain extract false features fetch filter final first first_value flatten floor following for format format_datetime format_number from from_base from_base32 from_base64 from_base64url from_big_endian_32 from_big_endian_64 from_encoded_polyline from_geojson_geometry from_hex from_ieee754_32 from_ieee754_64 from_iso8601_date from_iso8601_timestamp from_iso8601_timestamp_nanos from_unixtime from_unixtime_nanos from_utf8 full functions geometric_mean geometry_from_hadoop_shape geometry_invalid_reason geometry_nearest_points geometry_to_bing_tiles geometry_union geometry_union_agg grant granted grants graphviz great_circle_distance greatest group grouping groups hamming_distance hash_counts having histogram hmac_md5 hmac_sha1 hmac_sha256 hmac_sha512 hour human_readable_seconds if ignore in including index infinity initial inner input insert intersect intersection_cardinality into inverse_beta_cdf inverse_normal_cdf invoker io is is_finite is_infinite is_json_scalar is_nan isolation jaccard_index join json_array json_array_contains json_array_get json_array_length json_exists json_extract json_extract_scalar json_format json_object json_parse json_query json_size json_value keep key keys kurtosis lag last last_day_of_month last_value lateral lead leading learn_classifier learn_libsvm_classifier learn_libsvm_regressor learn_regressor least left length level levenshtein_distance like limit line_interpolate_point line_interpolate_points line_locate_point listagg ln local localtime localtimestamp log log10 log2 logical lower lpad ltrim luhn_check make_set_digest map_agg map_concat map_entries map_filter map_from_entries map_keys map_union map_values map_zip_with match match_recognize matched matches materialized max max_by md5 measures merge merge_set_digest millisecond min min_by minute mod month multimap_agg multimap_from_entries murmur3 nan natural next nfc nfd nfkc nfkd ngrams no none none_match normal_cdf normalize not now nth_value ntile null nullif nulls numeric_histogram object objectid_timestamp of offset omit on one only option or order ordinality outer output over overflow parse_data_size parse_datetime parse_duration partition partitions passing past path pattern per percent_rank permute pi position pow power preceding prepare privileges properties prune qdigest_agg quarter quotes radians rand random range rank read recursive reduce reduce_agg refresh regexp_count regexp_extract regexp_extract_all regexp_like regexp_position regexp_replace regexp_split regr_intercept regr_slope regress rename render repeat repeatable replace reset respect restrict returning reverse revoke rgb right role roles rollback rollup round row_number rows rpad rtrim running scalar schema schemas second security seek select sequence serializable session set sets sha1 sha256 sha512 show shuffle sign simplify_geometry sin skewness skip slice some soundex spatial_partitioning spatial_partitions split split_part split_to_map split_to_multimap spooky_hash_v2_32 spooky_hash_v2_64 sqrt st_area st_asbinary st_astext st_boundary st_buffer st_centroid st_contains st_convexhull st_coorddim st_crosses st_difference st_dimension st_disjoint st_distance st_endpoint st_envelope st_envelopeaspts st_equals st_exteriorring st_geometries st_geometryfromtext st_geometryn st_geometrytype st_geomfrombinary st_interiorringn st_interiorrings st_intersection st_intersects st_isclosed st_isempty st_isring st_issimple st_isvalid st_length st_linefromtext st_linestring st_multipoint st_numgeometries st_numinteriorring st_numpoints st_overlaps st_point st_pointn st_points st_polygon st_relate st_startpoint st_symdifference st_touches st_union st_within st_x st_xmax st_xmin st_y st_ymax st_ymin start starts_with stats stddev stddev_pop stddev_samp string strpos subset substr substring sum system table tables tablesample tan tanh tdigest_agg text then ties timestamp_objectid timezone_hour timezone_minute to to_base to_base32 to_base64 to_base64url to_big_endian_32 to_big_endian_64 to_char to_date to_encoded_polyline to_geojson_geometry to_geometry to_hex to_ieee754_32 to_ieee754_64 to_iso8601 to_milliseconds to_spherical_geography to_timestamp to_unixtime to_utf8 trailing transaction transform transform_keys transform_values translate trim trim_array true truncate try try_cast type typeof uescape unbounded uncommitted unconditional union unique unknown unmatched unnest update upper url_decode url_encode url_extract_fragment url_extract_host url_extract_parameter url_extract_path url_extract_port url_extract_protocol url_extract_query use user using utf16 utf32 utf8 validate value value_at_quantile values values_at_quantiles var_pop var_samp variance verbose version view week week_of_year when where width_bucket wilson_interval_lower wilson_interval_upper window with with_timezone within without word_stem work wrapper write xxhash64 year year_of_week yow zip zip_with"),
        // https://github.com/trinodb/trino/blob/bc7a4eeedde28684c7ae6f74cefcaf7c6e782174/core/trino-main/src/main/java/io/trino/metadata/TypeRegistry.java#L131-L168
        // https://github.com/trinodb/trino/blob/bc7a4eeedde28684c7ae6f74cefcaf7c6e782174/plugin/trino-ml/src/main/java/io/trino/plugin/ml/MLPlugin.java#L35
        // https://github.com/trinodb/trino/blob/bc7a4eeedde28684c7ae6f74cefcaf7c6e782174/plugin/trino-mongodb/src/main/java/io/trino/plugin/mongodb/MongoPlugin.java#L32
        // https://github.com/trinodb/trino/blob/bc7a4eeedde28684c7ae6f74cefcaf7c6e782174/plugin/trino-geospatial/src/main/java/io/trino/plugin/geospatial/GeoPlugin.java#L37
        builtin: set("array bigint bingtile boolean char codepoints color date decimal double function geometry hyperloglog int integer interval ipaddress joniregexp json json2016 jsonpath kdbtree likepattern map model objectid p4hyperloglog precision qdigest re2jregexp real regressor row setdigest smallint sphericalgeography tdigest time timestamp tinyint uuid varbinary varchar zone"),
        atoms: set("false true null unknown"),
        // https://trino.io/docs/current/functions/list.html#id1
        operatorChars: /^[[\]|<>=!\-+*/%]/,
        dateSQL: set("date time timestamp zone"),
        // hexNumber is necessary for VARBINARY literals, e.g. X'65683F'
        // but it also enables 0xFF hex numbers, which Trino doesn't support.
        support: set("decimallessFloat zerolessFloat hexNumber")
      });
    });
  })();
  return sql.exports;
}
var hasRequiredSqlHint;
function requireSqlHint() {
  if (hasRequiredSqlHint) return sqlHint.exports;
  hasRequiredSqlHint = 1;
  (function(module, exports) {
    (function(mod) {
      mod(requireCodemirror(), requireSql());
    })(function(CodeMirror2) {
      var tables;
      var defaultTable;
      var keywords;
      var identifierQuote;
      var CONS = {
        QUERY_DIV: ";",
        ALIAS_KEYWORD: "AS"
      };
      var Pos = CodeMirror2.Pos, cmpPos = CodeMirror2.cmpPos;
      function isArray(val) {
        return Object.prototype.toString.call(val) == "[object Array]";
      }
      function getModeConf(editor, field) {
        return editor.getModeAt(editor.getCursor()).config[field] || CodeMirror2.resolveMode("text/x-sql")[field];
      }
      function getKeywords(editor) {
        return getModeConf(editor, "keywords") || [];
      }
      function getIdentifierQuote(editor) {
        return getModeConf(editor, "identifierQuote") || "`";
      }
      function getText(item) {
        return typeof item == "string" ? item : item.text;
      }
      function wrapTable(name, value) {
        if (isArray(value)) value = { columns: value };
        if (!value.text) value.text = name;
        return value;
      }
      function parseTables(input) {
        var result = {};
        if (isArray(input)) {
          for (var i = input.length - 1; i >= 0; i--) {
            var item = input[i];
            result[getText(item).toUpperCase()] = wrapTable(getText(item), item);
          }
        } else if (input) {
          for (var name in input)
            result[name.toUpperCase()] = wrapTable(name, input[name]);
        }
        return result;
      }
      function getTable(name) {
        return tables[name.toUpperCase()];
      }
      function shallowClone(object) {
        var result = {};
        for (var key2 in object) if (object.hasOwnProperty(key2))
          result[key2] = object[key2];
        return result;
      }
      function match(string, word) {
        var len = string.length;
        var sub = getText(word).substr(0, len);
        return string.toUpperCase() === sub.toUpperCase();
      }
      function addMatches(result, search, wordlist, formatter) {
        if (isArray(wordlist)) {
          for (var i = 0; i < wordlist.length; i++)
            if (match(search, wordlist[i])) result.push(formatter(wordlist[i]));
        } else {
          for (var word in wordlist) if (wordlist.hasOwnProperty(word)) {
            var val = wordlist[word];
            if (!val || val === true)
              val = word;
            else
              val = val.displayText ? { text: val.text, displayText: val.displayText } : val.text;
            if (match(search, val)) result.push(formatter(val));
          }
        }
      }
      function cleanName(name) {
        if (name.charAt(0) == ".") {
          name = name.substr(1);
        }
        var nameParts = name.split(identifierQuote + identifierQuote);
        for (var i = 0; i < nameParts.length; i++)
          nameParts[i] = nameParts[i].replace(new RegExp(identifierQuote, "g"), "");
        return nameParts.join(identifierQuote);
      }
      function insertIdentifierQuotes(name) {
        var nameParts = getText(name).split(".");
        for (var i = 0; i < nameParts.length; i++)
          nameParts[i] = identifierQuote + // duplicate identifierQuotes
          nameParts[i].replace(new RegExp(identifierQuote, "g"), identifierQuote + identifierQuote) + identifierQuote;
        var escaped = nameParts.join(".");
        if (typeof name == "string") return escaped;
        name = shallowClone(name);
        name.text = escaped;
        return name;
      }
      function nameCompletion(cur, token, result, editor) {
        var useIdentifierQuotes = false;
        var nameParts = [];
        var start = token.start;
        var cont = true;
        while (cont) {
          cont = token.string.charAt(0) == ".";
          useIdentifierQuotes = useIdentifierQuotes || token.string.charAt(0) == identifierQuote;
          start = token.start;
          nameParts.unshift(cleanName(token.string));
          token = editor.getTokenAt(Pos(cur.line, token.start));
          if (token.string == ".") {
            cont = true;
            token = editor.getTokenAt(Pos(cur.line, token.start));
          }
        }
        var string = nameParts.join(".");
        addMatches(result, string, tables, function(w) {
          return useIdentifierQuotes ? insertIdentifierQuotes(w) : w;
        });
        addMatches(result, string, defaultTable, function(w) {
          return useIdentifierQuotes ? insertIdentifierQuotes(w) : w;
        });
        string = nameParts.pop();
        var table = nameParts.join(".");
        var alias = false;
        var aliasTable = table;
        if (!getTable(table)) {
          var oldTable = table;
          table = findTableByAlias(table, editor);
          if (table !== oldTable) alias = true;
        }
        var columns = getTable(table);
        if (columns && columns.columns)
          columns = columns.columns;
        if (columns) {
          addMatches(result, string, columns, function(w) {
            var tableInsert = table;
            if (alias == true) tableInsert = aliasTable;
            if (typeof w == "string") {
              w = tableInsert + "." + w;
            } else {
              w = shallowClone(w);
              w.text = tableInsert + "." + w.text;
            }
            return useIdentifierQuotes ? insertIdentifierQuotes(w) : w;
          });
        }
        return start;
      }
      function eachWord(lineText, f) {
        var words = lineText.split(/\s+/);
        for (var i = 0; i < words.length; i++)
          if (words[i]) f(words[i].replace(/[`,;]/g, ""));
      }
      function findTableByAlias(alias, editor) {
        var doc = editor.doc;
        var fullQuery = doc.getValue();
        var aliasUpperCase = alias.toUpperCase();
        var previousWord = "";
        var table = "";
        var separator2 = [];
        var validRange = {
          start: Pos(0, 0),
          end: Pos(editor.lastLine(), editor.getLineHandle(editor.lastLine()).length)
        };
        var indexOfSeparator = fullQuery.indexOf(CONS.QUERY_DIV);
        while (indexOfSeparator != -1) {
          separator2.push(doc.posFromIndex(indexOfSeparator));
          indexOfSeparator = fullQuery.indexOf(CONS.QUERY_DIV, indexOfSeparator + 1);
        }
        separator2.unshift(Pos(0, 0));
        separator2.push(Pos(editor.lastLine(), editor.getLineHandle(editor.lastLine()).text.length));
        var prevItem = null;
        var current = editor.getCursor();
        for (var i = 0; i < separator2.length; i++) {
          if ((prevItem == null || cmpPos(current, prevItem) > 0) && cmpPos(current, separator2[i]) <= 0) {
            validRange = { start: prevItem, end: separator2[i] };
            break;
          }
          prevItem = separator2[i];
        }
        if (validRange.start) {
          var query = doc.getRange(validRange.start, validRange.end, false);
          for (var i = 0; i < query.length; i++) {
            var lineText = query[i];
            eachWord(lineText, function(word) {
              var wordUpperCase = word.toUpperCase();
              if (wordUpperCase === aliasUpperCase && getTable(previousWord))
                table = previousWord;
              if (wordUpperCase !== CONS.ALIAS_KEYWORD)
                previousWord = word;
            });
            if (table) break;
          }
        }
        return table;
      }
      CodeMirror2.registerHelper("hint", "sql", function(editor, options) {
        tables = parseTables(options && options.tables);
        var defaultTableName = options && options.defaultTable;
        var disableKeywords = options && options.disableKeywords;
        defaultTable = defaultTableName && getTable(defaultTableName);
        keywords = getKeywords(editor);
        identifierQuote = getIdentifierQuote(editor);
        if (defaultTableName && !defaultTable)
          defaultTable = findTableByAlias(defaultTableName, editor);
        defaultTable = defaultTable || [];
        if (defaultTable.columns)
          defaultTable = defaultTable.columns;
        var cur = editor.getCursor();
        var result = [];
        var token = editor.getTokenAt(cur), start, end, search;
        if (token.end > cur.ch) {
          token.end = cur.ch;
          token.string = token.string.slice(0, cur.ch - token.start);
        }
        if (token.string.match(/^[.`"'\w@][\w$#]*$/g)) {
          search = token.string;
          start = token.start;
          end = token.end;
        } else {
          start = end = cur.ch;
          search = "";
        }
        if (search.charAt(0) == "." || search.charAt(0) == identifierQuote) {
          start = nameCompletion(cur, token, result, editor);
        } else {
          var objectOrClass = function(w, className) {
            if (typeof w === "object") {
              w.className = className;
            } else {
              w = { text: w, className };
            }
            return w;
          };
          addMatches(result, search, defaultTable, function(w) {
            return objectOrClass(w, "CodeMirror-hint-table CodeMirror-hint-default-table");
          });
          addMatches(
            result,
            search,
            tables,
            function(w) {
              return objectOrClass(w, "CodeMirror-hint-table");
            }
          );
          if (!disableKeywords)
            addMatches(result, search, keywords, function(w) {
              return objectOrClass(w.toUpperCase(), "CodeMirror-hint-keyword");
            });
        }
        return { list: result, from: Pos(cur.line, start), to: Pos(cur.line, end) };
      });
    });
  })();
  return sqlHint.exports;
}
requireSqlHint();
const _sfc_main$1 = {
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    mode: {
      type: String,
      default: "sql"
    },
    onInput: {
      type: Function,
      default: () => {
      }
    },
    onCursorActivity: {
      type: Function,
      default: () => {
      }
    },
    height: {
      type: [String, Number],
      default: 300
    },
    options: {
      type: Object,
      default: () => {
      }
    },
    theme: {
      type: String,
      default: "idea"
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      contentValue: this.modelValue,
      coder: null,
      opt: __spreadValues({
        autoRefresh: true,
        autofocus: true,
        theme: this.theme,
        //主题
        autoMatchParens: true,
        styleActiveLine: true,
        //高亮当前行
        lineNumbers: true,
        //行号
        lineWrapping: false,
        //自动换行
        tabSize: 4,
        //Tab缩进
        indentUnit: 4,
        //缩进单位
        indentWithTabs: true,
        //自动缩进
        mode: this.mode,
        //语言
        readOnly: this.readOnly
      }, this.options)
    };
  },
  computed: {
    _height() {
      return Number(this.height) ? Number(this.height) + "px" : this.height;
    }
  },
  watch: {
    modelValue(val) {
      this.contentValue = val;
      if (val !== this.coder.getValue()) {
        this.coder.setValue(val);
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    refresh() {
      setTimeout(() => {
        this.coder.refresh();
      }, 10);
    },
    upgradeHits(hits) {
      this.coder.setOption("hintOptions", {
        // 自定义提示选项
        tables: hits
      });
    },
    init() {
      var _a, _b;
      this.coder = markRaw(CodeMirror.fromTextArea(this.$refs.textarea, this.opt));
      this.coder.on("change", (coder) => {
        this.contentValue = coder.getValue();
        this.$emit("update:modelValue", this.contentValue);
        this.$emit("updateValue", this.contentValue);
      });
      if (this.onInput) {
        this.coder.on("keyup", (val, e) => {
          this.onInput(val);
          if (e.keyCode === 8 || e.keyCode >= 37 && e.keyCode <= 40) {
            return;
          }
          this.coder.showHint();
        });
      }
      if (this.onCursorActivity) {
        this.coder.on("cursorActivity", () => {
          this.onCursorActivity();
        });
      }
      this.coder.setOption("hintOptions", {
        // 自定义提示选项
        completeSingle: (_a = this.options) == null ? void 0 : _a.completeSingle,
        // 当匹配只有一项的时候是否自动补全
        tables: (_b = this.options) == null ? void 0 : _b.tables
      });
    },
    formatStrInJson(strValue) {
      return JSON.stringify(JSON.parse(strValue), null, 4);
    }
  }
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "sc-code-editor",
    style: normalizeStyle({
      height: $options._height
    })
  }, [withDirectives(createBaseVNode("textarea", {
    ref: "textarea",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.contentValue = $event)
  }, null, 512), [[vModelText, $data.contentValue]])], 4);
}
const ScCodeEditor = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-5a9ad9f8"], ["__file", "H:/workspace/2/vue-support-parent-starter/packages/components/scCodeEditor/index.vue"]]);
var LineType;
(function(LineType2) {
  LineType2["INSERT"] = "insert";
  LineType2["DELETE"] = "delete";
  LineType2["CONTEXT"] = "context";
})(LineType || (LineType = {}));
const OutputFormatType = {
  LINE_BY_LINE: "line-by-line"
};
const LineMatchingType = {
  NONE: "none"
};
const DiffStyleType = {
  WORD: "word"
};
var ColorSchemeType;
(function(ColorSchemeType2) {
  ColorSchemeType2["AUTO"] = "auto";
  ColorSchemeType2["DARK"] = "dark";
  ColorSchemeType2["LIGHT"] = "light";
})(ColorSchemeType || (ColorSchemeType = {}));
const specials = [
  "-",
  "[",
  "]",
  "/",
  "{",
  "}",
  "(",
  ")",
  "*",
  "+",
  "?",
  ".",
  "\\",
  "^",
  "$",
  "|"
];
const regex = RegExp("[" + specials.join("\\") + "]", "g");
function escapeForRegExp(str) {
  return str.replace(regex, "\\$&");
}
function unifyPath(path) {
  return path ? path.replace(/\\/g, "/") : path;
}
function hashCode(text) {
  let i, chr, len;
  let hash = 0;
  for (i = 0, len = text.length; i < len; i++) {
    chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}
function max(arr) {
  const length = arr.length;
  let max2 = -Infinity;
  for (let i = 0; i < length; i++) {
    max2 = Math.max(max2, arr[i]);
  }
  return max2;
}
function getExtension(filename, language) {
  const filenameParts = filename.split(".");
  return filenameParts.length > 1 ? filenameParts[filenameParts.length - 1] : language;
}
function startsWithAny(str, prefixes) {
  return prefixes.reduce((startsWith, prefix) => startsWith || str.startsWith(prefix), false);
}
const baseDiffFilenamePrefixes = ["a/", "b/", "i/", "w/", "c/", "o/"];
function getFilename(line, linePrefix, extraPrefix) {
  const prefixes = extraPrefix !== void 0 ? [...baseDiffFilenamePrefixes, extraPrefix] : baseDiffFilenamePrefixes;
  const FilenameRegExp = linePrefix ? new RegExp(`^${escapeForRegExp(linePrefix)} "?(.+?)"?$`) : new RegExp('^"?(.+?)"?$');
  const [, filename = ""] = FilenameRegExp.exec(line) || [];
  const matchingPrefix = prefixes.find((p) => filename.indexOf(p) === 0);
  const fnameWithoutPrefix = matchingPrefix ? filename.slice(matchingPrefix.length) : filename;
  return fnameWithoutPrefix.replace(/\s+\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)? [+-]\d{4}.*$/, "");
}
function getSrcFilename(line, srcPrefix) {
  return getFilename(line, "---", srcPrefix);
}
function getDstFilename(line, dstPrefix) {
  return getFilename(line, "+++", dstPrefix);
}
function parse$1(diffInput, config = {}) {
  const files = [];
  let currentFile = null;
  let currentBlock = null;
  let oldLine = null;
  let oldLine2 = null;
  let newLine = null;
  let possibleOldName = null;
  let possibleNewName = null;
  const oldFileNameHeader = "--- ";
  const newFileNameHeader = "+++ ";
  const hunkHeaderPrefix = "@@";
  const oldMode = /^old mode (\d{6})/;
  const newMode = /^new mode (\d{6})/;
  const deletedFileMode = /^deleted file mode (\d{6})/;
  const newFileMode = /^new file mode (\d{6})/;
  const copyFrom = /^copy from "?(.+)"?/;
  const copyTo = /^copy to "?(.+)"?/;
  const renameFrom = /^rename from "?(.+)"?/;
  const renameTo = /^rename to "?(.+)"?/;
  const similarityIndex = /^similarity index (\d+)%/;
  const dissimilarityIndex = /^dissimilarity index (\d+)%/;
  const index2 = /^index ([\da-z]+)\.\.([\da-z]+)\s*(\d{6})?/;
  const binaryFiles = /^Binary files (.*) and (.*) differ/;
  const binaryDiff = /^GIT binary patch/;
  const combinedIndex = /^index ([\da-z]+),([\da-z]+)\.\.([\da-z]+)/;
  const combinedMode = /^mode (\d{6}),(\d{6})\.\.(\d{6})/;
  const combinedNewFile = /^new file mode (\d{6})/;
  const combinedDeletedFile = /^deleted file mode (\d{6}),(\d{6})/;
  const diffLines2 = diffInput.replace(/\\ No newline at end of file/g, "").replace(/\r\n?/g, "\n").split("\n");
  function saveBlock() {
    if (currentBlock !== null && currentFile !== null) {
      currentFile.blocks.push(currentBlock);
      currentBlock = null;
    }
  }
  function saveFile() {
    if (currentFile !== null) {
      if (!currentFile.oldName && possibleOldName !== null) {
        currentFile.oldName = possibleOldName;
      }
      if (!currentFile.newName && possibleNewName !== null) {
        currentFile.newName = possibleNewName;
      }
      if (currentFile.newName) {
        files.push(currentFile);
        currentFile = null;
      }
    }
    possibleOldName = null;
    possibleNewName = null;
  }
  function startFile() {
    saveBlock();
    saveFile();
    currentFile = {
      blocks: [],
      deletedLines: 0,
      addedLines: 0
    };
  }
  function startBlock(line) {
    saveBlock();
    let values;
    if (currentFile !== null) {
      if (values = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@.*/.exec(line)) {
        currentFile.isCombined = false;
        oldLine = parseInt(values[1], 10);
        newLine = parseInt(values[2], 10);
      } else if (values = /^@@@ -(\d+)(?:,\d+)? -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@@.*/.exec(line)) {
        currentFile.isCombined = true;
        oldLine = parseInt(values[1], 10);
        oldLine2 = parseInt(values[2], 10);
        newLine = parseInt(values[3], 10);
      } else {
        if (line.startsWith(hunkHeaderPrefix)) {
          console.error("Failed to parse lines, starting in 0!");
        }
        oldLine = 0;
        newLine = 0;
        currentFile.isCombined = false;
      }
    }
    currentBlock = {
      lines: [],
      oldStartLine: oldLine,
      oldStartLine2: oldLine2,
      newStartLine: newLine,
      header: line
    };
  }
  function createLine(line) {
    if (currentFile === null || currentBlock === null || oldLine === null || newLine === null)
      return;
    const currentLine = {
      content: line
    };
    const addedPrefixes = currentFile.isCombined ? ["+ ", " +", "++"] : ["+"];
    const deletedPrefixes = currentFile.isCombined ? ["- ", " -", "--"] : ["-"];
    if (startsWithAny(line, addedPrefixes)) {
      currentFile.addedLines++;
      currentLine.type = LineType.INSERT;
      currentLine.oldNumber = void 0;
      currentLine.newNumber = newLine++;
    } else if (startsWithAny(line, deletedPrefixes)) {
      currentFile.deletedLines++;
      currentLine.type = LineType.DELETE;
      currentLine.oldNumber = oldLine++;
      currentLine.newNumber = void 0;
    } else {
      currentLine.type = LineType.CONTEXT;
      currentLine.oldNumber = oldLine++;
      currentLine.newNumber = newLine++;
    }
    currentBlock.lines.push(currentLine);
  }
  function existHunkHeader(line, lineIdx) {
    let idx = lineIdx;
    while (idx < diffLines2.length - 3) {
      if (line.startsWith("diff")) {
        return false;
      }
      if (diffLines2[idx].startsWith(oldFileNameHeader) && diffLines2[idx + 1].startsWith(newFileNameHeader) && diffLines2[idx + 2].startsWith(hunkHeaderPrefix)) {
        return true;
      }
      idx++;
    }
    return false;
  }
  diffLines2.forEach((line, lineIndex) => {
    if (!line || line.startsWith("*")) {
      return;
    }
    let values;
    const prevLine = diffLines2[lineIndex - 1];
    const nxtLine = diffLines2[lineIndex + 1];
    const afterNxtLine = diffLines2[lineIndex + 2];
    if (line.startsWith("diff --git") || line.startsWith("diff --combined")) {
      startFile();
      const gitDiffStart = /^diff --git "?([a-ciow]\/.+)"? "?([a-ciow]\/.+)"?/;
      if (values = gitDiffStart.exec(line)) {
        possibleOldName = getFilename(values[1], void 0, config.dstPrefix);
        possibleNewName = getFilename(values[2], void 0, config.srcPrefix);
      }
      if (currentFile === null) {
        throw new Error("Where is my file !!!");
      }
      currentFile.isGitDiff = true;
      return;
    }
    if (line.startsWith("Binary files") && !(currentFile === null || currentFile === void 0 ? void 0 : currentFile.isGitDiff)) {
      startFile();
      const unixDiffBinaryStart = /^Binary files "?([a-ciow]\/.+)"? and "?([a-ciow]\/.+)"? differ/;
      if (values = unixDiffBinaryStart.exec(line)) {
        possibleOldName = getFilename(values[1], void 0, config.dstPrefix);
        possibleNewName = getFilename(values[2], void 0, config.srcPrefix);
      }
      if (currentFile === null) {
        throw new Error("Where is my file !!!");
      }
      currentFile.isBinary = true;
      return;
    }
    if (!currentFile || !currentFile.isGitDiff && currentFile && line.startsWith(oldFileNameHeader) && nxtLine.startsWith(newFileNameHeader) && afterNxtLine.startsWith(hunkHeaderPrefix)) {
      startFile();
    }
    if (currentFile === null || currentFile === void 0 ? void 0 : currentFile.isTooBig) {
      return;
    }
    if (currentFile && (typeof config.diffMaxChanges === "number" && currentFile.addedLines + currentFile.deletedLines > config.diffMaxChanges || typeof config.diffMaxLineLength === "number" && line.length > config.diffMaxLineLength)) {
      currentFile.isTooBig = true;
      currentFile.addedLines = 0;
      currentFile.deletedLines = 0;
      currentFile.blocks = [];
      currentBlock = null;
      const message = typeof config.diffTooBigMessage === "function" ? config.diffTooBigMessage(files.length) : "Diff too big to be displayed";
      startBlock(message);
      return;
    }
    if (line.startsWith(oldFileNameHeader) && nxtLine.startsWith(newFileNameHeader) || line.startsWith(newFileNameHeader) && prevLine.startsWith(oldFileNameHeader)) {
      if (currentFile && !currentFile.oldName && line.startsWith("--- ") && (values = getSrcFilename(line, config.srcPrefix))) {
        currentFile.oldName = values;
        currentFile.language = getExtension(currentFile.oldName, currentFile.language);
        return;
      }
      if (currentFile && !currentFile.newName && line.startsWith("+++ ") && (values = getDstFilename(line, config.dstPrefix))) {
        currentFile.newName = values;
        currentFile.language = getExtension(currentFile.newName, currentFile.language);
        return;
      }
    }
    if (currentFile && (line.startsWith(hunkHeaderPrefix) || currentFile.isGitDiff && currentFile.oldName && currentFile.newName && !currentBlock)) {
      startBlock(line);
      return;
    }
    if (currentBlock && (line.startsWith("+") || line.startsWith("-") || line.startsWith(" "))) {
      createLine(line);
      return;
    }
    const doesNotExistHunkHeader = !existHunkHeader(line, lineIndex);
    if (currentFile === null) {
      throw new Error("Where is my file !!!");
    }
    if (values = oldMode.exec(line)) {
      currentFile.oldMode = values[1];
    } else if (values = newMode.exec(line)) {
      currentFile.newMode = values[1];
    } else if (values = deletedFileMode.exec(line)) {
      currentFile.deletedFileMode = values[1];
      currentFile.isDeleted = true;
    } else if (values = newFileMode.exec(line)) {
      currentFile.newFileMode = values[1];
      currentFile.isNew = true;
    } else if (values = copyFrom.exec(line)) {
      if (doesNotExistHunkHeader) {
        currentFile.oldName = values[1];
      }
      currentFile.isCopy = true;
    } else if (values = copyTo.exec(line)) {
      if (doesNotExistHunkHeader) {
        currentFile.newName = values[1];
      }
      currentFile.isCopy = true;
    } else if (values = renameFrom.exec(line)) {
      if (doesNotExistHunkHeader) {
        currentFile.oldName = values[1];
      }
      currentFile.isRename = true;
    } else if (values = renameTo.exec(line)) {
      if (doesNotExistHunkHeader) {
        currentFile.newName = values[1];
      }
      currentFile.isRename = true;
    } else if (values = binaryFiles.exec(line)) {
      currentFile.isBinary = true;
      currentFile.oldName = getFilename(values[1], void 0, config.srcPrefix);
      currentFile.newName = getFilename(values[2], void 0, config.dstPrefix);
      startBlock("Binary file");
    } else if (binaryDiff.test(line)) {
      currentFile.isBinary = true;
      startBlock(line);
    } else if (values = similarityIndex.exec(line)) {
      currentFile.unchangedPercentage = parseInt(values[1], 10);
    } else if (values = dissimilarityIndex.exec(line)) {
      currentFile.changedPercentage = parseInt(values[1], 10);
    } else if (values = index2.exec(line)) {
      currentFile.checksumBefore = values[1];
      currentFile.checksumAfter = values[2];
      if (values[3])
        currentFile.mode = values[3];
    } else if (values = combinedIndex.exec(line)) {
      currentFile.checksumBefore = [values[2], values[3]];
      currentFile.checksumAfter = values[1];
    } else if (values = combinedMode.exec(line)) {
      currentFile.oldMode = [values[2], values[3]];
      currentFile.newMode = values[1];
    } else if (values = combinedNewFile.exec(line)) {
      currentFile.newFileMode = values[1];
      currentFile.isNew = true;
    } else if (values = combinedDeletedFile.exec(line)) {
      currentFile.deletedFileMode = values[1];
      currentFile.isDeleted = true;
    }
  });
  saveBlock();
  saveFile();
  return files;
}
function Diff() {
}
Diff.prototype = {
  diff: function diff(oldString, newString) {
    var _options$timeout;
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var callback = options.callback;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    var self = this;
    function done(value) {
      value = self.postProcess(value, options);
      if (callback) {
        setTimeout(function() {
          callback(value);
        }, 0);
        return true;
      } else {
        return value;
      }
    }
    oldString = this.castInput(oldString, options);
    newString = this.castInput(newString, options);
    oldString = this.removeEmpty(this.tokenize(oldString, options));
    newString = this.removeEmpty(this.tokenize(newString, options));
    var newLen = newString.length, oldLen = oldString.length;
    var editLength = 1;
    var maxEditLength = newLen + oldLen;
    if (options.maxEditLength != null) {
      maxEditLength = Math.min(maxEditLength, options.maxEditLength);
    }
    var maxExecutionTime = (_options$timeout = options.timeout) !== null && _options$timeout !== void 0 ? _options$timeout : Infinity;
    var abortAfterTimestamp = Date.now() + maxExecutionTime;
    var bestPath = [{
      oldPos: -1,
      lastComponent: void 0
    }];
    var newPos = this.extractCommon(bestPath[0], newString, oldString, 0, options);
    if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
      return done(buildValues(self, bestPath[0].lastComponent, newString, oldString, self.useLongestToken));
    }
    var minDiagonalToConsider = -Infinity, maxDiagonalToConsider = Infinity;
    function execEditLength() {
      for (var diagonalPath = Math.max(minDiagonalToConsider, -editLength); diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
        var basePath = void 0;
        var removePath = bestPath[diagonalPath - 1], addPath = bestPath[diagonalPath + 1];
        if (removePath) {
          bestPath[diagonalPath - 1] = void 0;
        }
        var canAdd = false;
        if (addPath) {
          var addPathNewPos = addPath.oldPos - diagonalPath;
          canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
        }
        var canRemove = removePath && removePath.oldPos + 1 < oldLen;
        if (!canAdd && !canRemove) {
          bestPath[diagonalPath] = void 0;
          continue;
        }
        if (!canRemove || canAdd && removePath.oldPos < addPath.oldPos) {
          basePath = self.addToPath(addPath, true, false, 0, options);
        } else {
          basePath = self.addToPath(removePath, false, true, 1, options);
        }
        newPos = self.extractCommon(basePath, newString, oldString, diagonalPath, options);
        if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
          return done(buildValues(self, basePath.lastComponent, newString, oldString, self.useLongestToken));
        } else {
          bestPath[diagonalPath] = basePath;
          if (basePath.oldPos + 1 >= oldLen) {
            maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
          }
          if (newPos + 1 >= newLen) {
            minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
          }
        }
      }
      editLength++;
    }
    if (callback) {
      (function exec() {
        setTimeout(function() {
          if (editLength > maxEditLength || Date.now() > abortAfterTimestamp) {
            return callback();
          }
          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
        var ret = execEditLength();
        if (ret) {
          return ret;
        }
      }
    }
  },
  addToPath: function addToPath(path, added, removed, oldPosInc, options) {
    var last = path.lastComponent;
    if (last && !options.oneChangePerToken && last.added === added && last.removed === removed) {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: {
          count: last.count + 1,
          added,
          removed,
          previousComponent: last.previousComponent
        }
      };
    } else {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: {
          count: 1,
          added,
          removed,
          previousComponent: last
        }
      };
    }
  },
  extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath, options) {
    var newLen = newString.length, oldLen = oldString.length, oldPos = basePath.oldPos, newPos = oldPos - diagonalPath, commonCount = 0;
    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(oldString[oldPos + 1], newString[newPos + 1], options)) {
      newPos++;
      oldPos++;
      commonCount++;
      if (options.oneChangePerToken) {
        basePath.lastComponent = {
          count: 1,
          previousComponent: basePath.lastComponent,
          added: false,
          removed: false
        };
      }
    }
    if (commonCount && !options.oneChangePerToken) {
      basePath.lastComponent = {
        count: commonCount,
        previousComponent: basePath.lastComponent,
        added: false,
        removed: false
      };
    }
    basePath.oldPos = oldPos;
    return newPos;
  },
  equals: function equals(left, right, options) {
    if (options.comparator) {
      return options.comparator(left, right);
    } else {
      return left === right || options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  },
  removeEmpty: function removeEmpty(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }
    return ret;
  },
  castInput: function castInput(value) {
    return value;
  },
  tokenize: function tokenize(value) {
    return Array.from(value);
  },
  join: function join(chars) {
    return chars.join("");
  },
  postProcess: function postProcess(changeObjects) {
    return changeObjects;
  }
};
function buildValues(diff2, lastComponent, newString, oldString, useLongestToken) {
  var components = [];
  var nextComponent;
  while (lastComponent) {
    components.push(lastComponent);
    nextComponent = lastComponent.previousComponent;
    delete lastComponent.previousComponent;
    lastComponent = nextComponent;
  }
  components.reverse();
  var componentPos = 0, componentLen = components.length, newPos = 0, oldPos = 0;
  for (; componentPos < componentLen; componentPos++) {
    var component = components[componentPos];
    if (!component.removed) {
      if (!component.added && useLongestToken) {
        var value = newString.slice(newPos, newPos + component.count);
        value = value.map(function(value2, i) {
          var oldValue = oldString[oldPos + i];
          return oldValue.length > value2.length ? oldValue : value2;
        });
        component.value = diff2.join(value);
      } else {
        component.value = diff2.join(newString.slice(newPos, newPos + component.count));
      }
      newPos += component.count;
      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      component.value = diff2.join(oldString.slice(oldPos, oldPos + component.count));
      oldPos += component.count;
    }
  }
  return components;
}
var characterDiff = new Diff();
function diffChars(oldStr, newStr, options) {
  return characterDiff.diff(oldStr, newStr, options);
}
function longestCommonPrefix(str1, str2) {
  var i;
  for (i = 0; i < str1.length && i < str2.length; i++) {
    if (str1[i] != str2[i]) {
      return str1.slice(0, i);
    }
  }
  return str1.slice(0, i);
}
function longestCommonSuffix(str1, str2) {
  var i;
  if (!str1 || !str2 || str1[str1.length - 1] != str2[str2.length - 1]) {
    return "";
  }
  for (i = 0; i < str1.length && i < str2.length; i++) {
    if (str1[str1.length - (i + 1)] != str2[str2.length - (i + 1)]) {
      return str1.slice(-i);
    }
  }
  return str1.slice(-i);
}
function replacePrefix(string, oldPrefix, newPrefix) {
  if (string.slice(0, oldPrefix.length) != oldPrefix) {
    throw Error("string ".concat(JSON.stringify(string), " doesn't start with prefix ").concat(JSON.stringify(oldPrefix), "; this is a bug"));
  }
  return newPrefix + string.slice(oldPrefix.length);
}
function replaceSuffix(string, oldSuffix, newSuffix) {
  if (!oldSuffix) {
    return string + newSuffix;
  }
  if (string.slice(-oldSuffix.length) != oldSuffix) {
    throw Error("string ".concat(JSON.stringify(string), " doesn't end with suffix ").concat(JSON.stringify(oldSuffix), "; this is a bug"));
  }
  return string.slice(0, -oldSuffix.length) + newSuffix;
}
function removePrefix(string, oldPrefix) {
  return replacePrefix(string, oldPrefix, "");
}
function removeSuffix(string, oldSuffix) {
  return replaceSuffix(string, oldSuffix, "");
}
function maximumOverlap(string1, string2) {
  return string2.slice(0, overlapCount(string1, string2));
}
function overlapCount(a, b) {
  var startA = 0;
  if (a.length > b.length) {
    startA = a.length - b.length;
  }
  var endB = b.length;
  if (a.length < b.length) {
    endB = a.length;
  }
  var map = Array(endB);
  var k = 0;
  map[0] = 0;
  for (var j = 1; j < endB; j++) {
    if (b[j] == b[k]) {
      map[j] = map[k];
    } else {
      map[j] = k;
    }
    while (k > 0 && b[j] != b[k]) {
      k = map[k];
    }
    if (b[j] == b[k]) {
      k++;
    }
  }
  k = 0;
  for (var i = startA; i < a.length; i++) {
    while (k > 0 && a[i] != b[k]) {
      k = map[k];
    }
    if (a[i] == b[k]) {
      k++;
    }
  }
  return k;
}
function hasOnlyWinLineEndings(string) {
  return string.includes("\r\n") && !string.startsWith("\n") && !string.match(/[^\r]\n/);
}
function hasOnlyUnixLineEndings(string) {
  return !string.includes("\r\n") && string.includes("\n");
}
var extendedWordChars = "a-zA-Z0-9_\\u{C0}-\\u{FF}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}";
var tokenizeIncludingWhitespace = new RegExp("[".concat(extendedWordChars, "]+|\\s+|[^").concat(extendedWordChars, "]"), "ug");
var wordDiff = new Diff();
wordDiff.equals = function(left, right, options) {
  if (options.ignoreCase) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  }
  return left.trim() === right.trim();
};
wordDiff.tokenize = function(value) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var parts;
  if (options.intlSegmenter) {
    if (options.intlSegmenter.resolvedOptions().granularity != "word") {
      throw new Error('The segmenter passed must have a granularity of "word"');
    }
    parts = Array.from(options.intlSegmenter.segment(value), function(segment) {
      return segment.segment;
    });
  } else {
    parts = value.match(tokenizeIncludingWhitespace) || [];
  }
  var tokens = [];
  var prevPart = null;
  parts.forEach(function(part) {
    if (/\s/.test(part)) {
      if (prevPart == null) {
        tokens.push(part);
      } else {
        tokens.push(tokens.pop() + part);
      }
    } else if (/\s/.test(prevPart)) {
      if (tokens[tokens.length - 1] == prevPart) {
        tokens.push(tokens.pop() + part);
      } else {
        tokens.push(prevPart + part);
      }
    } else {
      tokens.push(part);
    }
    prevPart = part;
  });
  return tokens;
};
wordDiff.join = function(tokens) {
  return tokens.map(function(token, i) {
    if (i == 0) {
      return token;
    } else {
      return token.replace(/^\s+/, "");
    }
  }).join("");
};
wordDiff.postProcess = function(changes, options) {
  if (!changes || options.oneChangePerToken) {
    return changes;
  }
  var lastKeep = null;
  var insertion = null;
  var deletion = null;
  changes.forEach(function(change) {
    if (change.added) {
      insertion = change;
    } else if (change.removed) {
      deletion = change;
    } else {
      if (insertion || deletion) {
        dedupeWhitespaceInChangeObjects(lastKeep, deletion, insertion, change);
      }
      lastKeep = change;
      insertion = null;
      deletion = null;
    }
  });
  if (insertion || deletion) {
    dedupeWhitespaceInChangeObjects(lastKeep, deletion, insertion, null);
  }
  return changes;
};
function diffWords(oldStr, newStr, options) {
  if ((options === null || options === void 0 ? void 0 : options.ignoreWhitespace) != null && !options.ignoreWhitespace) {
    return diffWordsWithSpace(oldStr, newStr, options);
  }
  return wordDiff.diff(oldStr, newStr, options);
}
function dedupeWhitespaceInChangeObjects(startKeep, deletion, insertion, endKeep) {
  if (deletion && insertion) {
    var oldWsPrefix = deletion.value.match(/^\s*/)[0];
    var oldWsSuffix = deletion.value.match(/\s*$/)[0];
    var newWsPrefix = insertion.value.match(/^\s*/)[0];
    var newWsSuffix = insertion.value.match(/\s*$/)[0];
    if (startKeep) {
      var commonWsPrefix = longestCommonPrefix(oldWsPrefix, newWsPrefix);
      startKeep.value = replaceSuffix(startKeep.value, newWsPrefix, commonWsPrefix);
      deletion.value = removePrefix(deletion.value, commonWsPrefix);
      insertion.value = removePrefix(insertion.value, commonWsPrefix);
    }
    if (endKeep) {
      var commonWsSuffix = longestCommonSuffix(oldWsSuffix, newWsSuffix);
      endKeep.value = replacePrefix(endKeep.value, newWsSuffix, commonWsSuffix);
      deletion.value = removeSuffix(deletion.value, commonWsSuffix);
      insertion.value = removeSuffix(insertion.value, commonWsSuffix);
    }
  } else if (insertion) {
    if (startKeep) {
      insertion.value = insertion.value.replace(/^\s*/, "");
    }
    if (endKeep) {
      endKeep.value = endKeep.value.replace(/^\s*/, "");
    }
  } else if (startKeep && endKeep) {
    var newWsFull = endKeep.value.match(/^\s*/)[0], delWsStart = deletion.value.match(/^\s*/)[0], delWsEnd = deletion.value.match(/\s*$/)[0];
    var newWsStart = longestCommonPrefix(newWsFull, delWsStart);
    deletion.value = removePrefix(deletion.value, newWsStart);
    var newWsEnd = longestCommonSuffix(removePrefix(newWsFull, newWsStart), delWsEnd);
    deletion.value = removeSuffix(deletion.value, newWsEnd);
    endKeep.value = replacePrefix(endKeep.value, newWsFull, newWsEnd);
    startKeep.value = replaceSuffix(startKeep.value, newWsFull, newWsFull.slice(0, newWsFull.length - newWsEnd.length));
  } else if (endKeep) {
    var endKeepWsPrefix = endKeep.value.match(/^\s*/)[0];
    var deletionWsSuffix = deletion.value.match(/\s*$/)[0];
    var overlap = maximumOverlap(deletionWsSuffix, endKeepWsPrefix);
    deletion.value = removeSuffix(deletion.value, overlap);
  } else if (startKeep) {
    var startKeepWsSuffix = startKeep.value.match(/\s*$/)[0];
    var deletionWsPrefix = deletion.value.match(/^\s*/)[0];
    var _overlap = maximumOverlap(startKeepWsSuffix, deletionWsPrefix);
    deletion.value = removePrefix(deletion.value, _overlap);
  }
}
var wordWithSpaceDiff = new Diff();
wordWithSpaceDiff.tokenize = function(value) {
  var regex2 = new RegExp("(\\r?\\n)|[".concat(extendedWordChars, "]+|[^\\S\\n\\r]+|[^").concat(extendedWordChars, "]"), "ug");
  return value.match(regex2) || [];
};
function diffWordsWithSpace(oldStr, newStr, options) {
  return wordWithSpaceDiff.diff(oldStr, newStr, options);
}
function generateOptions(options, defaults) {
  if (typeof options === "function") {
    defaults.callback = options;
  } else if (options) {
    for (var name in options) {
      if (options.hasOwnProperty(name)) {
        defaults[name] = options[name];
      }
    }
  }
  return defaults;
}
var lineDiff = new Diff();
lineDiff.tokenize = function(value, options) {
  if (options.stripTrailingCr) {
    value = value.replace(/\r\n/g, "\n");
  }
  var retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  }
  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];
    if (i % 2 && !options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      retLines.push(line);
    }
  }
  return retLines;
};
lineDiff.equals = function(left, right, options) {
  if (options.ignoreWhitespace) {
    if (!options.newlineIsToken || !left.includes("\n")) {
      left = left.trim();
    }
    if (!options.newlineIsToken || !right.includes("\n")) {
      right = right.trim();
    }
  } else if (options.ignoreNewlineAtEof && !options.newlineIsToken) {
    if (left.endsWith("\n")) {
      left = left.slice(0, -1);
    }
    if (right.endsWith("\n")) {
      right = right.slice(0, -1);
    }
  }
  return Diff.prototype.equals.call(this, left, right, options);
};
function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}
function diffTrimmedLines(oldStr, newStr, callback) {
  var options = generateOptions(callback, {
    ignoreWhitespace: true
  });
  return lineDiff.diff(oldStr, newStr, options);
}
var sentenceDiff = new Diff();
sentenceDiff.tokenize = function(value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};
function diffSentences(oldStr, newStr, callback) {
  return sentenceDiff.diff(oldStr, newStr, callback);
}
var cssDiff = new Diff();
cssDiff.tokenize = function(value) {
  return value.split(/([{}:;,]|\s+)/);
};
function diffCss(oldStr, newStr, callback) {
  return cssDiff.diff(oldStr, newStr, callback);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function _defineProperty(obj, key2, value) {
  key2 = _toPropertyKey(key2);
  if (key2 in obj) {
    Object.defineProperty(obj, key2, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key2] = value;
  }
  return obj;
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var jsonDiff = new Diff();
jsonDiff.useLongestToken = true;
jsonDiff.tokenize = lineDiff.tokenize;
jsonDiff.castInput = function(value, options) {
  var undefinedReplacement = options.undefinedReplacement, _options$stringifyRep = options.stringifyReplacer, stringifyReplacer = _options$stringifyRep === void 0 ? function(k, v) {
    return typeof v === "undefined" ? undefinedReplacement : v;
  } : _options$stringifyRep;
  return typeof value === "string" ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, "  ");
};
jsonDiff.equals = function(left, right, options) {
  return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, "$1"), right.replace(/,([\r\n])/g, "$1"), options);
};
function diffJson(oldObj, newObj, options) {
  return jsonDiff.diff(oldObj, newObj, options);
}
function canonicalize(obj, stack, replacementStack, replacer, key2) {
  stack = stack || [];
  replacementStack = replacementStack || [];
  if (replacer) {
    obj = replacer(key2, obj);
  }
  var i;
  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  }
  var canonicalizedObj;
  if ("[object Array]" === Object.prototype.toString.call(obj)) {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);
    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key2);
    }
    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  }
  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  }
  if (_typeof(obj) === "object" && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);
    var sortedKeys = [], _key;
    for (_key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, _key)) {
        sortedKeys.push(_key);
      }
    }
    sortedKeys.sort();
    for (i = 0; i < sortedKeys.length; i += 1) {
      _key = sortedKeys[i];
      canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
    }
    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  }
  return canonicalizedObj;
}
var arrayDiff = new Diff();
arrayDiff.tokenize = function(value) {
  return value.slice();
};
arrayDiff.join = arrayDiff.removeEmpty = function(value) {
  return value;
};
function diffArrays(oldArr, newArr, callback) {
  return arrayDiff.diff(oldArr, newArr, callback);
}
function unixToWin(patch) {
  if (Array.isArray(patch)) {
    return patch.map(unixToWin);
  }
  return _objectSpread2(_objectSpread2({}, patch), {}, {
    hunks: patch.hunks.map(function(hunk) {
      return _objectSpread2(_objectSpread2({}, hunk), {}, {
        lines: hunk.lines.map(function(line, i) {
          var _hunk$lines;
          return line.startsWith("\\") || line.endsWith("\r") || (_hunk$lines = hunk.lines[i + 1]) !== null && _hunk$lines !== void 0 && _hunk$lines.startsWith("\\") ? line : line + "\r";
        })
      });
    })
  });
}
function winToUnix(patch) {
  if (Array.isArray(patch)) {
    return patch.map(winToUnix);
  }
  return _objectSpread2(_objectSpread2({}, patch), {}, {
    hunks: patch.hunks.map(function(hunk) {
      return _objectSpread2(_objectSpread2({}, hunk), {}, {
        lines: hunk.lines.map(function(line) {
          return line.endsWith("\r") ? line.substring(0, line.length - 1) : line;
        })
      });
    })
  });
}
function isUnix(patch) {
  if (!Array.isArray(patch)) {
    patch = [patch];
  }
  return !patch.some(function(index2) {
    return index2.hunks.some(function(hunk) {
      return hunk.lines.some(function(line) {
        return !line.startsWith("\\") && line.endsWith("\r");
      });
    });
  });
}
function isWin(patch) {
  if (!Array.isArray(patch)) {
    patch = [patch];
  }
  return patch.some(function(index2) {
    return index2.hunks.some(function(hunk) {
      return hunk.lines.some(function(line) {
        return line.endsWith("\r");
      });
    });
  }) && patch.every(function(index2) {
    return index2.hunks.every(function(hunk) {
      return hunk.lines.every(function(line, i) {
        var _hunk$lines2;
        return line.startsWith("\\") || line.endsWith("\r") || ((_hunk$lines2 = hunk.lines[i + 1]) === null || _hunk$lines2 === void 0 ? void 0 : _hunk$lines2.startsWith("\\"));
      });
    });
  });
}
function parsePatch(uniDiff) {
  var diffstr = uniDiff.split(/\n/), list = [], i = 0;
  function parseIndex() {
    var index2 = {};
    list.push(index2);
    while (i < diffstr.length) {
      var line = diffstr[i];
      if (/^(\-\-\-|\+\+\+|@@)\s/.test(line)) {
        break;
      }
      var header = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(line);
      if (header) {
        index2.index = header[1];
      }
      i++;
    }
    parseFileHeader(index2);
    parseFileHeader(index2);
    index2.hunks = [];
    while (i < diffstr.length) {
      var _line = diffstr[i];
      if (/^(Index:\s|diff\s|\-\-\-\s|\+\+\+\s|===================================================================)/.test(_line)) {
        break;
      } else if (/^@@/.test(_line)) {
        index2.hunks.push(parseHunk());
      } else if (_line) {
        throw new Error("Unknown line " + (i + 1) + " " + JSON.stringify(_line));
      } else {
        i++;
      }
    }
  }
  function parseFileHeader(index2) {
    var fileHeader = /^(---|\+\+\+)\s+(.*)\r?$/.exec(diffstr[i]);
    if (fileHeader) {
      var keyPrefix = fileHeader[1] === "---" ? "old" : "new";
      var data = fileHeader[2].split("	", 2);
      var fileName = data[0].replace(/\\\\/g, "\\");
      if (/^".*"$/.test(fileName)) {
        fileName = fileName.substr(1, fileName.length - 2);
      }
      index2[keyPrefix + "FileName"] = fileName;
      index2[keyPrefix + "Header"] = (data[1] || "").trim();
      i++;
    }
  }
  function parseHunk() {
    var chunkHeaderIndex = i, chunkHeaderLine = diffstr[i++], chunkHeader = chunkHeaderLine.split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    var hunk = {
      oldStart: +chunkHeader[1],
      oldLines: typeof chunkHeader[2] === "undefined" ? 1 : +chunkHeader[2],
      newStart: +chunkHeader[3],
      newLines: typeof chunkHeader[4] === "undefined" ? 1 : +chunkHeader[4],
      lines: []
    };
    if (hunk.oldLines === 0) {
      hunk.oldStart += 1;
    }
    if (hunk.newLines === 0) {
      hunk.newStart += 1;
    }
    var addCount = 0, removeCount = 0;
    for (; i < diffstr.length && (removeCount < hunk.oldLines || addCount < hunk.newLines || (_diffstr$i = diffstr[i]) !== null && _diffstr$i !== void 0 && _diffstr$i.startsWith("\\")); i++) {
      var _diffstr$i;
      var operation = diffstr[i].length == 0 && i != diffstr.length - 1 ? " " : diffstr[i][0];
      if (operation === "+" || operation === "-" || operation === " " || operation === "\\") {
        hunk.lines.push(diffstr[i]);
        if (operation === "+") {
          addCount++;
        } else if (operation === "-") {
          removeCount++;
        } else if (operation === " ") {
          addCount++;
          removeCount++;
        }
      } else {
        throw new Error("Hunk at line ".concat(chunkHeaderIndex + 1, " contained invalid line ").concat(diffstr[i]));
      }
    }
    if (!addCount && hunk.newLines === 1) {
      hunk.newLines = 0;
    }
    if (!removeCount && hunk.oldLines === 1) {
      hunk.oldLines = 0;
    }
    if (addCount !== hunk.newLines) {
      throw new Error("Added line count did not match for hunk at line " + (chunkHeaderIndex + 1));
    }
    if (removeCount !== hunk.oldLines) {
      throw new Error("Removed line count did not match for hunk at line " + (chunkHeaderIndex + 1));
    }
    return hunk;
  }
  while (i < diffstr.length) {
    parseIndex();
  }
  return list;
}
function distanceIterator(start, minLine, maxLine) {
  var wantForward = true, backwardExhausted = false, forwardExhausted = false, localOffset = 1;
  return function iterator() {
    if (wantForward && !forwardExhausted) {
      if (backwardExhausted) {
        localOffset++;
      } else {
        wantForward = false;
      }
      if (start + localOffset <= maxLine) {
        return start + localOffset;
      }
      forwardExhausted = true;
    }
    if (!backwardExhausted) {
      if (!forwardExhausted) {
        wantForward = true;
      }
      if (minLine <= start - localOffset) {
        return start - localOffset++;
      }
      backwardExhausted = true;
      return iterator();
    }
  };
}
function applyPatch(source, uniDiff) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  if (typeof uniDiff === "string") {
    uniDiff = parsePatch(uniDiff);
  }
  if (Array.isArray(uniDiff)) {
    if (uniDiff.length > 1) {
      throw new Error("applyPatch only works with a single input.");
    }
    uniDiff = uniDiff[0];
  }
  if (options.autoConvertLineEndings || options.autoConvertLineEndings == null) {
    if (hasOnlyWinLineEndings(source) && isUnix(uniDiff)) {
      uniDiff = unixToWin(uniDiff);
    } else if (hasOnlyUnixLineEndings(source) && isWin(uniDiff)) {
      uniDiff = winToUnix(uniDiff);
    }
  }
  var lines = source.split("\n"), hunks = uniDiff.hunks, compareLine = options.compareLine || function(lineNumber, line2, operation, patchContent) {
    return line2 === patchContent;
  }, fuzzFactor = options.fuzzFactor || 0, minLine = 0;
  if (fuzzFactor < 0 || !Number.isInteger(fuzzFactor)) {
    throw new Error("fuzzFactor must be a non-negative integer");
  }
  if (!hunks.length) {
    return source;
  }
  var prevLine = "", removeEOFNL = false, addEOFNL = false;
  for (var i = 0; i < hunks[hunks.length - 1].lines.length; i++) {
    var line = hunks[hunks.length - 1].lines[i];
    if (line[0] == "\\") {
      if (prevLine[0] == "+") {
        removeEOFNL = true;
      } else if (prevLine[0] == "-") {
        addEOFNL = true;
      }
    }
    prevLine = line;
  }
  if (removeEOFNL) {
    if (addEOFNL) {
      if (!fuzzFactor && lines[lines.length - 1] == "") {
        return false;
      }
    } else if (lines[lines.length - 1] == "") {
      lines.pop();
    } else if (!fuzzFactor) {
      return false;
    }
  } else if (addEOFNL) {
    if (lines[lines.length - 1] != "") {
      lines.push("");
    } else if (!fuzzFactor) {
      return false;
    }
  }
  function applyHunk(hunkLines, toPos2, maxErrors2) {
    var hunkLinesI = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
    var lastContextLineMatched = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
    var patchedLines = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : [];
    var patchedLinesLength = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : 0;
    var nConsecutiveOldContextLines = 0;
    var nextContextLineMustMatch = false;
    for (; hunkLinesI < hunkLines.length; hunkLinesI++) {
      var hunkLine = hunkLines[hunkLinesI], operation = hunkLine.length > 0 ? hunkLine[0] : " ", content = hunkLine.length > 0 ? hunkLine.substr(1) : hunkLine;
      if (operation === "-") {
        if (compareLine(toPos2 + 1, lines[toPos2], operation, content)) {
          toPos2++;
          nConsecutiveOldContextLines = 0;
        } else {
          if (!maxErrors2 || lines[toPos2] == null) {
            return null;
          }
          patchedLines[patchedLinesLength] = lines[toPos2];
          return applyHunk(hunkLines, toPos2 + 1, maxErrors2 - 1, hunkLinesI, false, patchedLines, patchedLinesLength + 1);
        }
      }
      if (operation === "+") {
        if (!lastContextLineMatched) {
          return null;
        }
        patchedLines[patchedLinesLength] = content;
        patchedLinesLength++;
        nConsecutiveOldContextLines = 0;
        nextContextLineMustMatch = true;
      }
      if (operation === " ") {
        nConsecutiveOldContextLines++;
        patchedLines[patchedLinesLength] = lines[toPos2];
        if (compareLine(toPos2 + 1, lines[toPos2], operation, content)) {
          patchedLinesLength++;
          lastContextLineMatched = true;
          nextContextLineMustMatch = false;
          toPos2++;
        } else {
          if (nextContextLineMustMatch || !maxErrors2) {
            return null;
          }
          return lines[toPos2] && (applyHunk(hunkLines, toPos2 + 1, maxErrors2 - 1, hunkLinesI + 1, false, patchedLines, patchedLinesLength + 1) || applyHunk(hunkLines, toPos2 + 1, maxErrors2 - 1, hunkLinesI, false, patchedLines, patchedLinesLength + 1)) || applyHunk(hunkLines, toPos2, maxErrors2 - 1, hunkLinesI + 1, false, patchedLines, patchedLinesLength);
        }
      }
    }
    patchedLinesLength -= nConsecutiveOldContextLines;
    toPos2 -= nConsecutiveOldContextLines;
    patchedLines.length = patchedLinesLength;
    return {
      patchedLines,
      oldLineLastI: toPos2 - 1
    };
  }
  var resultLines = [];
  var prevHunkOffset = 0;
  for (var _i = 0; _i < hunks.length; _i++) {
    var hunk = hunks[_i];
    var hunkResult = void 0;
    var maxLine = lines.length - hunk.oldLines + fuzzFactor;
    var toPos = void 0;
    for (var maxErrors = 0; maxErrors <= fuzzFactor; maxErrors++) {
      toPos = hunk.oldStart + prevHunkOffset - 1;
      var iterator = distanceIterator(toPos, minLine, maxLine);
      for (; toPos !== void 0; toPos = iterator()) {
        hunkResult = applyHunk(hunk.lines, toPos, maxErrors);
        if (hunkResult) {
          break;
        }
      }
      if (hunkResult) {
        break;
      }
    }
    if (!hunkResult) {
      return false;
    }
    for (var _i2 = minLine; _i2 < toPos; _i2++) {
      resultLines.push(lines[_i2]);
    }
    for (var _i3 = 0; _i3 < hunkResult.patchedLines.length; _i3++) {
      var _line = hunkResult.patchedLines[_i3];
      resultLines.push(_line);
    }
    minLine = hunkResult.oldLineLastI + 1;
    prevHunkOffset = toPos + 1 - hunk.oldStart;
  }
  for (var _i4 = minLine; _i4 < lines.length; _i4++) {
    resultLines.push(lines[_i4]);
  }
  return resultLines.join("\n");
}
function applyPatches(uniDiff, options) {
  if (typeof uniDiff === "string") {
    uniDiff = parsePatch(uniDiff);
  }
  var currentIndex = 0;
  function processIndex() {
    var index2 = uniDiff[currentIndex++];
    if (!index2) {
      return options.complete();
    }
    options.loadFile(index2, function(err, data) {
      if (err) {
        return options.complete(err);
      }
      var updatedContent = applyPatch(data, index2, options);
      options.patched(index2, updatedContent, function(err2) {
        if (err2) {
          return options.complete(err2);
        }
        processIndex();
      });
    });
  }
  processIndex();
}
function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  if (!options) {
    options = {};
  }
  if (typeof options === "function") {
    options = {
      callback: options
    };
  }
  if (typeof options.context === "undefined") {
    options.context = 4;
  }
  if (options.newlineIsToken) {
    throw new Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");
  }
  if (!options.callback) {
    return diffLinesResultToPatch(diffLines(oldStr, newStr, options));
  } else {
    var _options = options, _callback = _options.callback;
    diffLines(oldStr, newStr, _objectSpread2(_objectSpread2({}, options), {}, {
      callback: function callback(diff2) {
        var patch = diffLinesResultToPatch(diff2);
        _callback(patch);
      }
    }));
  }
  function diffLinesResultToPatch(diff2) {
    if (!diff2) {
      return;
    }
    diff2.push({
      value: "",
      lines: []
    });
    function contextLines(lines) {
      return lines.map(function(entry) {
        return " " + entry;
      });
    }
    var hunks = [];
    var oldRangeStart = 0, newRangeStart = 0, curRange = [], oldLine = 1, newLine = 1;
    var _loop = function _loop2() {
      var current = diff2[i], lines = current.lines || splitLines(current.value);
      current.lines = lines;
      if (current.added || current.removed) {
        var _curRange;
        if (!oldRangeStart) {
          var prev = diff2[i - 1];
          oldRangeStart = oldLine;
          newRangeStart = newLine;
          if (prev) {
            curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
            oldRangeStart -= curRange.length;
            newRangeStart -= curRange.length;
          }
        }
        (_curRange = curRange).push.apply(_curRange, _toConsumableArray(lines.map(function(entry) {
          return (current.added ? "+" : "-") + entry;
        })));
        if (current.added) {
          newLine += lines.length;
        } else {
          oldLine += lines.length;
        }
      } else {
        if (oldRangeStart) {
          if (lines.length <= options.context * 2 && i < diff2.length - 2) {
            var _curRange2;
            (_curRange2 = curRange).push.apply(_curRange2, _toConsumableArray(contextLines(lines)));
          } else {
            var _curRange3;
            var contextSize = Math.min(lines.length, options.context);
            (_curRange3 = curRange).push.apply(_curRange3, _toConsumableArray(contextLines(lines.slice(0, contextSize))));
            var _hunk = {
              oldStart: oldRangeStart,
              oldLines: oldLine - oldRangeStart + contextSize,
              newStart: newRangeStart,
              newLines: newLine - newRangeStart + contextSize,
              lines: curRange
            };
            hunks.push(_hunk);
            oldRangeStart = 0;
            newRangeStart = 0;
            curRange = [];
          }
        }
        oldLine += lines.length;
        newLine += lines.length;
      }
    };
    for (var i = 0; i < diff2.length; i++) {
      _loop();
    }
    for (var _i = 0, _hunks = hunks; _i < _hunks.length; _i++) {
      var hunk = _hunks[_i];
      for (var _i2 = 0; _i2 < hunk.lines.length; _i2++) {
        if (hunk.lines[_i2].endsWith("\n")) {
          hunk.lines[_i2] = hunk.lines[_i2].slice(0, -1);
        } else {
          hunk.lines.splice(_i2 + 1, 0, "\\ No newline at end of file");
          _i2++;
        }
      }
    }
    return {
      oldFileName,
      newFileName,
      oldHeader,
      newHeader,
      hunks
    };
  }
}
function formatPatch(diff2) {
  if (Array.isArray(diff2)) {
    return diff2.map(formatPatch).join("\n");
  }
  var ret = [];
  if (diff2.oldFileName == diff2.newFileName) {
    ret.push("Index: " + diff2.oldFileName);
  }
  ret.push("===================================================================");
  ret.push("--- " + diff2.oldFileName + (typeof diff2.oldHeader === "undefined" ? "" : "	" + diff2.oldHeader));
  ret.push("+++ " + diff2.newFileName + (typeof diff2.newHeader === "undefined" ? "" : "	" + diff2.newHeader));
  for (var i = 0; i < diff2.hunks.length; i++) {
    var hunk = diff2.hunks[i];
    if (hunk.oldLines === 0) {
      hunk.oldStart -= 1;
    }
    if (hunk.newLines === 0) {
      hunk.newStart -= 1;
    }
    ret.push("@@ -" + hunk.oldStart + "," + hunk.oldLines + " +" + hunk.newStart + "," + hunk.newLines + " @@");
    ret.push.apply(ret, hunk.lines);
  }
  return ret.join("\n") + "\n";
}
function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  var _options2;
  if (typeof options === "function") {
    options = {
      callback: options
    };
  }
  if (!((_options2 = options) !== null && _options2 !== void 0 && _options2.callback)) {
    var patchObj = structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options);
    if (!patchObj) {
      return;
    }
    return formatPatch(patchObj);
  } else {
    var _options3 = options, _callback2 = _options3.callback;
    structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, _objectSpread2(_objectSpread2({}, options), {}, {
      callback: function callback(patchObj2) {
        if (!patchObj2) {
          _callback2();
        } else {
          _callback2(formatPatch(patchObj2));
        }
      }
    }));
  }
}
function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
  return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
}
function splitLines(text) {
  var hasTrailingNl = text.endsWith("\n");
  var result = text.split("\n").map(function(line) {
    return line + "\n";
  });
  if (hasTrailingNl) {
    result.pop();
  } else {
    result.push(result.pop().slice(0, -1));
  }
  return result;
}
function arrayEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  return arrayStartsWith(a, b);
}
function arrayStartsWith(array, start) {
  if (start.length > array.length) {
    return false;
  }
  for (var i = 0; i < start.length; i++) {
    if (start[i] !== array[i]) {
      return false;
    }
  }
  return true;
}
function calcLineCount(hunk) {
  var _calcOldNewLineCount = calcOldNewLineCount(hunk.lines), oldLines = _calcOldNewLineCount.oldLines, newLines = _calcOldNewLineCount.newLines;
  if (oldLines !== void 0) {
    hunk.oldLines = oldLines;
  } else {
    delete hunk.oldLines;
  }
  if (newLines !== void 0) {
    hunk.newLines = newLines;
  } else {
    delete hunk.newLines;
  }
}
function merge(mine, theirs, base) {
  mine = loadPatch(mine, base);
  theirs = loadPatch(theirs, base);
  var ret = {};
  if (mine.index || theirs.index) {
    ret.index = mine.index || theirs.index;
  }
  if (mine.newFileName || theirs.newFileName) {
    if (!fileNameChanged(mine)) {
      ret.oldFileName = theirs.oldFileName || mine.oldFileName;
      ret.newFileName = theirs.newFileName || mine.newFileName;
      ret.oldHeader = theirs.oldHeader || mine.oldHeader;
      ret.newHeader = theirs.newHeader || mine.newHeader;
    } else if (!fileNameChanged(theirs)) {
      ret.oldFileName = mine.oldFileName;
      ret.newFileName = mine.newFileName;
      ret.oldHeader = mine.oldHeader;
      ret.newHeader = mine.newHeader;
    } else {
      ret.oldFileName = selectField(ret, mine.oldFileName, theirs.oldFileName);
      ret.newFileName = selectField(ret, mine.newFileName, theirs.newFileName);
      ret.oldHeader = selectField(ret, mine.oldHeader, theirs.oldHeader);
      ret.newHeader = selectField(ret, mine.newHeader, theirs.newHeader);
    }
  }
  ret.hunks = [];
  var mineIndex = 0, theirsIndex = 0, mineOffset = 0, theirsOffset = 0;
  while (mineIndex < mine.hunks.length || theirsIndex < theirs.hunks.length) {
    var mineCurrent = mine.hunks[mineIndex] || {
      oldStart: Infinity
    }, theirsCurrent = theirs.hunks[theirsIndex] || {
      oldStart: Infinity
    };
    if (hunkBefore(mineCurrent, theirsCurrent)) {
      ret.hunks.push(cloneHunk(mineCurrent, mineOffset));
      mineIndex++;
      theirsOffset += mineCurrent.newLines - mineCurrent.oldLines;
    } else if (hunkBefore(theirsCurrent, mineCurrent)) {
      ret.hunks.push(cloneHunk(theirsCurrent, theirsOffset));
      theirsIndex++;
      mineOffset += theirsCurrent.newLines - theirsCurrent.oldLines;
    } else {
      var mergedHunk = {
        oldStart: Math.min(mineCurrent.oldStart, theirsCurrent.oldStart),
        oldLines: 0,
        newStart: Math.min(mineCurrent.newStart + mineOffset, theirsCurrent.oldStart + theirsOffset),
        newLines: 0,
        lines: []
      };
      mergeLines(mergedHunk, mineCurrent.oldStart, mineCurrent.lines, theirsCurrent.oldStart, theirsCurrent.lines);
      theirsIndex++;
      mineIndex++;
      ret.hunks.push(mergedHunk);
    }
  }
  return ret;
}
function loadPatch(param, base) {
  if (typeof param === "string") {
    if (/^@@/m.test(param) || /^Index:/m.test(param)) {
      return parsePatch(param)[0];
    }
    if (!base) {
      throw new Error("Must provide a base reference or pass in a patch");
    }
    return structuredPatch(void 0, void 0, base, param);
  }
  return param;
}
function fileNameChanged(patch) {
  return patch.newFileName && patch.newFileName !== patch.oldFileName;
}
function selectField(index2, mine, theirs) {
  if (mine === theirs) {
    return mine;
  } else {
    index2.conflict = true;
    return {
      mine,
      theirs
    };
  }
}
function hunkBefore(test, check) {
  return test.oldStart < check.oldStart && test.oldStart + test.oldLines < check.oldStart;
}
function cloneHunk(hunk, offset) {
  return {
    oldStart: hunk.oldStart,
    oldLines: hunk.oldLines,
    newStart: hunk.newStart + offset,
    newLines: hunk.newLines,
    lines: hunk.lines
  };
}
function mergeLines(hunk, mineOffset, mineLines, theirOffset, theirLines) {
  var mine = {
    offset: mineOffset,
    lines: mineLines,
    index: 0
  }, their = {
    offset: theirOffset,
    lines: theirLines,
    index: 0
  };
  insertLeading(hunk, mine, their);
  insertLeading(hunk, their, mine);
  while (mine.index < mine.lines.length && their.index < their.lines.length) {
    var mineCurrent = mine.lines[mine.index], theirCurrent = their.lines[their.index];
    if ((mineCurrent[0] === "-" || mineCurrent[0] === "+") && (theirCurrent[0] === "-" || theirCurrent[0] === "+")) {
      mutualChange(hunk, mine, their);
    } else if (mineCurrent[0] === "+" && theirCurrent[0] === " ") {
      var _hunk$lines;
      (_hunk$lines = hunk.lines).push.apply(_hunk$lines, _toConsumableArray(collectChange(mine)));
    } else if (theirCurrent[0] === "+" && mineCurrent[0] === " ") {
      var _hunk$lines2;
      (_hunk$lines2 = hunk.lines).push.apply(_hunk$lines2, _toConsumableArray(collectChange(their)));
    } else if (mineCurrent[0] === "-" && theirCurrent[0] === " ") {
      removal(hunk, mine, their);
    } else if (theirCurrent[0] === "-" && mineCurrent[0] === " ") {
      removal(hunk, their, mine, true);
    } else if (mineCurrent === theirCurrent) {
      hunk.lines.push(mineCurrent);
      mine.index++;
      their.index++;
    } else {
      conflict(hunk, collectChange(mine), collectChange(their));
    }
  }
  insertTrailing(hunk, mine);
  insertTrailing(hunk, their);
  calcLineCount(hunk);
}
function mutualChange(hunk, mine, their) {
  var myChanges = collectChange(mine), theirChanges = collectChange(their);
  if (allRemoves(myChanges) && allRemoves(theirChanges)) {
    if (arrayStartsWith(myChanges, theirChanges) && skipRemoveSuperset(their, myChanges, myChanges.length - theirChanges.length)) {
      var _hunk$lines3;
      (_hunk$lines3 = hunk.lines).push.apply(_hunk$lines3, _toConsumableArray(myChanges));
      return;
    } else if (arrayStartsWith(theirChanges, myChanges) && skipRemoveSuperset(mine, theirChanges, theirChanges.length - myChanges.length)) {
      var _hunk$lines4;
      (_hunk$lines4 = hunk.lines).push.apply(_hunk$lines4, _toConsumableArray(theirChanges));
      return;
    }
  } else if (arrayEqual(myChanges, theirChanges)) {
    var _hunk$lines5;
    (_hunk$lines5 = hunk.lines).push.apply(_hunk$lines5, _toConsumableArray(myChanges));
    return;
  }
  conflict(hunk, myChanges, theirChanges);
}
function removal(hunk, mine, their, swap) {
  var myChanges = collectChange(mine), theirChanges = collectContext(their, myChanges);
  if (theirChanges.merged) {
    var _hunk$lines6;
    (_hunk$lines6 = hunk.lines).push.apply(_hunk$lines6, _toConsumableArray(theirChanges.merged));
  } else {
    conflict(hunk, swap ? theirChanges : myChanges, swap ? myChanges : theirChanges);
  }
}
function conflict(hunk, mine, their) {
  hunk.conflict = true;
  hunk.lines.push({
    conflict: true,
    mine,
    theirs: their
  });
}
function insertLeading(hunk, insert, their) {
  while (insert.offset < their.offset && insert.index < insert.lines.length) {
    var line = insert.lines[insert.index++];
    hunk.lines.push(line);
    insert.offset++;
  }
}
function insertTrailing(hunk, insert) {
  while (insert.index < insert.lines.length) {
    var line = insert.lines[insert.index++];
    hunk.lines.push(line);
  }
}
function collectChange(state) {
  var ret = [], operation = state.lines[state.index][0];
  while (state.index < state.lines.length) {
    var line = state.lines[state.index];
    if (operation === "-" && line[0] === "+") {
      operation = "+";
    }
    if (operation === line[0]) {
      ret.push(line);
      state.index++;
    } else {
      break;
    }
  }
  return ret;
}
function collectContext(state, matchChanges) {
  var changes = [], merged = [], matchIndex = 0, contextChanges = false, conflicted = false;
  while (matchIndex < matchChanges.length && state.index < state.lines.length) {
    var change = state.lines[state.index], match = matchChanges[matchIndex];
    if (match[0] === "+") {
      break;
    }
    contextChanges = contextChanges || change[0] !== " ";
    merged.push(match);
    matchIndex++;
    if (change[0] === "+") {
      conflicted = true;
      while (change[0] === "+") {
        changes.push(change);
        change = state.lines[++state.index];
      }
    }
    if (match.substr(1) === change.substr(1)) {
      changes.push(change);
      state.index++;
    } else {
      conflicted = true;
    }
  }
  if ((matchChanges[matchIndex] || "")[0] === "+" && contextChanges) {
    conflicted = true;
  }
  if (conflicted) {
    return changes;
  }
  while (matchIndex < matchChanges.length) {
    merged.push(matchChanges[matchIndex++]);
  }
  return {
    merged,
    changes
  };
}
function allRemoves(changes) {
  return changes.reduce(function(prev, change) {
    return prev && change[0] === "-";
  }, true);
}
function skipRemoveSuperset(state, removeChanges, delta) {
  for (var i = 0; i < delta; i++) {
    var changeContent = removeChanges[removeChanges.length - delta + i].substr(1);
    if (state.lines[state.index + i] !== " " + changeContent) {
      return false;
    }
  }
  state.index += delta;
  return true;
}
function calcOldNewLineCount(lines) {
  var oldLines = 0;
  var newLines = 0;
  lines.forEach(function(line) {
    if (typeof line !== "string") {
      var myCount = calcOldNewLineCount(line.mine);
      var theirCount = calcOldNewLineCount(line.theirs);
      if (oldLines !== void 0) {
        if (myCount.oldLines === theirCount.oldLines) {
          oldLines += myCount.oldLines;
        } else {
          oldLines = void 0;
        }
      }
      if (newLines !== void 0) {
        if (myCount.newLines === theirCount.newLines) {
          newLines += myCount.newLines;
        } else {
          newLines = void 0;
        }
      }
    } else {
      if (newLines !== void 0 && (line[0] === "+" || line[0] === " ")) {
        newLines++;
      }
      if (oldLines !== void 0 && (line[0] === "-" || line[0] === " ")) {
        oldLines++;
      }
    }
  });
  return {
    oldLines,
    newLines
  };
}
function reversePatch(structuredPatch2) {
  if (Array.isArray(structuredPatch2)) {
    return structuredPatch2.map(reversePatch).reverse();
  }
  return _objectSpread2(_objectSpread2({}, structuredPatch2), {}, {
    oldFileName: structuredPatch2.newFileName,
    oldHeader: structuredPatch2.newHeader,
    newFileName: structuredPatch2.oldFileName,
    newHeader: structuredPatch2.oldHeader,
    hunks: structuredPatch2.hunks.map(function(hunk) {
      return {
        oldLines: hunk.newLines,
        oldStart: hunk.newStart,
        newLines: hunk.oldLines,
        newStart: hunk.oldStart,
        lines: hunk.lines.map(function(l) {
          if (l.startsWith("-")) {
            return "+".concat(l.slice(1));
          }
          if (l.startsWith("+")) {
            return "-".concat(l.slice(1));
          }
          return l;
        })
      };
    })
  });
}
function convertChangesToDMP(changes) {
  var ret = [], change, operation;
  for (var i = 0; i < changes.length; i++) {
    change = changes[i];
    if (change.added) {
      operation = 1;
    } else if (change.removed) {
      operation = -1;
    } else {
      operation = 0;
    }
    ret.push([operation, change.value]);
  }
  return ret;
}
function convertChangesToXML(changes) {
  var ret = [];
  for (var i = 0; i < changes.length; i++) {
    var change = changes[i];
    if (change.added) {
      ret.push("<ins>");
    } else if (change.removed) {
      ret.push("<del>");
    }
    ret.push(escapeHTML(change.value));
    if (change.added) {
      ret.push("</ins>");
    } else if (change.removed) {
      ret.push("</del>");
    }
  }
  return ret.join("");
}
function escapeHTML(s) {
  var n = s;
  n = n.replace(/&/g, "&amp;");
  n = n.replace(/</g, "&lt;");
  n = n.replace(/>/g, "&gt;");
  n = n.replace(/"/g, "&quot;");
  return n;
}
const Diff$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Diff,
  applyPatch,
  applyPatches,
  canonicalize,
  convertChangesToDMP,
  convertChangesToXML,
  createPatch,
  createTwoFilesPatch,
  diffArrays,
  diffChars,
  diffCss,
  diffJson,
  diffLines,
  diffSentences,
  diffTrimmedLines,
  diffWords,
  diffWordsWithSpace,
  formatPatch,
  merge,
  parsePatch,
  reversePatch,
  structuredPatch
}, Symbol.toStringTag, { value: "Module" }));
function levenshtein(a, b) {
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }
  const matrix = [];
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
      }
    }
  }
  return matrix[b.length][a.length];
}
function newDistanceFn(str) {
  return (x, y) => {
    const xValue = str(x).trim();
    const yValue = str(y).trim();
    const lev = levenshtein(xValue, yValue);
    return lev / (xValue.length + yValue.length);
  };
}
function newMatcherFn(distance2) {
  function findBestMatch(a, b, cache = /* @__PURE__ */ new Map()) {
    let bestMatchDist = Infinity;
    let bestMatch;
    for (let i = 0; i < a.length; ++i) {
      for (let j = 0; j < b.length; ++j) {
        const cacheKey = JSON.stringify([a[i], b[j]]);
        let md;
        if (!(cache.has(cacheKey) && (md = cache.get(cacheKey)))) {
          md = distance2(a[i], b[j]);
          cache.set(cacheKey, md);
        }
        if (md < bestMatchDist) {
          bestMatchDist = md;
          bestMatch = { indexA: i, indexB: j, score: bestMatchDist };
        }
      }
    }
    return bestMatch;
  }
  function group(a, b, level = 0, cache = /* @__PURE__ */ new Map()) {
    const bm = findBestMatch(a, b, cache);
    if (!bm || a.length + b.length < 3) {
      return [[a, b]];
    }
    const a1 = a.slice(0, bm.indexA);
    const b1 = b.slice(0, bm.indexB);
    const aMatch = [a[bm.indexA]];
    const bMatch = [b[bm.indexB]];
    const tailA = bm.indexA + 1;
    const tailB = bm.indexB + 1;
    const a2 = a.slice(tailA);
    const b2 = b.slice(tailB);
    const group1 = group(a1, b1, level + 1, cache);
    const groupMatch = group(aMatch, bMatch, level + 1, cache);
    const group2 = group(a2, b2, level + 1, cache);
    let result = groupMatch;
    if (bm.indexA > 0 || bm.indexB > 0) {
      result = group1.concat(result);
    }
    if (a.length > tailA || b.length > tailB) {
      result = result.concat(group2);
    }
    return result;
  }
  return group;
}
const CSSLineClass = {
  INSERTS: "d2h-ins",
  DELETES: "d2h-del",
  CONTEXT: "d2h-cntx",
  INFO: "d2h-info",
  INSERT_CHANGES: "d2h-ins d2h-change",
  DELETE_CHANGES: "d2h-del d2h-change"
};
const defaultRenderConfig = {
  matching: LineMatchingType.NONE,
  matchWordsThreshold: 0.25,
  maxLineLengthHighlight: 1e4,
  diffStyle: DiffStyleType.WORD,
  colorScheme: ColorSchemeType.LIGHT
};
const separator = "/";
const distance = newDistanceFn((change) => change.value);
const matcher = newMatcherFn(distance);
function isDevNullName(name) {
  return name.indexOf("dev/null") !== -1;
}
function removeInsElements(line) {
  return line.replace(/(<ins[^>]*>((.|\n)*?)<\/ins>)/g, "");
}
function removeDelElements(line) {
  return line.replace(/(<del[^>]*>((.|\n)*?)<\/del>)/g, "");
}
function toCSSClass(lineType) {
  switch (lineType) {
    case LineType.CONTEXT:
      return CSSLineClass.CONTEXT;
    case LineType.INSERT:
      return CSSLineClass.INSERTS;
    case LineType.DELETE:
      return CSSLineClass.DELETES;
  }
}
function colorSchemeToCss(colorScheme) {
  switch (colorScheme) {
    case ColorSchemeType.DARK:
      return "d2h-dark-color-scheme";
    case ColorSchemeType.AUTO:
      return "d2h-auto-color-scheme";
    case ColorSchemeType.LIGHT:
    default:
      return "d2h-light-color-scheme";
  }
}
function prefixLength(isCombined) {
  return isCombined ? 2 : 1;
}
function escapeForHtml(str) {
  return str.slice(0).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
}
function deconstructLine(line, isCombined, escape = true) {
  const indexToSplit = prefixLength(isCombined);
  return {
    prefix: line.substring(0, indexToSplit),
    content: escape ? escapeForHtml(line.substring(indexToSplit)) : line.substring(indexToSplit)
  };
}
function filenameDiff(file) {
  const oldFilename = unifyPath(file.oldName);
  const newFilename = unifyPath(file.newName);
  if (oldFilename !== newFilename && !isDevNullName(oldFilename) && !isDevNullName(newFilename)) {
    const prefixPaths = [];
    const suffixPaths = [];
    const oldFilenameParts = oldFilename.split(separator);
    const newFilenameParts = newFilename.split(separator);
    const oldFilenamePartsSize = oldFilenameParts.length;
    const newFilenamePartsSize = newFilenameParts.length;
    let i = 0;
    let j = oldFilenamePartsSize - 1;
    let k = newFilenamePartsSize - 1;
    while (i < j && i < k) {
      if (oldFilenameParts[i] === newFilenameParts[i]) {
        prefixPaths.push(newFilenameParts[i]);
        i += 1;
      } else {
        break;
      }
    }
    while (j > i && k > i) {
      if (oldFilenameParts[j] === newFilenameParts[k]) {
        suffixPaths.unshift(newFilenameParts[k]);
        j -= 1;
        k -= 1;
      } else {
        break;
      }
    }
    const finalPrefix = prefixPaths.join(separator);
    const finalSuffix = suffixPaths.join(separator);
    const oldRemainingPath = oldFilenameParts.slice(i, j + 1).join(separator);
    const newRemainingPath = newFilenameParts.slice(i, k + 1).join(separator);
    if (finalPrefix.length && finalSuffix.length) {
      return finalPrefix + separator + "{" + oldRemainingPath + " \u2192 " + newRemainingPath + "}" + separator + finalSuffix;
    } else if (finalPrefix.length) {
      return finalPrefix + separator + "{" + oldRemainingPath + " \u2192 " + newRemainingPath + "}";
    } else if (finalSuffix.length) {
      return "{" + oldRemainingPath + " \u2192 " + newRemainingPath + "}" + separator + finalSuffix;
    }
    return oldFilename + " \u2192 " + newFilename;
  } else if (!isDevNullName(newFilename)) {
    return newFilename;
  } else {
    return oldFilename;
  }
}
function getHtmlId(file) {
  return `d2h-${hashCode(filenameDiff(file)).toString().slice(-6)}`;
}
function getFileIcon(file) {
  let templateName = "file-changed";
  if (file.isRename) {
    templateName = "file-renamed";
  } else if (file.isCopy) {
    templateName = "file-renamed";
  } else if (file.isNew) {
    templateName = "file-added";
  } else if (file.isDeleted) {
    templateName = "file-deleted";
  } else if (file.newName !== file.oldName) {
    templateName = "file-renamed";
  }
  return templateName;
}
function diffHighlight(diffLine1, diffLine2, isCombined, config = {}) {
  const { matching, maxLineLengthHighlight, matchWordsThreshold, diffStyle } = Object.assign(Object.assign({}, defaultRenderConfig), config);
  const line1 = deconstructLine(diffLine1, isCombined, false);
  const line2 = deconstructLine(diffLine2, isCombined, false);
  if (line1.content.length > maxLineLengthHighlight || line2.content.length > maxLineLengthHighlight) {
    return {
      oldLine: {
        prefix: line1.prefix,
        content: escapeForHtml(line1.content)
      },
      newLine: {
        prefix: line2.prefix,
        content: escapeForHtml(line2.content)
      }
    };
  }
  const diff2 = diffStyle === "char" ? diffChars(line1.content, line2.content) : diffWordsWithSpace(line1.content, line2.content);
  const changedWords = [];
  if (diffStyle === "word" && matching === "words") {
    const removed = diff2.filter((element) => element.removed);
    const added = diff2.filter((element) => element.added);
    const chunks = matcher(added, removed);
    chunks.forEach((chunk) => {
      if (chunk[0].length === 1 && chunk[1].length === 1) {
        const dist = distance(chunk[0][0], chunk[1][0]);
        if (dist < matchWordsThreshold) {
          changedWords.push(chunk[0][0]);
          changedWords.push(chunk[1][0]);
        }
      }
    });
  }
  const highlightedLine = diff2.reduce((highlightedLine2, part) => {
    const elemType = part.added ? "ins" : part.removed ? "del" : null;
    const addClass = changedWords.indexOf(part) > -1 ? ' class="d2h-change"' : "";
    const escapedValue = escapeForHtml(part.value);
    return elemType !== null ? `${highlightedLine2}<${elemType}${addClass}>${escapedValue}</${elemType}>` : `${highlightedLine2}${escapedValue}`;
  }, "");
  return {
    oldLine: {
      prefix: line1.prefix,
      content: removeInsElements(highlightedLine)
    },
    newLine: {
      prefix: line2.prefix,
      content: removeDelElements(highlightedLine)
    }
  };
}
const baseTemplatesPath$2 = "file-summary";
const iconsBaseTemplatesPath$2 = "icon";
const defaultFileListRendererConfig = {
  colorScheme: defaultRenderConfig.colorScheme
};
class FileListRenderer {
  constructor(hoganUtils, config = {}) {
    this.hoganUtils = hoganUtils;
    this.config = Object.assign(Object.assign({}, defaultFileListRendererConfig), config);
  }
  render(diffFiles) {
    const files = diffFiles.map((file) => this.hoganUtils.render(baseTemplatesPath$2, "line", {
      fileHtmlId: getHtmlId(file),
      oldName: file.oldName,
      newName: file.newName,
      fileName: filenameDiff(file),
      deletedLines: "-" + file.deletedLines,
      addedLines: "+" + file.addedLines
    }, {
      fileIcon: this.hoganUtils.template(iconsBaseTemplatesPath$2, getFileIcon(file))
    })).join("\n");
    return this.hoganUtils.render(baseTemplatesPath$2, "wrapper", {
      colorScheme: colorSchemeToCss(this.config.colorScheme),
      filesNumber: diffFiles.length,
      files
    });
  }
}
const defaultLineByLineRendererConfig = Object.assign(Object.assign({}, defaultRenderConfig), { renderNothingWhenEmpty: false, matchingMaxComparisons: 2500, maxLineSizeInBlockForComparison: 200 });
const genericTemplatesPath$1 = "generic";
const baseTemplatesPath$1 = "line-by-line";
const iconsBaseTemplatesPath$1 = "icon";
const tagsBaseTemplatesPath$1 = "tag";
class LineByLineRenderer {
  constructor(hoganUtils, config = {}) {
    this.hoganUtils = hoganUtils;
    this.config = Object.assign(Object.assign({}, defaultLineByLineRendererConfig), config);
  }
  render(diffFiles) {
    const diffsHtml = diffFiles.map((file) => {
      let diffs;
      if (file.blocks.length) {
        diffs = this.generateFileHtml(file);
      } else {
        diffs = this.generateEmptyDiff();
      }
      return this.makeFileDiffHtml(file, diffs);
    }).join("\n");
    return this.hoganUtils.render(genericTemplatesPath$1, "wrapper", {
      colorScheme: colorSchemeToCss(this.config.colorScheme),
      content: diffsHtml
    });
  }
  makeFileDiffHtml(file, diffs) {
    if (this.config.renderNothingWhenEmpty && Array.isArray(file.blocks) && file.blocks.length === 0)
      return "";
    const fileDiffTemplate = this.hoganUtils.template(baseTemplatesPath$1, "file-diff");
    const filePathTemplate = this.hoganUtils.template(genericTemplatesPath$1, "file-path");
    const fileIconTemplate = this.hoganUtils.template(iconsBaseTemplatesPath$1, "file");
    const fileTagTemplate = this.hoganUtils.template(tagsBaseTemplatesPath$1, getFileIcon(file));
    return fileDiffTemplate.render({
      file,
      fileHtmlId: getHtmlId(file),
      diffs,
      filePath: filePathTemplate.render({
        fileDiffName: filenameDiff(file)
      }, {
        fileIcon: fileIconTemplate,
        fileTag: fileTagTemplate
      })
    });
  }
  generateEmptyDiff() {
    return this.hoganUtils.render(genericTemplatesPath$1, "empty-diff", {
      contentClass: "d2h-code-line",
      CSSLineClass
    });
  }
  generateFileHtml(file) {
    const matcher2 = newMatcherFn(newDistanceFn((e) => deconstructLine(e.content, file.isCombined).content));
    return file.blocks.map((block) => {
      let lines = this.hoganUtils.render(genericTemplatesPath$1, "block-header", {
        CSSLineClass,
        blockHeader: file.isTooBig ? block.header : escapeForHtml(block.header),
        lineClass: "d2h-code-linenumber",
        contentClass: "d2h-code-line"
      });
      this.applyLineGroupping(block).forEach(([contextLines, oldLines, newLines]) => {
        if (oldLines.length && newLines.length && !contextLines.length) {
          this.applyRematchMatching(oldLines, newLines, matcher2).map(([oldLines2, newLines2]) => {
            const { left, right } = this.processChangedLines(file, file.isCombined, oldLines2, newLines2);
            lines += left;
            lines += right;
          });
        } else if (contextLines.length) {
          contextLines.forEach((line) => {
            const { prefix, content } = deconstructLine(line.content, file.isCombined);
            lines += this.generateSingleLineHtml(file, {
              type: CSSLineClass.CONTEXT,
              prefix,
              content,
              oldNumber: line.oldNumber,
              newNumber: line.newNumber
            });
          });
        } else if (oldLines.length || newLines.length) {
          const { left, right } = this.processChangedLines(file, file.isCombined, oldLines, newLines);
          lines += left;
          lines += right;
        } else {
          console.error("Unknown state reached while processing groups of lines", contextLines, oldLines, newLines);
        }
      });
      return lines;
    }).join("\n");
  }
  applyLineGroupping(block) {
    const blockLinesGroups = [];
    let oldLines = [];
    let newLines = [];
    for (let i = 0; i < block.lines.length; i++) {
      const diffLine = block.lines[i];
      if (diffLine.type !== LineType.INSERT && newLines.length || diffLine.type === LineType.CONTEXT && oldLines.length > 0) {
        blockLinesGroups.push([[], oldLines, newLines]);
        oldLines = [];
        newLines = [];
      }
      if (diffLine.type === LineType.CONTEXT) {
        blockLinesGroups.push([[diffLine], [], []]);
      } else if (diffLine.type === LineType.INSERT && oldLines.length === 0) {
        blockLinesGroups.push([[], [], [diffLine]]);
      } else if (diffLine.type === LineType.INSERT && oldLines.length > 0) {
        newLines.push(diffLine);
      } else if (diffLine.type === LineType.DELETE) {
        oldLines.push(diffLine);
      }
    }
    if (oldLines.length || newLines.length) {
      blockLinesGroups.push([[], oldLines, newLines]);
      oldLines = [];
      newLines = [];
    }
    return blockLinesGroups;
  }
  applyRematchMatching(oldLines, newLines, matcher2) {
    const comparisons = oldLines.length * newLines.length;
    const maxLineSizeInBlock = max(oldLines.concat(newLines).map((elem) => elem.content.length));
    const doMatching = comparisons < this.config.matchingMaxComparisons && maxLineSizeInBlock < this.config.maxLineSizeInBlockForComparison && (this.config.matching === "lines" || this.config.matching === "words");
    return doMatching ? matcher2(oldLines, newLines) : [[oldLines, newLines]];
  }
  processChangedLines(file, isCombined, oldLines, newLines) {
    const fileHtml = {
      right: "",
      left: ""
    };
    const maxLinesNumber = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLinesNumber; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];
      const diff2 = oldLine !== void 0 && newLine !== void 0 ? diffHighlight(oldLine.content, newLine.content, isCombined, this.config) : void 0;
      const preparedOldLine = oldLine !== void 0 && oldLine.oldNumber !== void 0 ? Object.assign(Object.assign({}, diff2 !== void 0 ? {
        prefix: diff2.oldLine.prefix,
        content: diff2.oldLine.content,
        type: CSSLineClass.DELETE_CHANGES
      } : Object.assign(Object.assign({}, deconstructLine(oldLine.content, isCombined)), { type: toCSSClass(oldLine.type) })), { oldNumber: oldLine.oldNumber, newNumber: oldLine.newNumber }) : void 0;
      const preparedNewLine = newLine !== void 0 && newLine.newNumber !== void 0 ? Object.assign(Object.assign({}, diff2 !== void 0 ? {
        prefix: diff2.newLine.prefix,
        content: diff2.newLine.content,
        type: CSSLineClass.INSERT_CHANGES
      } : Object.assign(Object.assign({}, deconstructLine(newLine.content, isCombined)), { type: toCSSClass(newLine.type) })), { oldNumber: newLine.oldNumber, newNumber: newLine.newNumber }) : void 0;
      const { left, right } = this.generateLineHtml(file, preparedOldLine, preparedNewLine);
      fileHtml.left += left;
      fileHtml.right += right;
    }
    return fileHtml;
  }
  generateLineHtml(file, oldLine, newLine) {
    return {
      left: this.generateSingleLineHtml(file, oldLine),
      right: this.generateSingleLineHtml(file, newLine)
    };
  }
  generateSingleLineHtml(file, line) {
    if (line === void 0)
      return "";
    const lineNumberHtml = this.hoganUtils.render(baseTemplatesPath$1, "numbers", {
      oldNumber: line.oldNumber || "",
      newNumber: line.newNumber || ""
    });
    return this.hoganUtils.render(genericTemplatesPath$1, "line", {
      type: line.type,
      lineClass: "d2h-code-linenumber",
      contentClass: "d2h-code-line",
      prefix: line.prefix === " " ? "&nbsp;" : line.prefix,
      content: line.content,
      lineNumber: lineNumberHtml,
      line,
      file
    });
  }
}
const defaultSideBySideRendererConfig = Object.assign(Object.assign({}, defaultRenderConfig), { renderNothingWhenEmpty: false, matchingMaxComparisons: 2500, maxLineSizeInBlockForComparison: 200 });
const genericTemplatesPath = "generic";
const baseTemplatesPath = "side-by-side";
const iconsBaseTemplatesPath = "icon";
const tagsBaseTemplatesPath = "tag";
class SideBySideRenderer {
  constructor(hoganUtils, config = {}) {
    this.hoganUtils = hoganUtils;
    this.config = Object.assign(Object.assign({}, defaultSideBySideRendererConfig), config);
  }
  render(diffFiles) {
    const diffsHtml = diffFiles.map((file) => {
      let diffs;
      if (file.blocks.length) {
        diffs = this.generateFileHtml(file);
      } else {
        diffs = this.generateEmptyDiff();
      }
      return this.makeFileDiffHtml(file, diffs);
    }).join("\n");
    return this.hoganUtils.render(genericTemplatesPath, "wrapper", {
      colorScheme: colorSchemeToCss(this.config.colorScheme),
      content: diffsHtml
    });
  }
  makeFileDiffHtml(file, diffs) {
    if (this.config.renderNothingWhenEmpty && Array.isArray(file.blocks) && file.blocks.length === 0)
      return "";
    const fileDiffTemplate = this.hoganUtils.template(baseTemplatesPath, "file-diff");
    const filePathTemplate = this.hoganUtils.template(genericTemplatesPath, "file-path");
    const fileIconTemplate = this.hoganUtils.template(iconsBaseTemplatesPath, "file");
    const fileTagTemplate = this.hoganUtils.template(tagsBaseTemplatesPath, getFileIcon(file));
    return fileDiffTemplate.render({
      file,
      fileHtmlId: getHtmlId(file),
      diffs,
      filePath: filePathTemplate.render({
        fileDiffName: filenameDiff(file)
      }, {
        fileIcon: fileIconTemplate,
        fileTag: fileTagTemplate
      })
    });
  }
  generateEmptyDiff() {
    return {
      right: "",
      left: this.hoganUtils.render(genericTemplatesPath, "empty-diff", {
        contentClass: "d2h-code-side-line",
        CSSLineClass
      })
    };
  }
  generateFileHtml(file) {
    const matcher2 = newMatcherFn(newDistanceFn((e) => deconstructLine(e.content, file.isCombined).content));
    return file.blocks.map((block) => {
      const fileHtml = {
        left: this.makeHeaderHtml(block.header, file),
        right: this.makeHeaderHtml("")
      };
      this.applyLineGroupping(block).forEach(([contextLines, oldLines, newLines]) => {
        if (oldLines.length && newLines.length && !contextLines.length) {
          this.applyRematchMatching(oldLines, newLines, matcher2).map(([oldLines2, newLines2]) => {
            const { left, right } = this.processChangedLines(file.isCombined, oldLines2, newLines2);
            fileHtml.left += left;
            fileHtml.right += right;
          });
        } else if (contextLines.length) {
          contextLines.forEach((line) => {
            const { prefix, content } = deconstructLine(line.content, file.isCombined);
            const { left, right } = this.generateLineHtml({
              type: CSSLineClass.CONTEXT,
              prefix,
              content,
              number: line.oldNumber
            }, {
              type: CSSLineClass.CONTEXT,
              prefix,
              content,
              number: line.newNumber
            });
            fileHtml.left += left;
            fileHtml.right += right;
          });
        } else if (oldLines.length || newLines.length) {
          const { left, right } = this.processChangedLines(file.isCombined, oldLines, newLines);
          fileHtml.left += left;
          fileHtml.right += right;
        } else {
          console.error("Unknown state reached while processing groups of lines", contextLines, oldLines, newLines);
        }
      });
      return fileHtml;
    }).reduce((accomulated, html2) => {
      return { left: accomulated.left + html2.left, right: accomulated.right + html2.right };
    }, { left: "", right: "" });
  }
  applyLineGroupping(block) {
    const blockLinesGroups = [];
    let oldLines = [];
    let newLines = [];
    for (let i = 0; i < block.lines.length; i++) {
      const diffLine = block.lines[i];
      if (diffLine.type !== LineType.INSERT && newLines.length || diffLine.type === LineType.CONTEXT && oldLines.length > 0) {
        blockLinesGroups.push([[], oldLines, newLines]);
        oldLines = [];
        newLines = [];
      }
      if (diffLine.type === LineType.CONTEXT) {
        blockLinesGroups.push([[diffLine], [], []]);
      } else if (diffLine.type === LineType.INSERT && oldLines.length === 0) {
        blockLinesGroups.push([[], [], [diffLine]]);
      } else if (diffLine.type === LineType.INSERT && oldLines.length > 0) {
        newLines.push(diffLine);
      } else if (diffLine.type === LineType.DELETE) {
        oldLines.push(diffLine);
      }
    }
    if (oldLines.length || newLines.length) {
      blockLinesGroups.push([[], oldLines, newLines]);
      oldLines = [];
      newLines = [];
    }
    return blockLinesGroups;
  }
  applyRematchMatching(oldLines, newLines, matcher2) {
    const comparisons = oldLines.length * newLines.length;
    const maxLineSizeInBlock = max(oldLines.concat(newLines).map((elem) => elem.content.length));
    const doMatching = comparisons < this.config.matchingMaxComparisons && maxLineSizeInBlock < this.config.maxLineSizeInBlockForComparison && (this.config.matching === "lines" || this.config.matching === "words");
    return doMatching ? matcher2(oldLines, newLines) : [[oldLines, newLines]];
  }
  makeHeaderHtml(blockHeader, file) {
    return this.hoganUtils.render(genericTemplatesPath, "block-header", {
      CSSLineClass,
      blockHeader: (file === null || file === void 0 ? void 0 : file.isTooBig) ? blockHeader : escapeForHtml(blockHeader),
      lineClass: "d2h-code-side-linenumber",
      contentClass: "d2h-code-side-line"
    });
  }
  processChangedLines(isCombined, oldLines, newLines) {
    const fileHtml = {
      right: "",
      left: ""
    };
    const maxLinesNumber = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLinesNumber; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];
      const diff2 = oldLine !== void 0 && newLine !== void 0 ? diffHighlight(oldLine.content, newLine.content, isCombined, this.config) : void 0;
      const preparedOldLine = oldLine !== void 0 && oldLine.oldNumber !== void 0 ? Object.assign(Object.assign({}, diff2 !== void 0 ? {
        prefix: diff2.oldLine.prefix,
        content: diff2.oldLine.content,
        type: CSSLineClass.DELETE_CHANGES
      } : Object.assign(Object.assign({}, deconstructLine(oldLine.content, isCombined)), { type: toCSSClass(oldLine.type) })), { number: oldLine.oldNumber }) : void 0;
      const preparedNewLine = newLine !== void 0 && newLine.newNumber !== void 0 ? Object.assign(Object.assign({}, diff2 !== void 0 ? {
        prefix: diff2.newLine.prefix,
        content: diff2.newLine.content,
        type: CSSLineClass.INSERT_CHANGES
      } : Object.assign(Object.assign({}, deconstructLine(newLine.content, isCombined)), { type: toCSSClass(newLine.type) })), { number: newLine.newNumber }) : void 0;
      const { left, right } = this.generateLineHtml(preparedOldLine, preparedNewLine);
      fileHtml.left += left;
      fileHtml.right += right;
    }
    return fileHtml;
  }
  generateLineHtml(oldLine, newLine) {
    return {
      left: this.generateSingleHtml(oldLine),
      right: this.generateSingleHtml(newLine)
    };
  }
  generateSingleHtml(line) {
    const lineClass = "d2h-code-side-linenumber";
    const contentClass = "d2h-code-side-line";
    return this.hoganUtils.render(genericTemplatesPath, "line", {
      type: (line === null || line === void 0 ? void 0 : line.type) || `${CSSLineClass.CONTEXT} d2h-emptyplaceholder`,
      lineClass: line !== void 0 ? lineClass : `${lineClass} d2h-code-side-emptyplaceholder`,
      contentClass: line !== void 0 ? contentClass : `${contentClass} d2h-code-side-emptyplaceholder`,
      prefix: (line === null || line === void 0 ? void 0 : line.prefix) === " " ? "&nbsp;" : line === null || line === void 0 ? void 0 : line.prefix,
      content: line === null || line === void 0 ? void 0 : line.content,
      lineNumber: line === null || line === void 0 ? void 0 : line.number
    });
  }
}
var compiler = {};
var hasRequiredCompiler;
function requireCompiler() {
  if (hasRequiredCompiler) return compiler;
  hasRequiredCompiler = 1;
  (function(exports) {
    (function(Hogan) {
      var rIsWhitespace = /\S/, rQuot = /\"/g, rNewline = /\n/g, rCr = /\r/g, rSlash = /\\/g, rLineSep = /\u2028/, rParagraphSep = /\u2029/;
      Hogan.tags = {
        "#": 1,
        "^": 2,
        "<": 3,
        "$": 4,
        "/": 5,
        "!": 6,
        ">": 7,
        "=": 8,
        "_v": 9,
        "{": 10,
        "&": 11,
        "_t": 12
      };
      Hogan.scan = function scan(text, delimiters) {
        var len = text.length, IN_TEXT = 0, IN_TAG_TYPE = 1, IN_TAG = 2, state = IN_TEXT, tagType = null, tag = null, buf = "", tokens = [], seenTag = false, i = 0, lineStart = 0, otag = "{{", ctag = "}}";
        function addBuf() {
          if (buf.length > 0) {
            tokens.push({ tag: "_t", text: new String(buf) });
            buf = "";
          }
        }
        function lineIsWhitespace() {
          var isAllWhitespace = true;
          for (var j = lineStart; j < tokens.length; j++) {
            isAllWhitespace = Hogan.tags[tokens[j].tag] < Hogan.tags["_v"] || tokens[j].tag == "_t" && tokens[j].text.match(rIsWhitespace) === null;
            if (!isAllWhitespace) {
              return false;
            }
          }
          return isAllWhitespace;
        }
        function filterLine(haveSeenTag, noNewLine) {
          addBuf();
          if (haveSeenTag && lineIsWhitespace()) {
            for (var j = lineStart, next; j < tokens.length; j++) {
              if (tokens[j].text) {
                if ((next = tokens[j + 1]) && next.tag == ">") {
                  next.indent = tokens[j].text.toString();
                }
                tokens.splice(j, 1);
              }
            }
          } else if (!noNewLine) {
            tokens.push({ tag: "\n" });
          }
          seenTag = false;
          lineStart = tokens.length;
        }
        function changeDelimiters(text2, index2) {
          var close = "=" + ctag, closeIndex = text2.indexOf(close, index2), delimiters2 = trim(
            text2.substring(text2.indexOf("=", index2) + 1, closeIndex)
          ).split(" ");
          otag = delimiters2[0];
          ctag = delimiters2[delimiters2.length - 1];
          return closeIndex + close.length - 1;
        }
        if (delimiters) {
          delimiters = delimiters.split(" ");
          otag = delimiters[0];
          ctag = delimiters[1];
        }
        for (i = 0; i < len; i++) {
          if (state == IN_TEXT) {
            if (tagChange(otag, text, i)) {
              --i;
              addBuf();
              state = IN_TAG_TYPE;
            } else {
              if (text.charAt(i) == "\n") {
                filterLine(seenTag);
              } else {
                buf += text.charAt(i);
              }
            }
          } else if (state == IN_TAG_TYPE) {
            i += otag.length - 1;
            tag = Hogan.tags[text.charAt(i + 1)];
            tagType = tag ? text.charAt(i + 1) : "_v";
            if (tagType == "=") {
              i = changeDelimiters(text, i);
              state = IN_TEXT;
            } else {
              if (tag) {
                i++;
              }
              state = IN_TAG;
            }
            seenTag = i;
          } else {
            if (tagChange(ctag, text, i)) {
              tokens.push({
                tag: tagType,
                n: trim(buf),
                otag,
                ctag,
                i: tagType == "/" ? seenTag - otag.length : i + ctag.length
              });
              buf = "";
              i += ctag.length - 1;
              state = IN_TEXT;
              if (tagType == "{") {
                if (ctag == "}}") {
                  i++;
                } else {
                  cleanTripleStache(tokens[tokens.length - 1]);
                }
              }
            } else {
              buf += text.charAt(i);
            }
          }
        }
        filterLine(seenTag, true);
        return tokens;
      };
      function cleanTripleStache(token) {
        if (token.n.substr(token.n.length - 1) === "}") {
          token.n = token.n.substring(0, token.n.length - 1);
        }
      }
      function trim(s) {
        if (s.trim) {
          return s.trim();
        }
        return s.replace(/^\s*|\s*$/g, "");
      }
      function tagChange(tag, text, index2) {
        if (text.charAt(index2) != tag.charAt(0)) {
          return false;
        }
        for (var i = 1, l = tag.length; i < l; i++) {
          if (text.charAt(index2 + i) != tag.charAt(i)) {
            return false;
          }
        }
        return true;
      }
      var allowedInSuper = { "_t": true, "\n": true, "$": true, "/": true };
      function buildTree(tokens, kind, stack, customTags) {
        var instructions = [], opener = null, tail = null, token = null;
        tail = stack[stack.length - 1];
        while (tokens.length > 0) {
          token = tokens.shift();
          if (tail && tail.tag == "<" && !(token.tag in allowedInSuper)) {
            throw new Error("Illegal content in < super tag.");
          }
          if (Hogan.tags[token.tag] <= Hogan.tags["$"] || isOpener(token, customTags)) {
            stack.push(token);
            token.nodes = buildTree(tokens, token.tag, stack, customTags);
          } else if (token.tag == "/") {
            if (stack.length === 0) {
              throw new Error("Closing tag without opener: /" + token.n);
            }
            opener = stack.pop();
            if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
              throw new Error("Nesting error: " + opener.n + " vs. " + token.n);
            }
            opener.end = token.i;
            return instructions;
          } else if (token.tag == "\n") {
            token.last = tokens.length == 0 || tokens[0].tag == "\n";
          }
          instructions.push(token);
        }
        if (stack.length > 0) {
          throw new Error("missing closing tag: " + stack.pop().n);
        }
        return instructions;
      }
      function isOpener(token, tags) {
        for (var i = 0, l = tags.length; i < l; i++) {
          if (tags[i].o == token.n) {
            token.tag = "#";
            return true;
          }
        }
      }
      function isCloser(close, open, tags) {
        for (var i = 0, l = tags.length; i < l; i++) {
          if (tags[i].c == close && tags[i].o == open) {
            return true;
          }
        }
      }
      function stringifySubstitutions(obj) {
        var items = [];
        for (var key2 in obj) {
          items.push('"' + esc(key2) + '": function(c,p,t,i) {' + obj[key2] + "}");
        }
        return "{ " + items.join(",") + " }";
      }
      function stringifyPartials(codeObj) {
        var partials = [];
        for (var key2 in codeObj.partials) {
          partials.push('"' + esc(key2) + '":{name:"' + esc(codeObj.partials[key2].name) + '", ' + stringifyPartials(codeObj.partials[key2]) + "}");
        }
        return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
      }
      Hogan.stringify = function(codeObj, text, options) {
        return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) + "}";
      };
      var serialNo = 0;
      Hogan.generate = function(tree, text, options) {
        serialNo = 0;
        var context = { code: "", subs: {}, partials: {} };
        Hogan.walk(tree, context);
        if (options.asString) {
          return this.stringify(context, text, options);
        }
        return this.makeTemplate(context, text, options);
      };
      Hogan.wrapMain = function(code) {
        return 'var t=this;t.b(i=i||"");' + code + "return t.fl();";
      };
      Hogan.template = Hogan.Template;
      Hogan.makeTemplate = function(codeObj, text, options) {
        var template2 = this.makePartials(codeObj);
        template2.code = new Function("c", "p", "i", this.wrapMain(codeObj.code));
        return new this.template(template2, text, this, options);
      };
      Hogan.makePartials = function(codeObj) {
        var key2, template2 = { subs: {}, partials: codeObj.partials, name: codeObj.name };
        for (key2 in template2.partials) {
          template2.partials[key2] = this.makePartials(template2.partials[key2]);
        }
        for (key2 in codeObj.subs) {
          template2.subs[key2] = new Function("c", "p", "t", "i", codeObj.subs[key2]);
        }
        return template2;
      };
      function esc(s) {
        return s.replace(rSlash, "\\\\").replace(rQuot, '\\"').replace(rNewline, "\\n").replace(rCr, "\\r").replace(rLineSep, "\\u2028").replace(rParagraphSep, "\\u2029");
      }
      function chooseMethod(s) {
        return ~s.indexOf(".") ? "d" : "f";
      }
      function createPartial(node, context) {
        var prefix = "<" + (context.prefix || "");
        var sym = prefix + node.n + serialNo++;
        context.partials[sym] = { name: node.n, partials: {} };
        context.code += 't.b(t.rp("' + esc(sym) + '",c,p,"' + (node.indent || "") + '"));';
        return sym;
      }
      Hogan.codegen = {
        "#": function(node, context) {
          context.code += "if(t.s(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,0,' + node.i + "," + node.end + ',"' + node.otag + " " + node.ctag + '")){t.rs(c,p,function(c,p,t){';
          Hogan.walk(node.nodes, context);
          context.code += "});c.pop();}";
        },
        "^": function(node, context) {
          context.code += "if(!t.s(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
          Hogan.walk(node.nodes, context);
          context.code += "};";
        },
        ">": createPartial,
        "<": function(node, context) {
          var ctx = { partials: {}, code: "", subs: {}, inPartial: true };
          Hogan.walk(node.nodes, ctx);
          var template2 = context.partials[createPartial(node, context)];
          template2.subs = ctx.subs;
          template2.partials = ctx.partials;
        },
        "$": function(node, context) {
          var ctx = { subs: {}, code: "", partials: context.partials, prefix: node.n };
          Hogan.walk(node.nodes, ctx);
          context.subs[node.n] = ctx.code;
          if (!context.inPartial) {
            context.code += 't.sub("' + esc(node.n) + '",c,p,i);';
          }
        },
        "\n": function(node, context) {
          context.code += write('"\\n"' + (node.last ? "" : " + i"));
        },
        "_v": function(node, context) {
          context.code += "t.b(t.v(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
        },
        "_t": function(node, context) {
          context.code += write('"' + esc(node.text) + '"');
        },
        "{": tripleStache,
        "&": tripleStache
      };
      function tripleStache(node, context) {
        context.code += "t.b(t.t(t." + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
      }
      function write(s) {
        return "t.b(" + s + ");";
      }
      Hogan.walk = function(nodelist, context) {
        var func;
        for (var i = 0, l = nodelist.length; i < l; i++) {
          func = Hogan.codegen[nodelist[i].tag];
          func && func(nodelist[i], context);
        }
        return context;
      };
      Hogan.parse = function(tokens, text, options) {
        options = options || {};
        return buildTree(tokens, "", [], options.sectionTags || []);
      };
      Hogan.cache = {};
      Hogan.cacheKey = function(text, options) {
        return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join("||");
      };
      Hogan.compile = function(text, options) {
        options = options || {};
        var key2 = Hogan.cacheKey(text, options);
        var template2 = this.cache[key2];
        if (template2) {
          var partials = template2.partials;
          for (var name in partials) {
            delete partials[name].instance;
          }
          return template2;
        }
        template2 = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
        return this.cache[key2] = template2;
      };
    })(exports);
  })(compiler);
  return compiler;
}
var template = {};
var hasRequiredTemplate;
function requireTemplate() {
  if (hasRequiredTemplate) return template;
  hasRequiredTemplate = 1;
  (function(exports) {
    (function(Hogan) {
      Hogan.Template = function(codeObj, text, compiler2, options) {
        codeObj = codeObj || {};
        this.r = codeObj.code || this.r;
        this.c = compiler2;
        this.options = options || {};
        this.text = text || "";
        this.partials = codeObj.partials || {};
        this.subs = codeObj.subs || {};
        this.buf = "";
      };
      Hogan.Template.prototype = {
        // render: replaced by generated code.
        r: function(context, partials, indent) {
          return "";
        },
        // variable escaping
        v: hoganEscape,
        // triple stache
        t: coerceToString,
        render: function render(context, partials, indent) {
          return this.ri([context], partials || {}, indent);
        },
        // render internal -- a hook for overrides that catches partials too
        ri: function(context, partials, indent) {
          return this.r(context, partials, indent);
        },
        // ensurePartial
        ep: function(symbol, partials) {
          var partial = this.partials[symbol];
          var template2 = partials[partial.name];
          if (partial.instance && partial.base == template2) {
            return partial.instance;
          }
          if (typeof template2 == "string") {
            if (!this.c) {
              throw new Error("No compiler available.");
            }
            template2 = this.c.compile(template2, this.options);
          }
          if (!template2) {
            return null;
          }
          this.partials[symbol].base = template2;
          if (partial.subs) {
            if (!partials.stackText) partials.stackText = {};
            for (key in partial.subs) {
              if (!partials.stackText[key]) {
                partials.stackText[key] = this.activeSub !== void 0 && partials.stackText[this.activeSub] ? partials.stackText[this.activeSub] : this.text;
              }
            }
            template2 = createSpecializedPartial(
              template2,
              partial.subs,
              partial.partials,
              this.stackSubs,
              this.stackPartials,
              partials.stackText
            );
          }
          this.partials[symbol].instance = template2;
          return template2;
        },
        // tries to find a partial in the current scope and render it
        rp: function(symbol, context, partials, indent) {
          var partial = this.ep(symbol, partials);
          if (!partial) {
            return "";
          }
          return partial.ri(context, partials, indent);
        },
        // render a section
        rs: function(context, partials, section) {
          var tail = context[context.length - 1];
          if (!isArray(tail)) {
            section(context, partials, this);
            return;
          }
          for (var i = 0; i < tail.length; i++) {
            context.push(tail[i]);
            section(context, partials, this);
            context.pop();
          }
        },
        // maybe start a section
        s: function(val, ctx, partials, inverted, start, end, tags) {
          var pass;
          if (isArray(val) && val.length === 0) {
            return false;
          }
          if (typeof val == "function") {
            val = this.ms(val, ctx, partials, inverted, start, end, tags);
          }
          pass = !!val;
          if (!inverted && pass && ctx) {
            ctx.push(typeof val == "object" ? val : ctx[ctx.length - 1]);
          }
          return pass;
        },
        // find values with dotted names
        d: function(key2, ctx, partials, returnFound) {
          var found, names = key2.split("."), val = this.f(names[0], ctx, partials, returnFound), doModelGet = this.options.modelGet, cx = null;
          if (key2 === "." && isArray(ctx[ctx.length - 2])) {
            val = ctx[ctx.length - 1];
          } else {
            for (var i = 1; i < names.length; i++) {
              found = findInScope(names[i], val, doModelGet);
              if (found !== void 0) {
                cx = val;
                val = found;
              } else {
                val = "";
              }
            }
          }
          if (returnFound && !val) {
            return false;
          }
          if (!returnFound && typeof val == "function") {
            ctx.push(cx);
            val = this.mv(val, ctx, partials);
            ctx.pop();
          }
          return val;
        },
        // find values with normal names
        f: function(key2, ctx, partials, returnFound) {
          var val = false, v = null, found = false, doModelGet = this.options.modelGet;
          for (var i = ctx.length - 1; i >= 0; i--) {
            v = ctx[i];
            val = findInScope(key2, v, doModelGet);
            if (val !== void 0) {
              found = true;
              break;
            }
          }
          if (!found) {
            return returnFound ? false : "";
          }
          if (!returnFound && typeof val == "function") {
            val = this.mv(val, ctx, partials);
          }
          return val;
        },
        // higher order templates
        ls: function(func, cx, partials, text, tags) {
          var oldTags = this.options.delimiters;
          this.options.delimiters = tags;
          this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
          this.options.delimiters = oldTags;
          return false;
        },
        // compile text
        ct: function(text, cx, partials) {
          if (this.options.disableLambda) {
            throw new Error("Lambda features disabled.");
          }
          return this.c.compile(text, this.options).render(cx, partials);
        },
        // template result buffering
        b: function(s) {
          this.buf += s;
        },
        fl: function() {
          var r = this.buf;
          this.buf = "";
          return r;
        },
        // method replace section
        ms: function(func, ctx, partials, inverted, start, end, tags) {
          var textSource, cx = ctx[ctx.length - 1], result = func.call(cx);
          if (typeof result == "function") {
            if (inverted) {
              return true;
            } else {
              textSource = this.activeSub && this.subsText && this.subsText[this.activeSub] ? this.subsText[this.activeSub] : this.text;
              return this.ls(result, cx, partials, textSource.substring(start, end), tags);
            }
          }
          return result;
        },
        // method replace variable
        mv: function(func, ctx, partials) {
          var cx = ctx[ctx.length - 1];
          var result = func.call(cx);
          if (typeof result == "function") {
            return this.ct(coerceToString(result.call(cx)), cx, partials);
          }
          return result;
        },
        sub: function(name, context, partials, indent) {
          var f = this.subs[name];
          if (f) {
            this.activeSub = name;
            f(context, partials, this, indent);
            this.activeSub = false;
          }
        }
      };
      function findInScope(key2, scope, doModelGet) {
        var val;
        if (scope && typeof scope == "object") {
          if (scope[key2] !== void 0) {
            val = scope[key2];
          } else if (doModelGet && scope.get && typeof scope.get == "function") {
            val = scope.get(key2);
          }
        }
        return val;
      }
      function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
        function PartialTemplate() {
        }
        PartialTemplate.prototype = instance;
        function Substitutions() {
        }
        Substitutions.prototype = instance.subs;
        var key2;
        var partial = new PartialTemplate();
        partial.subs = new Substitutions();
        partial.subsText = {};
        partial.buf = "";
        stackSubs = stackSubs || {};
        partial.stackSubs = stackSubs;
        partial.subsText = stackText;
        for (key2 in subs) {
          if (!stackSubs[key2]) stackSubs[key2] = subs[key2];
        }
        for (key2 in stackSubs) {
          partial.subs[key2] = stackSubs[key2];
        }
        stackPartials = stackPartials || {};
        partial.stackPartials = stackPartials;
        for (key2 in partials) {
          if (!stackPartials[key2]) stackPartials[key2] = partials[key2];
        }
        for (key2 in stackPartials) {
          partial.partials[key2] = stackPartials[key2];
        }
        return partial;
      }
      var rAmp = /&/g, rLt = /</g, rGt = />/g, rApos = /\'/g, rQuot = /\"/g, hChars = /[&<>\"\']/;
      function coerceToString(val) {
        return String(val === null || val === void 0 ? "" : val);
      }
      function hoganEscape(str) {
        str = coerceToString(str);
        return hChars.test(str) ? str.replace(rAmp, "&amp;").replace(rLt, "&lt;").replace(rGt, "&gt;").replace(rApos, "&#39;").replace(rQuot, "&quot;") : str;
      }
      var isArray = Array.isArray || function(a) {
        return Object.prototype.toString.call(a) === "[object Array]";
      };
    })(exports);
  })(template);
  return template;
}
var hogan;
var hasRequiredHogan;
function requireHogan() {
  if (hasRequiredHogan) return hogan;
  hasRequiredHogan = 1;
  var Hogan = requireCompiler();
  Hogan.Template = requireTemplate().Template;
  Hogan.template = Hogan.Template;
  hogan = Hogan;
  return hogan;
}
var hoganExports = requireHogan();
const defaultTemplates = {};
defaultTemplates["file-summary-line"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<li class="d2h-file-list-line">');
  t.b("\n" + i);
  t.b('    <span class="d2h-file-name-wrapper">');
  t.b("\n" + i);
  t.b(t.rp("<fileIcon0", c, p, "      "));
  t.b('      <a href="#');
  t.b(t.v(t.f("fileHtmlId", c, p, 0)));
  t.b('" class="d2h-file-name">');
  t.b(t.v(t.f("fileName", c, p, 0)));
  t.b("</a>");
  t.b("\n" + i);
  t.b('      <span class="d2h-file-stats">');
  t.b("\n" + i);
  t.b('          <span class="d2h-lines-added">');
  t.b(t.v(t.f("addedLines", c, p, 0)));
  t.b("</span>");
  t.b("\n" + i);
  t.b('          <span class="d2h-lines-deleted">');
  t.b(t.v(t.f("deletedLines", c, p, 0)));
  t.b("</span>");
  t.b("\n" + i);
  t.b("      </span>");
  t.b("\n" + i);
  t.b("    </span>");
  t.b("\n" + i);
  t.b("</li>");
  return t.fl();
}, partials: { "<fileIcon0": { name: "fileIcon", partials: {}, subs: {} } }, subs: {} });
defaultTemplates["file-summary-wrapper"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<div class="d2h-file-list-wrapper ');
  t.b(t.v(t.f("colorScheme", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b('    <div class="d2h-file-list-header">');
  t.b("\n" + i);
  t.b('        <span class="d2h-file-list-title">Files changed (');
  t.b(t.v(t.f("filesNumber", c, p, 0)));
  t.b(")</span>");
  t.b("\n" + i);
  t.b('        <a class="d2h-file-switch d2h-hide">hide</a>');
  t.b("\n" + i);
  t.b('        <a class="d2h-file-switch d2h-show">show</a>');
  t.b("\n" + i);
  t.b("    </div>");
  t.b("\n" + i);
  t.b('    <ol class="d2h-file-list">');
  t.b("\n" + i);
  t.b("    ");
  t.b(t.t(t.f("files", c, p, 0)));
  t.b("\n" + i);
  t.b("    </ol>");
  t.b("\n" + i);
  t.b("</div>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["generic-block-header"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b("<tr>");
  t.b("\n" + i);
  t.b('    <td class="');
  t.b(t.v(t.f("lineClass", c, p, 0)));
  t.b(" ");
  t.b(t.v(t.d("CSSLineClass.INFO", c, p, 0)));
  t.b('"></td>');
  t.b("\n" + i);
  t.b('    <td class="');
  t.b(t.v(t.d("CSSLineClass.INFO", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b('        <div class="');
  t.b(t.v(t.f("contentClass", c, p, 0)));
  t.b('">');
  if (t.s(t.f("blockHeader", c, p, 1), c, p, 0, 156, 173, "{{ }}")) {
    t.rs(c, p, function(c2, p2, t2) {
      t2.b(t2.t(t2.f("blockHeader", c2, p2, 0)));
    });
    c.pop();
  }
  if (!t.s(t.f("blockHeader", c, p, 1), c, p, 1, 0, 0, "")) {
    t.b("&nbsp;");
  }
  t.b("</div>");
  t.b("\n" + i);
  t.b("    </td>");
  t.b("\n" + i);
  t.b("</tr>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["generic-empty-diff"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b("<tr>");
  t.b("\n" + i);
  t.b('    <td class="');
  t.b(t.v(t.d("CSSLineClass.INFO", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b('        <div class="');
  t.b(t.v(t.f("contentClass", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b("            File without changes");
  t.b("\n" + i);
  t.b("        </div>");
  t.b("\n" + i);
  t.b("    </td>");
  t.b("\n" + i);
  t.b("</tr>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["generic-file-path"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<span class="d2h-file-name-wrapper">');
  t.b("\n" + i);
  t.b(t.rp("<fileIcon0", c, p, "    "));
  t.b('    <span class="d2h-file-name">');
  t.b(t.v(t.f("fileDiffName", c, p, 0)));
  t.b("</span>");
  t.b("\n" + i);
  t.b(t.rp("<fileTag1", c, p, "    "));
  t.b("</span>");
  t.b("\n" + i);
  t.b('<label class="d2h-file-collapse">');
  t.b("\n" + i);
  t.b('    <input class="d2h-file-collapse-input" type="checkbox" name="viewed" value="viewed">');
  t.b("\n" + i);
  t.b("    Viewed");
  t.b("\n" + i);
  t.b("</label>");
  return t.fl();
}, partials: { "<fileIcon0": { name: "fileIcon", partials: {}, subs: {} }, "<fileTag1": { name: "fileTag", partials: {}, subs: {} } }, subs: {} });
defaultTemplates["generic-line"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b("<tr>");
  t.b("\n" + i);
  t.b('    <td class="');
  t.b(t.v(t.f("lineClass", c, p, 0)));
  t.b(" ");
  t.b(t.v(t.f("type", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b("      ");
  t.b(t.t(t.f("lineNumber", c, p, 0)));
  t.b("\n" + i);
  t.b("    </td>");
  t.b("\n" + i);
  t.b('    <td class="');
  t.b(t.v(t.f("type", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b('        <div class="');
  t.b(t.v(t.f("contentClass", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  if (t.s(t.f("prefix", c, p, 1), c, p, 0, 162, 238, "{{ }}")) {
    t.rs(c, p, function(c2, p2, t2) {
      t2.b('            <span class="d2h-code-line-prefix">');
      t2.b(t2.t(t2.f("prefix", c2, p2, 0)));
      t2.b("</span>");
      t2.b("\n" + i);
    });
    c.pop();
  }
  if (!t.s(t.f("prefix", c, p, 1), c, p, 1, 0, 0, "")) {
    t.b('            <span class="d2h-code-line-prefix">&nbsp;</span>');
    t.b("\n" + i);
  }
  if (t.s(t.f("content", c, p, 1), c, p, 0, 371, 445, "{{ }}")) {
    t.rs(c, p, function(c2, p2, t2) {
      t2.b('            <span class="d2h-code-line-ctn">');
      t2.b(t2.t(t2.f("content", c2, p2, 0)));
      t2.b("</span>");
      t2.b("\n" + i);
    });
    c.pop();
  }
  if (!t.s(t.f("content", c, p, 1), c, p, 1, 0, 0, "")) {
    t.b('            <span class="d2h-code-line-ctn"><br></span>');
    t.b("\n" + i);
  }
  t.b("        </div>");
  t.b("\n" + i);
  t.b("    </td>");
  t.b("\n" + i);
  t.b("</tr>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["generic-wrapper"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<div class="d2h-wrapper ');
  t.b(t.v(t.f("colorScheme", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b("    ");
  t.b(t.t(t.f("content", c, p, 0)));
  t.b("\n" + i);
  t.b("</div>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["icon-file-added"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<svg aria-hidden="true" class="d2h-icon d2h-added" height="16" title="added" version="1.1" viewBox="0 0 14 16"');
  t.b("\n" + i);
  t.b('     width="14">');
  t.b("\n" + i);
  t.b('    <path d="M13 1H1C0.45 1 0 1.45 0 2v12c0 0.55 0.45 1 1 1h12c0.55 0 1-0.45 1-1V2c0-0.55-0.45-1-1-1z m0 13H1V2h12v12zM6 9H3V7h3V4h2v3h3v2H8v3H6V9z"></path>');
  t.b("\n" + i);
  t.b("</svg>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["icon-file-changed"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<svg aria-hidden="true" class="d2h-icon d2h-changed" height="16" title="modified" version="1.1"');
  t.b("\n" + i);
  t.b('     viewBox="0 0 14 16" width="14">');
  t.b("\n" + i);
  t.b('    <path d="M13 1H1C0.45 1 0 1.45 0 2v12c0 0.55 0.45 1 1 1h12c0.55 0 1-0.45 1-1V2c0-0.55-0.45-1-1-1z m0 13H1V2h12v12zM4 8c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"></path>');
  t.b("\n" + i);
  t.b("</svg>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["icon-file-deleted"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<svg aria-hidden="true" class="d2h-icon d2h-deleted" height="16" title="removed" version="1.1"');
  t.b("\n" + i);
  t.b('     viewBox="0 0 14 16" width="14">');
  t.b("\n" + i);
  t.b('    <path d="M13 1H1C0.45 1 0 1.45 0 2v12c0 0.55 0.45 1 1 1h12c0.55 0 1-0.45 1-1V2c0-0.55-0.45-1-1-1z m0 13H1V2h12v12zM11 9H3V7h8v2z"></path>');
  t.b("\n" + i);
  t.b("</svg>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["icon-file-renamed"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<svg aria-hidden="true" class="d2h-icon d2h-moved" height="16" title="renamed" version="1.1"');
  t.b("\n" + i);
  t.b('     viewBox="0 0 14 16" width="14">');
  t.b("\n" + i);
  t.b('    <path d="M6 9H3V7h3V4l5 4-5 4V9z m8-7v12c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h12c0.55 0 1 0.45 1 1z m-1 0H1v12h12V2z"></path>');
  t.b("\n" + i);
  t.b("</svg>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["icon-file"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<svg aria-hidden="true" class="d2h-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12">');
  t.b("\n" + i);
  t.b('    <path d="M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z"></path>');
  t.b("\n" + i);
  t.b("</svg>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["line-by-line-file-diff"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<div id="');
  t.b(t.v(t.f("fileHtmlId", c, p, 0)));
  t.b('" class="d2h-file-wrapper" data-lang="');
  t.b(t.v(t.d("file.language", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b('    <div class="d2h-file-header">');
  t.b("\n" + i);
  t.b("    ");
  t.b(t.t(t.f("filePath", c, p, 0)));
  t.b("\n" + i);
  t.b("    </div>");
  t.b("\n" + i);
  t.b('    <div class="d2h-file-diff">');
  t.b("\n" + i);
  t.b('        <div class="d2h-code-wrapper">');
  t.b("\n" + i);
  t.b('            <table class="d2h-diff-table">');
  t.b("\n" + i);
  t.b('                <tbody class="d2h-diff-tbody">');
  t.b("\n" + i);
  t.b("                ");
  t.b(t.t(t.f("diffs", c, p, 0)));
  t.b("\n" + i);
  t.b("                </tbody>");
  t.b("\n" + i);
  t.b("            </table>");
  t.b("\n" + i);
  t.b("        </div>");
  t.b("\n" + i);
  t.b("    </div>");
  t.b("\n" + i);
  t.b("</div>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["line-by-line-numbers"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<div class="line-num1">');
  t.b(t.v(t.f("oldNumber", c, p, 0)));
  t.b("</div>");
  t.b("\n" + i);
  t.b('<div class="line-num2">');
  t.b(t.v(t.f("newNumber", c, p, 0)));
  t.b("</div>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["side-by-side-file-diff"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<div id="');
  t.b(t.v(t.f("fileHtmlId", c, p, 0)));
  t.b('" class="d2h-file-wrapper" data-lang="');
  t.b(t.v(t.d("file.language", c, p, 0)));
  t.b('">');
  t.b("\n" + i);
  t.b('    <div class="d2h-file-header">');
  t.b("\n" + i);
  t.b("      ");
  t.b(t.t(t.f("filePath", c, p, 0)));
  t.b("\n" + i);
  t.b("    </div>");
  t.b("\n" + i);
  t.b('    <div class="d2h-files-diff">');
  t.b("\n" + i);
  t.b('        <div class="d2h-file-side-diff">');
  t.b("\n" + i);
  t.b('            <div class="d2h-code-wrapper">');
  t.b("\n" + i);
  t.b('                <table class="d2h-diff-table">');
  t.b("\n" + i);
  t.b('                    <tbody class="d2h-diff-tbody">');
  t.b("\n" + i);
  t.b("                    ");
  t.b(t.t(t.d("diffs.left", c, p, 0)));
  t.b("\n" + i);
  t.b("                    </tbody>");
  t.b("\n" + i);
  t.b("                </table>");
  t.b("\n" + i);
  t.b("            </div>");
  t.b("\n" + i);
  t.b("        </div>");
  t.b("\n" + i);
  t.b('        <div class="d2h-file-side-diff">');
  t.b("\n" + i);
  t.b('            <div class="d2h-code-wrapper">');
  t.b("\n" + i);
  t.b('                <table class="d2h-diff-table">');
  t.b("\n" + i);
  t.b('                    <tbody class="d2h-diff-tbody">');
  t.b("\n" + i);
  t.b("                    ");
  t.b(t.t(t.d("diffs.right", c, p, 0)));
  t.b("\n" + i);
  t.b("                    </tbody>");
  t.b("\n" + i);
  t.b("                </table>");
  t.b("\n" + i);
  t.b("            </div>");
  t.b("\n" + i);
  t.b("        </div>");
  t.b("\n" + i);
  t.b("    </div>");
  t.b("\n" + i);
  t.b("</div>");
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["tag-file-added"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<span class="d2h-tag d2h-added d2h-added-tag">ADDED</span>');
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["tag-file-changed"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<span class="d2h-tag d2h-changed d2h-changed-tag">CHANGED</span>');
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["tag-file-deleted"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<span class="d2h-tag d2h-deleted d2h-deleted-tag">DELETED</span>');
  return t.fl();
}, partials: {}, subs: {} });
defaultTemplates["tag-file-renamed"] = new hoganExports.Template({ code: function(c, p, i) {
  var t = this;
  t.b(i = i || "");
  t.b('<span class="d2h-tag d2h-moved d2h-moved-tag">RENAMED</span>');
  return t.fl();
}, partials: {}, subs: {} });
class HoganJsUtils {
  constructor({ compiledTemplates = {}, rawTemplates = {} }) {
    const compiledRawTemplates = Object.entries(rawTemplates).reduce((previousTemplates, [name, templateString]) => {
      const compiledTemplate = hoganExports.compile(templateString, { asString: false });
      return Object.assign(Object.assign({}, previousTemplates), { [name]: compiledTemplate });
    }, {});
    this.preCompiledTemplates = Object.assign(Object.assign(Object.assign({}, defaultTemplates), compiledTemplates), compiledRawTemplates);
  }
  static compile(templateString) {
    return hoganExports.compile(templateString, { asString: false });
  }
  render(namespace, view, params, partials, indent) {
    const templateKey = this.templateKey(namespace, view);
    try {
      const template2 = this.preCompiledTemplates[templateKey];
      return template2.render(params, partials, indent);
    } catch (_e) {
      throw new Error(`Could not find template to render '${templateKey}'`);
    }
  }
  template(namespace, view) {
    return this.preCompiledTemplates[this.templateKey(namespace, view)];
  }
  templateKey(namespace, view) {
    return `${namespace}-${view}`;
  }
}
const defaultDiff2HtmlConfig = Object.assign(Object.assign(Object.assign({}, defaultLineByLineRendererConfig), defaultSideBySideRendererConfig), { outputFormat: OutputFormatType.LINE_BY_LINE, drawFileList: true });
function parse(diffInput, configuration = {}) {
  return parse$1(diffInput, Object.assign(Object.assign({}, defaultDiff2HtmlConfig), configuration));
}
function html(diffInput, configuration = {}) {
  const config = Object.assign(Object.assign({}, defaultDiff2HtmlConfig), configuration);
  const diffJson2 = typeof diffInput === "string" ? parse$1(diffInput, config) : diffInput;
  const hoganUtils = new HoganJsUtils(config);
  const { colorScheme } = config;
  const fileListRendererConfig = { colorScheme };
  const fileList = config.drawFileList ? new FileListRenderer(hoganUtils, fileListRendererConfig).render(diffJson2) : "";
  const diffOutput = config.outputFormat === "side-by-side" ? new SideBySideRenderer(hoganUtils, config).render(diffJson2) : new LineByLineRenderer(hoganUtils, config).render(diffJson2);
  return fileList + diffOutput;
}
const Diff2Html = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  defaultDiff2HtmlConfig,
  html,
  parse
}, Symbol.toStringTag, { value: "Module" }));
var yamlLint = { exports: {} };
var hasRequiredYamlLint;
function requireYamlLint() {
  if (hasRequiredYamlLint) return yamlLint.exports;
  hasRequiredYamlLint = 1;
  (function(module, exports) {
    (function(mod) {
      mod(requireCodemirror());
    })(function(CodeMirror2) {
      CodeMirror2.registerHelper("lint", "yaml", function(text) {
        var found = [];
        if (!window.jsyaml) {
          if (window.console) {
            window.console.error("Error: window.jsyaml not defined, CodeMirror YAML linting cannot run.");
          }
          return found;
        }
        try {
          jsyaml.loadAll(text);
        } catch (e) {
          var loc = e.mark, from = loc ? CodeMirror2.Pos(loc.line, loc.column) : CodeMirror2.Pos(0, 0), to = from;
          found.push({ from, to, message: e.message });
        }
        return found;
      });
    });
  })();
  return yamlLint.exports;
}
requireYamlLint();
var yaml = { exports: {} };
var hasRequiredYaml;
function requireYaml() {
  if (hasRequiredYaml) return yaml.exports;
  hasRequiredYaml = 1;
  (function(module, exports) {
    (function(mod) {
      mod(requireCodemirror());
    })(function(CodeMirror2) {
      CodeMirror2.defineMode("yaml", function() {
        var cons = ["true", "false", "on", "off", "yes", "no"];
        var keywordRegex = new RegExp("\\b((" + cons.join(")|(") + "))$", "i");
        return {
          token: function(stream, state) {
            var ch = stream.peek();
            var esc = state.escaped;
            state.escaped = false;
            if (ch == "#" && (stream.pos == 0 || /\s/.test(stream.string.charAt(stream.pos - 1)))) {
              stream.skipToEnd();
              return "comment";
            }
            if (stream.match(/^('([^']|\\.)*'?|"([^"]|\\.)*"?)/))
              return "string";
            if (state.literal && stream.indentation() > state.keyCol) {
              stream.skipToEnd();
              return "string";
            } else if (state.literal) {
              state.literal = false;
            }
            if (stream.sol()) {
              state.keyCol = 0;
              state.pair = false;
              state.pairStart = false;
              if (stream.match("---")) {
                return "def";
              }
              if (stream.match("...")) {
                return "def";
              }
              if (stream.match(/\s*-\s+/)) {
                return "meta";
              }
            }
            if (stream.match(/^(\{|\}|\[|\])/)) {
              if (ch == "{")
                state.inlinePairs++;
              else if (ch == "}")
                state.inlinePairs--;
              else if (ch == "[")
                state.inlineList++;
              else
                state.inlineList--;
              return "meta";
            }
            if (state.inlineList > 0 && !esc && ch == ",") {
              stream.next();
              return "meta";
            }
            if (state.inlinePairs > 0 && !esc && ch == ",") {
              state.keyCol = 0;
              state.pair = false;
              state.pairStart = false;
              stream.next();
              return "meta";
            }
            if (state.pairStart) {
              if (stream.match(/^\s*(\||\>)\s*/)) {
                state.literal = true;
                return "meta";
              }
              if (stream.match(/^\s*(\&|\*)[a-z0-9\._-]+\b/i)) {
                return "variable-2";
              }
              if (state.inlinePairs == 0 && stream.match(/^\s*-?[0-9\.\,]+\s?$/)) {
                return "number";
              }
              if (state.inlinePairs > 0 && stream.match(/^\s*-?[0-9\.\,]+\s?(?=(,|}))/)) {
                return "number";
              }
              if (stream.match(keywordRegex)) {
                return "keyword";
              }
            }
            if (!state.pair && stream.match(/^\s*(?:[,\[\]{}&*!|>'"%@`][^\s'":]|[^\s,\[\]{}#&*!|>'"%@`])[^#:]*(?=:($|\s))/)) {
              state.pair = true;
              state.keyCol = stream.indentation();
              return "atom";
            }
            if (state.pair && stream.match(/^:\s*/)) {
              state.pairStart = true;
              return "meta";
            }
            state.pairStart = false;
            state.escaped = ch == "\\";
            stream.next();
            return null;
          },
          startState: function() {
            return {
              pair: false,
              pairStart: false,
              keyCol: 0,
              inlinePairs: 0,
              inlineList: 0,
              literal: false,
              escaped: false
            };
          },
          lineComment: "#",
          fold: "indent"
        };
      });
      CodeMirror2.defineMIME("text/x-yaml", "yaml");
      CodeMirror2.defineMIME("text/yaml", "yaml");
    });
  })();
  return yaml.exports;
}
requireYaml();
const _sfc_main = {
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const newContent = ref("");
    const type = ref("");
    const outputFormat = ref("side-by-side");
    const oldContent = ref("");
    const prettyHtml = computed(() => {
      return html(createTwoFilesPatch("\u65B0\u6587\u4EF6", "\u65E7\u6587\u4EF6", newContent.value, oldContent.value), {
        drawFileList: true,
        matching: "lines",
        outputFormat: outputFormat.value
      });
    });
    const __returned__ = {
      newContent,
      type,
      outputFormat,
      oldContent,
      prettyHtml,
      ScCodeEditor,
      get Diff2Html() {
        return Diff2Html;
      },
      get Diff() {
        return Diff$1;
      },
      get YamlLoader() {
        return YamlLoader;
      },
      computed,
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
  class: "file-header"
};
const _hoisted_8 = {
  class: "file-header"
};
const _hoisted_9 = ["innerHTML"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_input = resolveComponent("el-input");
  const _component_el_col = resolveComponent("el-col");
  const _component_el_option = resolveComponent("el-option");
  const _component_el_select = resolveComponent("el-select");
  const _component_el_form_item = resolveComponent("el-form-item");
  const _component_el_form = resolveComponent("el-form");
  const _component_el_row = resolveComponent("el-row");
  const _component_el_card = resolveComponent("el-card");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:file-compare-line",
    class: "title-icon"
  }), _cache[8] || (_cache[8] = createTextVNode(" \u6587\u4EF6\u5BF9\u6BD4\u5DE5\u5177 ", -1))]), _cache[9] || (_cache[9] = createBaseVNode("p", {
    class: "page-subtitle"
  }, "\u5BF9\u6BD4\u4E24\u4E2A\u6587\u4EF6\u7684\u5DEE\u5F02\uFF0C\u652F\u6301 JSON/YAML/\u6587\u672C", -1))])])]), createBaseVNode("div", _hoisted_6, [createVNode(_component_el_card, {
    shadow: "never",
    class: "h-full"
  }, {
    default: withCtx(() => [createVNode(_component_el_row, {
      class: "h-full",
      gutter: 16
    }, {
      default: withCtx(() => [createVNode(_component_el_col, {
        md: 8,
        class: "h-full"
      }, {
        default: withCtx(() => [createBaseVNode("div", _hoisted_7, [createVNode(_component_IconifyIconOnline, {
          icon: "ri:file-add-line",
          class: "file-icon"
        }), _cache[10] || (_cache[10] = createBaseVNode("span", null, "\u65B0\u6587\u4EF6", -1))]), $setup.type === "yaml" ? (openBlock(), createBlock($setup["ScCodeEditor"], {
          key: 0,
          modelValue: $setup.newContent,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.newContent = $event),
          height: "100%",
          class: "h-full",
          mode: "text/x-yaml",
          onUpdateValue: _cache[1] || (_cache[1] = (it) => $setup.newContent = it)
        }, null, 8, ["modelValue"])) : createCommentVNode("", true), createVNode(_component_el_input, {
          modelValue: $setup.newContent,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.newContent = $event),
          class: "textarea-with-line-numbers",
          type: "textarea",
          autosize: ""
        }, null, 8, ["modelValue"])]),
        _: 1
      }), createVNode(_component_el_col, {
        md: 8,
        class: "h-full"
      }, {
        default: withCtx(() => [createBaseVNode("div", _hoisted_8, [createVNode(_component_IconifyIconOnline, {
          icon: "ri:file-line",
          class: "file-icon"
        }), _cache[11] || (_cache[11] = createBaseVNode("span", null, "\u65E7\u6587\u4EF6", -1))]), $setup.type === "yaml" ? (openBlock(), createBlock($setup["ScCodeEditor"], {
          key: 0,
          modelValue: $setup.oldContent,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.oldContent = $event),
          height: "100%",
          class: "h-full",
          mode: "text/x-yaml",
          onUpdateValue: _cache[4] || (_cache[4] = (it) => $setup.oldContent = it)
        }, null, 8, ["modelValue"])) : (openBlock(), createBlock(_component_el_input, {
          key: 1,
          modelValue: $setup.oldContent,
          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.oldContent = $event),
          class: "textarea-with-line-numbers",
          type: "textarea",
          autosize: ""
        }, null, 8, ["modelValue"]))]),
        _: 1
      }), createVNode(_component_el_col, {
        md: 8,
        class: "h-full pl-2"
      }, {
        default: withCtx(() => [createVNode(_component_el_form, {
          inline: true
        }, {
          default: withCtx(() => [createVNode(_component_el_form_item, {
            label: "\u7C7B\u578B"
          }, {
            default: withCtx(() => [createVNode(_component_el_select, {
              modelValue: $setup.type,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.type = $event),
              class: "!w-[100px]"
            }, {
              default: withCtx(() => [createVNode(_component_el_option, {
                value: "json",
                label: "JsonView"
              }), createVNode(_component_el_option, {
                value: "yaml",
                label: "Yaml"
              }), createVNode(_component_el_option, {
                value: "text",
                label: "\u6587\u672C"
              })]),
              _: 1
            }, 8, ["modelValue"])]),
            _: 1
          }), createVNode(_component_el_form_item, {
            label: "\u663E\u793A\u65B9\u5F0F",
            class: "!w-[200px]"
          }, {
            default: withCtx(() => [createVNode(_component_el_select, {
              modelValue: $setup.outputFormat,
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.outputFormat = $event)
            }, {
              default: withCtx(() => [createVNode(_component_el_option, {
                value: "side-by-side",
                label: "side-by-side"
              }), createVNode(_component_el_option, {
                value: "line-by-line",
                label: "line-by-line"
              })]),
              _: 1
            }, 8, ["modelValue"])]),
            _: 1
          })]),
          _: 1
        }), createBaseVNode("div", {
          class: "diff-result",
          innerHTML: $setup.prettyHtml
        }, null, 8, _hoisted_9)]),
        _: 1
      })]),
      _: 1
    })]),
    _: 1
  })])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-171985a7"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/tools/diff/index.vue"]]);
export {
  index as default
};
