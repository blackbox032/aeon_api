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

function SubscriberInfoToXML(userPin, deviceId, deviceSer, accountNo, sessionId, productId, providerId) {
  ret =
    `<request>` +
    `<EventType>GetSubscriberBillInfo</EventType>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<event>` +
    `<UserPin>${userPin}</UserPin>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<accountNo>${accountNo}</accountNo>` +
    `<productId>${productId}</productId>` +
    `<providerId>${providerId}</providerId>` +
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