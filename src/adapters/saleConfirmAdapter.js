var parser = require("xml2json");

function toXML(userPin, deviceId, deviceSer, confrimationRef, reference) {
  ret =
    `<request>` +
    `<Version>2.1</Version>` +
    `<EventType>SoldVoucher</EventType>` +
    `<event>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<UserPin>${userPin}</UserPin>` +
    `<TransRef>${confrimationRef}</TransRef>` +
    `<Reference>${reference}</Reference>` +
    `</event>` +
    `</request>`;
  return ret + "\n";
}

//may return success response
//or standard error object
function toJS(xml) {
  json = parser.toJson(xml);
  return JSON.parse(json);
}

module.exports = {
  toXML,
  toJS
};
