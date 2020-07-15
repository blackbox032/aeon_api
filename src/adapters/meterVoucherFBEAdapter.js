var utils = require("./adapterUtils");

function toXML(
  sessionId,
  confirmationRef,
  transReference,
  reference,
  meterNumber
) {
  ret =
    `<request>` +
    `<Version>2.0</Version>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<EventType>GetVoucher</EventType>` +
    `<event>` +
    `<Type>FBE</Type>` +
    `<TransRef>${confirmationRef}</TransRef>` +
    `<Reference>${reference}</Reference>` +
    `<LoyaltyProfileId>${payParams.profileId}</LoyaltyProfileId>` +
    `<Recon transReference="${transReference}" accountNumber="${meterNumber}"></Recon>` +
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