var parser = require("xml2json");

function toXML(
  userPin,
  deviceId,
  deviceSer,
  transType,
  reference,
  phoneNumber,
  amount
) {
  ret = `<request>
    <EventType>DoBundleTopup</EventType>
    <event>
      <UserPin>${userPin}</UserPin>
      <DeviceId>${deviceId}</DeviceId>
      <DeviceSer>${deviceSer}!</DeviceSer>
      <TransType>${transType}</TransType>
      <Reference>${reference}</Reference>
      <PhoneNumber>${phoneNumber}</PhoneNumber>
      <ProductCode>${amount}</ProductCode>
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
