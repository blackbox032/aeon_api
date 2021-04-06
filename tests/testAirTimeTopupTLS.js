const client = require("../src/clients/airtimeClient");
process.env.AEON_SOCKET_TYPE = "TLS";
process.env.AEON_AIRTIME_PORT = "443";
process.env.AEON_AIRTIME_URL = "aeonssl.live.bltelecoms.net";
process.env.AEON_AIRTIME_PIN = "011234";
process.env.AEON_AIRTIME_DEVICE_ID = "103936";
process.env.AEON_AIRTIME_DEVICE_SER = "GniRR3t5639!";
process.env.LOG_DEBUG = "true";

const msisdn = "27713523879";

doTopup();

async function doTopup() {
  xml = await client.doAirtimeTopUp("Vodacom", "123456", msisdn, "10", 'werwetrewrt', { loyaltyProfileID: '23423423' });
}
