var parser = require("xml2json");

function toXML(sessionId, transRef, origReference, phoneNumber) {
  return;
  `<request>
    <SessionId>${sessionId}</SessionId>
    <EventType>Reprint</EventType>
    <event>
      <TransRef>${transRef}</TransRef>
      <OrigReference>${origReference}</OrigReference>
      <PhoneNumber>${phoneNumber}</PhoneNumber>
    </event>
  </request>`;
}

//may return success response
//or standard error object
function toObj(xml) {
  json = parser.parse(xml);
  return JSON.parse(json);
}

module.exports = {
  toXML,
  toJS
};
