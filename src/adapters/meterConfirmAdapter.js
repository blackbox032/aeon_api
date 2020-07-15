var utils = require("./adapterUtils");

function toXML(userPin, deviceId, deviceSer, meterNumber, amount, payParams) {
  ret =
    `<request>` +
    `<Version>2.0</Version>` +
    `<EventType>ConfirmMeter</EventType>` +
    `<event>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<UserPin>${userPin}</UserPin>` +
    `<MeterNum>${meterNumber}</MeterNum>` +
    `<Amount>${amount}</Amount>` +
    `<LoyaltyProfileId>${payParams.profileId}</LoyaltyProfileId>` +
    `</event>` +
    `</request>`;
  return ret + "\n";
}

//may return success response
//or standard error object
function toJS(xml) {
  return utils.getObj(xml);
}

module.exports = {
  toXML,
  toJS,
};