const doBundleTopUp = require("../src/adapters/bundleTopUpAdapter");

xml = doBundleTopUp.toXML(
  "1234",
  "11111",
  "123456",
  "MTN",
  "AAAAAAA",
  "27713523879",
  10.5
);

console.log("XML: " + xml);

console.log("JS:  " + JSON.stringify(doBundleTopUp.toJS(xml)));
