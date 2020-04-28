exports = module.exports = {};

const log_enabled = {
  debug: process.env.LOG_DEBUG ? process.env.LOG_DEBUG == "true" : false,
  trace: process.env.LOG_TRACE ? process.env.LOG_TRACE == "true" : true,
  warn: process.env.LOG_WARN ? process.env.LOG_WARN == "true" : true,
  error: process.env.LOG_ERROR ? process.env.LOG_ERROR == "true" : true,
  fatal: process.env.LOG_FATAL ? process.env.LOG_FATAL == "true" : true,
  info: process.env.LOG_INFO ? process.env.LOG_INFO == "true" : true,
};

exports.levels = {
  DEBUG: "DEBUG",
  TRACE: "TRACE",
  WARN: "WARN",
  ERROR: "ERROR",
  FATAL: "FATAL",
  INFO: "INFO",
};

exports.sources = {
  AEON_API: "AEON_API",
};

exports.log_console = async function (level, source, description, meta) {
  var enabled = log_enabled[level.toLowerCase()] || false;
  if (!enabled) return;

  var log_date = new Date();
  var log_date_string = log_date.toLocaleString();

  var entry =
    log_date_string +
    "||" +
    level +
    "||" +
    source +
    "||" +
    description +
    "||" +
    JSON.stringify(meta);
  if (level && (level == "ERROR" || level == "FATAL")) console.error(entry);
  else console.log(entry);
};

exports.log = async function (level, source, description, meta) {
  //Must try catch this because we log errors too
  //Do NOT want uncaught errors when we log errors
  try {
    exports.log_console(level, source, description, meta);
  } catch (error) {}
};

exports.debug = async function () {
  var s = "";
  for (var i = 0; i < arguments.length; i++) {
    var e = "";
    try {
      e = JSON.stringify(arguments[i]) || "";
    } catch (ex) {
      e = "";
    }
    s += e;
  }
  exports.log_console(exports.levels.DEBUG, exports.sources.AEON_API, s, {});
};
