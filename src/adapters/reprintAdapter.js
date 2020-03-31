var parser = require("xml2json");

function toXML(sessionId, transRef, origReference, phoneNumber) {
  ret = `<request>
    <SessionId>${sessionId}</SessionId>
    <EventType>Reprint</EventType>
    <event>
      <TransRef>${transRef}</TransRef>
      <OrigReference>${origReference}</OrigReference>
      <PhoneNumber>${phoneNumber}</PhoneNumber>
    </event>
  </request>`;
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
