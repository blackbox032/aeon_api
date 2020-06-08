var utils = require("../adapters/adapterUtils");

function toXML(accountNo, amount, sessionId, payParams) {
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
    `<trxId>${payParams.trxId}</trxId>` +
    '<wantPrintJob>0</wantPrintJob>' +
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