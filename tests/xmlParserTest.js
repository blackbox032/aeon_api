/*jshint esversion: 6 */
var xml2json = require("xml2json");
var xml = `<response>
<SessionId>01234567890</SessionId>
<EventType>TheEvent</EventType>
<event>
<EventCode>1</EventCode>
</event>
<arraynode><value>1</value></arraynode>
<AttrTag attribute="hello"></AttrTag>
<data>
<ErrorCode>123</ErrorCode>
<ErrorText>An error occurred</ErrorText>
<AEONErrorCode>111</AEONErrorCode>
<AEONErrorText>An error occurred</AEONErrorText>
</data>
</response>`;

var json = xml2json.toJson(xml);
console.log("to json -> %s", json);