var utils = require("./adapterUtils");

function AuthToXML(userPin, deviceId, deviceSer, transType) {

  return `<request>` +
    `<EventType>Authentication</EventType>` +
    `<event>` +
    `<UserPin>${userPin}</UserPin>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<TransType>${transType}</TransType>` +
    `</event>` +
    `</request>` +
    "\n";
}

function SubscriberInfoToXML(accountNo, sessionId, payParams) {
  ret =
    `<request>` +
    `<EventType>GetSubscriberBillInfo</EventType>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<event>` +
    `<accountNo>${accountNo}</accountNo>` +
    `<productId>${payParams.productID}</productId>` +
    `<providerId>${payParams.providerID}</providerId>` +
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
  AuthToXML,
  SubscriberInfoToXML,
  toJS,
};