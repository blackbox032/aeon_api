var utils = require("./adapterUtils");

function toXML({ userPin, deviceId, deviceSer }, aeonParams = {}) {
  ret =
    `<request>` +
    `<Version>2.0</Version>` +
    `<EventType>ConfirmMeter</EventType>` +
    `<event>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<UserPin>${userPin}</UserPin>` +
    `<MeterNum>${aeonParams.meterNumber}</MeterNum>` +
    `<Amount>${aeonParams.amount}</Amount>` +
    `<LoyaltyProfileId>${aeonParams.loyaltyProfileID}</LoyaltyProfileId>` +
    `<tenderType>creditCard</tenderType>` +
    `<Recon transReference="${Date.now()}" accountNumber="${aeonParams.fromAccount}" sysReference="${aeonParams.meterNumber}"></Recon>` +
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