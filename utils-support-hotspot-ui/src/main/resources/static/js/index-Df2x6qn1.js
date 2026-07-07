const getRecentDays = (dayNum) => {
  const oneDayMs = 24 * 60 * 60 * 1e3;
  const result = [];
  for (let i = dayNum - 1; i >= 0; i--) {
    const currentDate = new Date(Date.now() - i * oneDayMs);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    result.push(formattedDate);
  }
  return result;
};
function formatDateTime(date2, format = "YYYY-MM-DD HH:mm:ss") {
  if (!date2) return "--";
  const d = typeof date2 === "string" ? new Date(date2) : date2;
  if (isNaN(d.getTime())) return "--";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return format.replace("YYYY", String(year)).replace("MM", month).replace("DD", day).replace("HH", hours).replace("mm", minutes).replace("ss", seconds);
}
const getThisWeekData = () => {
  const thisWeek = {
    start_day: "",
    end_day: ""
  };
  const date2 = /* @__PURE__ */ new Date();
  date2.setDate(date2.getDate() - date2.getDay() + 1);
  thisWeek.start_day = formatDate(date2);
  date2.setDate(date2.getDate() + 6);
  thisWeek.end_day = formatDate(date2);
  return thisWeek;
};
const getLastWeekData = () => {
  const lastWeek = {
    start_day: "",
    end_day: ""
  };
  const date2 = /* @__PURE__ */ new Date();
  date2.setDate(date2.getDate() - 7 - date2.getDay() + 1);
  lastWeek.start_day = formatDate(date2);
  date2.setDate(date2.getDate() + 6);
  lastWeek.end_day = formatDate(date2);
  return lastWeek;
};
const formatDate = (date2) => {
  const year = date2.getFullYear();
  const month = String(date2.getMonth() + 1).padStart(2, "0");
  const day = String(date2.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const getDateRang = (val, fmt = "yyyy-MM-dd hh:mm:ss") => {
  const now = /* @__PURE__ */ new Date();
  const nowDayOfWeek = now.getDay();
  const nowDay = now.getDate();
  const nowMonth = now.getMonth();
  const nowYear = now.getFullYear();
  const quarter = Math.ceil((nowMonth + 1) / 3);
  let startTime;
  let endTime;
  let customTime = [];
  switch (val) {
    case "today":
      startTime = new Date(nowYear, nowMonth, nowDay, 0, 0, 0);
      endTime = new Date(nowYear, nowMonth, nowDay, 23, 59, 59);
      break;
    case "yesterday":
      startTime = new Date(nowYear, nowMonth, nowDay - 1);
      endTime = new Date(nowYear, nowMonth, nowDay - 1);
      break;
    case "week":
      startTime = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
      endTime = new Date(nowYear, nowMonth, nowDay + 6 - nowDayOfWeek);
      break;
    case "pastWeek":
      startTime = new Date(nowYear, nowMonth, nowDay - 6);
      endTime = new Date(nowYear, nowMonth, nowDay);
      break;
    case "month":
      startTime = new Date(nowYear, nowMonth, 1);
      endTime = new Date(nowYear, nowMonth + 1, 0);
      break;
    case "pastMonth":
      startTime = new Date(nowYear, nowMonth, nowDay - 30);
      endTime = new Date(nowYear, nowMonth, nowDay);
      break;
    case "quarter":
      startTime = new Date(nowYear, (quarter - 1) * 3, 1);
      endTime = new Date(nowYear, quarter * 3, 0);
      break;
    case "year":
      startTime = new Date(nowYear, 0, 1);
      endTime = new Date(nowYear, 11, 31);
      break;
    default:
      customTime = val.split(" - ");
      break;
  }
  return customTime.length ? customTime : [dateFormat(startTime, fmt), dateFormat(endTime, fmt)];
};
const dateFormat = (date2, fmt = "yyyy-MM-dd hh:mm:ss") => {
  date2 = new Date(date2);
  const o = {
    "M+": date2.getMonth() + 1,
    // 月份
    "d+": date2.getDate(),
    // 日
    "h+": date2.getHours(),
    // 小时
    "m+": date2.getMinutes(),
    // 分
    "s+": date2.getSeconds(),
    // 秒
    "q+": Math.floor((date2.getMonth() + 3) / 3),
    // 季度
    S: date2.getMilliseconds()
    // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date2.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k].toString() : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return fmt;
};
const isTimeExpired = (expirationTime) => {
  const now = Date.now();
  let expirationTimestamp;
  if (expirationTime instanceof Date) {
    expirationTimestamp = expirationTime.getTime();
  } else if (typeof expirationTime === "string") {
    const parsedDate = new Date(expirationTime);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("\u65E0\u6548\u7684\u65F6\u95F4\u5B57\u7B26\u4E32\u683C\u5F0F");
    }
    expirationTimestamp = parsedDate.getTime();
  } else if (typeof expirationTime === "number") {
    expirationTimestamp = expirationTime;
  } else {
    throw new TypeError("expirationTime \u5FC5\u987B\u662F Date \u5BF9\u8C61\u3001\u65F6\u95F4\u5B57\u7B26\u4E32\u6216\u65F6\u95F4\u6233\uFF08\u6BEB\u79D2\uFF09");
  }
  return now > expirationTimestamp;
};
const getTimeAgo = (date2) => {
  const now = /* @__PURE__ */ new Date();
  const targetDate = typeof date2 === "string" ? new Date(date2) : date2;
  const diffMs = now.getTime() - targetDate.getTime();
  const diffSec = Math.floor(diffMs / 1e3);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = now.getMonth() - targetDate.getMonth() + (now.getFullYear() - targetDate.getFullYear()) * 12;
  const diffYear = now.getFullYear() - targetDate.getFullYear();
  if (diffSec < 60) {
    return `${diffSec} \u79D2\u524D`;
  } else if (diffMin < 60) {
    return `${diffMin} \u5206\u949F\u524D`;
  } else if (diffHour < 24) {
    return `${diffHour} \u5C0F\u65F6\u524D`;
  } else if (diffDay < 7) {
    return `${diffDay} \u5929\u524D`;
  } else if (diffWeek < 4) {
    return `${diffWeek} \u5468\u524D`;
  } else if (diffMonth < 12) {
    return `${diffMonth} \u4E2A\u6708\u524D`;
  } else {
    return `${diffYear} \u5E74\u524D`;
  }
};
const date = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dateFormat,
  formatDateTime,
  getDateRang,
  getLastWeekData,
  getRecentDays,
  getThisWeekData,
  getTimeAgo,
  isTimeExpired
}, Symbol.toStringTag, { value: "Module" }));
export {
  date as a,
  dateFormat as d,
  formatDateTime as f
};
