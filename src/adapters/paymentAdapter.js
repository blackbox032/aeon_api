var utils = require("./adapterUtils");

function authToXML(userPin, deviceId, deviceSer, aeonParams) {

  return `<request>` +
    `<EventType>Authentication</EventType>` +
    `<event>` +
    `<UserPin>${userPin}</UserPin>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<TransType>${aeonParams.subscriberEventType}</TransType>` +
    `</event>` +
    `</request>` +
    "\n";
}

function subscriberInfoToXML(accountNo, sessionId, aeonParams, amount = '10.00') {
  const eventType = aeonParams.eventType == undefined ? 'GetSubscriberBillInfo' : aeonParams.eventType;
  let moreParams = '';

  if (eventType != 'GetSubscriberBillInfo') {
    moreParams = `<realTime>1</realTime><verifyOnly>${aeonParams.verifyOnly}</verifyOnly><amountDue>${amount}</amountDue>`
  }

  ret =
    `<request>` +
    `<EventType>${eventType}</EventType>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<event>` +
    `<accountNo>${aeonParams.accountNo}</accountNo>` +
    `<productId>${aeonParams.productID}</productId>` +
    `<providerId>${aeonParams.providerID}</providerId>` +
    `<LoyaltyProfileId>${aeonParams.loyaltyProfileID}</LoyaltyProfileId>` +
    moreParams +
    `<Recon transReference="${Date.now()}" accountNumber="${aeonParams.fromAccount}" sysReference="${aeonParams.toAccount}"></Recon>` +
    `</event>` +
    `</request>`;
  return ret + "\n";
}


function paymentToXML(accountNo, amount, sessionId, aeonParams) {
  ret =
    `<request>` +
    `<EventType>Confirm</EventType>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<event>` +
    `<accountNumber>${accountNo}</accountNumber>` +
    `<amountDue>${amount}</amountDue>` +
    `<confirmType>commit</confirmType>` +
    `<productId>${aeonParams.productID}</productId>` +
    `<providerId>${aeonParams.providerID}</providerId>` +
    `<trxId>${aeonParams.trxID}</trxId>` +
    '<wantPrintJob>0</wantPrintJob>' +
    `<tenderType>creditCard</tenderType>` +
    `<Recon transReference="${Date.now()}" accountNumber="${aeonParams.fromAccount}" sysReference="${aeonParams.toAccount}"></Recon>` +
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