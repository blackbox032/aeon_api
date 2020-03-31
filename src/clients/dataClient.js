const socketRequest = require("./socketRequest");
const bundleTopUpAdapter = require("../adapters/bundleTopUpAdapter");

const port = process.env.PORT || 7898;
const host = process.env.EXTERNAL_URL || "196.38.158.118";
const ttl = process.env.TTL || 60000;
const userPin = process.env.PIN || 011234;
const deviceId = process.env.DEVICE_ID || 2215;
const deviceSer = process.env.DEVICE_SER || "TiZZIw779!";

//TODO: GetBundle

function bundleTopUp(transType, reference, phoneNumber, amount) {
  xml = bundleTopUpAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    transType,
    reference,
    phoneNumber,
    amount
  );
  socketRequest(host, port, xml, ttl, function(serverResponse) {
    console.log("Bundle Topup response: ", serverResponse);
    return bundleTopUpAdapter.toJS(serverResponse);
  });
}

module.exports = { bundleTopUp };
