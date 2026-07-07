import { _ as _export_sfc, e as resolveComponent, c as createElementBlock, o as openBlock, h as createBaseVNode, g as createVNode, i as createTextVNode, t as toDisplayString, k as withCtx, j as createBlock, v as createCommentVNode, F as Fragment, m as renderList, P as reactive, l as onMounted, bF as wsService, b as onUnmounted, r as ref, T as nextTick, ar as useRenderIcon } from "./index-DsQ9-pB_.js";
var __makeTemplateObject = function(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
};
var PacketKind;
(function(PacketKind2) {
  PacketKind2[PacketKind2["EOS"] = 0] = "EOS";
  PacketKind2[PacketKind2["Text"] = 1] = "Text";
  PacketKind2[PacketKind2["Incomplete"] = 2] = "Incomplete";
  PacketKind2[PacketKind2["ESC"] = 3] = "ESC";
  PacketKind2[PacketKind2["Unknown"] = 4] = "Unknown";
  PacketKind2[PacketKind2["SGR"] = 5] = "SGR";
  PacketKind2[PacketKind2["OSCURL"] = 6] = "OSCURL";
})(PacketKind || (PacketKind = {}));
class AnsiUp {
  constructor() {
    this.VERSION = "6.0.6";
    this.setup_palettes();
    this._use_classes = false;
    this.bold = false;
    this.faint = false;
    this.italic = false;
    this.underline = false;
    this.fg = this.bg = null;
    this._buffer = "";
    this._url_allowlist = { "http": 1, "https": 1 };
    this._escape_html = true;
    this.boldStyle = "font-weight:bold";
    this.faintStyle = "opacity:0.7";
    this.italicStyle = "font-style:italic";
    this.underlineStyle = "text-decoration:underline";
  }
  set use_classes(arg) {
    this._use_classes = arg;
  }
  get use_classes() {
    return this._use_classes;
  }
  set url_allowlist(arg) {
    this._url_allowlist = arg;
  }
  get url_allowlist() {
    return this._url_allowlist;
  }
  set escape_html(arg) {
    this._escape_html = arg;
  }
  get escape_html() {
    return this._escape_html;
  }
  set boldStyle(arg) {
    this._boldStyle = arg;
  }
  get boldStyle() {
    return this._boldStyle;
  }
  set faintStyle(arg) {
    this._faintStyle = arg;
  }
  get faintStyle() {
    return this._faintStyle;
  }
  set italicStyle(arg) {
    this._italicStyle = arg;
  }
  get italicStyle() {
    return this._italicStyle;
  }
  set underlineStyle(arg) {
    this._underlineStyle = arg;
  }
  get underlineStyle() {
    return this._underlineStyle;
  }
  setup_palettes() {
    this.ansi_colors = [
      [
        { rgb: [0, 0, 0], class_name: "ansi-black" },
        { rgb: [187, 0, 0], class_name: "ansi-red" },
        { rgb: [0, 187, 0], class_name: "ansi-green" },
        { rgb: [187, 187, 0], class_name: "ansi-yellow" },
        { rgb: [0, 0, 187], class_name: "ansi-blue" },
        { rgb: [187, 0, 187], class_name: "ansi-magenta" },
        { rgb: [0, 187, 187], class_name: "ansi-cyan" },
        { rgb: [255, 255, 255], class_name: "ansi-white" }
      ],
      [
        { rgb: [85, 85, 85], class_name: "ansi-bright-black" },
        { rgb: [255, 85, 85], class_name: "ansi-bright-red" },
        { rgb: [0, 255, 0], class_name: "ansi-bright-green" },
        { rgb: [255, 255, 85], class_name: "ansi-bright-yellow" },
        { rgb: [85, 85, 255], class_name: "ansi-bright-blue" },
        { rgb: [255, 85, 255], class_name: "ansi-bright-magenta" },
        { rgb: [85, 255, 255], class_name: "ansi-bright-cyan" },
        { rgb: [255, 255, 255], class_name: "ansi-bright-white" }
      ]
    ];
    this.palette_256 = [];
    this.ansi_colors.forEach((palette) => {
      palette.forEach((rec) => {
        this.palette_256.push(rec);
      });
    });
    let levels = [0, 95, 135, 175, 215, 255];
    for (let r = 0; r < 6; ++r) {
      for (let g = 0; g < 6; ++g) {
        for (let b = 0; b < 6; ++b) {
          let col = { rgb: [levels[r], levels[g], levels[b]], class_name: "truecolor" };
          this.palette_256.push(col);
        }
      }
    }
    let grey_level = 8;
    for (let i = 0; i < 24; ++i, grey_level += 10) {
      let gry = { rgb: [grey_level, grey_level, grey_level], class_name: "truecolor" };
      this.palette_256.push(gry);
    }
  }
  escape_txt_for_html(txt) {
    if (!this._escape_html)
      return txt;
    return txt.replace(/[&<>"']/gm, (str) => {
      if (str === "&")
        return "&amp;";
      if (str === "<")
        return "&lt;";
      if (str === ">")
        return "&gt;";
      if (str === '"')
        return "&quot;";
      if (str === "'")
        return "&#x27;";
    });
  }
  append_buffer(txt) {
    var str = this._buffer + txt;
    this._buffer = str;
  }
  get_next_packet() {
    var pkt = {
      kind: PacketKind.EOS,
      text: "",
      url: ""
    };
    var len = this._buffer.length;
    if (len == 0)
      return pkt;
    var pos = this._buffer.indexOf("\x1B");
    if (pos == -1) {
      pkt.kind = PacketKind.Text;
      pkt.text = this._buffer;
      this._buffer = "";
      return pkt;
    }
    if (pos > 0) {
      pkt.kind = PacketKind.Text;
      pkt.text = this._buffer.slice(0, pos);
      this._buffer = this._buffer.slice(pos);
      return pkt;
    }
    if (pos == 0) {
      if (len < 3) {
        pkt.kind = PacketKind.Incomplete;
        return pkt;
      }
      var next_char = this._buffer.charAt(1);
      if (next_char != "[" && next_char != "]" && next_char != "(") {
        pkt.kind = PacketKind.ESC;
        pkt.text = this._buffer.slice(0, 1);
        this._buffer = this._buffer.slice(1);
        return pkt;
      }
      if (next_char == "[") {
        if (!this._csi_regex) {
          this._csi_regex = rgx(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n                        ^                           # beginning of line\n                                                    #\n                                                    # First attempt\n                        (?:                         # legal sequence\n                          \x1B[                      # CSI\n                          ([<-?]?)              # private-mode char\n                          ([d;]*)                    # any digits or semicolons\n                          ([ -/]?               # an intermediate modifier\n                          [@-~])                # the command\n                        )\n                        |                           # alternate (second attempt)\n                        (?:                         # illegal sequence\n                          \x1B[                      # CSI\n                          [ -~]*                # anything legal\n                          ([\0-:])              # anything illegal\n                        )\n                    "], ["\n                        ^                           # beginning of line\n                                                    #\n                                                    # First attempt\n                        (?:                         # legal sequence\n                          \\x1b\\[                      # CSI\n                          ([\\x3c-\\x3f]?)              # private-mode char\n                          ([\\d;]*)                    # any digits or semicolons\n                          ([\\x20-\\x2f]?               # an intermediate modifier\n                          [\\x40-\\x7e])                # the command\n                        )\n                        |                           # alternate (second attempt)\n                        (?:                         # illegal sequence\n                          \\x1b\\[                      # CSI\n                          [\\x20-\\x7e]*                # anything legal\n                          ([\\x00-\\x1f:])              # anything illegal\n                        )\n                    "])));
        }
        let match = this._buffer.match(this._csi_regex);
        if (match === null) {
          pkt.kind = PacketKind.Incomplete;
          return pkt;
        }
        if (match[4]) {
          pkt.kind = PacketKind.ESC;
          pkt.text = this._buffer.slice(0, 1);
          this._buffer = this._buffer.slice(1);
          return pkt;
        }
        if (match[1] != "" || match[3] != "m")
          pkt.kind = PacketKind.Unknown;
        else
          pkt.kind = PacketKind.SGR;
        pkt.text = match[2];
        var rpos = match[0].length;
        this._buffer = this._buffer.slice(rpos);
        return pkt;
      } else if (next_char == "]") {
        if (len < 4) {
          pkt.kind = PacketKind.Incomplete;
          return pkt;
        }
        if (this._buffer.charAt(2) != "8" || this._buffer.charAt(3) != ";") {
          pkt.kind = PacketKind.ESC;
          pkt.text = this._buffer.slice(0, 1);
          this._buffer = this._buffer.slice(1);
          return pkt;
        }
        if (!this._osc_st) {
          this._osc_st = rgxG(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n                        (?:                         # legal sequence\n                          (\x1B\\)                    # ESC                           |                           # alternate\n                          (\x07)                      # BEL (what xterm did)\n                        )\n                        |                           # alternate (second attempt)\n                        (                           # illegal sequence\n                          [\0-]                 # anything illegal\n                          |                           # alternate\n                          [\b-]                 # anything illegal\n                          |                           # alternate\n                          [-]                 # anything illegal\n                        )\n                    "], ["\n                        (?:                         # legal sequence\n                          (\\x1b\\\\)                    # ESC \\\n                          |                           # alternate\n                          (\\x07)                      # BEL (what xterm did)\n                        )\n                        |                           # alternate (second attempt)\n                        (                           # illegal sequence\n                          [\\x00-\\x06]                 # anything illegal\n                          |                           # alternate\n                          [\\x08-\\x1a]                 # anything illegal\n                          |                           # alternate\n                          [\\x1c-\\x1f]                 # anything illegal\n                        )\n                    "])));
        }
        this._osc_st.lastIndex = 0;
        {
          let match2 = this._osc_st.exec(this._buffer);
          if (match2 === null) {
            pkt.kind = PacketKind.Incomplete;
            return pkt;
          }
          if (match2[3]) {
            pkt.kind = PacketKind.ESC;
            pkt.text = this._buffer.slice(0, 1);
            this._buffer = this._buffer.slice(1);
            return pkt;
          }
        }
        {
          let match2 = this._osc_st.exec(this._buffer);
          if (match2 === null) {
            pkt.kind = PacketKind.Incomplete;
            return pkt;
          }
          if (match2[3]) {
            pkt.kind = PacketKind.ESC;
            pkt.text = this._buffer.slice(0, 1);
            this._buffer = this._buffer.slice(1);
            return pkt;
          }
        }
        if (!this._osc_regex) {
          this._osc_regex = rgx(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n                        ^                           # beginning of line\n                                                    #\n                        \x1B]8;                    # OSC Hyperlink\n                        [ -:<-~]*       # params (excluding ;)\n                        ;                           # end of params\n                        ([!-~]{0,512})        # URL capture\n                        (?:                         # ST\n                          (?:\x1B\\)                  # ESC                           |                           # alternate\n                          (?:\x07)                    # BEL (what xterm did)\n                        )\n                        ([ -~]+)              # TEXT capture\n                        \x1B]8;;                   # OSC Hyperlink End\n                        (?:                         # ST\n                          (?:\x1B\\)                  # ESC                           |                           # alternate\n                          (?:\x07)                    # BEL (what xterm did)\n                        )\n                    "], ["\n                        ^                           # beginning of line\n                                                    #\n                        \\x1b\\]8;                    # OSC Hyperlink\n                        [\\x20-\\x3a\\x3c-\\x7e]*       # params (excluding ;)\n                        ;                           # end of params\n                        ([\\x21-\\x7e]{0,512})        # URL capture\n                        (?:                         # ST\n                          (?:\\x1b\\\\)                  # ESC \\\n                          |                           # alternate\n                          (?:\\x07)                    # BEL (what xterm did)\n                        )\n                        ([\\x20-\\x7e]+)              # TEXT capture\n                        \\x1b\\]8;;                   # OSC Hyperlink End\n                        (?:                         # ST\n                          (?:\\x1b\\\\)                  # ESC \\\n                          |                           # alternate\n                          (?:\\x07)                    # BEL (what xterm did)\n                        )\n                    "])));
        }
        let match = this._buffer.match(this._osc_regex);
        if (match === null) {
          pkt.kind = PacketKind.ESC;
          pkt.text = this._buffer.slice(0, 1);
          this._buffer = this._buffer.slice(1);
          return pkt;
        }
        pkt.kind = PacketKind.OSCURL;
        pkt.url = match[1];
        pkt.text = match[2];
        var rpos = match[0].length;
        this._buffer = this._buffer.slice(rpos);
        return pkt;
      } else if (next_char == "(") {
        pkt.kind = PacketKind.Unknown;
        this._buffer = this._buffer.slice(3);
        return pkt;
      }
    }
  }
  ansi_to_html(txt) {
    this.append_buffer(txt);
    var blocks = [];
    while (true) {
      var packet = this.get_next_packet();
      if (packet.kind == PacketKind.EOS || packet.kind == PacketKind.Incomplete)
        break;
      if (packet.kind == PacketKind.ESC || packet.kind == PacketKind.Unknown)
        continue;
      if (packet.kind == PacketKind.Text)
        blocks.push(this.transform_to_html(this.with_state(packet)));
      else if (packet.kind == PacketKind.SGR)
        this.process_ansi(packet);
      else if (packet.kind == PacketKind.OSCURL)
        blocks.push(this.process_hyperlink(packet));
    }
    return blocks.join("");
  }
  with_state(pkt) {
    return { bold: this.bold, faint: this.faint, italic: this.italic, underline: this.underline, fg: this.fg, bg: this.bg, text: pkt.text };
  }
  process_ansi(pkt) {
    let sgr_cmds = pkt.text.split(";");
    while (sgr_cmds.length > 0) {
      let sgr_cmd_str = sgr_cmds.shift();
      let num = parseInt(sgr_cmd_str, 10);
      if (isNaN(num) || num === 0) {
        this.fg = null;
        this.bg = null;
        this.bold = false;
        this.faint = false;
        this.italic = false;
        this.underline = false;
      } else if (num === 1) {
        this.bold = true;
      } else if (num === 2) {
        this.faint = true;
      } else if (num === 3) {
        this.italic = true;
      } else if (num === 4) {
        this.underline = true;
      } else if (num === 21) {
        this.bold = false;
      } else if (num === 22) {
        this.faint = false;
        this.bold = false;
      } else if (num === 23) {
        this.italic = false;
      } else if (num === 24) {
        this.underline = false;
      } else if (num === 39) {
        this.fg = null;
      } else if (num === 49) {
        this.bg = null;
      } else if (num >= 30 && num < 38) {
        this.fg = this.ansi_colors[0][num - 30];
      } else if (num >= 40 && num < 48) {
        this.bg = this.ansi_colors[0][num - 40];
      } else if (num >= 90 && num < 98) {
        this.fg = this.ansi_colors[1][num - 90];
      } else if (num >= 100 && num < 108) {
        this.bg = this.ansi_colors[1][num - 100];
      } else if (num === 38 || num === 48) {
        if (sgr_cmds.length > 0) {
          let is_foreground = num === 38;
          let mode_cmd = sgr_cmds.shift();
          if (mode_cmd === "5" && sgr_cmds.length > 0) {
            let palette_index = parseInt(sgr_cmds.shift(), 10);
            if (palette_index >= 0 && palette_index <= 255) {
              if (is_foreground)
                this.fg = this.palette_256[palette_index];
              else
                this.bg = this.palette_256[palette_index];
            }
          }
          if (mode_cmd === "2" && sgr_cmds.length > 2) {
            let r = parseInt(sgr_cmds.shift(), 10);
            let g = parseInt(sgr_cmds.shift(), 10);
            let b = parseInt(sgr_cmds.shift(), 10);
            if (r >= 0 && r <= 255 && (g >= 0 && g <= 255) && (b >= 0 && b <= 255)) {
              let c = { rgb: [r, g, b], class_name: "truecolor" };
              if (is_foreground)
                this.fg = c;
              else
                this.bg = c;
            }
          }
        }
      }
    }
  }
  transform_to_html(fragment) {
    let txt = fragment.text;
    if (txt.length === 0)
      return txt;
    txt = this.escape_txt_for_html(txt);
    if (!fragment.bold && !fragment.italic && !fragment.faint && !fragment.underline && fragment.fg === null && fragment.bg === null)
      return txt;
    let styles = [];
    let classes = [];
    let fg = fragment.fg;
    let bg = fragment.bg;
    if (fragment.bold)
      styles.push(this._boldStyle);
    if (fragment.faint)
      styles.push(this._faintStyle);
    if (fragment.italic)
      styles.push(this._italicStyle);
    if (fragment.underline)
      styles.push(this._underlineStyle);
    if (!this._use_classes) {
      if (fg)
        styles.push(`color:rgb(${fg.rgb.join(",")})`);
      if (bg)
        styles.push(`background-color:rgb(${bg.rgb})`);
    } else {
      if (fg) {
        if (fg.class_name !== "truecolor") {
          classes.push(`${fg.class_name}-fg`);
        } else {
          styles.push(`color:rgb(${fg.rgb.join(",")})`);
        }
      }
      if (bg) {
        if (bg.class_name !== "truecolor") {
          classes.push(`${bg.class_name}-bg`);
        } else {
          styles.push(`background-color:rgb(${bg.rgb.join(",")})`);
        }
      }
    }
    let class_string = "";
    let style_string = "";
    if (classes.length)
      class_string = ` class="${classes.join(" ")}"`;
    if (styles.length)
      style_string = ` style="${styles.join(";")}"`;
    return `<span${style_string}${class_string}>${txt}</span>`;
  }
  process_hyperlink(pkt) {
    let parts = pkt.url.split(":");
    if (parts.length < 1)
      return "";
    if (!this._url_allowlist[parts[0]])
      return "";
    let result = `<a href="${this.escape_txt_for_html(pkt.url)}">${this.escape_txt_for_html(pkt.text)}</a>`;
    return result;
  }
}
function rgx(tmplObj, ...subst) {
  let regexText = tmplObj.raw[0];
  let wsrgx = /^\s+|\s+\n|\s*#[\s\S]*?\n|\n/gm;
  let txt2 = regexText.replace(wsrgx, "");
  return new RegExp(txt2);
}
function rgxG(tmplObj, ...subst) {
  let regexText = tmplObj.raw[0];
  let wsrgx = /^\s+|\s+\n|\s*#[\s\S]*?\n|\n/gm;
  let txt2 = regexText.replace(wsrgx, "");
  return new RegExp(txt2, "g");
}
var templateObject_1, templateObject_2, templateObject_3;
const _sfc_main = {
  __name: "index",
  setup(__props, {
    expose: __expose
  }) {
    __expose();
    const ansiUp = new AnsiUp();
    const form = reactive({
      message: null
    });
    const dataList = reactive([]);
    const config = reactive({
      lock: true
    });
    let unsubscribe = null;
    const handleWsMessage = (message) => {
      if (message.event === "AGENT_LOG") {
        try {
          const logData = typeof message.data === "string" ? JSON.parse(message.data) : message.data;
          dataList.push({
            data: logData
          });
          while (dataList.length > 1e4) {
            dataList.shift();
          }
          if (config.lock) {
            nextTick(() => {
              const container = document.querySelector("#containerRef");
              if (container) {
                container.scrollTop = container.scrollHeight;
              }
            });
          }
        } catch (error) {
          console.error("\u89E3\u6790\u65E5\u5FD7\u5931\u8D25:", error);
        }
      }
    };
    const ansiToHtml = (ansiString) => {
      if (!ansiString) return "";
      return ansiUp.ansi_to_html(ansiString);
    };
    const getData = (data) => {
      return data.filter((item) => filter(item));
    };
    const filter = (row) => {
      var _a, _b;
      if (!form.message) {
        return true;
      }
      if (!((_a = row == null ? void 0 : row.data) == null ? void 0 : _a.message)) {
        return false;
      }
      return ((_b = row.data.message) == null ? void 0 : _b.indexOf(form.message)) > -1;
    };
    onMounted(() => {
      unsubscribe = wsService.subscribe("LOG", "AGENT_LOG", handleWsMessage);
    });
    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });
    const __returned__ = {
      ansiUp,
      form,
      dataList,
      config,
      get unsubscribe() {
        return unsubscribe;
      },
      set unsubscribe(v) {
        unsubscribe = v;
      },
      handleWsMessage,
      ansiToHtml,
      getData,
      filter,
      nextTick,
      ref,
      onUnmounted,
      reactive,
      onMounted,
      get AnsiUp() {
        return AnsiUp;
      },
      get useRenderIcon() {
        return useRenderIcon;
      },
      get wsService() {
        return wsService;
      }
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
  class: "flex-1 overflow-hidden"
};
const _hoisted_10 = {
  class: "log-container"
};
const _hoisted_11 = {
  class: "control-panel"
};
const _hoisted_12 = {
  class: "filter-group"
};
const _hoisted_13 = {
  class: "control-buttons"
};
const _hoisted_14 = {
  class: "log-list-container"
};
const _hoisted_15 = {
  id: "containerRef",
  class: "log-list"
};
const _hoisted_16 = {
  class: "log-index"
};
const _hoisted_17 = ["innerHTML"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconifyIconOnline = resolveComponent("IconifyIconOnline");
  const _component_el_radio_button = resolveComponent("el-radio-button");
  const _component_el_radio_group = resolveComponent("el-radio-group");
  const _component_el_input = resolveComponent("el-input");
  const _component_el_button = resolveComponent("el-button");
  const _component_el_empty = resolveComponent("el-empty");
  const _component_el_card = resolveComponent("el-card");
  return openBlock(), createElementBlock("div", _hoisted_1, [createBaseVNode("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, [createBaseVNode("div", _hoisted_4, [createBaseVNode("h1", _hoisted_5, [createVNode(_component_IconifyIconOnline, {
    icon: "ri:file-text-line",
    class: "title-icon"
  }), _cache[5] || (_cache[5] = createTextVNode(" \u65E5\u5FD7\u76D1\u63A7 ", -1))]), _cache[6] || (_cache[6] = createBaseVNode("p", {
    class: "page-subtitle"
  }, "\u5B9E\u65F6\u67E5\u770B\u548C\u7B5B\u9009\u5E94\u7528\u65E5\u5FD7", -1))]), createBaseVNode("div", _hoisted_6, [createBaseVNode("div", _hoisted_7, [createBaseVNode("div", _hoisted_8, toDisplayString($setup.dataList.length), 1), _cache[7] || (_cache[7] = createBaseVNode("div", {
    class: "stat-label"
  }, "\u65E5\u5FD7\u6761\u6570", -1))])])])]), createBaseVNode("div", _hoisted_9, [createVNode(_component_el_card, {
    shadow: "never",
    class: "h-full"
  }, {
    default: withCtx(() => [createBaseVNode("div", _hoisted_10, [createBaseVNode("div", _hoisted_11, [createBaseVNode("div", _hoisted_12, [createVNode(_component_el_radio_group, {
      modelValue: $setup.form.message,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.form.message = $event),
      size: "small"
    }, {
      default: withCtx(() => [createVNode(_component_el_radio_button, {
        value: ""
      }, {
        default: withCtx(() => [..._cache[8] || (_cache[8] = [createTextVNode("\u5168\u90E8", -1)])]),
        _: 1
      }), createVNode(_component_el_radio_button, {
        value: "ERROR"
      }, {
        default: withCtx(() => [..._cache[9] || (_cache[9] = [createTextVNode("ERROR", -1)])]),
        _: 1
      }), createVNode(_component_el_radio_button, {
        value: "INFO"
      }, {
        default: withCtx(() => [..._cache[10] || (_cache[10] = [createTextVNode("INFO", -1)])]),
        _: 1
      }), createVNode(_component_el_radio_button, {
        value: "DEBUG"
      }, {
        default: withCtx(() => [..._cache[11] || (_cache[11] = [createTextVNode("DEBUG", -1)])]),
        _: 1
      })]),
      _: 1
    }, 8, ["modelValue"])]), createVNode(_component_el_input, {
      modelValue: $setup.form.message,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.form.message = $event),
      placeholder: "\u8BF7\u8F93\u5165\u8BF7\u6C42ID\u7B5B\u9009...",
      clearable: "",
      class: "search-input"
    }, {
      prefix: withCtx(() => [createVNode(_component_IconifyIconOnline, {
        icon: "ep:search"
      })]),
      _: 1
    }, 8, ["modelValue"]), createBaseVNode("div", _hoisted_13, [$setup.config.lock ? (openBlock(), createBlock(_component_el_button, {
      key: 0,
      type: "primary",
      circle: "",
      icon: $setup.useRenderIcon("ep:lock"),
      onClick: _cache[2] || (_cache[2] = ($event) => $setup.config.lock = false),
      title: "\u89E3\u9501\u6EDA\u52A8"
    }, null, 8, ["icon"])) : (openBlock(), createBlock(_component_el_button, {
      key: 1,
      circle: "",
      icon: $setup.useRenderIcon("ep:unlock"),
      onClick: _cache[3] || (_cache[3] = ($event) => $setup.config.lock = true),
      title: "\u9501\u5B9A\u6EDA\u52A8"
    }, null, 8, ["icon"])), createVNode(_component_el_button, {
      circle: "",
      type: "danger",
      icon: $setup.useRenderIcon("ep:delete-filled"),
      onClick: _cache[4] || (_cache[4] = ($event) => $setup.dataList.length = 0),
      title: "\u6E05\u7A7A\u65E5\u5FD7"
    }, null, 8, ["icon"])])]), createBaseVNode("div", _hoisted_14, [createBaseVNode("ul", _hoisted_15, [(openBlock(true), createElementBlock(Fragment, null, renderList($setup.getData($setup.dataList), (item, index2) => {
      var _a;
      return openBlock(), createElementBlock("li", {
        key: index2,
        class: "log-item"
      }, [createBaseVNode("span", _hoisted_16, toDisplayString(index2 + 1), 1), createBaseVNode("span", {
        class: "log-content",
        innerHTML: $setup.ansiToHtml((_a = item == null ? void 0 : item.data) == null ? void 0 : _a.message)
      }, null, 8, _hoisted_17)]);
    }), 128))]), !$setup.dataList || $setup.dataList.length == 0 ? (openBlock(), createBlock(_component_el_empty, {
      key: 0,
      description: "\u6682\u65E0\u65E5\u5FD7\u8BB0\u5F55"
    })) : createCommentVNode("", true)])])]),
    _: 1
  })])]);
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-247ebc53"], ["__file", "H:/workspace/2/vue-support-parent-starter/apps/vue-support-hotspot-starter/src/views/hotspot/log/index.vue"]]);
export {
  index as default
};
