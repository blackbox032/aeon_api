var utils = require("./adapterUtils");

function authToXML(userPin, deviceId, deviceSer, transType) {

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

function subscriberInfoToXML(accountNo, sessionId, payParams) {
  ret =
    `<request>` +
    `<EventType>GetSubscriberBillInfo</EventType>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<event>` +
    `<accountNo>${accountNo}</accountNo>` +
    `<productId>${payParams.productID}</productId>` +
    `<providerId>${payParams.providerID}</providerId>` +
    `<LoyaltyProfileId>${payParams.loyaltyCard}</LoyaltyProfileId>` +
    `<Recon transReference="${transReference}" accountNumber="${payParams.fromAccount}" sysReference="${payParams.toAccount}"></Recon>` +
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
    `<Recon transReference="${transReference}" accountNumber="${payParams.fromAccount}" sysReference="${payParams.toAccount}"></Recon>` +
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