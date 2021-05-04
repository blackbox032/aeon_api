const logger = require("../utils/logger");
const socketClient = require("./sockets/socketClient");
const paymentAdapter = require("../adapters/paymentAdapter");
const authClient = require("./authClient");

const port = process.env.AEON_AIRTIME_PORT || 7800;
const host = process.env.AEON_AIRTIME_URL || "aeon.qa.bltelecoms.net";
const ttl = process.env.TTL_PAYMENT || 180000;
const userPin = process.env.AEON_AIRTIME_PIN || "016351";
const deviceId = process.env.AEON_AIRTIME_DEVICE_ID || "865181";
const deviceSer = process.env.AEON_AIRTIME_DEVICE_SER || "w!22!t";


async function reprint() {

  // const client = await socketClient(host, port, ttl);

  const authDetails = await authClient.doAuth('Reprint');


  console.log('authDetails', authDetails);

  return await authClient.doAuth('Reprint');;

  console.log('authDetails', authDetails)

}

module.exports = {
  reprint
}