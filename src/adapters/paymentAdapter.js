var utils = require("./adapterUtils");

function authToXML({ userPin, deviceId, deviceSer }, aeonParams) {

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

function subscriberInfoToXML(sessionId, aeonParams) {
  const eventType = aeonParams.eventType == undefined ? 'GetSubscriberBillInfo' : aeonParams.eventType;
  let moreParams = '';

  if (eventType != 'GetSubscriberBillInfo') {
    moreParams = `<realTime>1</realTime><verifyOnly>${aeonParams.verifyOnly}</verifyOnly><amountDue>${aeonParams.amount || '100'}</amountDue>`
  }

  ret =
    `<request>` +
    `<EventType>${eventType}</EventType>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<event>` +
    `<accountNo>${aeonParams.toAccount}</accountNo>` +
    `<productId>${aeonParams.productID}</productId>` +
    `<providerId>${aeonParams.providerID}</providerId>` +
    `<LoyaltyProfileId>${aeonParams.loyaltyProfileID}</LoyaltyProfileId>` +
    moreParams +
    `<Recon transReference="${Date.now()}" accountNumber="${aeonParams.fromAccount}" sysReference="${aeonParams.toAccount}"></Recon>` +
    `</event>` +
    `</request>`;
  return ret + "\n";
}


function paymentToXML(sessionId, aeonParams, bankResp = {}) {
  ret =
    `<request>` +
    `<EventType>Confirm</EventType>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<event>` +
    `<accountNumber>${aeonParams.toAccount}</accountNumber>` +
    `<amountDue>${aeonParams.amount}</amountDue>` +
    `<confirmType>commit</confirmType>` +
    `<productId>${aeonParams.productID}</productId>` +
    `<providerId>${aeonParams.providerID}</providerId>` +
    `<trxId>${aeonParams.trxID}</trxId>` +
    '<wantPrintJob>0</wantPrintJob>' +
    `<tenderType>creditCard</tenderType>` +
    `<Recon transReference="${Date.now()}" accountNumber="${aeonParams.fromAccount}" sysReference="${aeonParams.toAccount}" transNumber="${bankResp.auth_id_res}" authoriser="${bankResp.rrn}" transDateTime="${bankResp.trx_datetime.replace(/[T,Z]/g, ' ')}"" ></Recon > ` +
    `</event > ` +
    `</request > `;
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