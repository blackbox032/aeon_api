const socketRequest = require("./socketRequest");
const airtimeTopUpAdapter = require("../adapters/airtimeTopUpAdapter");

const port = process.env.PORT || 7800;
const host = process.env.EXTERNAL_URL || "aeon.qa.bltelecoms.net";
const ttl = process.env.TTL || 60000;
const userPin = process.env.PIN || "016351";
const deviceId = process.env.DEVICE_ID || "865181";
const deviceSer = process.env.DEVICE_SER || "w!22!t";

async function doAirtimeTopUp(transType, reference, phoneNumber, amount) {
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
    console.log("AirTime Topup response: ", serverResponse);
    return airtimeTopUpAdapter.toJS(serverResponse);
  });
}

module.exports = { doAirtimeTopUp };
