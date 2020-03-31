var parser = require("xml2json");

function toXML(
  userPin,
  deviceId,
  deviceSer,
  meterNumber,
  amount,
  reference
) {
  ret = `<request>` +
         `<Version>2.1</Version>` + 
         `<EventType>ConfirmMeter</EventType>` +
         `<event>` +
                `<DeviceId>${deviceId}</DeviceId>` + 
                `<DeviceSer>${deviceSer}</DeviceSer>` + 
                `<UserPin>${userPin}</UserPin>` +
                `<MeterNum>${meterNumber}</MeterNum>` + 
                `<Amount>${amount}</Amount>` +
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
