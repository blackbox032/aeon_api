var utils = require("./adapterUtils");

function toXML(sessionId, transRef, origReference, phoneNumber) {
  ret =
    `<request>` +
    `<SessionId>${sessionId}</SessionId>` +
    `<EventType>Reprint</EventType>` +
    `<event>` +
    `<TransRef>${transRef}</TransRef>` +
    `<OrigReference>${origReference}</OrigReference>` +
    `<PhoneNumber>${phoneNumber}</PhoneNumber>` +
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
  toJS
};
