/*jshint esversion: 6 */
// var parser = require("fast-xml-parser");
var xml = `<response>
<SessionId>01234567890</SessionId>
<EventType>TheEvent</EventType>
<event>
<EventCode>1</EventCode>
</event>
<arraynode><value>1</value></arraynode>
<data>
<ErrorCode>123</ErrorCode>
<ErrorText>An error occured</ErrorText>
<AEONErrorCode>111</AEONErrorCode>
<AEONErrorText>An error occured</AEONErrorText>
</data>
</response>`;

var json = parser.toJson(xml);
console.log("to json -> %s", json);
