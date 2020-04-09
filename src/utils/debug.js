logDebug = process.env.LOG_DEBUG ? process.env.LOG_DEBUG == "true" : false;
function debug() {
  if (logDebug) {
    var s = "";
    for (var i = 0; i < arguments.length; i++) {
      var e = "";
      try {
        e = arguments[i] || "";
      } catch (ex) {
        e = "";
      }
      s += e;
    }
    console.log(s);
  }
}

module.exports = debug;
