var utils = require("./adapterUtils");

function authToXML(userPin, deviceId, deviceSer, payParams) {

  return `<request>` +
    `<EventType>Authentication</EventType>` +
    `<event>` +
    `<UserPin>${userPin}</UserPin>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<TransType>${payParams.subscriberEventType}</TransType>` +
    `</event>` +
    `</request>` +
    "\n";
}

function subscriberInfoToXML(accountNo, sessionId, payParams) {
  const eventType = payParams.eventType == undefined ? 'GetSubscriberBillInfo' : payParams.eventType;
  console.log('I get to subscriberInfoToXML with: ', accountNo, sessionId, payParams)
  ret =
    `<request>` +
    `<EventType>${eventType}</EventType>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<event>` +
    `<accountNo>${accountNo}</accountNo>` +
    `<productId>${payParams.productID}</productId>` +
    `<providerId>${payParams.providerID}</providerId>` +
    `<LoyaltyProfileId>${payParams.loyaltyProfileID}</LoyaltyProfileId>` +
    `<Recon accountNumber="${payParams.fromAccount}" sysReference="${payParams.toAccount}"></Recon>` +
    `<realTime>1</realTime>` +
    `<verifyOnly>0</verifyOnly>` +
    `</event>` +
    `</request>`;
  return ret + "\n";
}


function paymentToXML(accountNo, amount, sessionId, payParams) {
  ret =
    `<request>` +
    `<EventType>Confirm</EventType>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<event>` +
    `<accountNumber>${accountNo}</accountNumber>` +
    `<amountDue>${amount}</amountDue>` +
    `<confirmType>commit</confirmType>` +
    `<productId>${payParams.productID}</productId>` +
    '<tenderType>cash</tenderType>' +
    `<providerId>${payParams.providerID}</providerId>` +
    `<trxId>${payParams.trxID}</trxId>` +
    '<wantPrintJob>0</wantPrintJob>' +
    `<Recon accountNumber="${payParams.fromAccount}" sysReference="${payParams.toAccount}"></Recon>` +
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
  authToXML,
  subscriberInfoToXML,
  paymentToXML,
  toJS,
};