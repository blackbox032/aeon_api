var utils = require("./adapterUtils");

function toXML(sessionId, confirmationRef, reference) {
  ret =
    `<request>` +
    `<Version>2.1</Version>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<EventType>GetVoucher</EventType>` +
    `<event>` +
    `<Type>FBE</Type>` +
    `<TransRef>${confirmationRef}</TransRef>` +
    `<Reference>${reference}</Reference>` +
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
