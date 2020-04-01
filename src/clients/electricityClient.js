const socketRequest = require("./socketRequest");
const airtimeTopUpAdapter = require("../adapters/airtimeTopUpAdapter");

const port = process.env.PORT || 7898;
const host = process.env.EXTERNAL_URL || "196.38.158.118";
const ttl = process.env.TTL || 60000;
const userPin = process.env.PIN || 011234;
const deviceId = process.env.DEVICE_ID || 2215;
const deviceSer = process.env.DEVICE_SER || "TiZZIw779!";

//TODO: GetBundle
async function doElectricityTopUp(transType, reference, phoneNumber, amount) {
  xml = airtimeTopUpAdapter.toXML(
    userPin,
    deviceId,
    deviceSer,
    transType,
    reference,
    phoneNumber,
    amount
  );
  return await socketRequest(host, port, xml, ttl).then(serverResponse => {
    console.log("Electricity Topup response: ", serverResponse);
    return airtimeTopUpAdapter.toJS(serverResponse);
  });
}

module.exports = { doAirtimeTopUp };
