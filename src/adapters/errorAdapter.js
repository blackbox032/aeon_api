var utils = require("./adapterUtils");

function toXML(eventType, errorText) {
  ret =
    `<response>` +
    `<SessionId>NA</SessionId>` +
    `<EventType>${eventType}</EventType>` +
    `<event>` +
    `<EventCode>1</EventCode>` +
    `</event>` +
    `<data>` +
    `<ErrorCode>-1</ErrorCode>` +
    `<ErrorText>${errorText}</ErrorText>` +
    `<AEONErrorCode>-1</ErrorCode>` +
    `<AEONErrorText>${errorText}</ErrorText>` +
    `</data>` +
    `</response>`;
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
