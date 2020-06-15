const client = require("../src/clients/paymentsClient");
// process.env.AEON_SOCKET_TYPE = "TLS";
// process.env.AEON_AIRTIME_PORT = "443";
// process.env.AEON_AIRTIME_URL = "aeonssl.live.bltelecoms.net";
// process.env.AEON_AIRTIME_PIN = "011234";
// process.env.AEON_AIRTIME_DEVICE_ID = "103936";
// process.env.AEON_AIRTIME_DEVICE_SER = "GniRR3t5639!";
// process.env.LOG_DEBUG = "true";

const accountNo = "81880498";

const payParams = {
  providerID: 198,
  subscriberEventType: 'BluBillPayment',
  trxID: '0111221',
  productID: 298
}
doPayment();

async function doPayment() {
  jsonResp = await client.doPayment(accountNo, '101', payParams);
  await client.doGetSubscriberInfo(accountNo, payParams)
}