var utils = require("./adapterUtils");

function toXML(sessionId, confirmationRef, aeonParams, bankResp) {
  ret =
    `<request>` +
    `<Version>2.0</Version>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<EventType>GetVoucher</EventType>` +
    `<event>` +
    `<TransRef>${confirmationRef}</TransRef>` +
    `<Reference>${aeonParams.reference}</Reference>` +
    `<LoyaltyProfileId>${aeonParams.loyaltyProfileID}</LoyaltyProfileId>` +
    `<tenderType>creditCard</tenderType>` +
    `<Recon transReference="${bankRes.auth_id_res}" accountNumber="${aeonParams.fromAccount}" sysReference="${aeonParams.toAccount}" transNumber="${bankResp.user_id}" authoriser="${bankResp.rrn}" transDateTime="${bankResp.trx_datetime.replace(/[T,Z]/g, ' ')}"></Recon> ` +
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
  toXML,
  toJS,
};