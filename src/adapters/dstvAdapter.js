var utils = require("aeon_api/src/adapters/adapterUtils");

function toXML(accountNo, sessionId, amount, trxId) {
  ret =
    `<request>` +
    `<EventType>Confirm</EventType>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<event>` +
    `<accountNumber>${accountNo}</accountNumber>` +
    `<amountDue>${amount}</amountDue>` +
    `<confirmType>commit</confirmType>` +
    `<productId>298</productId>` +
    '<tenderType>cash</tenderType>' +
    `<providerId>198</providerId>` +
    `<trxId>${trxId}</trxId>` +
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