var parser = require("xml2json");

function toXML(eventType, errorText) {
  ret = `<response>
    <SessionId>NA</SessionId>
    <EventType>${eventType}</EventType>
    <event>
      <EventCode>1</EventCode>
    </event>
    <data>
      <ErrorCode>-1</ErrorCode>
      <ErrorText>${errorText}</ErrorText>
      <AEONErrorCode>-1</ErrorCode>
      <AEONErrorText>${errorText}</ErrorText>
    </data>
  </response>`;
  return ret.replace("\n", "") + "\n";
}

//may return success response
//or standard error object
function toJS(xml) {
  json = parser.toJson(xml);
  return JSON.parse(json);
}

module.exports = {
  toXML,
  toJS
};
