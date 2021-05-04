var utils = require("./adapterUtils");

function toXML(userPin, deviceId, deviceSer, transType) {
  ret =
    `<request>` +
    `<EventType>Authentication</EventType>` +
    `<event>` +
    `<UserPin>${userPin}</UserPin>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<TransType>${transType}</TransType>` +
    `</event>` +
    `</request>`;
  return ret.replace(/\s+/g,"") + "";
}

//may return success response
//or standard error object
function toJS(xml) {
  obj = utils.getObj(xml);
  delete obj.PrintLines;
  delete obj.MerchantPrintLines;
  return obj;
}

module.exports = {
  toXML,
  toJS,
};