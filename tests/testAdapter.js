const productListAdapter = require("../src/adapters/productListAdapter");

xml = productListAdapter.toXML("1234", "11111", "123456", "MTN");

console.log("XML: " + xml);

const json = require("./testResponse.json");

console.log(
  "JS:  " +
    JSON.stringify(
      productListAdapter.toJS(
        "<response>" +
          "<SessionId>1</SessionId>" +
          "<EventType>BLEH</EventType>" +
          "<event>" +
          "<EventCode>0</EventCode>" +
          "<EventDescription>123</EventDescription>" +
          "</event>" +
          "<data>" +
          "<Value1>abc</Value1>" +
          "<Value2>1.1</Value2>" +
          "</data>" +
          "</response>"
      )
    )
);
