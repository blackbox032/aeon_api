var parser = require("xml2json");

function toXML(
  sessionId,
  confrimationRef,
  reference
) {
  ret = `<request>
        <Version>2.1</Version>
        <SessionId>${sessionId}</SessionId>
        <EventType>CancelVoucher</EventType>
        <event>
                <TransRef>${confrimationRef}</TransRef>
                <Reference>${reference}</Reference>
        </event>
        </request>
`;
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