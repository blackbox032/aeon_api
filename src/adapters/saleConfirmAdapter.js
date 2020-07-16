var utils = require("./adapterUtils");

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
    // `<Recon transReference="${transReference}" accountNumber="${payParams.fromAccount}" sysReference="${payParams.toAccount}"></Recon>` +
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
  toJS
};