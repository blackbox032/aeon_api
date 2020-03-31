var parser = require("xml2json");

function toXML(userPin, deviceId, deviceSer, transType) {
  ret = `<request>
    <EventType>GetProductList</EventType>
    <event>
      <UserPin>${userPin}</UserPin>
      <DeviceId>${deviceId}</DeviceId>
      <DeviceSer>${deviceSer}</DeviceSer>
      <TransType>${transType}</TransType>
    </event>
  </request>`;
  return ret.replace("\n", "") + "\n";
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
