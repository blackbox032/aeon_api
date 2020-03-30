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
  return;
  `<request>
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
}

//may return success response
//or standard error object
function toObj(xml) {
  json = parser.parse(xml);
  return JSON.parse(json);
}

module.exports = {
  toXML,
  toJS
};
